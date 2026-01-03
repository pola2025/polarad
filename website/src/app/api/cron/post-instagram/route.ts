/**
 * Vercel Cron Job: Instagram 자동 게시
 * 스케줄: 월/수/금/일 오전 9시 30분 (KST)
 *
 * Airtable에서 instagram_posted가 false인 글을 찾아 Instagram에 게시
 */

import { NextResponse } from 'next/server';
import sharp from 'sharp';
import {
  generateInstagramCaption,
  publishToInstagram,
} from '@/lib/instagram';
import { uploadImageToR2, isR2Configured } from '@/lib/r2-storage';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;
const CRON_SECRET = process.env.CRON_SECRET;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = '-1003280236380';

interface AirtableRecord {
  id: string;
  fields: {
    title: string;
    slug: string;
    category: string;
    description: string;
    content: string; // 블로그 전체 내용 (AI 캡션 생성용)
    tags: string;
    thumbnailUrl: string;
    instagram_posted?: boolean;
    instagram_post_id?: string;
    instagram_permalink?: string;
    instagram_image?: Array<{ url: string }>; // 정사각형 리사이즈 이미지
    instagram_caption?: string; // AI 생성 캡션
  };
}

// 텔레그램 알림 전송
async function sendTelegramNotification(
  type: 'success' | 'error',
  data: {
    title?: string;
    instagramUrl?: string;
    errorMessage?: string;
    count?: number;
  }
): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN) return;

  let message: string;

  if (type === 'success') {
    message = `📸 *Instagram 자동 게시 완료*

📝 *제목:* ${data.title}
🔗 *Instagram:* [게시글 보기](${data.instagramUrl})

✅ 마케팅 소식이 Instagram에 성공적으로 게시되었습니다!`;
  } else {
    message = `❌ *Instagram 자동 게시 실패*

⚠️ *오류:* ${data.errorMessage}

🔧 수동 확인이 필요합니다.`;
  }

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
        disable_web_page_preview: false
      })
    });
  } catch (error) {
    console.error('텔레그램 알림 오류:', error);
  }
}

// Airtable에서 Instagram 미게시 글 조회
async function getUnpostedArticles(): Promise<AirtableRecord[]> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
    console.log('⚠️ Airtable 설정 없음');
    return [];
  }

  try {
    // instagram_posted가 false이거나 비어있는 레코드 조회
    const filterFormula = encodeURIComponent(
      "OR({instagram_posted}=FALSE(), {instagram_posted}=BLANK())"
    );

    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}?filterByFormula=${filterFormula}&sort%5B0%5D%5Bfield%5D=date&sort%5B0%5D%5Bdirection%5D=desc&maxRecords=1`,
      {
        headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` }
      }
    );

    const result = await res.json();
    return result.records || [];
  } catch (error) {
    console.error('Airtable 조회 실패:', error);
    return [];
  }
}

// 이미지를 1080x1080 정사각형으로 리사이즈
async function resizeImageToSquare(imageUrl: string): Promise<Buffer> {
  const response = await fetch(imageUrl);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return sharp(buffer)
    .resize(1080, 1080, {
      fit: 'cover',
      position: 'center',
    })
    .jpeg({ quality: 90 })
    .toBuffer();
}

// R2에 Instagram용 정사각형 이미지 업로드
async function uploadInstagramImageToR2(
  imageBuffer: Buffer,
  slug: string
): Promise<string | null> {
  if (!isR2Configured()) {
    console.error('❌ R2 설정 없음');
    return null;
  }

  try {
    const filename = `${slug}-square-${Date.now()}.jpg`;
    console.log(`☁️ R2 업로드 중: instagram/${filename}`);
    
    const r2Url = await uploadImageToR2(imageBuffer, filename, 'instagram');
    console.log(`✅ R2 업로드 완료: ${r2Url}`);
    
    return r2Url;
  } catch (error) {
    console.error('R2 업로드 오류:', error);
    return null;
  }
}

// Airtable에 Instagram 이미지 URL 저장
async function saveImageUrlToAirtable(
  recordId: string,
  imageUrl: string
): Promise<boolean> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
    return false;
  }

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}/${recordId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: {
            instagram_image: [{ url: imageUrl }]
          }
        })
      }
    );

    return res.ok;
  } catch (error) {
    console.error('Airtable 이미지 URL 저장 실패:', error);
    return false;
  }
}

// Airtable 레코드 업데이트 (Instagram 게시 완료 표시)
async function updateAirtableRecord(
  recordId: string,
  instagramPostId: string,
  instagramPermalink: string,
  instagramCaption: string
): Promise<boolean> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
    return false;
  }

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}/${recordId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: {
            instagram_posted: true,
            instagram_post_id: instagramPostId,
            instagram_permalink: instagramPermalink,
            instagram_caption: instagramCaption
          }
        })
      }
    );

    return res.ok;
  } catch (error) {
    console.error('Airtable 업데이트 실패:', error);
    return false;
  }
}

// 이미지 URL 접근 가능 여부 확인
async function checkImageAvailable(imageUrl: string): Promise<boolean> {
  try {
    const res = await fetch(imageUrl, { method: 'HEAD' });
    return res.ok;
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const forceRun = url.searchParams.get('force') === 'true';

  // Cron 인증 확인
  const authHeader = request.headers.get('authorization');
  if (!forceRun && CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('📸 Instagram 자동 게시 시작...');

    // 1. Airtable에서 미게시 글 조회
    const unpostedArticles = await getUnpostedArticles();

    if (unpostedArticles.length === 0) {
      console.log('✅ 게시할 글이 없습니다.');
      return NextResponse.json({
        success: true,
        message: 'No articles to post',
        posted: 0
      });
    }

    const article = unpostedArticles[0];
    const { title, slug, category, description, content, tags, thumbnailUrl } = article.fields;

    console.log(`📝 게시 대상: ${title}`);

    // 2. 이미지 URL 확인
    const imageUrl = thumbnailUrl || `https://polarad.co.kr/images/marketing-news/${slug}.webp`;
    const imageAvailable = await checkImageAvailable(imageUrl);

    if (!imageAvailable) {
      console.log('⚠️ 이미지가 아직 배포되지 않았습니다. 다음 실행에서 재시도합니다.');
      return NextResponse.json({
        success: false,
        message: 'Image not yet available',
        imageUrl
      });
    }

    // 3. 이미지 리사이즈 (1080x1080 정사각형)
    console.log('🖼️ 이미지 리사이즈 중 (1080x1080)...');
    const resizedImageBuffer = await resizeImageToSquare(imageUrl);
    console.log('✅ 이미지 리사이즈 완료');

    // 4. R2에 리사이즈된 이미지 업로드
    console.log('📤 R2에 이미지 업로드 중...');
    const instagramImageUrl = await uploadInstagramImageToR2(resizedImageBuffer, slug);

    if (!instagramImageUrl) {
      console.error('❌ R2 이미지 업로드 실패');
      await sendTelegramNotification('error', {
        errorMessage: 'R2 이미지 업로드 실패'
      });
      return NextResponse.json({
        success: false,
        error: 'Failed to upload image to R2'
      }, { status: 500 });
    }

    console.log('✅ R2 이미지 업로드 완료:', instagramImageUrl);

    // 5. Airtable에 이미지 URL 저장 + 게시 중 표시 (중복 방지)
    await saveImageUrlToAirtable(article.id, instagramImageUrl);

    // 중복 게시 방지: 게시 시작 전 먼저 instagram_posted를 true로 설정
    await updateAirtableRecord(article.id, 'POSTING_IN_PROGRESS', '', '');

    // 6. Instagram 캡션 생성 (AI로 블로그 내용 재구성)
    const tagsArray = tags ? tags.split(',').map(t => t.trim()) : [];
    console.log('🤖 AI 캡션 생성 중...');
    const caption = await generateInstagramCaption({
      title,
      description,
      category,
      tags: tagsArray,
      slug,
      content // 블로그 전체 내용 전달
    });

    console.log('📝 AI 캡션 생성 완료');

    // 7. Instagram 게시 (R2에서 호스팅되는 정사각형 이미지 사용)
    const result = await publishToInstagram(instagramImageUrl, caption);

    if (!result.success) {
      console.error('❌ Instagram 게시 실패:', result.error);
      await sendTelegramNotification('error', {
        errorMessage: result.error || 'Unknown error'
      });
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }

    console.log(`✅ Instagram 게시 완료: ${result.permalink}`);

    // 8. Airtable 업데이트 (게시 완료 표시 + 캡션 저장)
    await updateAirtableRecord(
      article.id,
      result.postId || '',
      result.permalink || '',
      caption
    );

    // 9. 텔레그램 알림
    await sendTelegramNotification('success', {
      title,
      instagramUrl: result.permalink
    });

    return NextResponse.json({
      success: true,
      title,
      slug,
      instagram: {
        postId: result.postId,
        permalink: result.permalink,
        imageUrl: instagramImageUrl
      }
    });

  } catch (error) {
    console.error('❌ 에러:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    await sendTelegramNotification('error', {
      errorMessage
    });

    return NextResponse.json({
      error: 'Instagram posting failed',
      message: errorMessage
    }, { status: 500 });
  }
}
