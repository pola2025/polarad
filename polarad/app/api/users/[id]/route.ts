import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: 사용자 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        submission: true,
        workflows: {
          orderBy: { createdAt: "desc" },
        },
        userNotifications: {
          orderBy: { sentAt: "desc" },
          take: 10,
        },
        client: {
          select: {
            id: true,
            clientId: true,
            metaAdAccountId: true,
            authStatus: true,
            tokenExpiresAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "사용자 조회 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

// PATCH: 사용자 정보 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      clientName,
      name,
      email,
      phone,
      isActive,
      smsConsent,
      emailConsent,
      telegramEnabled,
      telegramChatId,
    } = body;

    // 사용자 존재 확인
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 이메일 중복 체크 (변경 시)
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });
      if (emailExists) {
        return NextResponse.json(
          { error: "이미 사용 중인 이메일입니다" },
          { status: 400 }
        );
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(clientName !== undefined && { clientName }),
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone: phone.replace(/-/g, "") }),
        ...(isActive !== undefined && { isActive }),
        ...(smsConsent !== undefined && { smsConsent }),
        ...(emailConsent !== undefined && { emailConsent }),
        ...(telegramEnabled !== undefined && { telegramEnabled }),
        ...(telegramChatId !== undefined && { telegramChatId }),
      },
    });

    return NextResponse.json({
      success: true,
      data: user,
      message: "사용자 정보가 수정되었습니다",
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "사용자 수정 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

// DELETE: 사용자 삭제 (비활성화)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 사용자 존재 확인
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 완전 삭제 대신 비활성화
    await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: "사용자가 비활성화되었습니다",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "사용자 삭제 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
