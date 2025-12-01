import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET: 현재 사용자의 자료 제출 정보 조회
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다" },
        { status: 401 }
      );
    }

    // 기존 submission 조회 또는 빈 객체 반환
    const submission = await prisma.submission.findUnique({
      where: { userId: user.userId },
    });

    return NextResponse.json({
      success: true,
      submission: submission || null,
    });
  } catch (error) {
    console.error("Get submission error:", error);
    return NextResponse.json(
      { error: "자료 조회 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

// PUT: 자료 제출 저장/수정
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      businessLicense,
      profilePhoto,
      brandName,
      contactEmail,
      contactPhone,
      bankAccount,
      deliveryAddress,
      websiteStyle,
      websiteColor,
      blogDesignNote,
      additionalNote,
    } = body;

    // 필수 필드 모두 채워졌는지 확인
    const isComplete = !!(
      businessLicense &&
      profilePhoto &&
      brandName &&
      contactEmail &&
      contactPhone &&
      bankAccount
    );

    // upsert: 없으면 생성, 있으면 업데이트
    const submission = await prisma.submission.upsert({
      where: { userId: user.userId },
      create: {
        userId: user.userId,
        businessLicense,
        profilePhoto,
        brandName,
        contactEmail,
        contactPhone,
        bankAccount,
        deliveryAddress,
        websiteStyle,
        websiteColor,
        blogDesignNote,
        additionalNote,
        isComplete,
        status: isComplete ? "SUBMITTED" : "DRAFT",
        completedAt: isComplete ? new Date() : null,
      },
      update: {
        businessLicense,
        profilePhoto,
        brandName,
        contactEmail,
        contactPhone,
        bankAccount,
        deliveryAddress,
        websiteStyle,
        websiteColor,
        blogDesignNote,
        additionalNote,
        isComplete,
        status: isComplete ? "SUBMITTED" : "DRAFT",
        completedAt: isComplete ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      submission,
      message: isComplete ? "자료가 제출되었습니다" : "임시 저장되었습니다",
    });
  } catch (error) {
    console.error("Save submission error:", error);
    return NextResponse.json(
      { error: "자료 저장 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
