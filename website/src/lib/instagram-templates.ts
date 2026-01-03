/**
 * Instagram 이미지 생성용 HTML 템플릿
 * polarad.co.kr 컨텐츠 기반 + Gemini 베리에이션
 */

export interface TemplateData {
  // 공통
  headline: string;
  subHeadline?: string;

  // 배지/태그
  badge?: string;

  // 리스트 아이템 (최대 4개)
  items?: Array<{
    icon?: string;
    text: string;
    highlight?: string;
  }>;

  // CTA
  cta?: string;

  // 통계/숫자 (KPI 템플릿용)
  stats?: Array<{
    label: string;
    value: string;
    change?: string;
  }>;

  // 색상 테마
  theme?: 'blue' | 'purple' | 'green' | 'red' | 'gradient';
}

export type TemplateType =
  | 'intro'      // 브랜드 소개
  | 'problem'    // 문제 제기
  | 'solution'   // 솔루션
  | 'feature'    // 기능 소개
  | 'stats'      // 통계/리포트
  | 'promo'      // 프로모션
  | 'service'    // 서비스 소개
  | 'case'       // 실제 사례/성과
  | 'cta';       // 마무리

/**
 * 색상 테마 정의 - 다양한 스타일 변화
 */
const COLOR_THEMES = {
  blue: {
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    aurora: 'radial-gradient(ellipse at 30% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
    accent: '#60a5fa',
    bg: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
  },
  purple: {
    primary: '#8b5cf6',
    primaryHover: '#7c3aed',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    aurora: 'radial-gradient(ellipse at 30% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
    accent: '#a78bfa',
    bg: 'linear-gradient(145deg, #1e1b4b 0%, #312e81 100%)',
  },
  green: {
    primary: '#10b981',
    primaryHover: '#059669',
    gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    aurora: 'radial-gradient(ellipse at 30% 20%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)',
    accent: '#34d399',
    bg: 'linear-gradient(145deg, #022c22 0%, #064e3b 100%)',
  },
  orange: {
    primary: '#f59e0b',
    primaryHover: '#d97706',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
    aurora: 'radial-gradient(ellipse at 30% 20%, rgba(245, 158, 11, 0.3) 0%, transparent 50%)',
    accent: '#fbbf24',
    bg: 'linear-gradient(145deg, #1c1917 0%, #292524 100%)',
  },
  pink: {
    primary: '#ec4899',
    primaryHover: '#db2777',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
    aurora: 'radial-gradient(ellipse at 30% 20%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)',
    accent: '#f472b6',
    bg: 'linear-gradient(145deg, #1f1218 0%, #3b1a2e 100%)',
  },
  cyan: {
    primary: '#06b6d4',
    primaryHover: '#0891b2',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)',
    aurora: 'radial-gradient(ellipse at 30% 20%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)',
    accent: '#22d3ee',
    bg: 'linear-gradient(145deg, #0c1a1e 0%, #164e63 100%)',
  },
};

const THEME_KEYS = Object.keys(COLOR_THEMES) as Array<keyof typeof COLOR_THEMES>;

type ThemeType = typeof COLOR_THEMES[keyof typeof COLOR_THEMES];

/**
 * 랜덤 테마 선택
 */
function getRandomTheme() {
  const randomKey = THEME_KEYS[Math.floor(Math.random() * THEME_KEYS.length)];
  return COLOR_THEMES[randomKey];
}

/**
 * 배경 패턴 스타일 (랜덤)
 */
function getRandomBackgroundPattern(): string {
  const patterns = [
    // 그리드 패턴
    `background: linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
     background-size: 60px 60px;`,
    // 도트 패턴
    `background: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px);
     background-size: 30px 30px;`,
    // 대각선 패턴
    `background: repeating-linear-gradient(
       45deg,
       transparent,
       transparent 30px,
       rgba(255,255,255,0.02) 30px,
       rgba(255,255,255,0.02) 60px
     );`,
    // 노이즈 패턴 (없음)
    '',
    // 원형 그라데이션
    `background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%);`,
  ];
  return patterns[Math.floor(Math.random() * patterns.length)];
}

/**
 * 템플릿 타입별 HTML 생성
 */
export function generateTemplateHtml(type: TemplateType, data: TemplateData): string {
  const baseStyles = getBaseStyles();
  const theme = getRandomTheme();
  const bgPattern = getRandomBackgroundPattern();

  switch (type) {
    case 'intro':
      return generateIntroTemplate(data, baseStyles, theme, bgPattern);
    case 'problem':
      return generateProblemTemplate(data, baseStyles, theme, bgPattern);
    case 'solution':
      return generateSolutionTemplate(data, baseStyles, theme, bgPattern);
    case 'feature':
      return generateFeatureTemplate(data, baseStyles, theme, bgPattern);
    case 'stats':
      return generateStatsTemplate(data, baseStyles, theme, bgPattern);
    case 'promo':
      return generatePromoTemplate(data, baseStyles, theme, bgPattern);
    case 'service':
      return generateServiceTemplate(data, baseStyles, theme, bgPattern);
    case 'case':
      return generateCaseTemplate(data, baseStyles, theme, bgPattern);
    case 'cta':
      return generateCtaTemplate(data, baseStyles, theme, bgPattern);
    default:
      return generateIntroTemplate(data, baseStyles, theme, bgPattern);
  }
}

function getBaseStyles(): string {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif; }
    .instagram-post {
      width: 1080px;
      height: 1350px;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      padding: 80px;
    }
    .aurora {
      position: absolute;
      inset: 0;
      opacity: 0.4;
    }
    .grid-pattern {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 60px 60px;
    }
    .content {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .logo {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      overflow: hidden;
    }
    .logo img { width: 100%; height: 100%; object-fit: contain; }
    .brand-name { font-size: 28px; font-weight: 700; color: #fff; }
    .badge {
      padding: 12px 24px;
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 100px;
      font-size: 18px;
      color: #3b82f6;
      font-weight: 600;
    }
    .footer {
      display: flex;
      justify-content: center;
      margin-top: auto;
      padding-top: 40px;
    }
    .website {
      font-size: 22px;
      color: #64748b;
    }
    .website span { color: #3b82f6; font-weight: 600; }
  `;
}

function generateIntroTemplate(data: TemplateData, baseStyles: string, theme: ThemeType, bgPattern: string): string {
  const items = data.items || [
    { text: '홈페이지' },
    { text: 'Meta 광고' },
    { text: '인쇄물' },
  ];

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" rel="stylesheet">
  <style>
    ${baseStyles}
    .instagram-post {
      background: ${theme.bg};
      align-items: center;
      justify-content: center;
    }
    .aurora::before {
      content: '';
      position: absolute;
      top: -50%; left: -50%;
      width: 200%; height: 200%;
      background: ${theme.aurora};
    }
    .grid-pattern {
      ${bgPattern}
    }
    .content {
      text-align: center;
      align-items: center;
      gap: 50px;
      height: auto;
    }
    .logo-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }
    .logo-icon {
      width: 120px;
      height: 120px;
      border-radius: 30px;
      overflow: hidden;
    }
    .logo-icon img { width: 100%; height: 100%; object-fit: contain; }
    .brand-name-large {
      font-size: 52px;
      font-weight: 800;
      background: linear-gradient(135deg, #ffffff 0%, #94a3b8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .brand-tagline { font-size: 24px; color: #64748b; }
    .headline {
      font-size: 56px;
      font-weight: 800;
      color: #fff;
      line-height: 1.3;
    }
    .headline .highlight {
      background: ${theme.gradient};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .sub-headline {
      font-size: 28px;
      color: #94a3b8;
      line-height: 1.6;
    }
    .features {
      display: flex;
      gap: 40px;
      margin-top: 20px;
    }
    .feature {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }
    .feature-icon {
      width: 80px;
      height: 80px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
    }
    .feature-text { font-size: 20px; color: #e2e8f0; font-weight: 600; }
    .cta {
      margin-top: 30px;
      padding: 24px 60px;
      background: ${theme.gradient};
      border-radius: 60px;
      font-size: 26px;
      font-weight: 700;
      color: white;
      box-shadow: 0 15px 40px ${theme.primary}66;
    }
    .website {
      position: absolute;
      bottom: 60px;
      left: 50%;
      transform: translateX(-50%);
    }
  </style>
</head>
<body>
  <div class="instagram-post">
    <div class="aurora"></div>
    <div class="grid-pattern"></div>
    <div class="content">
      <div class="logo-area">
        <div class="logo-icon">
          <img src="https://www.polarad.co.kr/instagram/logo.png" alt="PolarAD">
        </div>
        <div class="brand-name-large">PolarAD</div>
        <div class="brand-tagline">폴라애드 마케팅</div>
      </div>
      <div class="main-message">
        <h1 class="headline">${data.headline.replace(/\n/g, '<br>')}</h1>
        ${data.subHeadline ? `<p class="sub-headline">${data.subHeadline.replace(/\n/g, '<br>')}</p>` : ''}
      </div>
      <div class="features">
        ${items.map(item => `
          <div class="feature">
            <div class="feature-icon">${item.icon || '✨'}</div>
            <span class="feature-text">${item.text}</span>
          </div>
        `).join('')}
      </div>
      ${data.cta ? `<div class="cta">${data.cta} →</div>` : ''}
    </div>
    <div class="website">🌐 <span>polarad.co.kr</span></div>
  </div>
</body>
</html>`;
}

function generateProblemTemplate(data: TemplateData, baseStyles: string, theme: ThemeType, bgPattern: string): string {
  const items = data.items || [
    { text: '공유 DB로', highlight: '경쟁만 치열' },
    { text: '', highlight: '미팅 성사율 5% 미만' },
    { text: '매월', highlight: '수백만 원 DB 비용' },
  ];

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" rel="stylesheet">
  <style>
    ${baseStyles}
    .instagram-post {
      background: ${theme.bg};
    }
    .bg-effect::before {
      content: '';
      position: absolute;
      top: -20%; right: -20%;
      width: 80%; height: 80%;
      background: radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 70%);
    }
    .grid-pattern {
      ${bgPattern}
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 50px;
    }
    .badge-red {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 28px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 100px;
    }
    .badge-dot {
      width: 10px; height: 10px;
      background: #ef4444;
      border-radius: 50%;
    }
    .badge-text { font-size: 20px; color: #ef4444; font-weight: 600; }
    .main-question {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .question-text {
      font-size: 64px;
      font-weight: 800;
      color: #fff;
      line-height: 1.25;
      margin-bottom: 50px;
    }
    .question-text .red { color: #ef4444; }
    .question-text .gray { color: #6b7280; }
    .pain-points {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 40px;
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 24px;
      margin-bottom: 60px;
    }
    .pain-point {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .pain-icon {
      width: 50px; height: 50px;
      background: rgba(239, 68, 68, 0.1);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }
    .pain-text { font-size: 26px; color: #9ca3af; }
    .pain-text strong { color: #fff; font-weight: 700; }
    .solution-teaser {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 30px 40px;
      background: linear-gradient(135deg, ${theme.primary}1a 0%, ${theme.accent}1a 100%);
      border: 1px solid ${theme.primary}33;
      border-radius: 20px;
    }
    .solution-icon {
      width: 60px; height: 60px;
      background: ${theme.gradient};
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
    }
    .solution-text { font-size: 28px; color: #fff; font-weight: 700; }
    .solution-sub { font-size: 20px; color: #64748b; margin-top: 5px; }
  </style>
</head>
<body>
  <div class="instagram-post">
    <div class="bg-effect"></div>
    <div class="grid-pattern"></div>
    <div class="content">
      <div class="header">
        <div class="badge-red">
          <div class="badge-dot"></div>
          <span class="badge-text">${data.badge || '영업 대표님께 드리는 질문'}</span>
        </div>
      </div>
      <div class="main-question">
        <h1 class="question-text">${data.headline.replace(/\n/g, '<br>')}</h1>
        <div class="pain-points">
          ${items.map(item => `
            <div class="pain-point">
              <div class="pain-icon">❌</div>
              <span class="pain-text">${item.text} <strong>${item.highlight || ''}</strong></span>
            </div>
          `).join('')}
        </div>
        <div class="solution-teaser">
          <div class="solution-icon">✓</div>
          <div>
            <div class="solution-text">${data.cta || '체계적인 자동화 접수 시스템'}</div>
            <div class="solution-sub">${data.subHeadline || '영업에만 집중하시면 됩니다'}</div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="brand">
          <div class="logo"><img src="https://www.polarad.co.kr/instagram/logo.png" alt="PolarAD"></div>
          <span class="brand-name">PolarAD</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function generateSolutionTemplate(data: TemplateData, baseStyles: string, theme: ThemeType, bgPattern: string): string {
  const items = data.items || [
    { icon: '🎯', text: 'Conversion Basecamp', highlight: '고객을 설득하고 DB를 추출하는 전환 기지' },
    { icon: '🧲', text: 'Lead Magnet Engine', highlight: '잠재 고객을 정밀 타겟팅하여 유입' },
    { icon: '🏆', text: 'Authority Kit', highlight: '미팅 현장에서 신뢰도를 높이는 브랜딩 키트' },
  ];

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" rel="stylesheet">
  <style>
    ${baseStyles}
    .instagram-post {
      background: ${theme.bg};
    }
    .aurora::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: ${theme.aurora};
    }
    .grid-pattern {
      ${bgPattern}
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
    }
    .title-section {
      text-align: center;
      margin-bottom: 50px;
    }
    .title {
      font-size: 54px;
      font-weight: 800;
      color: #fff;
      line-height: 1.3;
      margin-bottom: 16px;
    }
    .title .gradient {
      background: ${theme.gradient};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle { font-size: 24px; color: #64748b; }
    .solution-cards {
      display: flex;
      flex-direction: column;
      gap: 24px;
      flex: 1;
    }
    .solution-card {
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 32px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
    }
    .card-icon {
      width: 72px; height: 72px;
      background: linear-gradient(135deg, ${theme.primary}33 0%, ${theme.accent}33 100%);
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      flex-shrink: 0;
    }
    .card-content { flex: 1; }
    .card-title { font-size: 26px; color: #fff; font-weight: 700; margin-bottom: 8px; }
    .card-desc { font-size: 20px; color: #94a3b8; line-height: 1.5; }
    .promo-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 24px;
      background: linear-gradient(135deg, rgba(234,179,8,0.1) 0%, rgba(245,158,11,0.1) 100%);
      border: 1px solid rgba(234,179,8,0.3);
      border-radius: 16px;
      margin-top: 30px;
    }
    .promo-text { font-size: 24px; color: #fbbf24; font-weight: 700; }
    .badge {
      background: ${theme.primary}1a;
      border-color: ${theme.primary}4d;
      color: ${theme.primary};
    }
  </style>
</head>
<body>
  <div class="instagram-post">
    <div class="aurora"></div>
    <div class="grid-pattern"></div>
    <div class="content">
      <div class="header">
        <div class="brand">
          <div class="logo"><img src="https://www.polarad.co.kr/instagram/logo.png" alt="PolarAD"></div>
          <span class="brand-name">PolarAD</span>
        </div>
        <div class="badge">${data.badge || '✨ 올인원 패키지'}</div>
      </div>
      <div class="title-section">
        <h1 class="title">${data.headline.replace(/\n/g, '<br>')}</h1>
        ${data.subHeadline ? `<p class="subtitle">${data.subHeadline}</p>` : ''}
      </div>
      <div class="solution-cards">
        ${items.map(item => `
          <div class="solution-card">
            <div class="card-icon">${item.icon || '✨'}</div>
            <div class="card-content">
              <div class="card-title">${item.text}</div>
              <div class="card-desc">${item.highlight || ''}</div>
            </div>
          </div>
        `).join('')}
      </div>
      ${data.cta ? `
        <div class="promo-badge">
          <span style="font-size: 28px;">🎁</span>
          <span class="promo-text">${data.cta}</span>
        </div>
      ` : ''}
      <div class="footer">
        <div class="website">🌐 <span>polarad.co.kr</span></div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function generateFeatureTemplate(data: TemplateData, baseStyles: string, theme: ThemeType, bgPattern: string): string {
  const items = data.items || [
    { icon: '🔔', text: '실시간 알림' },
    { icon: '📂', text: '자동 분류' },
    { icon: '💾', text: 'DB 관리' },
  ];

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" rel="stylesheet">
  <style>
    ${baseStyles}
    .instagram-post {
      background: ${theme.bg};
      align-items: center;
      justify-content: center;
    }
    .aurora::before {
      content: '';
      position: absolute;
      top: 20%; left: 50%;
      transform: translateX(-50%);
      width: 600px; height: 400px;
      background: ${theme.aurora};
    }
    .grid-pattern {
      ${bgPattern}
    }
    .content {
      text-align: center;
      align-items: center;
      gap: 50px;
      height: auto;
    }
    .icon-large {
      width: 120px; height: 120px;
      background: ${theme.gradient};
      border-radius: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 56px;
      box-shadow: 0 20px 60px ${theme.primary}66;
    }
    .title {
      font-size: 58px;
      font-weight: 800;
      color: #fff;
      line-height: 1.3;
    }
    .title .blue { color: ${theme.primary}; }
    .subtitle {
      font-size: 26px;
      color: #94a3b8;
      line-height: 1.6;
    }
    .feature-grid {
      display: flex;
      gap: 30px;
      margin-top: 20px;
    }
    .feature-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 30px 40px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
    }
    .feature-icon {
      width: 64px; height: 64px;
      background: ${theme.primary}1a;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
    }
    .feature-name { font-size: 22px; color: #fff; font-weight: 600; }
    .bottom-text {
      font-size: 24px;
      color: #64748b;
      margin-top: 30px;
    }
    .bottom-text strong { color: #fff; }
    .website span { color: ${theme.primary}; }
  </style>
</head>
<body>
  <div class="instagram-post">
    <div class="aurora"></div>
    <div class="grid-pattern"></div>
    <div class="content">
      <div class="icon-large">⚙️</div>
      <div>
        <h1 class="title">${data.headline.replace(/\n/g, '<br>')}</h1>
        ${data.subHeadline ? `<p class="subtitle">${data.subHeadline.replace(/\n/g, '<br>')}</p>` : ''}
      </div>
      <div class="feature-grid">
        ${items.map(item => `
          <div class="feature-item">
            <div class="feature-icon">${item.icon || '✨'}</div>
            <span class="feature-name">${item.text}</span>
          </div>
        `).join('')}
      </div>
      ${data.cta ? `<p class="bottom-text">${data.cta}</p>` : ''}
    </div>
    <div class="website" style="position: absolute; bottom: 60px; left: 50%; transform: translateX(-50%);">🌐 <span>polarad.co.kr</span></div>
  </div>
</body>
</html>`;
}

function generateStatsTemplate(data: TemplateData, baseStyles: string, theme: ThemeType, bgPattern: string): string {
  const stats = data.stats || [
    { label: '총 지출', value: '₩2.8M', change: '예산 대비 94%' },
    { label: 'DB 수집', value: '127건', change: '▲ 23% vs 지난주' },
    { label: 'DB당 단가', value: '₩22K', change: '▼ 12% 개선' },
  ];

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" rel="stylesheet">
  <style>
    ${baseStyles}
    .instagram-post {
      background: ${theme.bg};
    }
    .grid-bg {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(90deg, ${theme.primary}08 1px, transparent 1px),
        linear-gradient(${theme.primary}08 1px, transparent 1px);
      background-size: 40px 40px;
    }
    .grid-pattern {
      ${bgPattern}
    }
    .glow {
      position: absolute;
      top: 20%; left: 50%;
      transform: translateX(-50%);
      width: 600px; height: 400px;
      background: ${theme.aurora};
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 50px;
    }
    .title-section {
      text-align: center;
      margin-bottom: 50px;
    }
    .title {
      font-size: 54px;
      font-weight: 800;
      color: #fff;
      line-height: 1.25;
      margin-bottom: 20px;
    }
    .title .blue { color: ${theme.primary}; }
    .subtitle { font-size: 26px; color: #64748b; }
    .dashboard {
      flex: 1;
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 24px;
      padding: 40px;
      display: flex;
      flex-direction: column;
      gap: 30px;
    }
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .dashboard-title { font-size: 24px; font-weight: 700; color: #fff; }
    .date-range {
      padding: 10px 20px;
      background: rgba(255,255,255,0.05);
      border-radius: 8px;
      font-size: 16px;
      color: #94a3b8;
    }
    .kpi-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    .kpi-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 16px;
      padding: 24px;
    }
    .kpi-label { font-size: 16px; color: #64748b; margin-bottom: 10px; }
    .kpi-value { font-size: 36px; font-weight: 700; color: #fff; }
    .kpi-change { font-size: 14px; color: #22c55e; margin-top: 8px; }
    .kpi-change.negative { color: #ef4444; }
    .chart-area {
      flex: 1;
      background: rgba(255,255,255,0.02);
      border-radius: 16px;
      padding: 30px;
    }
    .chart-title { font-size: 18px; color: #94a3b8; margin-bottom: 20px; }
    .chart-bars {
      height: 200px;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 16px;
      padding-bottom: 30px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .bar-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
    }
    .bar {
      width: 100%;
      max-width: 60px;
      background: ${theme.gradient};
      border-radius: 6px 6px 0 0;
    }
    .bar-label { font-size: 16px; color: #64748b; }
    .badge {
      background: ${theme.primary}1a;
      border-color: ${theme.primary}4d;
      color: ${theme.primary};
    }
    .website span { color: ${theme.primary}; }
  </style>
</head>
<body>
  <div class="instagram-post">
    <div class="grid-bg"></div>
    <div class="glow"></div>
    <div class="content">
      <div class="header">
        <div class="brand">
          <div class="logo"><img src="https://www.polarad.co.kr/instagram/logo.png" alt="PolarAD"></div>
          <span class="brand-name">PolarAD</span>
        </div>
        <div class="badge">${data.badge || '📊 자동 리포팅'}</div>
      </div>
      <div class="title-section">
        <h1 class="title">${data.headline.replace(/\n/g, '<br>')}</h1>
        ${data.subHeadline ? `<p class="subtitle">${data.subHeadline}</p>` : ''}
      </div>
      <div class="dashboard">
        <div class="dashboard-header">
          <span class="dashboard-title">📈 실시간 광고 성과</span>
          <span class="date-range">최근 7일</span>
        </div>
        <div class="kpi-row">
          ${stats.map(stat => `
            <div class="kpi-card">
              <div class="kpi-label">${stat.label}</div>
              <div class="kpi-value">${stat.value}</div>
              <div class="kpi-change">${stat.change || ''}</div>
            </div>
          `).join('')}
        </div>
        <div class="chart-area">
          <div class="chart-title">일별 추이</div>
          <div class="chart-bars">
            <div class="bar-group"><div class="bar" style="height: 120px;"></div><span class="bar-label">월</span></div>
            <div class="bar-group"><div class="bar" style="height: 150px;"></div><span class="bar-label">화</span></div>
            <div class="bar-group"><div class="bar" style="height: 90px;"></div><span class="bar-label">수</span></div>
            <div class="bar-group"><div class="bar" style="height: 170px;"></div><span class="bar-label">목</span></div>
            <div class="bar-group"><div class="bar" style="height: 130px;"></div><span class="bar-label">금</span></div>
            <div class="bar-group"><div class="bar" style="height: 100px;"></div><span class="bar-label">토</span></div>
            <div class="bar-group"><div class="bar" style="height: 80px;"></div><span class="bar-label">일</span></div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="website">🌐 <span>polarad.co.kr</span></div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function generatePromoTemplate(data: TemplateData, baseStyles: string, theme: ThemeType, bgPattern: string): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" rel="stylesheet">
  <style>
    ${baseStyles}
    .instagram-post {
      background: ${theme.bg};
      align-items: center;
      justify-content: center;
    }
    .aurora::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: ${theme.aurora};
    }
    .grid-pattern {
      ${bgPattern}
    }
    .content {
      text-align: center;
      align-items: center;
      gap: 40px;
      height: auto;
    }
    .promo-badge {
      padding: 16px 32px;
      background: linear-gradient(135deg, rgba(234,179,8,0.2) 0%, rgba(245,158,11,0.2) 100%);
      border: 2px solid rgba(234,179,8,0.5);
      border-radius: 100px;
      font-size: 24px;
      color: #fbbf24;
      font-weight: 700;
    }
    .main-text {
      font-size: 52px;
      font-weight: 800;
      color: #fff;
      line-height: 1.25;
      word-break: keep-all;
    }
    .main-text .gold {
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .main-text .highlight {
      background: ${theme.gradient};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .sub-text {
      font-size: 28px;
      color: #94a3b8;
      line-height: 1.5;
      word-break: keep-all;
    }
    .benefit-box {
      padding: 40px 60px;
      background: rgba(255,255,255,0.03);
      border: 2px solid ${theme.primary}4d;
      border-radius: 24px;
      margin: 20px 0;
    }
    .benefit-title {
      font-size: 28px;
      color: #94a3b8;
      margin-bottom: 16px;
    }
    .benefit-value {
      font-size: 52px;
      font-weight: 800;
      color: #fbbf24;
    }
    .benefit-note {
      font-size: 20px;
      color: #64748b;
      margin-top: 12px;
    }
    .urgency {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 26px;
      color: #ef4444;
      font-weight: 600;
    }
    .cta-button {
      padding: 28px 70px;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      border-radius: 60px;
      font-size: 28px;
      font-weight: 700;
      color: #0f172a;
      box-shadow: 0 15px 40px rgba(234, 179, 8, 0.4);
    }
    .website span { color: ${theme.primary}; }
  </style>
</head>
<body>
  <div class="instagram-post">
    <div class="aurora"></div>
    <div class="grid-pattern"></div>
    <div class="content">
      <div class="promo-badge">${data.badge || '🎁 특별 프로모션'}</div>
      <h1 class="main-text">${data.headline.replace(/\n/g, '<br>')}</h1>
      ${data.subHeadline ? `<p class="sub-text">${data.subHeadline.replace(/\n/g, '<br>')}</p>` : ''}
      <div class="benefit-box">
        <div class="benefit-title">지금 신청하시면</div>
        <div class="benefit-value">${data.cta || '자동화 시스템 2년 무료'}</div>
        <div class="benefit-note">(정가 120만원 상당)</div>
      </div>
      <div class="urgency">🔴 마감 임박! 서두르세요</div>
      <div class="cta-button">지금 바로 신청 →</div>
    </div>
    <div class="website" style="position: absolute; bottom: 60px; left: 50%; transform: translateX(-50%);">🌐 <span>polarad.co.kr</span></div>
  </div>
</body>
</html>`;
}

function generateServiceTemplate(data: TemplateData, baseStyles: string, theme: ThemeType, bgPattern: string): string {
  const items = data.items || [
    { icon: '📱', text: '반응형 웹', highlight: 'PC, 모바일 모두 최적화' },
    { icon: '🔍', text: 'SEO 최적화', highlight: '검색엔진 상위 노출' },
    { icon: '📋', text: 'DB 폼 연동', highlight: '고객 문의 자동 수집' },
  ];

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" rel="stylesheet">
  <style>
    ${baseStyles}
    .instagram-post {
      background: ${theme.bg};
    }
    .aurora::before {
      content: '';
      position: absolute;
      top: 10%; left: 50%;
      transform: translateX(-50%);
      width: 80%; height: 60%;
      background: ${theme.aurora};
    }
    .grid-pattern {
      ${bgPattern}
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 50px;
    }
    .title-section {
      text-align: center;
      margin-bottom: 60px;
    }
    .title {
      font-size: 58px;
      font-weight: 800;
      color: #fff;
      line-height: 1.3;
      margin-bottom: 20px;
    }
    .title .blue { color: ${theme.primary}; }
    .subtitle {
      font-size: 26px;
      color: #64748b;
      line-height: 1.5;
    }
    .feature-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
      flex: 1;
    }
    .feature-row {
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 28px 36px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
    }
    .feature-icon {
      width: 64px; height: 64px;
      background: linear-gradient(135deg, ${theme.primary}33 0%, ${theme.accent}33 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      flex-shrink: 0;
    }
    .feature-content { flex: 1; }
    .feature-title { font-size: 26px; color: #fff; font-weight: 700; margin-bottom: 6px; }
    .feature-desc { font-size: 20px; color: #94a3b8; }
    .cta-section {
      text-align: center;
      margin-top: 40px;
    }
    .cta-text { font-size: 22px; color: #64748b; }
    .badge {
      background: ${theme.primary}1a;
      border-color: ${theme.primary}4d;
      color: ${theme.primary};
    }
    .website span { color: ${theme.primary}; }
  </style>
</head>
<body>
  <div class="instagram-post">
    <div class="aurora"></div>
    <div class="grid-pattern"></div>
    <div class="content">
      <div class="header">
        <div class="brand">
          <div class="logo"><img src="https://www.polarad.co.kr/instagram/logo.png" alt="PolarAD"></div>
          <span class="brand-name">PolarAD</span>
        </div>
        <div class="badge">${data.badge || '🖥️ 서비스 소개'}</div>
      </div>
      <div class="title-section">
        <h1 class="title">${data.headline.replace(/\n/g, '<br>')}</h1>
        ${data.subHeadline ? `<p class="subtitle">${data.subHeadline.replace(/\n/g, '<br>')}</p>` : ''}
      </div>
      <div class="feature-list">
        ${items.map(item => `
          <div class="feature-row">
            <div class="feature-icon">${item.icon || '✨'}</div>
            <div class="feature-content">
              <div class="feature-title">${item.text}</div>
              <div class="feature-desc">${item.highlight || ''}</div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="cta-section">
        ${data.cta ? `<p class="cta-text">💬 ${data.cta}</p>` : ''}
      </div>
      <div class="footer">
        <div class="website">🌐 <span>polarad.co.kr</span></div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function generateCaseTemplate(data: TemplateData, baseStyles: string, theme: ThemeType, bgPattern: string): string {
  const stats = data.stats || [
    { label: '광고비', value: '₩150만원', change: '월 예산' },
    { label: 'DB 수집', value: '127건', change: '월 평균' },
    { label: '미팅 전환', value: '32%', change: '업계 2배' },
  ];

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" rel="stylesheet">
  <style>
    ${baseStyles}
    .instagram-post {
      background: ${theme.bg};
      padding: 70px;
    }
    .aurora::before {
      content: '';
      position: absolute;
      inset: 0;
      background: ${theme.aurora};
    }
    .grid-pattern {
      ${bgPattern}
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 50px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .logo {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      overflow: hidden;
      background: white;
    }
    .logo img { width: 100%; height: 100%; object-fit: contain; }
    .brand-name { font-size: 28px; font-weight: 700; color: #fff; }
    .badge {
      padding: 14px 28px;
      background: ${theme.primary}22;
      border: 1px solid ${theme.primary}44;
      border-radius: 100px;
      font-size: 18px;
      color: ${theme.primary};
      font-weight: 600;
    }
    .case-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 32px;
      padding: 50px;
      margin-bottom: 40px;
    }
    .case-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .client-info {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .client-avatar {
      width: 80px;
      height: 80px;
      background: ${theme.gradient};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
    }
    .client-name { font-size: 32px; color: #fff; font-weight: 700; }
    .client-industry { font-size: 20px; color: #94a3b8; margin-top: 6px; }
    .period {
      font-size: 18px;
      color: #64748b;
      padding: 12px 24px;
      background: rgba(255,255,255,0.05);
      border-radius: 50px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;
      margin-bottom: 40px;
    }
    .stat-item {
      text-align: center;
      padding: 30px;
      background: rgba(255,255,255,0.02);
      border-radius: 20px;
    }
    .stat-value {
      font-size: 48px;
      font-weight: 800;
      color: ${theme.primary};
      margin-bottom: 10px;
    }
    .stat-label { font-size: 20px; color: #94a3b8; }
    .stat-change {
      font-size: 16px;
      color: #10b981;
      margin-top: 8px;
    }
    .quote-section {
      background: ${theme.primary}11;
      border-left: 4px solid ${theme.primary};
      padding: 30px 40px;
      border-radius: 0 20px 20px 0;
    }
    .quote-text {
      font-size: 26px;
      color: #e2e8f0;
      line-height: 1.6;
      font-style: italic;
    }
    .quote-author {
      font-size: 18px;
      color: #64748b;
      margin-top: 16px;
    }
    .cta-section {
      text-align: center;
      margin-top: 50px;
    }
    .cta-text {
      font-size: 28px;
      color: #fff;
      font-weight: 600;
      margin-bottom: 24px;
    }
    .cta-sub {
      font-size: 20px;
      color: ${theme.primary};
    }
    .footer {
      display: flex;
      justify-content: center;
      margin-top: auto;
    }
    .website { font-size: 22px; color: #64748b; }
    .website span { color: ${theme.primary}; font-weight: 600; }
  </style>
</head>
<body>
  <div class="instagram-post">
    <div class="aurora"></div>
    <div class="grid-pattern"></div>
    <div class="content">
      <div class="header">
        <div class="brand">
          <div class="logo">
            <img src="https://polarad.co.kr/images/logo-mobile.png" alt="PolarAD">
          </div>
          <span class="brand-name">PolarAD</span>
        </div>
        <div class="badge">${data.badge || '📈 실제 사례'}</div>
      </div>
      <div class="case-card">
        <div class="case-header">
          <div class="client-info">
            <div class="client-avatar">👤</div>
            <div>
              <div class="client-name">${data.headline.replace(/\n/g, ' ')}</div>
              <div class="client-industry">${data.subHeadline || '영업 대표님'}</div>
            </div>
          </div>
          <div class="period">운영 3개월 성과</div>
        </div>
        <div class="stats-grid">
          ${stats.map(stat => `
            <div class="stat-item">
              <div class="stat-value">${stat.value}</div>
              <div class="stat-label">${stat.label}</div>
              <div class="stat-change">${stat.change}</div>
            </div>
          `).join('')}
        </div>
        <div class="quote-section">
          <p class="quote-text">"${data.cta || '폴라애드 덕분에 영업에만 집중할 수 있게 됐습니다'}"</p>
          <p class="quote-author">- ${data.headline.replace(/\n/g, ' ')} 대표님</p>
        </div>
      </div>
      <div class="cta-section">
        <p class="cta-text">다음 성공 사례의 주인공이 되어보세요</p>
        <p class="cta-sub">💬 무료 상담 신청 → polarad.co.kr</p>
      </div>
      <div class="footer">
        <div class="website">🌐 <span>polarad.co.kr</span></div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function generateCtaTemplate(data: TemplateData, baseStyles: string, theme: ThemeType, bgPattern: string): string {
  const items = data.items || [
    { icon: '🖥️', text: '홈페이지' },
    { icon: '📱', text: 'Meta 광고' },
    { icon: '📊', text: '자동 리포트' },
    { icon: '🔔', text: '실시간 알림' },
  ];

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" rel="stylesheet">
  <style>
    ${baseStyles}
    .instagram-post {
      background: ${theme.bg};
      align-items: center;
      justify-content: center;
    }
    .aurora::before {
      content: '';
      position: absolute;
      inset: 0;
      background: ${theme.aurora};
    }
    .grid-pattern {
      ${bgPattern}
    }
    .content {
      text-align: center;
      align-items: center;
      gap: 50px;
      height: auto;
    }
    .quote {
      font-size: 52px;
      font-weight: 800;
      color: #fff;
      line-height: 1.4;
    }
    .quote-mark {
      font-size: 80px;
      color: ${theme.primary};
      line-height: 1;
    }
    .sub-quote {
      font-size: 28px;
      color: #94a3b8;
      margin-top: 16px;
    }
    .services-label {
      font-size: 22px;
      color: #64748b;
      margin-bottom: 24px;
    }
    .services-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
    .service-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px 32px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
    }
    .service-icon { font-size: 28px; }
    .service-name { font-size: 22px; color: #fff; font-weight: 600; }
    .bottom-message {
      font-size: 24px;
      color: #64748b;
      line-height: 1.6;
    }
    .bottom-message strong { color: #fff; }
    .cta-button {
      padding: 26px 60px;
      background: ${theme.gradient};
      border-radius: 60px;
      font-size: 26px;
      font-weight: 700;
      color: white;
      box-shadow: 0 15px 40px ${theme.primary}66;
    }
    .website span { color: ${theme.primary}; }
  </style>
</head>
<body>
  <div class="instagram-post">
    <div class="aurora"></div>
    <div class="grid-pattern"></div>
    <div class="content">
      <div>
        <div class="quote-mark">"</div>
        <h1 class="quote">${data.headline.replace(/\n/g, '<br>')}</h1>
        ${data.subHeadline ? `<p class="sub-quote">${data.subHeadline}</p>` : ''}
      </div>
      <div>
        <p class="services-label">폴라애드가 처리해드리는 것들</p>
        <div class="services-grid">
          ${items.map(item => `
            <div class="service-item">
              <span class="service-icon">${item.icon || '✨'}</span>
              <span class="service-name">${item.text}</span>
            </div>
          `).join('')}
        </div>
      </div>
      <p class="bottom-message">
        대표님은 <strong>고객 미팅</strong>과<br>
        <strong>계약 성사</strong>에만 집중하세요
      </p>
      <div class="cta-button">${data.cta || '무료 상담 신청'} →</div>
    </div>
    <div class="website" style="position: absolute; bottom: 60px; left: 50%; transform: translateX(-50%);">🌐 <span>polarad.co.kr</span></div>
  </div>
</body>
</html>`;
}

/**
 * 템플릿 타입 목록
 */
export const TEMPLATE_TYPES: TemplateType[] = [
  'intro',
  'problem',
  'solution',
  'feature',
  'stats',
  'promo',
  'service',
  'case',
  'cta',
];

/**
 * 랜덤 템플릿 타입 선택
 */
export function getRandomTemplateType(): TemplateType {
  const randomIndex = Math.floor(Math.random() * TEMPLATE_TYPES.length);
  return TEMPLATE_TYPES[randomIndex];
}
