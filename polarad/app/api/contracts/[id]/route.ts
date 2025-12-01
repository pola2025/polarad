import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 사용자 계약 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentSession();
    if (!user) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const { id } = await params;

    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        package: true,
        logs: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!contract) {
      return NextResponse.json({ error: "계약을 찾을 수 없습니다" }, { status: 404 });
    }

    // 본인의 계약인지 확인 (관리자가 아닌 경우)
    if (user.type !== "admin" && contract.userId !== user.userId) {
      return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
    }

    return NextResponse.json({ contract });
  } catch (error) {
    console.error("계약 상세 조회 오류:", error);
    return NextResponse.json(
      { error: "계약 조회 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
