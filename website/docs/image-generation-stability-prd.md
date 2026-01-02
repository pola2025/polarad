# 이미지 생성 안정화 PRD (Product Requirements Document)

**버전**: 1.1
**작성일**: 2024-12-28
**최종 수정**: 2026-01-02
**상태**: 1단계 완료, 1.1 핫픽스 완료 / 2-4단계 계획

---

## 1. 개요

### 1.1 문제 정의

마케팅 소식 자동 생성 시스템에서 **Gemini 이미지 생성 API 실패**가 빈번하게 발생하여:
- 기본 이미지(fallback)로 대체되는 경우 증가
- 콘텐츠 품질 저하
- 브랜드 일관성 훼손

### 1.2 목표

| 지표 | 현재 | 목표 |
|------|------|------|
| 이미지 생성 성공률 | ~60% (추정) | **95%+** |
| Fallback 이미지 사용률 | ~40% | **5% 미만** |
| 평균 생성 시간 | 불안정 | **30초 이내** |

---

## 2. 현재 상태 분석

### 2.1 주요 실패 원인

| 에러 유형 | 설명 | 발생 빈도 |
|----------|------|----------|
| `SAFETY_FILTER` | 프롬프트가 안전 필터에 걸림 (특히 "한국인" 관련 표현) | 높음 |
| `RATE_LIMIT` | API 호출 제한 초과 | 중간 |
| `NO_IMAGE_DATA` | 이미지 데이터 없이 응답 | 중간 |
| `TIMEOUT` | API 응답 지연 (60초+) | 낮음 |
| `API_ERROR` | 서버 에러 (5xx) | 낮음 |

### 2.2 기존 코드 문제점

1. **재시도 로직 부재**: 단순 반복 재시도, 지수 백오프 없음
2. **프롬프트 고정**: 실패해도 동일 프롬프트로 재시도
3. **타임아웃 미설정**: API 응답 무한 대기 가능
4. **에러 분류 미흡**: 모든 에러를 동일하게 처리

---

## 3. 구현 계획

### 3.1 단계별 로드맵

```
[1단계] 기본 안정화 ✅ 완료
   └─ 재시도 전략, 안전 레벨 프롬프트, 타임아웃

[2단계] 멀티 프로바이더 전략
   └─ Gemini 실패 시 다른 이미지 생성 서비스로 폴백

[3단계] 프리셋 이미지 라이브러리
   └─ 카테고리별 사전 생성된 고품질 이미지 풀

[4단계] 자체 이미지 생성 파이프라인
   └─ Stable Diffusion API 또는 자체 호스팅
```

---

## 4. 1단계: 기본 안정화 (✅ 완료)

### 4.1 구현 내용

#### 4.1.1 이미지 생성 전용 재시도 함수

**파일**: `src/lib/utils/index.ts`

```typescript
// 에러 유형 정의
type ImageGenerationErrorType =
  | 'SAFETY_FILTER'
  | 'RATE_LIMIT'
  | 'TIMEOUT'
  | 'NO_IMAGE_DATA'
  | 'API_ERROR'
  | 'UNKNOWN';

// 에러 분석 함수
function analyzeImageError(result, response): ImageGenerationError

// 타임아웃이 있는 fetch
function fetchWithTimeout(url, options, timeoutMs = 60000)

// 이미지 생성 전용 재시도 래퍼
function withImageGenerationRetry<T>(fn, options)
```

#### 4.1.2 안전 레벨별 프롬프트 전략

**파일**: `src/lib/image-variation.ts`

| 시도 횟수 | 안전 레벨 | 프롬프트 특성 |
|----------|----------|--------------|
| 0-1회 | `normal` | 기존 프롬프트 (한국인 명시) |
| 2-3회 | `safe` | 인종 명시 없음, 일반적 표현 |
| 4회+ | `minimal` | 사람 없음, 오브젝트만 |

```typescript
function getSafetyLevelByAttempt(attempt: number): PromptSafetyLevel
function buildImagePrompt(title, variation, safetyLevel)
```

#### 4.1.3 메인 함수 개선

**파일**: `src/app/api/cron/generate-article/route.ts`

- 재시도 횟수: 5회 → 7회
- 지수 백오프: 2초 → 최대 15초
- Rate Limit 대응: 30초 추가 대기
- 타임아웃: 90초 제한
- 에러 통계 수집 및 텔레그램 알림

### 4.2 모니터링 및 Rate Limit 개선 (✅ 완료)

**파일**: `src/lib/utils/index.ts`, `src/app/api/cron/generate-article/route.ts`

#### 추가된 기능

1. **통계 수집 시스템**
   - `notifyImageGenerationComplete()`: 모든 이미지 생성 결과 알림
   - 성공/실패, 재시도 횟수, 안전레벨, 소요시간, 에러 통계 포함
   - 3회 이상 재시도 또는 실패 시 텔레그램 알림

2. **Rate Limit 연속 발생 추적기** (`RateLimitTracker`)
   - 연속 발생 횟수 추적 (1분 윈도우)
   - 동적 대기 시간 계산:
     - 1회: 30초
     - 2회: 60초
     - 3회 이상: **5분 대기**
   - 성공 시 자동 리셋

3. **텔레그램 알림 형식**
   ```
   ✅ 이미지 생성 완료
   📝 제목: Claude MCP 서버 추천...
   🎯 결과: 성공
   🔄 재시도: 2회
   📊 안전레벨: 안전
   ⏱ 소요시간: 15.3초
   🔍 에러: SAFETY_FILTER: 2
   ```

### 4.3 예상 효과

- SAFETY_FILTER 에러 → safe/minimal 프롬프트로 회복 가능
- RATE_LIMIT 에러 → 동적 대기 (30초 → 60초 → 5분)
- 연속 Rate Limit 3회 → 5분 쿨다운으로 API 보호
- 무한 대기 방지 → 90초 타임아웃

---

## 5. 2단계: 멀티 프로바이더 전략 (계획)

### 5.1 개요

Gemini가 실패할 경우 다른 이미지 생성 서비스로 자동 폴백

### 5.2 대안 서비스

| 서비스 | 특징 | 비용 | 품질 |
|--------|------|------|------|
| **OpenAI DALL-E 3** | 고품질, 안정적 | $0.04/이미지 | ★★★★★ |
| **Stability AI** | 빠름, 저렴 | $0.02/이미지 | ★★★★☆ |
| **Replicate (FLUX)** | 오픈소스 모델 | $0.003/이미지 | ★★★★☆ |
| **Ideogram** | 텍스트 렌더링 우수 | $0.05/이미지 | ★★★★☆ |

### 5.3 구현 계획

```typescript
// 우선순위 기반 프로바이더 선택
const IMAGE_PROVIDERS = [
  { name: 'gemini', priority: 1, maxRetries: 3 },
  { name: 'dalle', priority: 2, maxRetries: 2 },
  { name: 'stability', priority: 3, maxRetries: 1 },
];

async function generateImageWithFallback(prompt: string) {
  for (const provider of IMAGE_PROVIDERS) {
    try {
      return await generateWithProvider(provider, prompt);
    } catch (error) {
      console.log(`${provider.name} 실패, 다음 프로바이더로...`);
    }
  }
  return FALLBACK_IMAGE;
}
```

### 5.4 필요 작업

- [ ] DALL-E API 연동 (이미 OpenAI 계정 있음)
- [ ] Stability AI API 키 발급
- [ ] 프로바이더 추상화 레이어 구현
- [ ] 비용 모니터링 대시보드

---

## 6. 3단계: 프리셋 이미지 라이브러리 (계획)

### 6.1 개요

카테고리별로 사전 생성된 고품질 이미지 풀을 유지하여, 생성 실패 시 적합한 이미지 선택

### 6.2 카테고리별 이미지 풀

| 카테고리 | 이미지 수 | 테마 |
|----------|----------|------|
| `meta-ads` | 20장 | Facebook/Instagram 광고, 비즈니스 미팅 |
| `instagram-reels` | 15장 | 영상 제작, 스마트폰, 크리에이터 |
| `threads` | 10장 | SNS, 텍스트 기반 소통 |
| `faq` | 15장 | 문제 해결, 고객 지원 |
| `ai-tips` | 15장 | AI 도구, 자동화, 생산성 |
| `ai-news` | 15장 | AI 기업, 기술 혁신 |

### 6.3 이미지 선택 로직

```typescript
// 제목/키워드 기반 가장 적합한 이미지 선택
async function selectPresetImage(title: string, category: string): Promise<string> {
  const presets = await getPresetImages(category);

  // 키워드 매칭으로 가장 적합한 이미지 선택
  const keywords = extractKeywords(title);
  const scored = presets.map(img => ({
    ...img,
    score: calculateRelevance(img.tags, keywords)
  }));

  return scored.sort((a, b) => b.score - a.score)[0].path;
}
```

### 6.4 필요 작업

- [ ] 카테고리별 이미지 100장 사전 생성 (DALL-E 3 사용)
- [ ] 이미지 메타데이터 (태그, 설명) 관리
- [ ] 이미지 선택 알고리즘 구현
- [ ] 주기적인 이미지 풀 갱신 시스템

---

## 7. 4단계: 자체 이미지 생성 파이프라인 (장기 계획)

### 7.1 개요

외부 API 의존도를 줄이고, 완전한 제어가 가능한 자체 파이프라인 구축

### 7.2 옵션 비교

| 옵션 | 초기 비용 | 운영 비용 | 제어력 | 난이도 |
|------|----------|----------|--------|--------|
| **Replicate API** | 없음 | 종량제 | 중간 | 낮음 |
| **RunPod GPU** | 없음 | $0.20/시간 | 높음 | 중간 |
| **자체 서버** | $2000+ | 전기/유지보수 | 최고 | 높음 |

### 7.3 추천 접근 방식

1. **단기**: Replicate API (FLUX 모델) 사용
2. **중기**: RunPod에서 Stable Diffusion XL 호스팅
3. **장기**: 자체 LoRA 모델 학습 (브랜드 스타일)

---

## 8. 모니터링 및 알림

### 8.1 현재 구현

- 텔레그램 알림: 이미지 생성 실패 시 에러 통계 포함 알림

### 8.2 추가 계획

| 지표 | 수집 방법 | 알림 조건 |
|------|----------|----------|
| 일일 생성 성공률 | 로그 집계 | 90% 미만 시 |
| 평균 생성 시간 | 타임스탬프 | 60초 초과 시 |
| 프로바이더별 성공률 | 로그 집계 | 특정 프로바이더 70% 미만 시 |
| 비용 | API 호출 추적 | 일일 예산 초과 시 |

---

## 9. 비용 추정

### 9.1 현재 비용 (Gemini)

- 이미지 생성: 무료 (Gemini 3 Pro Image Preview)
- 재시도로 인한 추가 API 호출 증가

### 9.2 멀티 프로바이더 시나리오

**가정**: 월 100개 이미지 생성, Gemini 70% 성공

| 시나리오 | Gemini | DALL-E | Stability | 월 비용 |
|----------|--------|--------|-----------|--------|
| Gemini만 | 100장 | - | - | $0 |
| Gemini + DALL-E | 70장 | 30장 | - | $1.2 |
| 3중 폴백 | 70장 | 20장 | 10장 | $1.0 |

---

## 10. 일정

| 단계 | 작업 | 예상 기간 | 우선순위 |
|------|------|----------|----------|
| 1단계 | 기본 안정화 | ✅ 완료 | - |
| 2단계 | DALL-E 폴백 추가 | 1-2일 | 높음 |
| 3단계 | 프리셋 이미지 풀 | 3-5일 | 중간 |
| 4단계 | 자체 파이프라인 | 미정 | 낮음 |

---

## 11. 다음 단계 권장 사항

### 즉시 실행 (2단계)

1. **DALL-E API 연동**
   - OpenAI API 키 확인
   - DALL-E 3 이미지 생성 함수 구현
   - Gemini 실패 시 자동 폴백

2. **비용 모니터링**
   - API 호출 수 추적
   - 월별 비용 리포트

### 단기 (3단계)

3. **프리셋 이미지 라이브러리**
   - 카테고리별 20장씩 사전 생성
   - 이미지 메타데이터 관리
   - 키워드 기반 선택 알고리즘

---

## 부록 A: 관련 파일 목록

| 파일 | 역할 |
|------|------|
| `src/lib/utils/index.ts` | 재시도 함수, 에러 분석 |
| `src/lib/image-variation.ts` | 프롬프트 빌더, 안전 레벨 |
| `src/app/api/cron/generate-article/route.ts` | 메인 생성 로직 |
| `src/lib/content-generator.ts` | 콘텐츠 생성기 |
| `src/app/api/generate-image/route.ts` | 이미지 생성 API |

---

## 부록 B: 에러 코드 레퍼런스

| 코드 | 설명 | 권장 조치 |
|------|------|----------|
| `SAFETY_FILTER` | 안전 필터 거부 | 더 안전한 프롬프트로 재시도 |
| `RATE_LIMIT` | API 호출 제한 | 30초 대기 후 재시도 |
| `TIMEOUT` | 응답 지연 | 5초 대기 후 재시도 |
| `NO_IMAGE_DATA` | 이미지 없음 | 프롬프트 수정 후 재시도 |
| `API_ERROR` | 서버 에러 | 다른 프로바이더로 폴백 |

---

## 변경 로그

### v1.1 (2026-01-02) - 한글 프롬프트 → 영어 프롬프트 핫픽스

#### 발견된 문제

**증상:**
- 로컬 테스트: 이미지 생성 성공
- Vercel Cron 실행: 이미지 생성 100% 실패 (기본 이미지로 대체)

**원인 분석:**

| 원인 | 상세 | 영향도 |
|------|------|--------|
| **한글 프롬프트** | `image-variation.ts`의 VARIATION_POOL이 한글로 작성됨 (예: "30대 한국인 여성 마케터 1명") | **치명적** |
| **Vercel maxDuration 미설정** | `vercel.json`에 함수 타임아웃 설정 없음 (Pro 플랜 기본 60초) | 중간 |
| **Gemini 이미지 모델 한글 처리** | Gemini 3 Pro Image가 한글 프롬프트를 제대로 처리하지 못함 | 높음 |

**검증:**
```bash
# 영어 프롬프트 직접 테스트 - 성공
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent" \
  -d '{"contents":[{"parts":[{"text":"Create a professional office photo..."}]}]}'
# → 이미지 base64 데이터 정상 반환

# regenerate-image API 테스트 (한글 프롬프트) - 실패
curl -X POST "https://polarad.co.kr/api/regenerate-image" -d '{"slug":"...", "title":"..."}'
# → {"error":"Image generation failed after retries","attempts":5,"durationMs":100585}
```

#### 수정 내용

**1. 프롬프트 영어화 (`src/lib/image-variation.ts`)**

변경 전:
```typescript
people: [
  '30대 한국인 여성 마케터 1명',
  '30대 한국인 남성 마케터 1명',
  // ...
]
```

변경 후:
```typescript
people: [
  'one female marketing professional in her 30s',
  'one male marketing professional in his 30s',
  // ...
]
```

**2. Vercel 타임아웃 설정 (`vercel.json`)**

```json
{
  "functions": {
    "src/app/api/cron/generate-article/route.ts": {
      "maxDuration": 300
    }
  }
}
```

**3. buildImagePrompt 함수 개선**

- "Korean" 키워드 제거 (안전 필터 회피)
- 간결한 영어 프롬프트 구조로 변경
- 이미지 크기 명시 (1200x630)

#### 핵심 교훈

1. **Gemini 이미지 생성은 영어 프롬프트만 사용**
2. **Vercel Pro 플랜도 maxDuration 명시 필요**
3. **로컬 vs 프로덕션 환경 차이 항상 확인**

#### 예상 효과

| 지표 | 수정 전 | 수정 후 (예상) |
|------|---------|---------------|
| 이미지 생성 성공률 | 0% (Vercel) | 90%+ |
| 재시도 횟수 | 6회 (모두 실패) | 1-2회 |
| 평균 생성 시간 | 실패 | 20-30초 |

---

### v1.0 (2024-12-28) - 초기 안정화

- 재시도 전략 구현 (지수 백오프)
- 안전 레벨별 프롬프트 전략
- 타임아웃 설정 (90초)
- 에러 분류 및 텔레그램 알림
