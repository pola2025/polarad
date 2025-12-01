/**
 * Polarad 마케팅 패키지 - 클라이언트 API
 * GET: 클라이언트 목록 조회
 * POST: 새 클라이언트 등록
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AuthStatus } from "@prisma/client";

// GET: 클라이언트 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") as AuthStatus | null;
    const isActive = searchParams.get("isActive");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // 필터 조건 구성
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { clientName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { clientId: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.authStatus = status;
    }

    if (isActive !== null) {
      where.isActive = isActive === "true";
    }

    // 전체 개수 조회
    const total = await prisma.client.count({ where });

    // 클라이언트 목록 조회
    const clients = await prisma.client.findMany({
      where,
      select: {
        id: true,
        clientId: true,
        clientName: true,
        email: true,
        phone: true,
        metaAdAccountId: true,
        tokenExpiresAt: true,
        authStatus: true,
        planType: true,
        isActive: true,
        telegramEnabled: true,
        servicePeriodEnd: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    // 통계 정보
    const now = new Date();
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const stats = await prisma.client.groupBy({
      by: ["authStatus", "isActive", "telegramEnabled"],
      _count: true,
    });

    const tokenExpiringCount = await prisma.client.count({
      where: {
        isActive: true,
        tokenExpiresAt: {
          gte: now,
          lte: in7Days,
        },
      },
    });

    const summary = {
      total,
      active: stats
        .filter((s) => s.isActive)
        .reduce((acc, s) => acc + s._count, 0),
      tokenExpiring: tokenExpiringCount,
      authRequired: stats
        .filter((s) => s.authStatus === "AUTH_REQUIRED")
        .reduce((acc, s) => acc + s._count, 0),
      telegramEnabled: stats
        .filter((s) => s.telegramEnabled)
        .reduce((acc, s) => acc + s._count, 0),
    };

    return NextResponse.json({
      success: true,
      data: clients,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      stats: summary,
    });
  } catch (error) {
    console.error("[API] GET /api/clients error:", error);
    return NextResponse.json(
      { success: false, error: "클라이언트 목록 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}

// POST: 새 클라이언트 등록
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      clientId,
      clientName,
      email,
      phone,
      metaAdAccountId,
      metaAccessToken,
      metaRefreshToken,
      tokenExpiresAt,
      servicePeriodStart,
      servicePeriodEnd,
      telegramChatId,
      telegramEnabled,
      planType,
      memo,
    } = body;

    // 필수 필드 검증
    if (!clientId || !clientName || !email) {
      return NextResponse.json(
        { success: false, error: "clientId, clientName, email은 필수입니다." },
        { status: 400 }
      );
    }

    // 중복 체크
    const existing = await prisma.client.findFirst({
      where: {
        OR: [{ clientId }, { email }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "이미 등록된 clientId 또는 email입니다." },
        { status: 409 }
      );
    }

    // 클라이언트 생성
    const client = await prisma.client.create({
      data: {
        clientId,
        clientName,
        email,
        phone,
        metaAdAccountId,
        metaAccessToken,
        metaRefreshToken,
        tokenExpiresAt: tokenExpiresAt ? new Date(tokenExpiresAt) : null,
        servicePeriodStart: servicePeriodStart
          ? new Date(servicePeriodStart)
          : null,
        servicePeriodEnd: servicePeriodEnd ? new Date(servicePeriodEnd) : null,
        telegramChatId,
        telegramEnabled: telegramEnabled || false,
        planType: planType || "FREE",
        memo,
      },
    });

    return NextResponse.json(
      { success: true, data: client },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] POST /api/clients error:", error);
    return NextResponse.json(
      { success: false, error: "클라이언트 등록에 실패했습니다." },
      { status: 500 }
    );
  }
}
