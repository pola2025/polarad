/**
 * 마케팅 뉴스 MDX + Airtable 연동 스크립트
 * 사용법: node scripts/create-article.js "글 제목" "카테고리"
 * 카테고리: meta-ads, google-ads, marketing-trends, seo-content, ai-trends, faq
 */

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
require('dotenv').config({ path: '.env.local' });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;

const CATEGORIES = {
  'meta-ads': { label: 'Meta 광고', folder: 'meta-ads' },
  'google-ads': { label: 'Google 광고', folder: 'google-ads' },
  'marketing-trends': { label: '마케팅 트렌드', folder: 'marketing-trends' },
  'seo-content': { label: 'SEO & 콘텐츠', folder: 'seo-content' },
  'ai-trends': { label: 'AI 트렌드', folder: 'ai-trends' },
  'faq': { label: '궁금해요', folder: 'faq' }
};

function generateSlug(title) {
  return title.toLowerCase()
    .replace(/[가-힣]+/g, (m) => {
      const map = {
        '페이스북': 'facebook', '인스타그램': 'instagram', '구글': 'google',
        '광고': 'ads', '마케팅': 'marketing', '트렌드': 'trends',
        '전략': 'strategy', '가이드': 'guide', '방법': 'how-to',
        '최적화': 'optimization', '예산': 'budget', '성과': 'performance',
        '차단': 'blocked', '복구': 'recover', '오류': 'error', '안됨': 'not-working'
      };
      for (const [kr, en] of Object.entries(map)) if (m.includes(kr)) return en;
      return '';
    })
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50);
}

// Airtable에서 최근 2주 내 유사 주제 체크
async function checkDuplicateTopic(title, category) {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
    return { isDuplicate: false };
  }

  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const filterDate = twoWeeksAgo.toISOString().split('T')[0];

  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}?filterByFormula=AND(IS_AFTER({date},'${filterDate}'),{category}='${category}')`,
    {
      headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` }
    }
  );

  const result = await res.json();
  const recentTitles = result.records?.map(r => r.fields.title) || [];

  // AI로 유사도 체크
  if (recentTitles.length > 0) {
    const checkPrompt = `다음 새 글 제목이 기존 글들과 너무 비슷한지 판단해주세요.

새 글 제목: "${title}"

최근 2주 내 발행된 글 제목들:
${recentTitles.map((t, i) => `${i + 1}. ${t}`).join('\n')}

JSON으로만 응답: {"isDuplicate": true/false, "similarTo": "비슷한 기존 글 제목 또는 null", "reason": "이유"}`;

    const checkRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: checkPrompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 200 }
      })
    });

    const checkResult = await checkRes.json();
    const text = checkResult.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    try {
      return JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || '{}');
    } catch {
      return { isDuplicate: false };
    }
  }

  return { isDuplicate: false };
}

async function generateSEOKeywords(title, category) {
  const prompt = `SEO 키워드 연구 전문가로서 "${title}" 주제의 키워드를 분석하세요. 카테고리: ${category}.
JSON 형식으로만 응답: {"primary":"메인키워드","secondary":["보조키워드5개"],"lsi":["LSI키워드5개"],"questions":["FAQ질문3개"],"searchIntent":"정보형또는거래형","seoTitle":"SEO최적화제목60자이내","metaDescription":"메타설명155자이내"}`;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 1000 }
    })
  });
  const result = await res.json();
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  try {
    return JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || '{}');
  } catch {
    return {};
  }
}

async function generateContent(title, category, seoKeywords) {
  const categoryLabel = CATEGORIES[category]?.label || category;
  const kw = seoKeywords.primary
    ? `**SEO 키워드**: 메인: ${seoKeywords.primary}, 보조: ${seoKeywords.secondary?.join(', ') || ''}`
    : '';

  let prompt;

  if (category === 'faq') {
    // 궁금해요 카테고리: 트러블슈팅/FAQ 중심
    prompt = `구글 SEO 전문가이자 한국 디지털 마케팅 전문가로서 "${title}" 블로그 글을 작성하세요.

${kw}

**[중요] 실제 사용자 문제 해결 콘텐츠**:
- 사용자들이 네이버/구글에서 실제로 검색하는 구체적인 문제와 해결법
- 인터넷에 흔한 뻔한 내용 NO, 실무에서 겪는 트러블슈팅 위주
- "이거 왜 안돼요?" "어떻게 해요?" 에 대한 명확한 답변

**[필수] 이런 내용을 반드시 포함**:
- 계정 차단/정지 시 복구 방법
- 설정 안 될 때 우회 방법 (PC 안되면 모바일로, 비밀번호 재설정 등)
- 프로필 미설정 시 발생하는 문제와 해결
- 알고리즘에 영향 주는 숨겨진 요소
- 실수로 삭제했을 때 복구하는 법

**구조**:
[서론 - 독자가 겪는 실제 문제 공감, "혹시 이런 문제 겪고 계신가요?"]

## 1. 문제 상황 파악
### 이런 증상이 나타나나요?
### 왜 이런 문제가 생기는 걸까요?

## 2. 해결 방법 A: [가장 빠른 해결법]
### Step 1: [단계]
### Step 2: [단계]
### Step 3: [단계]

> 💡 **폴라애드 팁**: [현장에서 얻은 실무 노하우]

## 3. 해결 방법 B: [A가 안 될 때]
### 우회 방법 1
### 우회 방법 2

## 4. 이것도 확인해보세요
| 증상 | 원인 | 해결법 |
|------|------|--------|
| 증상1 | 원인 | 해결 |
| 증상2 | 원인 | 해결 |
| 증상3 | 원인 | 해결 |

## 5. 예방법: 다시 안 겪으려면
### ✅ 체크 1
### ✅ 체크 2
### ✅ 체크 3

---

## 자주 묻는 질문 (FAQ)

### Q1. [실제로 많이 묻는 구체적 질문]?
[해결 방법 포함 답변]

### Q2. [실제로 많이 묻는 구체적 질문]?
[해결 방법 포함 답변]

### Q3. [실제로 많이 묻는 구체적 질문]?
[해결 방법 포함 답변]

### Q4. [실제로 많이 묻는 구체적 질문]?
[해결 방법 포함 답변]

### Q5. [실제로 많이 묻는 구체적 질문]?
[해결 방법 포함 답변]

---

**[CTA]** 해결이 안 되시나요? 폴라애드 전문가에게 무료 상담 받아보세요!

**작성 규칙**:
- 분량: 2000-3000자
- 표: 1개 이상
- FAQ: 5개 이상
- 톤: 친근하고 공감하는 말투, 문제 해결 중심

카테고리: ${categoryLabel}
한국어로 작성하세요.`;

  } else {
    // 일반 카테고리: 전문 정보 제공
    prompt = `구글 SEO 전문가이자 한국 디지털 마케팅 전문가로서 "${title}" 블로그 글을 작성하세요.

${kw}

**SEO 요구사항**:
1) 키워드 밀도 1.5-2.5%
2) H2/H3 제목에 키워드 포함
3) 첫 100단어에 메인 키워드 포함
4) E-E-A-T 신호 (전문성, 경험, 권위, 신뢰)

**구조**:
[서론 - 키워드 포함, 독자 공감]

## 1. [키워드]란?
### 핵심 개념
### 왜 중요한가?

> 💡 **폴라애드 팁**: [실무 조언]

## 2. 실전 활용법
### Step 1: [단계]
### Step 2: [단계]
### Step 3: [단계]

## 3. 성공 사례 및 데이터
| 항목 | Before | After | 개선율 |
|------|--------|-------|--------|
| 지표1 | 값 | 값 | +00% |
| 지표2 | 값 | 값 | +00% |

## 4. 주의사항 및 팁
### ⚠️ 주의 1
### ⚠️ 주의 2
### 💡 꿀팁

## 5. 체크리스트
### ✅ 체크 1
- [ ] 세부 항목

### ✅ 체크 2
- [ ] 세부 항목

## 핵심 요약
1. **[키워드]** - 요약
2. **[키워드]** - 요약
3. **[키워드]** - 요약

---

## 자주 묻는 질문 (FAQ)

### Q1. [질문]?
[답변]

### Q2. [질문]?
[답변]

### Q3. [질문]?
[답변]

---

**[CTA]** 더 자세한 맞춤 전략이 필요하시다면 폴라애드 전문가와 무료 상담을 받아보세요!

**작성 규칙**:
- 분량: 2500-3500자
- 표: 2개 이상
- FAQ: 3개 이상
- 톤: 전문적이지만 친근하게

카테고리: ${categoryLabel}
한국어로 작성하세요.`;
  }

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
    })
  });
  return (await res.json()).candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function generateThumbnail(title, filename) {
  const prompt = `Create a photorealistic 1024x1024 stock photo for a Korean marketing blog article about: "${title}".

Requirements:
- Korean people (Asian features) in the image
- Korean office or cafe setting in Seoul/Korea
- Modern Korean business environment
- Natural lighting, high quality photography
- Professional but approachable atmosphere
- ABSOLUTELY NO TEXT, letters, numbers, watermarks, logos, or any written elements in the image
- No signs, banners, or any readable content
- Clean composition focusing only on people and environment`;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['image', 'text'] }
    })
  });

  const result = await res.json();
  const imageData = result.candidates?.[0]?.content?.parts?.find(p => p.inlineData?.mimeType?.startsWith('image/'));

  if (imageData?.inlineData?.data) {
    const webpFilename = filename.replace(/\.png$/, '.webp');
    const imagePath = path.join(process.cwd(), 'public', 'images', 'marketing-news', webpFilename);
    await fs.mkdir(path.dirname(imagePath), { recursive: true });
    const imageBuffer = Buffer.from(imageData.inlineData.data, 'base64');
    await sharp(imageBuffer).resize(1200, 630, { fit: 'cover' }).webp({ quality: 80 }).toFile(imagePath);
    const stats = await fs.stat(imagePath);
    console.log(`   📦 이미지: ${(stats.size / 1024).toFixed(1)}KB`);
    return `/images/marketing-news/${webpFilename}`;
  }
  return '/images/solution-website.webp';
}

async function uploadToAirtable(data) {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
    console.log('   ⚠️ Airtable 설정 없음');
    return null;
  }

  const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      records: [{
        fields: {
          date: data.publishedAt,
          title: data.title,
          category: data.category,
          content: data.content,
          tags: data.tags.join(', '),
          seoKeywords: JSON.stringify(data.seoKeywords),
          publishedAt: data.publishedAt,
          status: 'published',
          slug: data.slug,
          description: data.description,
          thumbnailUrl: data.thumbnailUrl
        }
      }]
    })
  });

  const result = await res.json();
  if (result.error) {
    console.log(`   ⚠️ Airtable: ${result.error.message}`);
    return null;
  }
  return result.records?.[0]?.id;
}

async function main() {
  const [,, title, category = 'marketing-trends'] = process.argv;

  if (!title) {
    console.log('사용법: node scripts/create-article.js "글 제목" "카테고리"');
    console.log('카테고리: meta-ads, google-ads, marketing-trends, seo-content, ai-trends, faq');
    process.exit(1);
  }

  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY가 설정되지 않았습니다.');
    process.exit(1);
  }

  console.log(`\n📝 "${title}" 글 생성 시작...\n`);

  // 0. 중복 주제 체크
  console.log('0/6 중복 주제 체크...');
  const duplicateCheck = await checkDuplicateTopic(title, category);
  if (duplicateCheck.isDuplicate) {
    console.log(`\n⚠️ 유사한 글이 최근 2주 내에 발행되었습니다!`);
    console.log(`   비슷한 글: ${duplicateCheck.similarTo}`);
    console.log(`   이유: ${duplicateCheck.reason}`);
    console.log(`\n다른 주제로 시도해주세요.`);
    process.exit(1);
  }
  console.log('   ✅ 중복 없음');

  const slug = generateSlug(title);
  const today = new Date().toISOString().split('T')[0];
  const imageFilename = `${slug}.png`;

  console.log('1/6 SEO 키워드 연구...');
  const seoKeywords = await generateSEOKeywords(title, category);
  console.log(`   🎯 메인: ${seoKeywords.primary || 'N/A'}`);

  console.log('2/6 SEO 콘텐츠 생성...');
  const content = await generateContent(title, category, seoKeywords);

  console.log('3/6 메타 데이터...');
  const description = seoKeywords.metaDescription || `${title}에 대해 알아봅니다.`;
  const seoTitle = seoKeywords.seoTitle || title;

  console.log('4/6 태그 생성...');
  const tags = [
    seoKeywords.primary,
    ...(seoKeywords.secondary || []).slice(0, 3)
  ].filter(Boolean).slice(0, 7);

  console.log('5/6 썸네일 생성...');
  const thumbnailPath = await generateThumbnail(title, imageFilename);

  const allKeywords = [
    seoKeywords.primary,
    ...(seoKeywords.secondary || []),
    ...(seoKeywords.lsi || [])
  ].filter(Boolean).slice(0, 15);

  const mdxContent = `---
title: "${seoTitle}"
description: "${description}"
category: "${category}"
tags: ${JSON.stringify(tags)}
author: "폴라애드"
publishedAt: "${today}"
updatedAt: "${today}"
thumbnail: "${thumbnailPath}"
featured: false
status: "published"
seo:
  keywords: ${JSON.stringify(allKeywords)}
  ogImage: "${thumbnailPath}"
  primaryKeyword: "${seoKeywords.primary || ''}"
  searchIntent: "${seoKeywords.searchIntent || '정보형'}"
  faqQuestions: ${JSON.stringify(seoKeywords.questions || [])}
---

${content}
`;

  const categoryFolder = CATEGORIES[category]?.folder || category;
  const mdxPath = path.join(process.cwd(), 'content', 'marketing-news', categoryFolder, `${slug}.mdx`);

  await fs.mkdir(path.dirname(mdxPath), { recursive: true });
  await fs.writeFile(mdxPath, mdxContent, 'utf-8');

  console.log('6/6 Airtable 업로드...');
  const airtableId = await uploadToAirtable({
    title: seoTitle,
    category,
    content,
    tags,
    seoKeywords: allKeywords,
    publishedAt: today,
    slug,
    description,
    thumbnailUrl: `https://polarad.co.kr${thumbnailPath}`
  });

  console.log(`\n✅ 완료!`);
  console.log(`📄 MDX: ${mdxPath}`);
  console.log(`🖼️  이미지: ${thumbnailPath}`);
  console.log(`🔗 URL: /marketing-news/${slug}`);
  console.log(`🎯 SEO: ${seoKeywords.primary || 'N/A'}`);
  if (airtableId) console.log(`📊 Airtable: ${airtableId}`);
}

main().catch(console.error);
