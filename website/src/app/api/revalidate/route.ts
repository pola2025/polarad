import { NextRequest, NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"

// 비밀 토큰으로 보호 (관리자만 호출 가능)
const REVALIDATE_TOKEN = process.env.REVALIDATE_TOKEN || "polarad-revalidate-2025"

export async function POST(request: NextRequest) {
  try {
    // 토큰 검증
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (token !== REVALIDATE_TOKEN) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { path, slug, type } = body

    // 마케팅 소식 관련 페이지 재검증
    if (type === "marketing-news") {
      // 목록 페이지 재검증
      revalidatePath("/marketing-news")

      // 카테고리 페이지 재검증
      const categories = [
        "meta-ads",
        "instagram-reels",
        "threads",
        "google-ads",
        "marketing-trends",
        "ai-trends",
        "ai-tips",
        "faq",
      ]
      for (const category of categories) {
        revalidatePath(`/marketing-news/category/${category}`)
      }

      // 특정 글 재검증
      if (slug) {
        revalidatePath(`/marketing-news/${slug}`)
      }

      // 홈페이지 (featured 글 표시용)
      revalidatePath("/")

      return NextResponse.json({
        success: true,
        revalidated: true,
        message: "Marketing news pages revalidated",
        timestamp: new Date().toISOString(),
      })
    }

    // 특정 경로 재검증
    if (path) {
      revalidatePath(path)
      return NextResponse.json({
        success: true,
        revalidated: true,
        path,
        timestamp: new Date().toISOString(),
      })
    }

    return NextResponse.json(
      { error: "Missing type or path parameter" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Revalidation error:", error)
    return NextResponse.json(
      { error: "Revalidation failed" },
      { status: 500 }
    )
  }
}

// GET 요청으로 상태 확인
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Revalidation API is ready",
  })
}
