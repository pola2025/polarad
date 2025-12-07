/**
 * Vercel Cron Job: Instagram 자동 게시
 * 스케줄: 월/수/금/일 오전 9시 30분 (KST)
 *
 * Airtable에서 instagram_posted가 false인 글을 찾아 Instagram에 게시
 */

import { NextResponse } from 'next/server';
import {
  generateInstagramCaption,
  publishToInstagram,
} from '@/lib/instagram';

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
    tags: string;
    thumbnailUrl: string;
    instagram_posted?: boolean;
    instagram_post_id?: string;
    instagram_permalink?: string;
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

// Airtable 레코드 업데이트 (Instagram 게시 완료 표시)
async function updateAirtableRecord(
  recordId: string,
  instagramPostId: string,
  instagramPermalink: string
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
            instagram_permalink: instagramPermalink
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
    const { title, slug, category, description, tags, thumbnailUrl } = article.fields;

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

    // 3. Instagram 캡션 생성
    const tagsArray = tags ? tags.split(',').map(t => t.trim()) : [];
    const caption = generateInstagramCaption({
      title,
      description,
      category,
      tags: tagsArray,
      slug
    });

    console.log('📝 캡션 생성 완료');

    // 4. Instagram 게시
    const result = await publishToInstagram(imageUrl, caption);

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

    // 5. Airtable 업데이트
    await updateAirtableRecord(
      article.id,
      result.postId || '',
      result.permalink || ''
    );

    // 6. 텔레그램 알림
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
        permalink: result.permalink
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
