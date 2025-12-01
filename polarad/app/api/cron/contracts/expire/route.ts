import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/telegram/bot";

// Cron Job 인증 토큰 (환경변수로 설정)
const CRON_SECRET = process.env.CRON_SECRET;

/**
 * 계약 만료 자동 처리 Cron Job
 * - APPROVED/ACTIVE 상태 계약 중 endDate가 지난 계약을 EXPIRED로 변경
 * - 만료 예정 계약 알림 발송 (7일, 3일, 1일 전)
 *
 * 호출 방법:
 * - Vercel Cron: vercel.json에 설정
 * - 외부 스케줄러: GET /api/cron/contracts/expire?secret=YOUR_SECRET
 *
 * 권장 실행 주기: 매일 00:00 (자정)
 */
export async function GET(request: NextRequest) {
  try {
    // 인증 확인
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    const authHeader = request.headers.get("authorization");

    // Vercel Cron은 Authorization 헤더로 인증, 외부는 쿼리 파라미터로 인증
    if (CRON_SECRET && secret !== CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const results = {
      expired: 0,
      notified7Days: 0,
      notified3Days: 0,
      notified1Day: 0,
      errors: [] as string[],
    };

    // 1. 만료된 계약 처리 (endDate < 오늘)
    const expiredContracts = await prisma.contract.findMany({
      where: {
        status: { in: ["APPROVED", "ACTIVE"] },
        endDate: {
          lt: now,
        },
      },
      include: {
        user: {
          select: {
            telegramChatId: true,
            telegramEnabled: true,
          },
        },
        package: {
          select: {
            displayName: true,
          },
        },
      },
    });

    for (const contract of expiredContracts) {
      try {
        // 상태 변경
        await prisma.contract.update({
          where: { id: contract.id },
          data: { status: "EXPIRED" },
        });

        // 로그 생성
        await prisma.contractLog.create({
          data: {
            contractId: contract.id,
            fromStatus: contract.status,
            toStatus: "EXPIRED",
            note: "계약 기간 만료 (자동 처리)",
          },
        });

        // 텔레그램 알림
        if (contract.user.telegramEnabled && contract.user.telegramChatId) {
          const message = `📅 <b>[Polarad] 계약 만료 안내</b>

안녕하세요, ${contract.companyName}님!

이용하시던 계약이 만료되었습니다.

<b>계약번호:</b> ${contract.contractNumber}
<b>패키지:</b> ${contract.package.displayName}
<b>만료일:</b> ${contract.endDate?.toLocaleDateString("ko-KR")}

서비스 연장을 원하시면 새로운 계약을 요청해 주세요.
감사합니다.`;

          await sendTelegramMessage(contract.user.telegramChatId, message);
        }

        results.expired++;
      } catch (error) {
        results.errors.push(`만료 처리 실패 (${contract.contractNumber}): ${error}`);
      }
    }

    // 2. 만료 예정 알림 (7일, 3일, 1일 전)
    const notificationDays = [7, 3, 1];

    for (const days of notificationDays) {
      const targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() + days);

      // 해당 날짜에 만료되는 계약 조회
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const expiringContracts = await prisma.contract.findMany({
        where: {
          status: { in: ["APPROVED", "ACTIVE"] },
          endDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        include: {
          user: {
            select: {
              telegramChatId: true,
              telegramEnabled: true,
            },
          },
          package: {
            select: {
              displayName: true,
            },
          },
        },
      });

      for (const contract of expiringContracts) {
        if (!contract.user.telegramEnabled || !contract.user.telegramChatId) {
          continue;
        }

        try {
          let urgencyEmoji = "📢";
          if (days === 1) urgencyEmoji = "🚨";
          else if (days === 3) urgencyEmoji = "⚠️";

          const message = `${urgencyEmoji} <b>[Polarad] 계약 만료 ${days}일 전 안내</b>

안녕하세요, ${contract.companyName}님!

이용 중인 계약이 <b>${days}일 후</b> 만료 예정입니다.

<b>계약번호:</b> ${contract.contractNumber}
<b>패키지:</b> ${contract.package.displayName}
<b>만료일:</b> ${contract.endDate?.toLocaleDateString("ko-KR")}

서비스 연장을 원하시면 새로운 계약을 요청해 주세요.`;

          await sendTelegramMessage(contract.user.telegramChatId, message);

          if (days === 7) results.notified7Days++;
          else if (days === 3) results.notified3Days++;
          else if (days === 1) results.notified1Day++;
        } catch (error) {
          results.errors.push(`알림 발송 실패 (${contract.contractNumber}, ${days}일 전): ${error}`);
        }
      }
    }

    console.log("[Cron] 계약 만료 처리 완료:", results);

    return NextResponse.json({
      success: true,
      message: "계약 만료 처리 완료",
      results,
      executedAt: now.toISOString(),
    });
  } catch (error) {
    console.error("[Cron] 계약 만료 처리 오류:", error);
    return NextResponse.json(
      { error: "계약 만료 처리 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
