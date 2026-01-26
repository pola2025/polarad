/**
 * 폴라리드 (PolarLead) - 카카오 로그인 기반 리드 수집 서비스
 * Cloudflare Workers
 */

export interface Env {
  KAKAO_CLIENT_ID: string;
  KAKAO_CLIENT_SECRET: string;
  KAKAO_REDIRECT_URI: string;
  AIRTABLE_API_KEY: string;
  AIRTABLE_BASE_ID: string;
  AIRTABLE_TABLE_NAME: string;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
  ENVIRONMENT: string;
}

// 욕설 필터 (기본)
const PROFANITY_LIST = [
  '씨발', '시발', '개새끼', '병신', '지랄', '꺼져', '죽어',
  'ㅅㅂ', 'ㅂㅅ', 'ㅈㄹ', 'ㄲㅈ',
];

function containsProfanity(text: string): boolean {
  const normalized = text.toLowerCase().replace(/\s/g, '');
  return PROFANITY_LIST.some(word => normalized.includes(word));
}

// 랜딩 페이지 HTML
function getLandingPage(env: Env): string {
  const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${env.KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(env.KAKAO_REDIRECT_URI)}&response_type=code&scope=profile_nickname,account_email,phone_number`;

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>무료 광고 컨설팅 신청 | POLARAD</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
    * { font-family: 'Pretendard', -apple-system, sans-serif; }
    .kakao-btn { background-color: #FEE500; }
    .kakao-btn:hover { background-color: #F5DC00; }
  </style>
</head>
<body class="bg-gray-50 min-h-screen">
  <!-- 헤더 -->
  <header class="bg-white border-b border-gray-200 py-4 px-4">
    <div class="max-w-md mx-auto flex items-center justify-center">
      <span class="text-2xl font-bold text-blue-600">POLAR<span class="text-gray-800">AD</span></span>
    </div>
  </header>

  <!-- 히어로 섹션 -->
  <main class="max-w-md mx-auto px-4 py-8">
    <section class="text-center mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-3">
        무료 광고 컨설팅<br>지금 신청하세요
      </h1>
      <p class="text-gray-600">
        15년 경력의 마케팅 전문가가<br>
        맞춤형 광고 전략을 제안해 드립니다
      </p>
    </section>

    <!-- 혜택 카드 -->
    <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <h2 class="font-semibold text-gray-900 mb-4">신청 시 혜택</h2>
      <ul class="space-y-3">
        <li class="flex items-start gap-3">
          <span class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </span>
          <div>
            <p class="font-medium text-gray-900">무료 현황 분석</p>
            <p class="text-sm text-gray-500">현재 광고 성과 진단</p>
          </div>
        </li>
        <li class="flex items-start gap-3">
          <span class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </span>
          <div>
            <p class="font-medium text-gray-900">맞춤 전략 제안</p>
            <p class="text-sm text-gray-500">업종별 최적화된 광고 전략</p>
          </div>
        </li>
        <li class="flex items-start gap-3">
          <span class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </span>
          <div>
            <p class="font-medium text-gray-900">예산 효율화</p>
            <p class="text-sm text-gray-500">불필요한 지출 최소화</p>
          </div>
        </li>
      </ul>
    </section>

    <!-- 신뢰 지표 -->
    <section class="grid grid-cols-3 gap-4 mb-8">
      <div class="bg-white rounded-xl p-4 text-center border border-gray-100">
        <p class="text-2xl font-bold text-blue-600">500+</p>
        <p class="text-xs text-gray-500">누적 고객사</p>
      </div>
      <div class="bg-white rounded-xl p-4 text-center border border-gray-100">
        <p class="text-2xl font-bold text-blue-600">98%</p>
        <p class="text-xs text-gray-500">고객 만족도</p>
      </div>
      <div class="bg-white rounded-xl p-4 text-center border border-gray-100">
        <p class="text-2xl font-bold text-blue-600">15년</p>
        <p class="text-xs text-gray-500">업력</p>
      </div>
    </section>

    <!-- 카카오 로그인 버튼 -->
    <a href="${kakaoLoginUrl}" class="kakao-btn w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-black transition-colors">
      <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3C6.5 3 2 6.58 2 11c0 2.84 1.88 5.34 4.72 6.77-.15.56-.53 2.02-.6 2.34-.1.42.15.41.32.3.12-.08 1.97-1.34 2.78-1.89.9.13 1.84.2 2.78.2 5.5 0 10-3.58 10-8s-4.5-8-10-8z"/>
      </svg>
      카카오로 간편 신청하기
    </a>

    <p class="text-center text-xs text-gray-400 mt-4">
      카카오 계정으로 빠르고 안전하게 신청하세요
    </p>
  </main>

  <!-- 푸터 -->
  <footer class="bg-gray-100 py-6 px-4 mt-8">
    <div class="max-w-md mx-auto text-center text-xs text-gray-500">
      <p class="mb-2">© 2025 POLARAD. All rights reserved.</p>
      <a href="https://polarad.co.kr/privacy" class="text-gray-600 hover:underline">개인정보처리방침</a>
    </div>
  </footer>
</body>
</html>`;
}

// 문의 내용 입력 폼 (카카오 로그인 후)
function getInquiryForm(kakaoUser: KakaoUser): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>문의 내용 입력 | POLARAD</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
    * { font-family: 'Pretendard', -apple-system, sans-serif; }
  </style>
</head>
<body class="bg-gray-50 min-h-screen">
  <header class="bg-white border-b border-gray-200 py-4 px-4">
    <div class="max-w-md mx-auto flex items-center justify-center">
      <span class="text-2xl font-bold text-blue-600">POLAR<span class="text-gray-800">AD</span></span>
    </div>
  </header>

  <main class="max-w-md mx-auto px-4 py-8">
    <section class="text-center mb-6">
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h1 class="text-xl font-bold text-gray-900 mb-2">인증 완료!</h1>
      <p class="text-gray-600">${kakaoUser.nickname}님, 문의 내용을 입력해주세요</p>
    </section>

    <form action="/submit" method="POST" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <input type="hidden" name="kakao_id" value="${kakaoUser.id}">
      <input type="hidden" name="nickname" value="${kakaoUser.nickname}">
      <input type="hidden" name="email" value="${kakaoUser.email || ''}">
      <input type="hidden" name="phone" value="${kakaoUser.phone || ''}">

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">문의 내용</label>
        <textarea
          name="content"
          rows="5"
          required
          placeholder="광고 관련 궁금한 점이나 원하시는 서비스를 자유롭게 작성해주세요"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        ></textarea>
      </div>

      <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition-colors">
        신청 완료하기
      </button>
    </form>
  </main>
</body>
</html>`;
}

// 완료 페이지
function getCompletePage(): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>신청 완료 | POLARAD</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
    * { font-family: 'Pretendard', -apple-system, sans-serif; }
  </style>
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center">
  <main class="max-w-md mx-auto px-4 py-8 text-center">
    <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
    </div>
    <h1 class="text-2xl font-bold text-gray-900 mb-3">신청이 완료되었습니다!</h1>
    <p class="text-gray-600 mb-6">
      빠른 시일 내에 연락드리겠습니다.<br>
      감사합니다.
    </p>
    <a href="https://polarad.co.kr" class="inline-block text-blue-600 hover:underline">
      폴라애드 홈페이지 방문하기 →
    </a>
  </main>
</body>
</html>`;
}

// 에러 페이지
function getErrorPage(message: string): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>오류 | POLARAD</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center">
  <main class="max-w-md mx-auto px-4 py-8 text-center">
    <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </div>
    <h1 class="text-2xl font-bold text-gray-900 mb-3">오류가 발생했습니다</h1>
    <p class="text-gray-600 mb-6">${message}</p>
    <a href="/" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold">
      처음으로 돌아가기
    </a>
  </main>
</body>
</html>`;
}

interface KakaoUser {
  id: string;
  nickname: string;
  email?: string;
  phone?: string;
}

// 카카오 토큰 교환
async function exchangeKakaoToken(code: string, env: Env): Promise<string> {
  const response = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: env.KAKAO_CLIENT_ID,
      client_secret: env.KAKAO_CLIENT_SECRET,
      redirect_uri: env.KAKAO_REDIRECT_URI,
      code: code,
    }),
  });

  const data = await response.json() as { access_token: string };
  return data.access_token;
}

// 카카오 사용자 정보 조회
async function getKakaoUserInfo(accessToken: string): Promise<KakaoUser> {
  const response = await fetch('https://kapi.kakao.com/v2/user/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json() as {
    id: number;
    kakao_account?: {
      profile?: { nickname?: string };
      email?: string;
      phone_number?: string;
    };
  };

  return {
    id: String(data.id),
    nickname: data.kakao_account?.profile?.nickname || '사용자',
    email: data.kakao_account?.email,
    phone: data.kakao_account?.phone_number,
  };
}

// Airtable에 리드 저장
async function saveToAirtable(
  env: Env,
  lead: {
    kakao_id: string;
    nickname: string;
    email: string;
    phone: string;
    content: string;
    ip_address: string;
    user_agent: string;
    is_blocked: boolean;
    client_id: string;
  }
): Promise<void> {
  const response = await fetch(
    `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${env.AIRTABLE_TABLE_NAME}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              kakao_id: lead.kakao_id,
              nickname: lead.nickname,
              email: lead.email,
              phone: lead.phone,
              content: lead.content,
              ip_address: lead.ip_address,
              user_agent: lead.user_agent,
              is_blocked: lead.is_blocked,
              client_id: lead.client_id,
              created_at: new Date().toISOString(),
            },
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Airtable 저장 실패');
  }
}

// 텔레그램 알림 발송
async function sendTelegramNotification(
  env: Env,
  lead: {
    nickname: string;
    phone: string;
    email: string;
    content: string;
  }
): Promise<void> {
  const message = `🔔 새 리드 접수!

👤 ${lead.nickname}
📱 ${lead.phone || '미제공'}
📧 ${lead.email || '미제공'}

📝 문의 내용:
${lead.content}`;

  await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text: message,
      }),
    }
  );
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // 클라이언트 정보
    const clientIp = request.headers.get('cf-connecting-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const clientId = url.hostname.split('.')[0]; // 서브도메인을 클라이언트 ID로 사용

    try {
      // 메인 랜딩 페이지
      if (path === '/' || path === '') {
        return new Response(getLandingPage(env), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }

      // 카카오 OAuth 콜백
      if (path === '/callback') {
        const code = url.searchParams.get('code');
        if (!code) {
          return new Response(getErrorPage('인증 코드가 없습니다.'), {
            status: 400,
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          });
        }

        // 토큰 교환 및 사용자 정보 조회
        const accessToken = await exchangeKakaoToken(code, env);
        const kakaoUser = await getKakaoUserInfo(accessToken);

        // 문의 내용 입력 폼 표시
        return new Response(getInquiryForm(kakaoUser), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }

      // 폼 제출 처리
      if (path === '/submit' && request.method === 'POST') {
        const formData = await request.formData();
        const kakaoId = formData.get('kakao_id') as string;
        const nickname = formData.get('nickname') as string;
        const email = formData.get('email') as string || '';
        const phone = formData.get('phone') as string || '';
        const content = formData.get('content') as string;

        // 욕설 필터
        const isBlocked = containsProfanity(content);
        if (isBlocked) {
          // 차단 기록은 저장하되 에러 표시
          await saveToAirtable(env, {
            kakao_id: kakaoId,
            nickname,
            email,
            phone,
            content,
            ip_address: clientIp,
            user_agent: userAgent,
            is_blocked: true,
            client_id: clientId,
          });

          return new Response(getErrorPage('부적절한 표현이 포함되어 있습니다.'), {
            status: 400,
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          });
        }

        // 리드 저장
        await saveToAirtable(env, {
          kakao_id: kakaoId,
          nickname,
          email,
          phone,
          content,
          ip_address: clientIp,
          user_agent: userAgent,
          is_blocked: false,
          client_id: clientId,
        });

        // 텔레그램 알림
        await sendTelegramNotification(env, { nickname, phone, email, content });

        // 완료 페이지
        return new Response(getCompletePage(), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }

      // 404
      return new Response('Not Found', { status: 404 });
    } catch (error) {
      console.error('Error:', error);
      return new Response(getErrorPage('서비스 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'), {
        status: 500,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }
  },
};
