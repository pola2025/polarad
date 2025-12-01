import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email/send-email";
import { sendTelegramMessage, formatContractRejectedMessage } from "@/lib/telegram/bot";

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
    const body = await request.json();
    const { reason } = body;

    // 계약 조회 (사용자 정보 포함)
    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
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
        { error: "승인 대기 상태의 계약만 거절할 수 있습니다" },
        { status: 400 }
      );
    }

    // 계약 거절 처리
    await prisma.contract.update({
      where: { id },
      data: {
        status: "REJECTED",
        rejectedAt: new Date(),
        rejectedBy: user.userId,
        rejectReason: reason || "사유 미기재",
      },
    });

    // 로그 생성
    await prisma.contractLog.create({
      data: {
        contractId: id,
        fromStatus: "SUBMITTED",
        toStatus: "REJECTED",
        changedBy: user.userId,
        note: reason || "관리자 거절",
      },
    });

    // 거절 알림 이메일 발송
    try {
      await sendEmail({
        to: contract.contactEmail,
        subject: `[폴라애드] ${contract.companyName} 계약 요청 결과 안내`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #ef4444; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
              .footer { background: #374151; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
              .reason { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>계약 요청 결과 안내</h1>
              </div>
              <div class="content">
                <p>안녕하세요, <strong>${contract.companyName}</strong> 담당자님.</p>

                <p>죄송합니다. 요청하신 계약이 승인되지 않았습니다.</p>

                <div class="reason">
                  <strong>사유:</strong><br>
                  ${reason || "사유가 기재되지 않았습니다."}
                </div>

                <p>추가 문의사항이 있으시면 연락 주세요.</p>

                <p style="margin-top: 30px;">
                  감사합니다.<br>
                  <strong>폴라애드 팀</strong>
                </p>
              </div>
              <div class="footer">
                <p>주식회사 폴라애드</p>
                <p>대표전화: 02-1234-5678 | 이메일: contact@polarad.co.kr</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
    } catch (emailError) {
      console.error("거절 알림 이메일 발송 오류:", emailError);
    }

    // 텔레그램 알림 발송
    if (contract.user.telegramEnabled && contract.user.telegramChatId) {
      try {
        const telegramMessage = formatContractRejectedMessage(
          contract.companyName,
          contract.contractNumber,
          reason
        );
        await sendTelegramMessage(contract.user.telegramChatId, telegramMessage);
      } catch (telegramError) {
        console.error("텔레그램 알림 발송 오류:", telegramError);
        // 텔레그램 실패해도 거절 처리는 성공으로 처리
      }
    }

    return NextResponse.json({
      success: true,
      message: "계약이 거절되었습니다",
    });
  } catch (error) {
    console.error("계약 거절 오류:", error);
    return NextResponse.json(
      { error: "계약 거절 처리 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
