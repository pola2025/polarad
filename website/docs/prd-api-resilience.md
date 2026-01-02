# PRD: API 호출 실패 복원력 개선

## 개요

마케팅소식 자동 생성 시 Gemini API 호출 실패가 전체 프로세스를 중단시키는 문제 해결

## 현재 문제

| 단계 | 현재 동작 | 문제점 |
|------|----------|--------|
| SEO 키워드 생성 | API 실패 → throw | 전체 중단, 글 생성 불가 |
| 콘텐츠 생성 | API 실패 → throw | 전체 중단, 글 생성 불가 |

## 목표

- API 실패 시에도 fallback으로 글 생성 계속 진행
- 5일 연속 실패 문제 방지
- 품질은 낮아도 글은 생성되도록 보장

## 개선 사항

### 1. SEO 키워드 생성 (`generateSEOKeywords`)

**현재:**
```typescript
if (!res.ok) {
  throw new Error(`Gemini API error: ${res.status}`);
}
```

**개선:**
```typescript
if (!res.ok) {
  console.error(`SEO 키워드 API 실패: ${res.status}, fallback 사용`);
  return getDefaultSEOKeywords(title, category);
}
```

**Fallback 전략:**
- 제목에서 키워드 추출
- 카테고리별 기본 키워드 사용
- 연도 정보 추가

### 2. 콘텐츠 생성 (`generateContent`)

**현재:**
- 재시도 로직 없음
- 실패 시 전체 중단

**개선:**
- `withGeminiRetry` 래퍼 적용 (3회 재시도)
- 최종 실패 시 간단한 템플릿 콘텐츠 생성

**Fallback 전략:**
- 제목 기반 기본 구조 생성
- CTA 포함한 최소 콘텐츠
- "AI 생성 실패, 수동 보완 필요" 표시

## TDD 체크리스트

### SEO 키워드 Fallback

- [ ] API 성공 시 정상 키워드 반환
- [ ] API 실패 시 fallback 키워드 반환
- [ ] fallback 키워드에 primary 포함
- [ ] fallback 키워드에 카테고리 관련어 포함
- [ ] fallback 키워드에 현재 연도 포함

### 콘텐츠 생성 Fallback

- [ ] API 성공 시 정상 콘텐츠 반환
- [ ] API 1회 실패 → 재시도 → 성공
- [ ] API 3회 실패 → fallback 콘텐츠 반환
- [ ] fallback 콘텐츠에 제목 포함
- [ ] fallback 콘텐츠에 CTA 포함
- [ ] fallback 콘텐츠 최소 500자 이상

## 구현 우선순위

1. **P0**: SEO 키워드 fallback (간단)
2. **P0**: 콘텐츠 생성 재시도 (withGeminiRetry)
3. **P1**: 콘텐츠 생성 fallback 템플릿

## 성공 기준

- API 실패해도 글 생성 완료
- 텔레그램 알림에 "fallback 사용" 표시
- 관리자가 수동 보완 가능하도록 표시

---

## 구현 완료 내역

### 1. SEO 키워드 Fallback ✅

- `getDefaultSEOKeywords()` 함수 추가
- 카테고리별 기본 키워드 매핑
- 제목에서 주요 단어 추출
- `isFallback: true` 플래그로 표시

### 2. 콘텐츠 생성 재시도 ✅

- `withGeminiRetry()` 래퍼 적용 (3회 재시도)
- 빈 콘텐츠 또는 100자 미만 시 재시도
- 검색 실패 시에도 진행 (try-catch)

### 3. 콘텐츠 Fallback 템플릿 ✅

- `generateFallbackContent()` 함수 추가
- 카테고리별 레이블 적용
- 제목에서 키워드 추출
- CTA 포함 (폴라애드 컨설팅)
- "관리자 수동 보완 필요" 표시

---

**작성일**: 2026-01-02
**상태**: 완료
**커밋**: (배포 후 업데이트)
