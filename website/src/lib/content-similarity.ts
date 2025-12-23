/**
 * 콘텐츠 유사도 검사 모듈
 * - Jaccard 유사도 기반 빠른 중복 검사
 * - 제목 중복 감지
 */

// ============================================
// 타입 정의
// ============================================

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  matchedTitle?: string;
  similarity?: number;
}

// ============================================
// 유틸리티 함수
// ============================================

/**
 * 텍스트를 토큰으로 분리
 */
function tokenize(text: string): Set<string> {
  // 한글, 영문, 숫자만 추출하여 토큰화
  const tokens = text
    .toLowerCase()
    .replace(/[^\w가-힣\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1);

  return new Set(tokens);
}

/**
 * Jaccard 유사도 계산
 * J(A, B) = |A ∩ B| / |A ∪ B|
 */
function jaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
  if (set1.size === 0 && set2.size === 0) return 1;
  if (set1.size === 0 || set2.size === 0) return 0;

  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
}

// ============================================
// 중복 검사 함수
// ============================================

/**
 * 제목 중복 검사 (Jaccard 유사도 기반)
 *
 * @param newTitle - 검사할 새 제목
 * @param existingTitles - 기존 제목 목록
 * @param threshold - 유사도 임계값 (기본 0.6 = 60%)
 * @returns 중복 여부 및 유사 제목
 */
export function checkTitleDuplicate(
  newTitle: string,
  existingTitles: string[],
  threshold = 0.6
): DuplicateCheckResult {
  if (!existingTitles || existingTitles.length === 0) {
    return { isDuplicate: false };
  }

  const newTokens = tokenize(newTitle);

  let maxSimilarity = 0;
  let matchedTitle: string | undefined;

  for (const existingTitle of existingTitles) {
    const existingTokens = tokenize(existingTitle);
    const similarity = jaccardSimilarity(newTokens, existingTokens);

    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      matchedTitle = existingTitle;
    }
  }

  if (maxSimilarity >= threshold) {
    return {
      isDuplicate: true,
      matchedTitle,
      similarity: Math.round(maxSimilarity * 100) / 100,
    };
  }

  return {
    isDuplicate: false,
    similarity: Math.round(maxSimilarity * 100) / 100,
  };
}

/**
 * 콘텐츠 유사도 검사 (더 긴 텍스트용)
 *
 * @param content1 - 첫 번째 콘텐츠
 * @param content2 - 두 번째 콘텐츠
 * @returns 유사도 점수 (0~1)
 */
export function calculateContentSimilarity(
  content1: string,
  content2: string
): number {
  const tokens1 = tokenize(content1);
  const tokens2 = tokenize(content2);

  return jaccardSimilarity(tokens1, tokens2);
}

/**
 * n-gram 기반 유사도 (더 정밀한 검사)
 *
 * @param text1 - 첫 번째 텍스트
 * @param text2 - 두 번째 텍스트
 * @param n - n-gram 크기 (기본 2 = bigram)
 * @returns 유사도 점수 (0~1)
 */
export function ngramSimilarity(
  text1: string,
  text2: string,
  n = 2
): number {
  function getNgrams(text: string, size: number): Set<string> {
    const cleaned = text.toLowerCase().replace(/\s+/g, ' ').trim();
    const ngrams = new Set<string>();

    for (let i = 0; i <= cleaned.length - size; i++) {
      ngrams.add(cleaned.slice(i, i + size));
    }

    return ngrams;
  }

  const ngrams1 = getNgrams(text1, n);
  const ngrams2 = getNgrams(text2, n);

  return jaccardSimilarity(ngrams1, ngrams2);
}
