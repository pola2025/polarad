#!/usr/bin/env node
/**
 * Fix OpenCode article - Remove ANSI escape codes from content
 * Record ID: recHfnES2bf4pzCAp
 */

require('dotenv').config({ path: '.env.local' });

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const BASE_ID = 'appbqw2GAixv7vSBV';
const TABLE_NAME = '뉴스레터';
const RECORD_ID = 'recHfnES2bf4pzCAp';

const cleanContent = `# OpenCode와 Oh-My-OpenCode: AI 코딩 환경의 새로운 패러다임

안녕하세요, AI 기술 기반 마케팅 솔루션 **폴라애드(POLARAD)**입니다.

2026년 AI 코딩 도구 시장에서 가장 주목받는 프로젝트가 있습니다. 바로 **OpenCode**와 그 위에서 동작하는 **Oh-My-OpenCode(OMO)** 플러그인입니다. GitHub Stars 4.9k, 358 Forks를 기록하며 개발자 커뮤니티에서 폭발적인 반응을 얻고 있는 이 도구들의 실제 사용자 평가와 장점을 분석해 드립니다.

---

## 1. OpenCode란?

**OpenCode**는 Claude Code의 오픈소스 대안으로, 터미널 기반 AI 코딩 에이전트입니다.

### 핵심 특징
- **75개 이상의 LLM 지원**: Claude, GPT, Gemini, Grok 등 원하는 모델 선택 가능
- **무료 사용**: API 키만 있으면 무료로 사용 (Claude Pro/Max 구독으로도 사용 가능)
- **네이티브 터미널 UI**: 화면 깜빡임 없는 고성능 인터페이스
- **LSP 지원**: IDE 수준의 코드 분석 및 리팩토링

---

## 2. Oh-My-OpenCode: 진정한 게임 체인저

Oh-My-OpenCode는 OpenCode를 **"스테로이드 버전"**으로 업그레이드합니다.

### 핵심 기능

**1) 비동기 서브에이전트 (Async Subagents)**
- Claude Code처럼 백그라운드에서 여러 에이전트가 동시에 작업
- GPT가 디버깅하는 동안 Claude가 다른 접근법 시도
- Gemini가 프론트엔드 작성 중 Claude가 백엔드 처리

**2) 전문화된 에이전트 팀**
- **Sisyphus** (Opus 4.5): 메인 오케스트레이터
- **Oracle** (GPT 5.2): 아키텍처 설계, 디버깅
- **Librarian** (Sonnet 4.5): 문서 검색, 구현 예제 탐색
- **Frontend Engineer** (Gemini 3 Pro): UI/UX 전문

**3) LSP/AST 도구 통합**
- IDE 수준의 리팩토링, 심볼 검색, 참조 찾기
- ast-grep으로 25개 언어 지원

**4) Claude Code 호환 레이어**
- 기존 Claude Code 설정 그대로 사용 가능
- Hooks, Commands, Skills, MCP 모두 지원

---

## 3. 실제 사용자 평가

Reddit, GitHub, YouTube에서 수집한 실제 사용자 리뷰입니다.

> **"Claude Code가 3개월 걸리는 일을 7일에 한다면, Sisyphus는 1시간에 합니다."**
> — B, 퀀트 리서처

> **"Oh My Opencode로 8,000개 ESLint 경고를 하루 만에 해결했습니다."**
> — Jacob Ferrari (@jacobferrari_)

> **"Oh My Opencode is king of the hill and has no contenders."**
> — RyanOnThePath

> **"use oh-my-opencode, you will never go back"**
> — d0t3ch

---

## 4. Claude Code, Cursor AI와 비교

| 항목 | **OpenCode + OMO** | **Claude Code** | **Cursor AI** |
|------|-------------------|-----------------|---------------|
| **가격** | 무료 (API 사용량만) | Pro $20/월, Max $100~200/월 | Pro $20/월 |
| **모델 선택** | 75+ 모델 | Anthropic 전용 | Claude/GPT |
| **멀티 에이전트** | ✅ 병렬 실행 | ❌ 단일 | ❌ 단일 |
| **커스터마이징** | 극도로 높음 | 제한적 | 중간 |
| **LSP 통합** | ✅ 전체 | 일부 | ✅ 내장 |

### OpenCode + OMO의 결정적 장점
1. **비용 효율성**: 월 구독료 없이 API 사용량만 지불
2. **모델 유연성**: 작업에 맞는 최적의 모델 선택 가능
3. **병렬 처리**: 여러 에이전트가 동시에 작업하여 생산성 극대화
4. **완전한 제어**: 모든 설정을 원하는 대로 커스터마이징

---

## 5. 시작하기: 설치 가이드

\`\`\`bash
# OpenCode 설치
npm install -g opencode

# 프로젝트 디렉토리에서 실행
cd <project>
opencode
\`\`\`

설치 후 Claude Pro, ChatGPT Plus, Gemini 구독을 연동하면 즉시 사용 가능합니다.

### Oh-My-OpenCode 설치

\`\`\`bash
# Oh-My-OpenCode 클론
git clone https://github.com/code-yeongyu/oh-my-opencode.git ~/.oh-my-opencode

# 설정 복사
cp -r ~/.oh-my-opencode/.claude/* ~/.claude/
\`\`\`

### 매직 키워드: ultrawork
프롬프트에 **ultrawork** (또는 **uw**)만 포함하면 모든 기능이 자동으로 활성화됩니다. 병렬 에이전트, 백그라운드 태스크, 심층 탐색까지 에이전트가 알아서 처리합니다.

---

## 마치며

OpenCode와 Oh-My-OpenCode는 AI 코딩 환경의 새로운 표준을 제시합니다. 구독료 부담 없이 최고 수준의 멀티모델 오케스트레이션을 경험할 수 있습니다.

> **"당신의 에이전트가 이제 개발팀 리드입니다. 당신은 AI 매니저입니다."**
> — Oh-My-OpenCode 공식 문서

AI 도구 도입과 마케팅 자동화에 대해 더 궁금한 점이 있으신가요? AI 기술로 비즈니스 성장을 돕는 **폴라애드(POLARAD)**에 문의해 주세요.

---

**참고 링크**
- [OpenCode 공식](https://opencode.ai)
- [Oh-My-OpenCode GitHub](https://github.com/code-yeongyu/oh-my-opencode)
- [OpenCode Discord](https://opencode.ai/discord)`;

async function updateRecord() {
  if (!AIRTABLE_API_KEY) {
    console.error('❌ AIRTABLE_API_KEY 환경변수가 필요합니다.');
    process.exit(1);
  }

  const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}/${RECORD_ID}`;
  
  console.log('📝 Airtable 레코드 업데이트 중...');
  console.log(`   Record ID: ${RECORD_ID}`);
  
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          content: cleanContent
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Airtable API 오류: ${response.status} - ${error}`);
    }

    const result = await response.json();
    console.log('✅ 업데이트 완료!');
    console.log(`   제목: ${result.fields.title}`);
    console.log(`   Slug: ${result.fields.slug}`);
    console.log(`   Content 길이: ${result.fields.content?.length || 0}자`);
    
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    process.exit(1);
  }
}

updateRecord();
