import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateContractPDF } from "@/lib/pdf/generate-contract-pdf";
import { sendContractEmail } from "@/lib/email/send-email";
import { sendTelegramMessage, formatContractApprovedMessage } from "@/lib/telegram/bot";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentSession();
    if (!user || user.type !== "admin") {
      return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
    }

    const { id } = await params;

    // 계약 조회 (사용자 정보 포함)
    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        package: true,
        user: {
          select: {
            telegramChatId: true,
            telegramEnabled: true,
          },
        },
      },
    });

    if (!contract) {
      return NextResponse.json({ error: "계약을 찾을 수 없습니다" }, { status: 404 });
    }

    if (contract.status !== "SUBMITTED") {
      return NextResponse.json(
        { error: "승인 대기 상태의 계약만 승인할 수 있습니다" },
        { status: 400 }
      );
    }

    // 계약 시작일/종료일 설정
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + contract.contractPeriod);

    // 계약 승인 처리
    await prisma.contract.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
        approvedBy: user.userId,
        startDate,
        endDate,
      },
    });

    // 로그 생성
    await prisma.contractLog.create({
      data: {
        contractId: id,
        fromStatus: "SUBMITTED",
        toStatus: "APPROVED",
        changedBy: user.userId,
        note: "관리자 승인",
      },
    });

    // PDF 생성 및 이메일 발송
    try {
      const pdfBuffer = await generateContractPDF({
        contractNumber: contract.contractNumber,
        companyName: contract.companyName,
        ceoName: contract.ceoName,
        businessNumber: contract.businessNumber,
        address: contract.address,
        contactName: contract.contactName,
        contactPhone: contract.contactPhone,
        contactEmail: contract.contactEmail,
        packageName: contract.package.name,
        packageDisplayName: contract.package.displayName,
        monthlyFee: contract.monthlyFee,
        contractPeriod: contract.contractPeriod,
        totalAmount: contract.totalAmount,
        startDate,
        endDate,
        signedAt: contract.signedAt || new Date(),
        clientSignature: contract.clientSignature || undefined,
      });

      await sendContractEmail(
        contract.contactEmail,
        contract.contractNumber,
        contract.companyName,
        pdfBuffer
      );

      // 이메일 발송 기록
      await prisma.contract.update({
        where: { id },
        data: { emailSentAt: new Date() },
      });
    } catch (emailError) {
      console.error("이메일 발송 오류:", emailError);
      // 이메일 실패해도 승인은 성공으로 처리
    }

    // 텔레그램 알림 발송
    if (contract.user.telegramEnabled && contract.user.telegramChatId) {
      try {
        const telegramMessage = formatContractApprovedMessage(
          contract.companyName,
          contract.contractNumber,
          contract.package.displayName,
          startDate,
          endDate
        );
        await sendTelegramMessage(contract.user.telegramChatId, telegramMessage);
      } catch (telegramError) {
        console.error("텔레그램 알림 발송 오류:", telegramError);
        // 텔레그램 실패해도 승인은 성공으로 처리
      }
    }

    return NextResponse.json({
      success: true,
      message: "계약이 승인되었습니다",
    });
  } catch (error) {
    console.error("계약 승인 오류:", error);
    return NextResponse.json(
      { error: "계약 승인 처리 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
