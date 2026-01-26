# 다음 세션 요청문

## 복사해서 사용:
```
polamkt Instagram 프롬프트 강화 완료 - 프로덕션 검증 필요
NEXT_SESSION_REQUEST.md 참고.
```

---

## 이번 세션 완료 작업

### 1. 드라이런 모드 추가 ✅
- `?dryrun=true` 파라미터로 Instagram 게시 없이 Gemini 응답 확인
- 프로덕션: `https://polarad.co.kr/api/cron/instagram-polamkt?dryrun=true`

### 2. 프롬프트 강화 ✅
**템플릿 + 캡션 프롬프트에 금지 항목 명시:**
- Meta 광고, Facebook 광고, Instagram 광고 ❌
- 홈페이지 제작 (5P, 10P) ❌
- 4티어 (Basic/Normal/Pro/Premium) ❌
- 자동 리포팅, 광고 세팅, 광고 대행 ❌
- 30만/60만/110만/220만원 ❌
- SEO 최적화, 광고비, ROAS 등 ❌

**오직 허용:**
- DB접수 랜딩 서비스 36만원
- 카카오 로그인, 텔레그램 알림, 대시보드
- 월 3만원, 1년 자동화, 5~7일 제작

### 3. 로컬 테스트 결과 ✅
| 테스트 | 템플릿 | 캡션 길이 | 금지 항목 |
|--------|--------|-----------|-----------|
| 1차 | case | 1,732자 | 없음 ✅ |
| 2차 | feature | 1,645자 | 없음 ✅ |

### 4. 배포 완료 ✅
- 커밋: b832e1f
- Vercel 자동 배포

---

## 다음 세션 작업

### 우선순위 1: 프로덕션 검증
```bash
# 프로덕션 드라이런 테스트
curl "https://polarad.co.kr/api/cron/instagram-polamkt?dryrun=true"
```
- 캡션에 Meta 광고, 4티어 등 금지 항목 없는지 확인
- 여러 번 실행해서 일관성 검증

### 우선순위 2: 실제 Instagram 게시 테스트
```bash
# force=true로 실제 게시 테스트
curl "https://polarad.co.kr/api/cron/instagram-polamkt?force=true"
```

---

## 관련 파일

- `src/app/api/cron/instagram-polamkt/route.ts` - 드라이런 모드 추가
- `src/lib/instagram-content-generator.ts` - 프롬프트 강화

---

## 프로젝트 정보
- 경로: F:\polasales\website
- GitHub: pola2025/polarad
- 프로덕션: https://polarad.co.kr

---

**작성일**: 2026-01-26
**상태**: 🟢 완료 - 프로덕션 검증 필요
