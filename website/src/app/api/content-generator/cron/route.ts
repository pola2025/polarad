/**
 * Content Generator Cron Job
 * 매일 오전 9시 (KST) = 0시 (UTC) 자동 실행
 * 23개 키워드 순환 생성
 */

import { NextResponse } from "next/server"
import { getKeywordByIndex, TOTAL_KEYWORDS } from "@/lib/sns-cs-keywords"

// Airtable 설정
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || "appbqw2GAixv7vSBV"
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

    // 2. 콘텐츠 생성 API 호출 (save=true로 Airtable 저장)
    const baseUrl = new URL(request.url).origin
    const contentResponse = await fetch(
      `${baseUrl}/api/content-generator?keyword=${encodeURIComponent(keyword)}&save=true`
    )

    const contentResult = await contentResponse.json()

    if (!contentResult.success) {
      throw new Error(contentResult.error || "Content generation failed")
    }

    // 3. 인덱스 업데이트
    await saveCurrentIndex(nextIndex, recordId)

    // 4. 텔레그램 알림
    await sendTelegramNotification("success", {
      keyword,
      title: contentResult.content?.title,
      nextIndex,
    })

    console.log(`[Cron] Completed! Next index: ${nextIndex}`)

    return NextResponse.json({
      success: true,
      keyword,
      title: contentResult.content?.title,
      currentIndex,
      nextIndex,
      totalKeywords: TOTAL_KEYWORDS,
      airtableRecordId: contentResult.airtableRecordId,
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
