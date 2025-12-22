# POLARAD Website 프로젝트 규칙

## Gemini AI 모델 사용 규칙 (필수 준수)

### 확정된 모델 설정 - 변경 금지

| 용도 | 모델 | 비고 |
|------|------|------|
| 주제 생성 | `gemini-3-flash-preview` | 가벼운 작업 |
| SEO 키워드 | `gemini-3-flash-preview` | 가벼운 작업 |
| 중복 체크 | `gemini-3-flash-preview` | 가벼운 작업 |
| 최신 정보 검색 | `gemini-3-flash-preview` + Google Search | AI 카테고리용 |
| **콘텐츠 생성** | `gemini-3-pro-preview` | 본문 작성 |
| 이미지 생성 | `gemini-2.0-flash-exp-image-generation` | 썸네일 전용 |

### 금지 사항

- ❌ `gemini-2.0-flash` 텍스트 생성에 사용 금지
- ❌ 모델명 임의 변경 금지
- ❌ 사용자 확인 없이 모델 다운그레이드 금지

### AI 카테고리 처리 흐름 (ai-news, ai-tips)

1. `gemini-3-flash-preview` + Google Search로 주제 생성
2. `gemini-3-flash-preview` + Google Search로 최신 정보 검색 (최근 1개월)
3. 검색 결과 + 프롬프트 → `gemini-3-pro-preview`로 콘텐츠 생성

---

## 기타 프로젝트 규칙

- 마케팅소식 이미지 교체 시 파일명 변경 필수 (Vercel 캐시 문제)
- 텔레그램 백필 알림: `BACKFILL_CHAT_ID = '-1003394139746'`
