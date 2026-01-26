# 다음 세션 요청문

## 복사해서 사용:
```
polamkt 인스타그램 캡처 서비스 내재화 작업 계속해줘.
Satori 캡처 완료, route.ts에 통합만 남았어.
NEXT_SESSION_REQUEST.md 파일에 상세 컨텍스트 있음.
```

---

## 이전 세션 완료 작업

- ✅ 외부 캡처 서비스 (HCTI) 한도 문제 확인
- ✅ Satori + resvg-js 방식으로 자체 캡처 구현 결정
- ✅ 패키지 설치 완료: `satori`, `@resvg/resvg-js`, `satori-html`
- ✅ 테스트 스크립트 작성 및 검증 완료
  - `scripts/test-satori-capture.mjs` - 기본 테스트
  - `scripts/test-satori-real-template.mjs` - 실제 템플릿 테스트
- ✅ 테스트 결과: **성공** (1.6~3초, 100-120KB PNG 생성)
- ✅ Twemoji 이모지 지원 구현 완료
- ✅ 사용자 결정: SVG 아이콘으로 이모지 교체 예정
- ✅ Satori 캡처 유틸리티 모듈 생성: `src/lib/satori-capture.ts`

## 이번 세션 작업 (남은 것)

- [ ] `route.ts`의 `captureHtmlToImage` 함수에 Satori 통합
  - Satori를 **메인 방식**으로 사용
  - 기존 HCTI, screenshotone은 **백업으로 유지**
- [ ] 환경변수 상태 체크 로직 업데이트 (SATORI 추가)
- [ ] 템플릿의 이모지를 SVG 아이콘 (Lucide)으로 교체 (선택)
- [ ] Vercel 배포 테스트
- [ ] 불필요한 Cloudflare Worker 파일 삭제 (선택)

## 중요 컨텍스트

### 파일 위치
- 메인 API: `F:\polasales\website\src\app\api\cron\instagram-polamkt\route.ts`
- Satori 유틸: `F:\polasales\website\src\lib\satori-capture.ts` (신규)
- 템플릿: `F:\polasales\website\src\lib\instagram-templates.ts`
- 테스트 스크립트: `F:\polasales\website\scripts\test-satori-*.mjs`

### Satori 캡처 사용법 (route.ts에 통합할 코드)
```typescript
import { captureHtmlWithSatori } from '@/lib/satori-capture';

// captureHtmlToImage 함수 내에서:
// 방법 1: Satori (자체 구현 - 메인)
const imageBuffer = await captureHtmlWithSatori(html, 1080, 1350);
if (imageBuffer) {
  return imageBuffer;
}
// 실패 시 기존 백업 방식으로 폴백...
```

### 현재 route.ts 캡처 우선순위 구조
1. CF_SCREENSHOT_WORKER_URL (Cloudflare Worker - 미구현/삭제 예정)
2. SCREENSHOT_SERVICE_URL (레거시)
3. HCTI API (한도 문제)
4. screenshotone API (백업)

### 변경 후 구조 (예정)
1. **Satori (자체 구현 - 메인)** ← 새로 추가
2. HCTI API (백업)
3. screenshotone API (최후 백업)

### SVG 아이콘 교체 (선택 사항)
- 이모지 대신 Lucide Icons SVG 인라인으로 교체
- `instagram-templates.ts`의 이모지를 SVG 문자열로 변경
- 예: `🖥️` → Lucide `Monitor` SVG

## 프로젝트 정보

- 경로: `F:\polasales\website`
- GitHub: polasales 프로젝트
- 배포: Vercel (polarad.co.kr)
- 환경변수: Vercel 대시보드에서 설정

## 삭제 예정 파일

```
F:\polasales\workers\screenshot-worker\  (Cloudflare Worker - 미사용)
F:\polasales\website\scripts\test-satori-capture.js  (CJS 버전 - 불필요)
```

---

**마지막 업데이트**: 2025-01-18
**테스트 결과 파일**: `F:\polasales\website\test-output-real-template.png`
