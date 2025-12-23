/**
 * 콘텐츠 품질 검증 모듈
 * - 글자수, 키워드 밀도, 구조 검사
 * - 품질 점수 및 등급 산정
 * - 재생성 피드백 생성
 */

// ============================================
// 타입 정의
// ============================================

export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  suggestion?: string;
}

export interface ValidationResult {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  issues: ValidationIssue[];
  recommendation: 'publish' | 'review' | 'regenerate';
  metrics: {
    wordCount: number;
    paragraphCount: number;
    headingCount: number;
    linkCount: number;
    keywordDensity: number;
  };
}

export interface ValidationOptions {
  keywords?: string[];
  category?: string;
  minWordCount?: number;
  maxWordCount?: number;
}

// ============================================
// 품질 검증 함수
// ============================================

/**
 * 콘텐츠 품질 검증
 */
export function validateContent(
  content: string,
  options: ValidationOptions = {}
): ValidationResult {
  const {
    keywords = [],
    minWordCount = 800,
    maxWordCount = 3000,
  } = options;

  const issues: ValidationIssue[] = [];
  let score = 100;

  // 기본 메트릭 계산
  const wordCount = content.replace(/\s+/g, ' ').trim().split(' ').length;
  const charCount = content.length;
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);
  const headings = content.match(/^#{1,6}\s+.+$/gm) || [];
  const links = content.match(/\[.*?\]\(.*?\)/g) || [];

  // 키워드 밀도 계산
  let keywordCount = 0;
  const lowerContent = content.toLowerCase();
  for (const keyword of keywords) {
    if (keyword) {
      const regex = new RegExp(keyword.toLowerCase(), 'g');
      keywordCount += (lowerContent.match(regex) || []).length;
    }
  }
  const keywordDensity = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;

  // 메트릭
  const metrics = {
    wordCount,
    paragraphCount: paragraphs.length,
    headingCount: headings.length,
    linkCount: links.length,
    keywordDensity: Math.round(keywordDensity * 100) / 100,
  };

  // ============================================
  // 검증 규칙
  // ============================================

  // 1. 글자수 체크
  if (charCount < 500) {
    issues.push({
      type: 'error',
      code: 'CONTENT_TOO_SHORT',
      message: `글자수가 너무 적습니다 (${charCount}자)`,
      suggestion: '최소 800자 이상 작성하세요',
    });
    score -= 30;
  } else if (charCount < 1000) {
    issues.push({
      type: 'warning',
      code: 'CONTENT_SHORT',
      message: `글자수가 짧습니다 (${charCount}자)`,
      suggestion: '1000자 이상 권장',
    });
    score -= 10;
  }

  if (charCount > 10000) {
    issues.push({
      type: 'warning',
      code: 'CONTENT_TOO_LONG',
      message: `글자수가 너무 많습니다 (${charCount}자)`,
      suggestion: '5000자 이하 권장',
    });
    score -= 5;
  }

  // 2. 단락 구조 체크
  if (paragraphs.length < 3) {
    issues.push({
      type: 'warning',
      code: 'FEW_PARAGRAPHS',
      message: `단락이 적습니다 (${paragraphs.length}개)`,
      suggestion: '최소 5개 이상의 단락으로 구성하세요',
    });
    score -= 10;
  }

  // 3. 제목 구조 체크
  if (headings.length === 0) {
    issues.push({
      type: 'warning',
      code: 'NO_HEADINGS',
      message: '소제목이 없습니다',
      suggestion: '##, ### 등 마크다운 제목을 추가하세요',
    });
    score -= 15;
  } else if (headings.length < 3) {
    issues.push({
      type: 'info',
      code: 'FEW_HEADINGS',
      message: `소제목이 적습니다 (${headings.length}개)`,
      suggestion: '3개 이상의 소제목 권장',
    });
    score -= 5;
  }

  // 4. 키워드 밀도 체크
  if (keywords.length > 0 && keywordDensity < 0.5) {
    issues.push({
      type: 'warning',
      code: 'LOW_KEYWORD_DENSITY',
      message: `키워드 밀도가 낮습니다 (${metrics.keywordDensity}%)`,
      suggestion: '주요 키워드를 본문에 자연스럽게 더 포함하세요',
    });
    score -= 10;
  } else if (keywordDensity > 5) {
    issues.push({
      type: 'warning',
      code: 'HIGH_KEYWORD_DENSITY',
      message: `키워드 밀도가 너무 높습니다 (${metrics.keywordDensity}%)`,
      suggestion: '키워드 스터핑 주의',
    });
    score -= 10;
  }

  // 5. 링크 체크
  if (links.length === 0) {
    issues.push({
      type: 'info',
      code: 'NO_LINKS',
      message: '링크가 없습니다',
      suggestion: '관련 링크나 출처를 추가하세요',
    });
    score -= 5;
  }

  // 점수 보정
  score = Math.max(0, Math.min(100, score));

  // 등급 산정
  let grade: ValidationResult['grade'];
  if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else if (score >= 60) grade = 'D';
  else grade = 'F';

  // 권장 사항
  let recommendation: ValidationResult['recommendation'];
  if (score >= 80) recommendation = 'publish';
  else if (score >= 60) recommendation = 'review';
  else recommendation = 'regenerate';

  return {
    score,
    grade,
    issues,
    recommendation,
    metrics,
  };
}

// ============================================
// 결과 포맷팅
// ============================================

/**
 * 검증 결과 요약 포맷팅
 */
export function formatValidationSummary(result: ValidationResult): string {
  const issuesByType = {
    error: result.issues.filter(i => i.type === 'error'),
    warning: result.issues.filter(i => i.type === 'warning'),
    info: result.issues.filter(i => i.type === 'info'),
  };

  let summary = `📊 품질 검사 결과: ${result.score}점 (${result.grade})\n`;
  summary += `   단어: ${result.metrics.wordCount} | 단락: ${result.metrics.paragraphCount} | 제목: ${result.metrics.headingCount}\n`;

  if (issuesByType.error.length > 0) {
    summary += `\n❌ 오류 (${issuesByType.error.length}개):\n`;
    issuesByType.error.forEach(i => {
      summary += `   • ${i.message}\n`;
    });
  }

  if (issuesByType.warning.length > 0) {
    summary += `\n⚠️ 경고 (${issuesByType.warning.length}개):\n`;
    issuesByType.warning.forEach(i => {
      summary += `   • ${i.message}\n`;
    });
  }

  summary += `\n💡 권장: ${result.recommendation === 'publish' ? '발행 가능' : result.recommendation === 'review' ? '검토 필요' : '재생성 권장'}`;

  return summary;
}

/**
 * 재생성을 위한 피드백 생성
 */
export function generateRegenerationFeedback(result: ValidationResult): string {
  const errorIssues = result.issues.filter(i => i.type === 'error');
  const warningIssues = result.issues.filter(i => i.type === 'warning');

  let feedback = '다음 사항을 개선해주세요:\n';

  if (errorIssues.length > 0) {
    feedback += '\n[필수 수정]\n';
    errorIssues.forEach(i => {
      feedback += `- ${i.message}`;
      if (i.suggestion) feedback += ` (${i.suggestion})`;
      feedback += '\n';
    });
  }

  if (warningIssues.length > 0) {
    feedback += '\n[권장 수정]\n';
    warningIssues.forEach(i => {
      feedback += `- ${i.message}`;
      if (i.suggestion) feedback += ` (${i.suggestion})`;
      feedback += '\n';
    });
  }

  return feedback;
}
