# 당근마켓 소식 이미지 생성 Skill

## 용도
당근마켓 비즈니스 프로필 "소식" 탭에 업로드할 상품 이미지 생성

## 이미지 사양

### 사이즈
- **업로드 사이즈**: 800x1000px (세로형)
- **미리보기**: 2:1 비율로 크롭됨 (중앙 기준)
- **Safe Zone**: y좌표 300~700px (중앙 400px 영역)

### 레이아웃 구조
```
┌─────────────────────┐
│   상단 (잘림)       │ 0~300px
│   로고, 뱃지        │
├─────────────────────┤
│   2:1 Safe Zone     │ 300~700px
│   - 카테고리        │
│   - 제목 (큰 글씨)  │
│   - 부제목          │
│   - 가격 (강조)     │
├─────────────────────┤
│   하단 (잘림)       │ 700~1000px
│   - 체크리스트      │
│   - 푸터            │
└─────────────────────┘
```

### 디자인 스타일
- **배경**: 다크 테마 (#0a0a0a ~ #1a1a1a)
- **상단 Glow**: 황금색 그라데이션 빛 효과 (PREMIUM용)
- **뱃지**: 우측 상단, 테두리 스타일
- **가격**: 큰 숫자 + 그라데이션 (황금색/녹색 등 상품별)
- **체크리스트**: 녹색 체크 아이콘 + 태그(HOT, UP, NEW)

## 상품별 색상 테마

| 상품 | 가격 | 메인 색상 | Glow 색상 |
|------|------|-----------|-----------|
| PROMO | 11만원 | 실버 (#C0C0C0) | 없음 |
| BASIC | 30만원 | 화이트 (#FFFFFF) | 없음 |
| NORMAL | 60만원 | 시안 (#00D4FF) | 청록 |
| PRO | 110만원 | 그린 (#10B981) | 녹색 |
| PREMIUM | 220만원 | 골드 (#FFD700) | 황금색 |

## 생성 절차

### 1. HTML 템플릿 생성
```
F:\polasales\website\docs\danggun\template-{상품명}.html
```

### 2. Playwright로 스크린샷
```javascript
// 1. viewport 리사이즈
playwright_resize({ width: 800, height: 1000 })

// 2. HTML 파일 열기
playwright_navigate({ url: "file:///F:/polasales/website/docs/danggun/template-{상품명}.html" })

// 3. 스크린샷 저장
playwright_screenshot({
  name: "{상품명}-800x1000",
  fullPage: true,
  savePng: true,
  downloadsDir: "F:/polasales/website/docs/danggun"
})
```

### 3. 사이즈 검증
```bash
file "파일경로.png"
# 결과: PNG image data, 800 x 1000
```

## HTML 템플릿 (Full)

기존 스타일 참조: `F:\polasales\website\docs\danggun\test-premium.html`

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=800, height=1000">
  <title>상품명</title>
  <style>
    @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      width: 800px;
      height: 1000px;
      background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
      font-family: 'Pretendard', -apple-system, sans-serif;
      color: white;
      position: relative;
      overflow: hidden;
    }

    /* ★ 황금색 상단 Glow 효과 */
    .top-glow {
      position: absolute;
      top: -100px;
      left: 50%;
      transform: translateX(-50%);
      width: 600px;
      height: 300px;
      background: radial-gradient(ellipse, rgba(255,215,0,0.15) 0%, transparent 70%);
      pointer-events: none;
    }

    /* ★ 우측 상단 뱃지 */
    .top-badge {
      position: absolute;
      top: 40px;
      right: 40px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .badge {
      background: linear-gradient(135deg, #d4a574 0%, #c9956c 100%);
      color: #1a1a1a;
      padding: 8px 20px;
      border-radius: 30px;
      font-size: 16px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .recommend-tag {
      background: #ff6b35;
      color: white;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }

    /* 상단 영역 (0~300px) - 잘림 */
    .top-zone {
      height: 300px;
      padding: 40px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }

    .logo {
      font-size: 28px;
      font-weight: 700;
      color: #fff;
    }

    /* ★ Safe Zone (300~700px) - 핵심 콘텐츠 */
    .safe-zone {
      height: 400px;
      padding: 30px 40px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .category {
      font-size: 14px;
      color: #d4a574;
      font-weight: 600;
      letter-spacing: 2px;
      margin-bottom: 12px;
    }

    .title {
      font-size: 48px;
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 16px;
    }

    .title .highlight {
      background: linear-gradient(135deg, #ffd700 0%, #ffaa00 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      font-size: 18px;
      color: #888;
      margin-bottom: 30px;
    }

    .price-container {
      display: flex;
      align-items: baseline;
      gap: 12px;
    }

    .price {
      font-size: 80px;
      font-weight: 800;
      background: linear-gradient(135deg, #ffd700 0%, #ffaa00 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1;
    }

    .price-unit {
      font-size: 32px;
      font-weight: 700;
      color: #d4a574;
    }

    .price-vat {
      font-size: 16px;
      color: #666;
      margin-left: 8px;
    }

    /* 하단 영역 (700~1000px) - 잘림 */
    .bottom-zone {
      height: 300px;
      padding: 30px 40px;
    }

    .features {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px 40px;
    }

    .feature {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 18px;
      color: #ccc;
    }

    .feature .check {
      width: 24px;
      height: 24px;
      background: #10b981;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .feature .check svg {
      width: 14px;
      height: 14px;
      stroke: white;
      stroke-width: 3;
      fill: none;
    }

    .tag { font-size: 11px; padding: 2px 8px; border-radius: 4px; font-weight: 600; margin-left: 8px; }
    .tag.hot { background: #ef4444; color: white; }
    .tag.up { background: #10b981; color: white; }

    .footer {
      position: absolute;
      bottom: 30px;
      left: 40px;
      right: 40px;
      display: flex;
      justify-content: space-between;
      color: #555;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="top-glow"></div>

  <div class="top-badge">
    <div class="badge"><span>👑</span><span>PREMIUM</span></div>
    <div class="recommend-tag">추천</div>
  </div>

  <div class="top-zone">
    <div class="logo">PolaAd</div>
  </div>

  <div class="safe-zone">
    <div class="category">ALL-IN-ONE PACKAGE</div>
    <h1 class="title">
      <span class="highlight">풀 패키지</span>로<br>완벽하게 시작
    </h1>
    <p class="subtitle">온라인 영업 시스템을 완성하고 싶은 분께</p>
    <div class="price-container">
      <span class="price">220</span>
      <span class="price-unit">만원</span>
      <span class="price-vat">VAT 포함</span>
    </div>
  </div>

  <div class="bottom-zone">
    <div class="features">
      <div class="feature">
        <div class="check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>
        <span>홈페이지 10P</span><span class="tag up">UP</span>
      </div>
      <div class="feature">
        <div class="check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>
        <span>Meta 광고 세팅</span>
      </div>
      <div class="feature">
        <div class="check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>
        <span>자동화 6개월</span><span class="tag hot">HOT</span>
      </div>
      <div class="feature">
        <div class="check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>
        <span>도메인 + 알림</span>
      </div>
    </div>
  </div>

  <div class="footer">
    <span>상담 후 진행됩니다</span>
    <span>polarad.co.kr</span>
  </div>
</body>
</html>
```

## 주의사항

1. **Safe Zone 필수**: 핵심 정보(제목, 가격)는 반드시 300~700px 영역에 배치
2. **점선 가이드 제거**: 최종 이미지에서 개발용 점선 테두리 제거
3. **폰트**: Pretendard CDN 사용
4. **이미지 검증**: 생성 후 반드시 `file` 명령어로 800x1000 확인

## 파일 저장 위치
```
F:\polasales\website\docs\danggun\
├── template-promo.html
├── template-basic.html
├── template-normal.html
├── template-normal-800x1000.html  ← 심플 스타일
├── template-pro.html
├── template-premium.html
├── promo-800x1000-{timestamp}.png
├── basic-800x1000-{timestamp}.png
├── normal-800x1000-{timestamp}.png
├── pro-800x1000-{timestamp}.png
└── premium-800x1000-{timestamp}.png
```

---

## 심플 스타일 템플릿 (가격 강조형)

### 특징
- **큰 가격 숫자** (280px) - 네온 글로우 효과
- **프로모션 태그** - 상단 중앙 빨간 배지
- **전체 화면 디자인** - Safe Zone 무시, 임팩트 강조
- **2x2 체크리스트 그리드** - 하단 고정
- **시안(Cyan) 색상** - NORMAL 상품용

### 용도
- 프로모션 강조 이미지
- 가격 임팩트가 중요한 광고
- 당근마켓 소식 피드용

### HTML 템플릿 (심플 스타일 - NORMAL 60만원)

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=800, height=1000">
  <title>NORMAL 60만원 - 800x1000</title>
  <style>
    @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      width: 800px;
      height: 1000px;
      background: linear-gradient(180deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%);
      font-family: 'Pretendard', -apple-system, sans-serif;
      color: white;
      position: relative;
      overflow: hidden;
    }

    /* 상단 글로우 - 시안 */
    .top-glow {
      position: absolute;
      top: -80px;
      left: 50%;
      transform: translateX(-50%);
      width: 600px;
      height: 250px;
      background: radial-gradient(ellipse, rgba(0,200,200,0.15) 0%, transparent 70%);
    }

    /* 프로모션 태그 */
    .promo-tag {
      position: absolute;
      top: 40px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      padding: 12px 28px;
      border-radius: 24px;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 1px;
    }

    /* 메인 컨텐츠 */
    .main-content {
      position: absolute;
      top: 110px;
      left: 50px;
      right: 50px;
      text-align: center;
    }

    .title {
      font-size: 88px;
      font-weight: 800;
      line-height: 1.15;
      margin-bottom: 20px;
    }

    .title .highlight {
      background: linear-gradient(135deg, #00d4d4 0%, #00a0a0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .sub-headline {
      font-size: 24px;
      color: #999;
      margin-bottom: 16px;
      font-weight: 500;
    }

    /* 가격 */
    .price-section {
      position: absolute;
      bottom: 280px;
      left: 0;
      right: 0;
      text-align: center;
    }

    .price-container {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 10px;
    }

    .price {
      font-size: 280px;
      font-weight: 900;
      color: #fff;
      line-height: 1;
      text-shadow:
        0 0 10px rgba(0,210,210,0.8),
        0 0 20px rgba(0,210,210,0.6),
        0 0 40px rgba(0,180,180,0.4),
        0 0 80px rgba(0,150,150,0.3);
      filter: brightness(1.1);
    }

    .price-unit {
      font-size: 56px;
      font-weight: 800;
      color: #fff;
      text-shadow:
        0 0 10px rgba(0,210,210,0.6),
        0 0 20px rgba(0,180,180,0.4);
    }

    .price-vat {
      font-size: 18px;
      color: #888;
      margin-left: 8px;
      align-self: baseline;
    }

    /* 체크리스트 그리드 */
    .features {
      position: absolute;
      bottom: 100px;
      left: 50px;
      right: 50px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }

    .feature.full-width {
      grid-column: 1 / -1;
    }

    .feature {
      display: flex;
      align-items: center;
      gap: 12px;
      background: linear-gradient(145deg, rgba(0,80,80,0.3) 0%, rgba(0,40,40,0.5) 100%);
      padding: 18px 20px;
      border-radius: 12px;
      border: 1px solid rgba(0,200,200,0.35);
      box-shadow:
        inset 0 1px 0 rgba(0,255,255,0.1),
        inset 0 -1px 0 rgba(0,0,0,0.2),
        0 2px 8px rgba(0,0,0,0.3);
    }

    .feature .check {
      width: 26px;
      height: 26px;
      border: 2px solid #00d4d4;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: linear-gradient(145deg, rgba(0,100,100,0.3) 0%, rgba(0,50,50,0.5) 100%);
    }

    .feature .check svg {
      width: 14px;
      height: 14px;
      stroke: #00e0e0;
      stroke-width: 3;
      fill: none;
    }

    .feature span {
      font-size: 17px;
      color: #e0e0e0;
      font-weight: 500;
    }

    /* 푸터 */
    .footer {
      position: absolute;
      bottom: 40px;
      left: 50px;
      right: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer-logo {
      font-size: 22px;
      font-weight: 700;
      color: #555;
    }

    .footer-site {
      font-size: 16px;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="top-glow"></div>

  <div class="promo-tag">🎁 2026 신년 특별 프로모션</div>

  <div class="main-content">
    <p class="sub-headline">광고 테스트를 시작하는 분</p>

    <h1 class="title">
      <span class="highlight">랜딩페이지</span>와<br>
      광고를 함께
    </h1>

  </div>

  <div class="price-section">
    <div class="price-container">
      <span class="price">60</span>
      <span class="price-unit">만원</span>
      <span class="price-vat">(VAT 포함)</span>
    </div>
  </div>

  <div class="features">
    <div class="feature">
      <div class="check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
      <span>랜딩페이지 1P</span>
    </div>
    <div class="feature">
      <div class="check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
      <span>Meta 광고 세팅</span>
    </div>
    <div class="feature">
      <div class="check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
      <span>Meta 자동화 1개월</span>
    </div>
    <div class="feature">
      <div class="check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
      <span>도메인 1년 제공</span>
    </div>
  </div>

  <div class="footer">
    <span class="footer-logo">PolaAd</span>
    <span class="footer-site">polarad.co.kr</span>
  </div>
</body>
</html>
```

### 색상 테마 변형

| 상품 | 가격 | 글로우 색상 | Highlight 색상 |
|------|------|-------------|----------------|
| NORMAL | 60 | `rgba(0,210,210,X)` | `#00d4d4` → `#00a0a0` |
| PRO | 110 | `rgba(16,185,129,X)` | `#10B981` → `#059669` |
| PREMIUM | 220 | `rgba(255,215,0,X)` | `#FFD700` → `#FFAA00` |

### CSS 변수로 색상 변경

```css
/* NORMAL (시안) */
--glow: rgba(0,210,210,0.8);
--highlight: linear-gradient(135deg, #00d4d4, #00a0a0);

/* PRO (그린) */
--glow: rgba(16,185,129,0.8);
--highlight: linear-gradient(135deg, #10B981, #059669);

/* PREMIUM (골드) */
--glow: rgba(255,215,0,0.8);
--highlight: linear-gradient(135deg, #FFD700, #FFAA00);
```
