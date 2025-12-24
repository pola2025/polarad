/**
 * Content Generator Cron Job
 * 매일 오전 9시 (KST) = 0시 (UTC) 자동 실행
 * 23개 키워드 순환 생성
 */

import { NextResponse } from "next/server"
import { getKeywordByIndex, TOTAL_KEYWORDS } from "@/lib/sns-cs-keywords"
import { rewriteContent, generateThumbnail } from "@/lib/content-generator"
import type { SourceArticle } from "@/lib/content-generator"

// Airtable 설정
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || "appbqw2GAixv7vSBV"
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || "뉴스레터"
const AIRTABLE_SETTINGS_TABLE = "Settings"
const CRON_SECRET = process.env.CRON_SECRET

// 텔레그램 알림 설정
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = "-1003280236380"

/**
 * Airtable에서 현재 인덱스 가져오기
 */
async function getCurrentIndex(): Promise<{ index: number; recordId?: string }> {
  if (!AIRTABLE_API_KEY) return { index: 0 }

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_SETTINGS_TABLE)}?filterByFormula={key}='content_generator_index'`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
      }
    )

    if (!response.ok) return { index: 0 }

    const data = await response.json()
    if (data.records && data.records.length > 0) {
      return {
        index: parseInt(data.records[0].fields.value, 10) || 0,
        recordId: data.records[0].id,
      }
    }
    return { index: 0 }
  } catch {
    return { index: 0 }
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
    console.error("[Cron] Failed to save index:", error)
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
      snippet: `메타 공식 파트너로서 수많은 ${keyword} 케이스를 해결한 경험을 바탕으로, 가장 효과적인 해결 방법을 안내합니다. 복잡한 케이스는 전문가 상담을 권장드립니다.`,
    },
  ]
}

/**
 * Airtable에 콘텐츠 저장
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
 * 텔레그램 알림 전송
 */
async function sendTelegramNotification(
  type: "success" | "error",
  data: {
    keyword?: string
    title?: string
    error?: string
    nextIndex?: number
  }
): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN) return

  let message: string
  if (type === "success") {
    message = `✅ *SNS CS 콘텐츠 자동 생성 완료*

📌 *키워드:* ${data.keyword}
📝 *제목:* ${data.title}
🔄 *다음 인덱스:* ${data.nextIndex}/${TOTAL_KEYWORDS}

🔗 23일 사이클 순환 중`
  } else {
    message = `❌ *SNS CS 콘텐츠 생성 실패*

⚠️ *오류:* ${data.error}

🔧 로그를 확인해주세요.`
  }

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }),
    })
  } catch (error) {
    console.error("[Cron] Telegram notification failed:", error)
  }
}

/**
 * Cron 엔드포인트
 * GET /api/content-generator/cron
 */
export async function GET(request: Request) {
  // Vercel Cron 인증 확인
  const authHeader = request.headers.get("authorization")
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    console.log("[Cron] Starting SNS CS content generation...")

    // 1. 현재 인덱스 가져오기
    const { index: currentIndex, recordId } = await getCurrentIndex()
    const keyword = getKeywordByIndex(currentIndex)
    const nextIndex = (currentIndex + 1) % TOTAL_KEYWORDS

    console.log(`[Cron] Current index: ${currentIndex}, Keyword: ${keyword}`)

    // 2. 참고 자료 생성
    const sourceArticles = generateSourceArticles(keyword)
    console.log(`[Cron] Generated ${sourceArticles.length} source articles`)

    // 3. 콘텐츠 리라이팅 (직접 함수 호출)
    const rewrittenContent = await rewriteContent(keyword, sourceArticles)
    console.log(`[Cron] Content generated: ${rewrittenContent.title}`)

    // 4. 썸네일 생성
    let thumbnailUrl = ""
    try {
      thumbnailUrl = await generateThumbnail(rewrittenContent.title, keyword)
      console.log(`[Cron] Thumbnail generated: ${thumbnailUrl}`)
    } catch (thumbError) {
      console.error(`[Cron] Thumbnail generation failed:`, thumbError)
    }

    const content = {
      ...rewrittenContent,
      thumbnailUrl,
    }

    // 5. Airtable 저장
    const airtableRecordId = await saveToAirtable(content)
    console.log(`[Cron] Saved to Airtable: ${airtableRecordId}`)

    // 6. 인덱스 업데이트
    await saveCurrentIndex(nextIndex, recordId)

    // 7. 텔레그램 알림
    await sendTelegramNotification("success", {
      keyword,
      title: content.title,
      nextIndex,
    })

    console.log(`[Cron] Completed! Next index: ${nextIndex}`)

    return NextResponse.json({
      success: true,
      keyword,
      title: content.title,
      currentIndex,
      nextIndex,
      totalKeywords: TOTAL_KEYWORDS,
      airtableRecordId,
    })
  } catch (error) {
    console.error("[Cron] Error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    // 텔레그램 알림 (실패)
    await sendTelegramNotification("error", { error: errorMessage })

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}
