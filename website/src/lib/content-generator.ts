import { GoogleGenerativeAI } from "@google/generative-ai"
import { mkdir } from "fs/promises"
import path from "path"
import sharp from "sharp"

// Gemini 설정
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// 콘텐츠 생성 결과 타입
export interface GeneratedContent {
  title: string
  description: string
  content: string
  seoKeywords: string
  tags: string
  slug: string
  thumbnailUrl: string
  category: string
  sourceKeyword: string
  officialLinks?: string[]
}

// 참고 글 정보 타입
export interface SourceArticle {
  title: string
  url: string
  snippet: string
  content?: string
}

/**
 * Gemini를 사용하여 콘텐츠 리라이팅
 */
export async function rewriteContent(
  keyword: string,
  sourceArticles: SourceArticle[]
): Promise<Omit<GeneratedContent, "thumbnailUrl">> {
  const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" })

  const sourceSummary = sourceArticles
    .map((a, i) => `[참고 ${i + 1}] ${a.title}\nURL: ${a.url}\n${a.snippet}`)
    .join("\n\n")

  const prompt = `당신은 SNS 마케팅 및 광고 계정 문제 해결 전문가입니다.
폴라애드(POLARAD)는 메타 공식 파트너 광고대행사입니다.

## 타겟 독자
- 1인 사업자, 소규모 대표
- 인하우스 마케터
- SNS 광고를 직접 운영하는 분들

## 키워드
${keyword}

## 참고 자료
${sourceSummary}

## 작성 규칙 (필수)
1. **100% 리라이팅**: 참고 자료를 절대 그대로 복사하지 않고 완전히 새롭게 작성
2. **구조**: 문제 상황 → 원인 분석 → 단계별 해결책 → 예방 팁
3. **공식 링크 필수**: 메타 공식 도움말 링크를 본문에 포함 (예: https://www.facebook.com/help/, https://help.instagram.com/)
4. **출처 명시**: 참고한 자료의 출처를 글 하단에 표기
5. **SEO 최적화**: 핵심 키워드를 제목, 소제목, 본문에 자연스럽게 배치
6. **연도**: 2026년 기준으로 작성 (최신 정보임을 강조)
7. **분량**: 1500-2000자
8. **톤앤매너**: 전문적이면서도 친근하게, 실제 도움이 되는 구체적인 정보 제공
9. **마크다운**: 제목(##), 리스트(-), 강조(**) 등 마크다운 문법 적극 활용
10. **CTA**: 글 마지막에 폴라애드 문의 유도 (자연스럽게)

## 출력 형식 (JSON만 출력)
{
  "title": "SEO 최적화된 제목 (50자 이내, 키워드 포함)",
  "description": "메타 설명 (150자 이내, 클릭 유도 문구)",
  "content": "마크다운 형식의 본문 내용 (1500-2000자)",
  "seoKeywords": "쉼표로 구분된 SEO 키워드 5개",
  "tags": "쉼표로 구분된 태그 3-5개",
  "slug": "url-friendly-slug-in-english",
  "officialLinks": ["본문에 포함된 메타 공식 도움말 링크들"]
}

JSON만 출력하세요. 다른 설명은 불필요합니다.`

  const result = await model.generateContent(prompt)
  const response = result.response.text()

  // JSON 파싱
  const jsonMatch = response.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error("Failed to parse Gemini response as JSON")
  }

  const parsed = JSON.parse(jsonMatch[0])

  return {
    ...parsed,
    category: "faq", // Airtable 카테고리와 일치
    sourceKeyword: keyword,
  }
}

/**
 * Gemini를 사용하여 썸네일 이미지 생성
 */
export async function generateThumbnail(
  title: string,
  keyword: string
): Promise<string> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY

  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not configured")
  }

  // 플랫폼 감지
  const platformInfo: Record<string, { name: string; style: string }> = {
    인스타그램: { name: "Instagram", style: "pink and purple gradient, Instagram logo style" },
    인스타: { name: "Instagram", style: "pink and purple gradient, Instagram logo style" },
    메타: { name: "Meta", style: "blue gradient, Meta logo style, modern tech" },
    페이스북: { name: "Facebook", style: "blue color scheme, Facebook branding" },
    쓰레드: { name: "Threads", style: "black and white minimalist, Threads app style" },
    구글: { name: "Google", style: "colorful Google colors, professional" },
  }

  let platform = { name: "SNS", style: "modern gradient, professional marketing" }
  for (const [key, info] of Object.entries(platformInfo)) {
    if (keyword.includes(key)) {
      platform = info
      break
    }
  }

  // 제목에서 핵심 키워드 추출 (짧게)
  const shortTitle = title.length > 30 ? title.substring(0, 30) + "..." : title

  // Gemini Imagen 프롬프트
  const imagePrompt = `Create a professional blog thumbnail image for a marketing article.
Style: ${platform.style}
Theme: ${platform.name} account problem solving guide
Text overlay concept: "${shortTitle}"
Requirements:
- 16:9 aspect ratio (1200x630)
- Clean, modern design
- Professional marketing agency style
- Include subtle ${platform.name} brand elements
- Minimalist with strong visual impact
- No actual text, just visual design elements
- Gradient background with white card overlay effect`

  // Gemini 3 Pro Image (Nano Banana Pro) - 2025년 최신
  const model = genAI.getGenerativeModel({ model: "gemini-3-pro-image-preview" })

  const result = await model.generateContent({
    contents: [{
      role: "user",
      parts: [{
        text: `Generate a professional blog thumbnail image.
${imagePrompt}

Create a visually appealing marketing thumbnail with modern design.`
      }]
    }],
    generationConfig: {
      responseModalities: ["image", "text"],
    } as unknown as import("@google/generative-ai").GenerationConfig,
  })

  const response = result.response
  const imagePart = response.candidates?.[0]?.content?.parts?.find(
    (part: { inlineData?: { mimeType: string } }) => part.inlineData?.mimeType?.startsWith("image/")
  )

  if (!imagePart?.inlineData?.data) {
    throw new Error("No image generated from Gemini")
  }

  // Base64 이미지 데이터
  const imageBuffer = Buffer.from(imagePart.inlineData.data, "base64")

  // WebP로 변환 및 압축
  const fileName = `sns-cs-${Date.now()}.webp`
  const outputDir = path.join(process.cwd(), "public", "images", "marketing-news")
  const filePath = path.join(outputDir, fileName)

  // 디렉토리 생성
  await mkdir(outputDir, { recursive: true })

  // Sharp로 WebP 변환 (1200x630, 품질 85%)
  await sharp(imageBuffer)
    .resize(1200, 630, { fit: "cover" })
    .webp({ quality: 85 })
    .toFile(filePath)

  console.log(`[Thumbnail] Generated: ${filePath}`)

  // 상대 URL 반환
  return `/images/marketing-news/${fileName}`
}

/**
 * 전체 콘텐츠 생성 파이프라인
 */
export async function generateFullContent(
  keyword: string,
  sourceArticles: SourceArticle[]
): Promise<GeneratedContent> {
  // 1. 콘텐츠 리라이팅
  const content = await rewriteContent(keyword, sourceArticles)

  // 2. 썸네일 생성
  const thumbnailUrl = await generateThumbnail(content.title, keyword)

  return {
    ...content,
    thumbnailUrl,
  }
}
