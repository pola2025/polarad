import { NextResponse } from "next/server"
import type { SourceArticle } from "@/lib/content-generator"
import { getRandomKeyword, getKeywordByIndex, TOTAL_KEYWORDS } from "@/lib/sns-cs-keywords"

// Airtable 설정
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || "appbqw2GAixv7vSBV"
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || "뉴스레터"
const AIRTABLE_SETTINGS_TABLE = "Settings"

/**
 * Airtable에서 현재 인덱스 가져오기
 */
async function getCurrentIndex(): Promise<number> {
  if (!AIRTABLE_API_KEY) return 0

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_SETTINGS_TABLE)}?filterByFormula={key}='content_generator_index'`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
      }
    )

    if (!response.ok) return 0

    const data = await response.json()
    if (data.records && data.records.length > 0) {
      return parseInt(data.records[0].fields.value, 10) || 0
    }
    return 0
  } catch {
    return 0
  }
}

/**
 * Airtable에 인덱스 저장하기
 */
async function saveCurrentIndex(index: number, recordId?: string): Promise<void> {
  if (!AIRTABLE_API_KEY) return

  try {
    if (recordId) {
      // 기존 레코드 업데이트
      await fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_SETTINGS_TABLE)}/${recordId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fields: { value: String(index) },
          }),
        }
      )
    } else {
      // 새 레코드 생성
      await fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_SETTINGS_TABLE)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            records: [
              {
                fields: {
                  key: "content_generator_index",
                  value: String(index),
                },
              },
            ],
          }),
        }
      )
    }
  } catch (error) {
    console.error("[Content Generator] Failed to save index:", error)
  }
}

/**
 * 참고 자료 생성 (키워드별 맞춤)
 */
function generateSourceArticles(keyword: string): SourceArticle[] {
  // 메타 공식 도움말 URL 매핑
  const officialUrls: Record<string, string> = {
    "계정 정지": "https://www.facebook.com/help/103873106370583",
    "비활성화": "https://www.facebook.com/help/103873106370583",
    "광고 계정": "https://www.facebook.com/business/help/2032679396983564",
    "비즈니스 관리자": "https://www.facebook.com/business/help/1710077379203657",
    "광고관리자": "https://www.facebook.com/business/help/1710077379203657",
    "정책 위반": "https://www.facebook.com/policies/ads/",
    "커뮤니티 보호": "https://help.instagram.com/366993040048856",
    "고객센터": "https://www.facebook.com/help/contact/260749603972907",
    "이의 신청": "https://www.facebook.com/help/2090856331203011",
  }

  // 키워드에 맞는 공식 URL 찾기
  let matchedUrl = "https://www.facebook.com/help"
  for (const [key, url] of Object.entries(officialUrls)) {
    if (keyword.includes(key)) {
      matchedUrl = url
      break
    }
  }

  return [
    {
      title: `[메타 공식] ${keyword} 가이드`,
      url: matchedUrl,
      snippet: `${keyword}에 대한 메타 공식 가이드입니다. 문제 발생 시 공식 채널을 통한 해결이 가장 효과적입니다. 이의 제기 양식 제출 후 24-48시간 내 검토가 진행됩니다.`,
    },
    {
      title: `2026 ${keyword} 최신 해결 가이드`,
      url: "https://business.facebook.com/",
      snippet: `최근 메타 정책 변경으로 ${keyword} 관련 케이스가 증가하고 있습니다. 비즈니스 관리자를 통한 체계적인 관리와 정책 준수가 예방의 핵심입니다. 문제 발생 시 당황하지 말고 단계별로 대응하세요.`,
    },
    {
      title: `폴라애드 전문가의 ${keyword} 해결 노하우`,
      url: "https://www.polarad.co.kr/",
      snippet: `Meta 광고 전문 폴라애드는 수많은 ${keyword} 케이스를 해결한 경험을 바탕으로, 가장 효과적인 해결 방법을 안내합니다. 복잡한 케이스는 전문가 상담을 권장드립니다.`,
    },
  ]
}

/**
 * Airtable에 저장
 */
async function saveToAirtable(content: {
  title: string
  description: string
  content: string
  category: string
  tags: string
  seoKeywords: string
  slug: string
  thumbnailUrl: string
  officialLinks?: string[]
}): Promise<string> {
  if (!AIRTABLE_API_KEY) {
    throw new Error("AIRTABLE_API_KEY not configured")
  }

  const response = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              date: new Date().toISOString().split("T")[0],
              title: content.title,
              description: content.description,
              category: content.category,
              content: content.content,
              tags: content.tags,
              seoKeywords: content.seoKeywords,
              status: "draft",
              slug: content.slug,
              thumbnailUrl: content.thumbnailUrl,
              views: 0,
            },
          },
        ],
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Airtable error: ${error}`)
  }

  const data = await response.json()
  return data.records[0].id
}

/**
 * 콘텐츠 생성 API
 * GET /api/content-generator?keyword=xxx&save=true&index=0
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const keywordParam = searchParams.get("keyword")
    const indexParam = searchParams.get("index")
    const shouldSave = searchParams.get("save") === "true"

    // 키워드 결정: 파라미터 > 인덱스 > 랜덤
    let keyword: string
    if (keywordParam) {
      keyword = keywordParam
    } else if (indexParam !== null) {
      keyword = getKeywordByIndex(parseInt(indexParam, 10))
    } else {
      keyword = getRandomKeyword()
    }

    console.log(`[Content Generator] Starting with keyword: ${keyword}`)

    // 1. 참고 자료 생성
    const sourceArticles = generateSourceArticles(keyword)
    console.log(`[Content Generator] Generated ${sourceArticles.length} source articles`)

    // 2. 콘텐츠 리라이팅
    const { rewriteContent, generateThumbnail } = await import("@/lib/content-generator")
    const rewrittenContent = await rewriteContent(keyword, sourceArticles)
    console.log(`[Content Generator] Content generated: ${rewrittenContent.title}`)

    // 3. 썸네일 생성
    let thumbnailUrl = ""
    try {
      thumbnailUrl = await generateThumbnail(rewrittenContent.title, keyword)
      console.log(`[Content Generator] Thumbnail generated: ${thumbnailUrl}`)
    } catch (error) {
      console.error(`[Content Generator] Thumbnail generation failed:`, error)
    }

    const content = {
      ...rewrittenContent,
      thumbnailUrl,
    }

    // 4. Airtable 저장 (옵션)
    let airtableRecordId = null
    if (shouldSave) {
      airtableRecordId = await saveToAirtable(content)
      console.log(`[Content Generator] Saved to Airtable: ${airtableRecordId}`)
    }

    return NextResponse.json({
      success: true,
      keyword,
      totalKeywords: TOTAL_KEYWORDS,
      content: {
        title: content.title,
        description: content.description,
        category: content.category,
        seoKeywords: content.seoKeywords,
        tags: content.tags,
        slug: content.slug,
        thumbnailUrl: content.thumbnailUrl,
        officialLinks: content.officialLinks,
        contentPreview: content.content.substring(0, 500) + "...",
        fullContentLength: content.content.length,
      },
      airtableRecordId,
      savedToAirtable: shouldSave,
    })
  } catch (error) {
    console.error("[Content Generator] Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

