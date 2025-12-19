/**
 * Instagram Content Publishing API 유틸리티
 * Meta Graph API를 사용하여 Instagram 게시글 자동 발행
 * Gemini AI로 블로그 컨텐츠를 인스타그램 맞춤형으로 재구성
 */

// 환경변수 대신 하드코딩 (보안상 환경변수 권장하지만 요청에 따라)
const INSTAGRAM_ACCESS_TOKEN = 'EAAfTImZCqPSQBQD3XFpcA1wGECplqeFbqtdZB0nL0AZCb5HFzWgOrJpeefCw0L3Otk32gxrDwiZAP3LZA558C6ggTVxVHau4ovsuWI3HC1Rk4emZAujYqORLsOo3ZB9DZB1IPzQAJZBUREZB5fp7If7WsI92ZAxOMJYBeop1sVOO5ZC3p9Yj5ncGQNZBrrC9O542DgQUHjwZDZD';
const INSTAGRAM_ACCOUNT_ID = '17841479557116437'; // 새 Instagram 계정 (polar.ad 비즈니스)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GRAPH_API_VERSION = 'v21.0';
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

interface InstagramPostResult {
  success: boolean;
  postId?: string;
  permalink?: string;
  error?: string;
}

interface CaptionData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  slug: string;
  content?: string; // 블로그 전체 내용 (AI 재구성용)
}

/**
 * 카테고리별 이모지 매핑
 */
const CATEGORY_EMOJIS: Record<string, string> = {
  'meta-ads': '📱',
  'google-ads': '🔍',
  'marketing-trends': '📈',
  'faq': '❓',
};

/**
 * 카테고리별 해시태그
 */
const CATEGORY_HASHTAGS: Record<string, string[]> = {
  'meta-ads': ['#메타광고', '#인스타그램광고', '#페이스북광고', '#SNS마케팅', '#퍼포먼스마케팅'],
  'google-ads': ['#구글광고', '#구글애즈', '#검색광고', '#GDN광고', '#퍼포먼스마케팅'],
  'marketing-trends': ['#마케팅트렌드', '#디지털마케팅', '#마케팅전략', '#온라인마케팅', '#마케팅인사이트'],
  'faq': ['#마케팅팁', '#광고운영', '#문제해결', '#마케팅FAQ', '#광고팁'],
};

/**
 * Gemini AI를 사용하여 블로그 컨텐츠를 인스타그램용으로 재구성
 * 홈페이지 유도 없이 핵심 내용만 요약하여 독립적인 정보 제공
 */
async function generateAICaption(title: string, content: string, category: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    console.log('⚠️ GEMINI_API_KEY 미설정 - 기본 캡션 사용');
    return '';
  }

  const prompt = `당신은 인스타그램 마케팅 콘텐츠 작성 전문가입니다. 아래 블로그 글의 핵심 정보를 인스타그램 게시물로 재구성해주세요.

**블로그 제목**: ${title}

**블로그 내용**:
${content.slice(0, 4000)}

**요구사항**:
1. 블로그 내용의 핵심 팩트와 실용적인 정보만 추출
2. 읽는 사람이 이 게시물만 보고도 유용한 정보를 얻을 수 있어야 함
3. 핵심 포인트 3-5개를 짧고 명확한 문장으로 정리
4. 각 포인트 앞에 ✅, 💡, 📌, 🔥, ⚡, 👉 등 적절한 이모지 사용
5. 첫 줄은 주제를 명확히 전달하는 제목 형식 (이모지 포함)
6. 전체 길이는 400자 이내
7. 해시태그는 포함하지 마세요 (별도 추가됨)
8. MDX 문법, 코드 블록, 컴포넌트 태그, HTML 태그 모두 제거
9. "프로필 링크", "자세한 내용은", "홈페이지 방문" 같은 외부 유도 문구 절대 금지

**예시 형식**:
🔥 [제목: 핵심 주제를 한 줄로]

✅ [핵심 정보 1 - 구체적인 팩트]
✅ [핵심 정보 2 - 실용적인 팁]
💡 [핵심 정보 3 - 알아두면 좋은 점]
📌 [핵심 정보 4 - 주의사항 또는 추가 정보]

💬 [마무리 한 줄 - 공감 유도 또는 질문]

캡션만 출력하세요. 다른 설명 없이 바로 캡션 텍스트만 작성하세요.`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
      })
    });

    const result = await res.json();
    const aiCaption = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    if (aiCaption) {
      console.log('✅ AI 캡션 생성 완료');
      return aiCaption;
    }
  } catch (error) {
    console.error('AI 캡션 생성 실패:', error);
  }

  return '';
}

/**
 * 마케팅 소식을 Instagram 캡션으로 변환
 * content가 제공되면 AI로 재구성, 아니면 기본 템플릿 사용
 */
export async function generateInstagramCaption(data: CaptionData): Promise<string> {
  const categoryEmoji = CATEGORY_EMOJIS[data.category] || '📢';
  const categoryHashtags = CATEGORY_HASHTAGS[data.category] || ['#마케팅', '#광고', '#디지털마케팅', '#SNS마케팅', '#폴라애드'];

  let mainContent: string;

  // 블로그 전체 내용이 있으면 AI로 재구성
  if (data.content && data.content.length > 100) {
    const aiCaption = await generateAICaption(data.title, data.content, data.category);
    if (aiCaption) {
      mainContent = aiCaption;
    } else {
      // AI 실패 시 기본 템플릿 (내용 요약만)
      mainContent = `${categoryEmoji} ${data.title}

${data.description.length > 200 ? data.description.slice(0, 197) + '...' : data.description}

💬 도움이 되셨다면 저장해두세요!`;
    }
  } else {
    // content가 없으면 기본 템플릿 (내용 요약만)
    mainContent = `${categoryEmoji} ${data.title}

${data.description.length > 200 ? data.description.slice(0, 197) + '...' : data.description}

💬 도움이 되셨다면 저장해두세요!`;
  }

  // 해시태그만 추가 (폴라애드 문구 제외)
  const caption = `${mainContent}

${categoryHashtags.join(' ')}`;

  return caption;
}

/**
 * Instagram에 이미지 게시글 발행
 *
 * 1단계: 미디어 컨테이너 생성
 * 2단계: 게시글 발행
 */
export async function publishToInstagram(
  imageUrl: string,
  caption: string
): Promise<InstagramPostResult> {
  try {
    // 1단계: 미디어 컨테이너 생성
    console.log('📸 Instagram 미디어 컨테이너 생성 중...');

    const containerResponse = await fetch(
      `${GRAPH_API_BASE}/${INSTAGRAM_ACCOUNT_ID}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: imageUrl,
          caption: caption,
          access_token: INSTAGRAM_ACCESS_TOKEN,
        }),
      }
    );

    const containerResult = await containerResponse.json();

    if (containerResult.error) {
      console.error('미디어 컨테이너 생성 실패:', containerResult.error);
      return {
        success: false,
        error: containerResult.error.message || 'Container creation failed',
      };
    }

    const containerId = containerResult.id;
    console.log(`✅ 컨테이너 생성 완료: ${containerId}`);

    // 컨테이너 상태 확인 (처리 완료 대기)
    await waitForContainerReady(containerId);

    // 2단계: 게시글 발행
    console.log('📤 Instagram 게시글 발행 중...');

    const publishResponse = await fetch(
      `${GRAPH_API_BASE}/${INSTAGRAM_ACCOUNT_ID}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: containerId,
          access_token: INSTAGRAM_ACCESS_TOKEN,
        }),
      }
    );

    const publishResult = await publishResponse.json();

    if (publishResult.error) {
      console.error('게시글 발행 실패:', publishResult.error);
      return {
        success: false,
        error: publishResult.error.message || 'Publish failed',
      };
    }

    const postId = publishResult.id;
    console.log(`✅ Instagram 게시 완료: ${postId}`);

    // 게시글 퍼머링크 가져오기
    const permalink = await getPostPermalink(postId);

    return {
      success: true,
      postId,
      permalink,
    };

  } catch (error) {
    console.error('Instagram 게시 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 미디어 컨테이너 처리 완료 대기
 */
async function waitForContainerReady(containerId: string, maxAttempts = 10): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    const statusResponse = await fetch(
      `${GRAPH_API_BASE}/${containerId}?fields=status_code&access_token=${INSTAGRAM_ACCESS_TOKEN}`
    );

    const statusResult = await statusResponse.json();

    if (statusResult.status_code === 'FINISHED') {
      return true;
    }

    if (statusResult.status_code === 'ERROR') {
      throw new Error('미디어 처리 실패');
    }

    // 2초 대기 후 재시도
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  throw new Error('미디어 처리 타임아웃');
}

/**
 * 게시글 퍼머링크 가져오기
 */
async function getPostPermalink(postId: string): Promise<string | undefined> {
  try {
    const response = await fetch(
      `${GRAPH_API_BASE}/${postId}?fields=permalink&access_token=${INSTAGRAM_ACCESS_TOKEN}`
    );

    const result = await response.json();
    return result.permalink;
  } catch {
    return undefined;
  }
}

/**
 * Instagram 정사각형 이미지용 리사이징 (1080x1080)
 */
export async function resizeForInstagram(imageBuffer: Buffer): Promise<Buffer> {
  const sharp = (await import('sharp')).default;

  return sharp(imageBuffer)
    .resize(1080, 1080, {
      fit: 'cover',
      position: 'center',
    })
    .jpeg({ quality: 90 })
    .toBuffer();
}

/**
 * 마케팅 소식 자동 Instagram 게시 (통합 함수)
 */
export async function postMarketingNewsToInstagram(
  data: CaptionData,
  imageBuffer: Buffer
): Promise<InstagramPostResult> {
  try {
    // 1. 캡션 생성
    const caption = await generateInstagramCaption(data);
    console.log('📝 Instagram 캡션 생성 완료');

    // 2. 이미지 리사이징 (1080x1080)
    const instagramImage = await resizeForInstagram(imageBuffer);
    console.log('🖼️ Instagram 이미지 리사이징 완료 (1080x1080)');

    // 3. 이미지를 임시 URL로 업로드 (GitHub raw URL 사용)
    // 실제로는 이미지가 이미 GitHub에 업로드된 후 polarad.co.kr에서 서빙됨
    const imageUrl = `https://polarad.co.kr/images/marketing-news/${data.slug}.webp`;

    // 4. Instagram 게시
    const result = await publishToInstagram(imageUrl, caption);

    return result;

  } catch (error) {
    console.error('Instagram 자동 게시 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
