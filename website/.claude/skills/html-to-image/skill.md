# HTML to Image 캡처 스킬

HTML 파일을 정확한 픽셀 사이즈의 PNG 이미지로 캡처하는 방법

## 핵심 프로세스

### 1단계: 캡처용 HTML 파일 생성

각 이미지 사이즈에 맞는 독립적인 HTML 파일 생성:

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=[WIDTH], height=[HEIGHT]">
    <title>캡처용</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body {
            width: [WIDTH]px;
            height: [HEIGHT]px;
            overflow: hidden;
            background: #000000;  /* 필수: 배경색 지정 */
        }
        /* 이미지 스타일 */
    </style>
</head>
<body>
    <!-- 이미지 컨텐츠 -->
</body>
</html>
```

**필수 CSS:**
- `html, body`에 정확한 `width`, `height` 설정
- `overflow: hidden` 필수
- `background` 색상 필수 (흰색 여백 방지)

### 2단계: Playwright로 캡처 (정확한 순서)

```
1. navigate - HTML 파일 열기
2. resize - 정확한 뷰포트 사이즈 설정 (핵심!)
3. screenshot - 캡처
```

**MCP 명령어:**

```javascript
// 1. HTML 파일 열기
mcp__playwright__playwright_navigate({
    url: "file:///경로/capture-파일명.html"
})

// 2. 뷰포트 정확히 설정 (필수!)
mcp__playwright__playwright_resize({
    width: [WIDTH],
    height: [HEIGHT]
})

// 3. 스크린샷 저장
mcp__playwright__playwright_screenshot({
    name: "파일명",
    savePng: true,
    downloadsDir: "저장경로"
})
```

**주의:** `navigate`의 width/height 옵션만으로는 부족함. 반드시 `resize`로 뷰포트 재설정 필요!

## 일반적인 이미지 사이즈

| 용도 | 사이즈 | 비율 |
|------|--------|------|
| 프로필 (원형) | 720×720 | 1:1 |
| 커버 이미지 | 1200×675 | 16:9 |
| 배너 | 1200×400 | 3:1 |
| 소식글/카드 | 1200×900 | 4:3 |
| 인스타그램 피드 | 1080×1080 | 1:1 |
| 인스타그램 스토리 | 1080×1920 | 9:16 |
| 유튜브 썸네일 | 1280×720 | 16:9 |
| 오픈그래프 | 1200×630 | 1.91:1 |

## 실제 예시

### 프로필 720×720 캡처

```javascript
// 1. 열기
mcp__playwright__playwright_navigate({
    url: "file:///F:/project/docs/capture-profile.html"
})

// 2. 뷰포트 설정
mcp__playwright__playwright_resize({
    width: 720,
    height: 720
})

// 3. 캡처
mcp__playwright__playwright_screenshot({
    name: "profile-720",
    savePng: true,
    downloadsDir: "F:/project/docs"
})
```

### 커버 1200×675 캡처

```javascript
mcp__playwright__playwright_navigate({
    url: "file:///F:/project/docs/capture-cover.html"
})

mcp__playwright__playwright_resize({
    width: 1200,
    height: 675
})

mcp__playwright__playwright_screenshot({
    name: "cover-1200x675",
    savePng: true,
    downloadsDir: "F:/project/docs"
})
```

## 체크리스트

- [ ] HTML에 정확한 width/height 설정
- [ ] HTML에 background 색상 설정
- [ ] HTML에 overflow: hidden 설정
- [ ] navigate로 파일 열기
- [ ] **resize로 뷰포트 정확히 설정** (핵심!)
- [ ] screenshot으로 PNG 저장
- [ ] 캡처된 이미지 확인

## 트러블슈팅

### 흰색 여백이 보일 때
- HTML의 `html, body`에 `background: #000000` 추가
- `resize`로 뷰포트를 정확히 설정했는지 확인

### 이미지가 잘릴 때
- HTML의 width/height와 resize의 width/height가 일치하는지 확인

### 스크롤바가 보일 때
- `overflow: hidden` 설정 확인
