import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentSession();
    if (!user || user.type !== "admin") {
      return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    // 검색 조건 설정
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: "insensitive" } },
        { contractNumber: { contains: search, mode: "insensitive" } },
        { ceoName: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status;
    }

    // 계약 목록 조회
    const contracts = await prisma.contract.findMany({
      where,
      include: {
        package: {
          select: {
            name: true,
            displayName: true,
          },
        },
        user: {
          select: {
            clientName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // 통계 조회
    const stats = await prisma.contract.groupBy({
      by: ["status"],
      _count: true,
    });

    const statsMap = stats.reduce((acc, item) => {
      acc[item.status.toLowerCase()] = item._count;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      contracts,
      stats: {
        total: contracts.length,
        pending: statsMap.pending || 0,
        submitted: statsMap.submitted || 0,
        approved: statsMap.approved || 0,
        active: statsMap.active || 0,
        rejected: statsMap.rejected || 0,
        expired: statsMap.expired || 0,
        cancelled: statsMap.cancelled || 0,
      },
    });
  } catch (error) {
    console.error("계약 목록 조회 오류:", error);
    return NextResponse.json(
      { error: "계약 목록을 불러올 수 없습니다" },
      { status: 500 }
    );
  }
}
