# POLARAD Website 프로젝트 규칙

## ⚠️ Gemini AI 모델 사용 규칙 (절대규칙)

### 확정된 모델 설정 - 절대 변경 금지

| 용도 | 모델 | 비고 |
|------|------|------|
| 주제 생성 | `gemini-3-flash-preview` | 가벼운 작업 |
| SEO 키워드 | `gemini-3-flash-preview` | 가벼운 작업 |
| 중복 체크 | `gemini-3-flash-preview` | 가벼운 작업 |
| 템플릿 데이터 | `gemini-3-flash-preview` | Instagram 템플릿 |
| 최신 정보 검색 | `gemini-3-flash-preview` + Google Search | AI 카테고리용 |
| **콘텐츠 생성** | `gemini-3-pro-preview` | 본문/캡션 작성 |
| **이미지 생성** | `gemini-3-pro-image-preview` | 썸네일 전용 |

### 절대 금지 사항

- ❌ **Gemini 2.x 버전 사용 절대 금지** (gemini-2.0-flash, gemini-2.5-flash 등)
- ❌ 모델명 임의 변경 금지
- ❌ 사용자 확인 없이 모델 다운그레이드 금지
- ❌ 존재하지 않는 모델명 사용 금지

### 🔐 보안 규칙 (CRITICAL)

**Gemini 프롬프트에 시크릿/토큰 절대 포함 금지**

Gemini API에 전송되는 프롬프트에는 다음 정보가 절대 포함되면 안 됩니다:
- ❌ API 키 (GEMINI_API_KEY, AIRTABLE_API_KEY 등)
- ❌ 액세스 토큰 (GITHUB_TOKEN, TELEGRAM_BOT_TOKEN 등)
- ❌ 비밀번호, 인증 정보
- ❌ R2/AWS 자격 증명
- ❌ 기타 환경변수 시크릿 값

**이유**: Gemini가 시크릿을 학습하거나 유출할 위험이 있음

**원칙**: 보안 정보는 Claude만 알고 있어야 하며, Gemini 프롬프트에는 콘텐츠 관련 정보만 전달

### 모델 선택 원칙

1. **가벼운 작업** (주제, 키워드, 중복체크, 템플릿): `gemini-3-flash-preview`
2. **콘텐츠 생성** (본문, 캡션): `gemini-3-pro-preview`
3. **이미지 생성**: `gemini-3-pro-image-preview`

### AI 카테고리 처리 흐름 (ai-news, ai-tips)

1. `gemini-3-flash-preview` + Google Search로 주제 생성
2. `gemini-3-flash-preview` + Google Search로 최신 정보 검색 (최근 1개월)
3. 검색 결과 + 프롬프트 → `gemini-3-pro-preview`로 콘텐츠 생성

### 위반 시 조치

- 코드 수정 전 반드시 이 문서 확인
- 모델명 변경 시 반드시 사용자 승인 필요
- 2.x 버전 모델 발견 시 즉시 3.x로 교체

---

## 배포 규칙 (중복 배포 방지)

- ✅ `git push`만 실행 → Vercel GitHub 연동으로 자동 배포됨
- ❌ `npx vercel --prod` 수동 실행 금지 (중복 배포 발생)
- 수동 배포는 **자동 배포 실패 시에만** 사용

---

## 기타 프로젝트 규칙

- 마케팅소식 이미지 교체 시 파일명 변경 필수 (Vercel 캐시 문제)
- 텔레그램 백필 알림: `BACKFILL_CHAT_ID = '-1003394139746'`
