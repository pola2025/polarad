/**
 * Instagram Content Publishing API 유틸리티
 * Meta Graph API를 사용하여 Instagram 게시글 자동 발행
 * Gemini AI로 블로그 컨텐츠를 인스타그램 맞춤형으로 재구성
 */

// 환경변수 대신 하드코딩 (보안상 환경변수 권장하지만 요청에 따라)
const INSTAGRAM_ACCESS_TOKEN = 'EAAfTImZCqPSQBQD3XFpcA1wGECplqeFbqtdZB0nL0AZCb5HFzWgOrJpeefCw0L3Otk32gxrDwiZAP3LZA558C6ggTVxVHau4ovsuWI3HC1Rk4emZAujYqORLsOo3ZB9DZB1IPzQAJZBUREZB5fp7If7WsI92ZAxOMJYBeop1sVOO5ZC3p9Yj5ncGQNZBrrC9O542DgQUHjwZDZD';
const INSTAGRAM_ACCOUNT_ID = '17841441970375843'; // polarad 공식 계정
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
 * polamkt 수준의 품질: pro 모델 + 재시도 + 길이 검증
 */
async function generateAICaption(title: string, content: string, category: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    console.log('⚠️ GEMINI_API_KEY 미설정 - 기본 캡션 사용');
    return '';
  }

  const prompt = `당신은 인스타그램 마케팅 콘텐츠 작성 전문가입니다. 아래 블로그 글의 핵심 정보를 인스타그램 게시물로 재구성해주세요.

⚠️ **[필수] 최소 1000자 이상 작성할 것!** (해시태그 제외)
→ 짧은 캡션은 인스타그램 알고리즘에 불리합니다.
→ 반드시 아래 구조를 모두 포함해서 충분한 분량으로 작성하세요.

**블로그 제목**: ${title}

**블로그 내용**:
${content.slice(0, 8000)}

**요구사항**:
1. **총 길이**: 1000~1500자 (해시태그 제외) - 반드시 지킬 것!
2. **인스타그램 가로폭 최적화**: 한 줄당 25~30자 이내, 빈 줄로 문단 구분

3. **구조 (필수)**:
[도입부 - 3~4줄]
- 첫 줄: 이모지 + 핵심 주제를 한 줄로
- 누구에게 필요한 정보인지 명시
- 왜 중요한지 간단히 언급

[본문 - 15~20줄]
- 핵심 포인트 5-8개를 구체적으로 정리
- 각 포인트 앞에 ✅, 💡, 📌, 🔥, ⚡, 👉, 🎯, ⭐ 등 이모지
- 각 포인트는 제목 + 1-2문장 설명으로 구성
- 구체적인 수치, 예시, 방법 포함

[체크리스트 섹션 - 선택적]
- 실행 가능한 액션 아이템 3-5개

[마무리 - 4~5줄]
- 핵심 요약 또는 강조
- 💬 댓글 유도 질문 (공감 유도)
- 저장/공유 유도 문구

**금지사항**:
- 해시태그 포함 금지 (별도 추가됨)
- MDX 문법, 코드 블록, 컴포넌트 태그, HTML 태그 모두 제거
- "프로필 링크", "자세한 내용은", "홈페이지 방문" 같은 외부 유도 문구 절대 금지

⚠️ 반드시 1000자 이상으로 작성하세요! 짧으면 다시 작성해야 합니다.
캡션만 출력하세요. 다른 설명 없이 바로 캡션 텍스트만 작성하세요.`;

  const MAX_RETRIES = 3;
  const MIN_CAPTION_LENGTH = 800;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`📝 AI 캡션 생성 시도 ${attempt}/${MAX_RETRIES}...`);

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.75, maxOutputTokens: 8192 }
        })
      });

      const result = await res.json();
      const aiCaption = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
      const finishReason = result.candidates?.[0]?.finishReason || 'UNKNOWN';

      console.log(`📊 생성 결과: ${aiCaption.length}자, finishReason: ${finishReason}`);

      // finishReason이 MAX_TOKENS면 잘린 것 - 재시도
      if (finishReason === 'MAX_TOKENS') {
        console.warn(`⚠️ 캡션이 토큰 한도로 잘림 (시도 ${attempt})`);
        continue;
      }

      // 길이 검증: 800자 이상이어야 함
      if (aiCaption && aiCaption.length >= MIN_CAPTION_LENGTH) {
        console.log(`✅ AI 캡션 생성 완료 (시도 ${attempt}): ${aiCaption.length}자`);
        return aiCaption;
      }

      console.warn(`⚠️ 캡션 길이 부족: ${aiCaption.length}자 < ${MIN_CAPTION_LENGTH}자 (시도 ${attempt})`);

    } catch (error) {
      console.error(`AI 캡션 생성 실패 (시도 ${attempt}):`, error);
    }
  }

  console.error('❌ AI 캡션 생성 최종 실패 - 기본 캡션 사용');
  return '';
}

/**
 * AI 실패 시 사용할 기본 캡션 생성
 * 최소 500자 이상 보장
 */
function generateFallbackCaption(data: CaptionData, categoryEmoji: string): string {
  const description = data.description || '';
  const tags = data.tags || [];

  // description에서 핵심 문장 추출 (마침표 기준)
  const sentences = description.split(/[.!?]/).filter(s => s.trim().length > 10);
  const keyPoints = sentences.slice(0, 5);

  return `${categoryEmoji} ${data.title}

마케터라면 꼭 알아야 할 정보입니다!
오늘도 실무에 도움되는 마케팅 인사이트를 전해드릴게요.

📌 핵심 내용

${keyPoints.length > 0 ? keyPoints.map((point, i) => {
  const emojis = ['✅', '💡', '📍', '🔥', '⭐'];
  return `${emojis[i % emojis.length]} ${point.trim()}`;
}).join('\n\n') : `✅ ${description.slice(0, 300)}`}

${tags.length > 0 ? `\n🏷️ 관련 키워드: ${tags.slice(0, 5).join(', ')}` : ''}

━━━━━━━━━━━━━━━

📢 이 정보가 도움이 되셨다면
저장해두고 필요할 때 다시 확인하세요!

💬 궁금한 점이나 추가로 알고 싶은 내용이 있다면
댓글로 남겨주세요!

❤️ 좋아요와 팔로우도 부탁드려요!`;
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
      console.log(`📊 최종 캡션 길이: ${mainContent.length}자`);
    } else {
      // AI 실패 시 개선된 기본 템플릿
      console.log('⚠️ AI 캡션 실패 - 기본 템플릿 사용');
      mainContent = generateFallbackCaption(data, categoryEmoji);
    }
  } else {
    // content가 없으면 기본 템플릿
    mainContent = generateFallbackCaption(data, categoryEmoji);
  }

  // 해시태그만 추가 (폴라애드 문구 제외) + Instagram 2,200자 제한 적용
  const INSTAGRAM_CAPTION_LIMIT = 2200;
  const separator = '\n\n';
  const hashtagsStr = categoryHashtags.join(' ');
  const reservedLength = separator.length + hashtagsStr.length;
  const maxContentLength = INSTAGRAM_CAPTION_LIMIT - reservedLength - 10; // 여유 10자

  // 캡션이 너무 길면 자르기
  let trimmedContent = mainContent;
  if (trimmedContent.length > maxContentLength) {
    console.log(`⚠️ 캡션 길이 초과: ${trimmedContent.length}자 → ${maxContentLength}자로 자름`);
    trimmedContent = trimmedContent.slice(0, maxContentLength);
    // 문장 단위로 자르기 시도
    const lastNewline = trimmedContent.lastIndexOf('\n');
    if (lastNewline > maxContentLength * 0.8) {
      trimmedContent = trimmedContent.slice(0, lastNewline);
    }
  }

  const caption = `${trimmedContent}${separator}${hashtagsStr}`;
  console.log(`📝 최종 캡션 길이: ${caption.length}자 (제한: ${INSTAGRAM_CAPTION_LIMIT}자)`);

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
