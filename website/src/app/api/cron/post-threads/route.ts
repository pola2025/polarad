/**
 * Vercel Cron Job: Threads 자동 게시
 * 스케줄: 월/수/금 오후 6시 (KST) = "0 9 * * 1,3,5" (UTC)
 *
 * 시즌1: 17년차 마케터의 타임라인 (에피소드 순차 게시)
 * - 본문 게시 → 셀프댓글 자동 추가
 * - Airtable 설정 테이블로 에피소드 인덱스 추적
 */

import { NextResponse } from "next/server";
import {
  publishToThreads,
  replyToThread,
  isThreadsConfigured,
  SEASON1_EPISODES,
  getCurrentEpisodeIndex,
  updateEpisodeIndex,
  type ThreadsPostResult,
} from "@/lib/threads";
import { logErrorToSlack, logSuccessToSlack } from "@/lib/slack-logger";

const CRON_SECRET = process.env.CRON_SECRET;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = "-1003280236380";

type CronStep =
  | "init"
  | "config_check"
  | "episode_fetch"
  | "post_body"
  | "post_reply"
  | "update_index"
  | "complete";

interface StepTimer {
  step: CronStep;
  startedAt: number;
  durations: Record<string, number>;
}

function createTimer(): StepTimer {
  return { step: "init", startedAt: Date.now(), durations: {} };
}

function markStep(timer: StepTimer, step: CronStep): void {
  const now = Date.now();
  timer.durations[timer.step] = now - timer.startedAt;
  timer.step = step;
  timer.startedAt = now;
}

// 텔레그램 알림
async function sendTelegramNotification(
  type: "success" | "error",
  data: {
    title?: string;
    threadsUrl?: string;
    episodeNumber?: number;
    errorMessage?: string;
    failedStep?: CronStep;
    stepDurations?: Record<string, number>;
  },
): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN) return;

  let message: string;

  if (type === "success") {
    message = `🧵 *Threads 자동 게시 완료*

📝 *에피소드:* ep.${data.episodeNumber} "${data.title}"
${data.threadsUrl ? `🔗 *링크:* [게시글 보기](${data.threadsUrl})` : ""}

✅ 본문 + 셀프댓글 게시 완료!`;
  } else {
    const stepInfo = data.failedStep
      ? `\n📍 *실패 단계:* ${data.failedStep}`
      : "";
    const durationInfo = data.stepDurations
      ? `\n⏱️ *단계별 소요시간:*\n${Object.entries(data.stepDurations)
          .map(([k, v]) => `  ${k}: ${(v / 1000).toFixed(1)}초`)
          .join("\n")}`
      : "";
    message = `❌ *Threads 자동 게시 실패*

⚠️ *오류:* ${data.errorMessage}${stepInfo}${durationInfo}

🔧 수동 확인: polarad.co.kr/api/cron/post-threads?force=true`;
  }

  try {
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
          disable_web_page_preview: false,
        }),
      },
    );
  } catch (error) {
    console.error("텔레그램 알림 오류:", error);
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const forceRun = url.searchParams.get("force") === "true";
  const forceEpisode = url.searchParams.get("episode"); // 특정 에피소드 강제 게시

  // Cron 인증
  const authHeader = request.headers.get("authorization");
  if (!forceRun && CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const timer = createTimer();
  const envStatus = {
    THREADS_TOKEN: process.env.THREADS_ACCESS_TOKEN ? "✅" : "❌",
    THREADS_USER_ID: process.env.THREADS_USER_ID ? "✅" : "❌",
    TELEGRAM: TELEGRAM_BOT_TOKEN ? "✅" : "❌",
    AIRTABLE: process.env.AIRTABLE_API_KEY ? "✅" : "❌",
    GEMINI: process.env.GEMINI_API_KEY ? "✅" : "❌",
  };

  try {
    console.log("🧵 Threads 자동 게시 시작...");
    console.log("📊 환경변수 상태:", JSON.stringify(envStatus));

    // 1. 설정 확인
    markStep(timer, "config_check");
    if (!isThreadsConfigured()) {
      const missing = [];
      if (!process.env.THREADS_ACCESS_TOKEN)
        missing.push("THREADS_ACCESS_TOKEN");
      if (!process.env.THREADS_USER_ID) missing.push("THREADS_USER_ID");

      const errorMsg = `Threads API 미설정: ${missing.join(", ")}`;
      console.error(`❌ ${errorMsg}`);

      await sendTelegramNotification("error", {
        errorMessage: errorMsg,
        failedStep: "config_check",
      });

      return NextResponse.json(
        {
          success: false,
          error: errorMsg,
          envStatus,
          help: "환경변수를 Vercel 대시보드에서 설정해주세요.",
        },
        { status: 500 },
      );
    }

    // 2. 에피소드 결정
    markStep(timer, "episode_fetch");
    let episodeIndex: number;

    if (forceEpisode) {
      episodeIndex = parseInt(forceEpisode, 10) - 1; // 1-based → 0-based
      console.log(`🎯 강제 에피소드: ep.${forceEpisode}`);
    } else {
      episodeIndex = await getCurrentEpisodeIndex();
      console.log(`📋 현재 에피소드 인덱스: ${episodeIndex}`);
    }

    // 모든 에피소드 게시 완료 체크
    if (episodeIndex >= SEASON1_EPISODES.length) {
      console.log("✅ 시즌1 모든 에피소드 게시 완료");
      return NextResponse.json({
        success: true,
        message: "시즌1 모든 에피소드 게시 완료",
        totalEpisodes: SEASON1_EPISODES.length,
        posted: 0,
      });
    }

    const episode = SEASON1_EPISODES[episodeIndex];
    console.log(`📝 게시 대상: ep.${episode.number} "${episode.title}"`);

    // 3. 본문 게시
    markStep(timer, "post_body");
    console.log(`🧵 본문 게시 중... (${episode.body.length}자)`);
    const postResult: ThreadsPostResult = await publishToThreads(episode.body);

    if (!postResult.success) {
      console.error(`❌ 본문 게시 실패:`, postResult.error);
      console.error(`📍 실패 단계: ${postResult.step}`);

      markStep(timer, "complete");
      await Promise.all([
        sendTelegramNotification("error", {
          errorMessage: `ep.${episode.number} 본문 게시 실패: ${postResult.error}`,
          failedStep: "post_body",
          stepDurations: timer.durations,
        }),
        logErrorToSlack({
          source: "/api/cron/post-threads",
          errorMessage: postResult.error || "Unknown error",
          step: `post_body (API step: ${postResult.step})`,
          envStatus,
          duration: Object.values(timer.durations).reduce((a, b) => a + b, 0),
        }),
      ]);

      return NextResponse.json(
        {
          success: false,
          error: postResult.error,
          episode: { number: episode.number, title: episode.title },
          failedStep: "post_body",
          apiStep: postResult.step,
          stepDurations: timer.durations,
        },
        { status: 500 },
      );
    }

    console.log(`✅ 본문 게시 완료: ${postResult.postId}`);
    if (postResult.permalink) {
      console.log(`🔗 퍼머링크: ${postResult.permalink}`);
    }

    // 4. 셀프댓글 게시 (본문 게시 성공 시)
    markStep(timer, "post_reply");
    let replyResult: ThreadsPostResult = { success: false };

    if (postResult.postId && episode.selfComment) {
      console.log(`💬 셀프댓글 게시 중... (${episode.selfComment.length}자)`);

      // 셀프댓글은 본문 게시 직후 바로 (알고리즘 부스트)
      replyResult = await replyToThread(postResult.postId, episode.selfComment);

      if (!replyResult.success) {
        // 셀프댓글 실패는 경고만 (본문은 이미 게시됨)
        console.warn(`⚠️ 셀프댓글 실패 (본문은 게시됨): ${replyResult.error}`);
      } else {
        console.log(`✅ 셀프댓글 게시 완료: ${replyResult.replyId}`);
      }
    }

    // 5. 에피소드 인덱스 업데이트
    markStep(timer, "update_index");
    if (!forceEpisode) {
      const updated = await updateEpisodeIndex(episodeIndex + 1);
      console.log(
        `📊 에피소드 인덱스 업데이트: ${episodeIndex} → ${episodeIndex + 1} (${updated ? "성공" : "실패"})`,
      );
    }

    // 6. 알림
    markStep(timer, "complete");
    const totalDuration = Object.values(timer.durations).reduce(
      (a, b) => a + b,
      0,
    );

    await Promise.all([
      sendTelegramNotification("success", {
        title: episode.title,
        threadsUrl: postResult.permalink,
        episodeNumber: episode.number,
      }),
      logSuccessToSlack(
        "/api/cron/post-threads",
        `ep.${episode.number} "${episode.title}"\n${postResult.permalink || "(퍼머링크 미확인)"}${replyResult.success ? "\n✅ 셀프댓글 포함" : "\n⚠️ 셀프댓글 실패"}`,
        totalDuration,
      ),
    ]);

    return NextResponse.json({
      success: true,
      episode: {
        number: episode.number,
        season: episode.season,
        title: episode.title,
      },
      threads: {
        postId: postResult.postId,
        permalink: postResult.permalink,
        replyId: replyResult.replyId,
        replySuccess: replyResult.success,
      },
      nextEpisode:
        episodeIndex + 1 < SEASON1_EPISODES.length
          ? {
              number: SEASON1_EPISODES[episodeIndex + 1].number,
              title: SEASON1_EPISODES[episodeIndex + 1].title,
            }
          : null,
      stepDurations: timer.durations,
      totalDuration,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error("❌ Threads 크론 에러:", errorMessage);
    console.error("📍 실패 단계:", timer.step);

    markStep(timer, "complete");

    await Promise.all([
      sendTelegramNotification("error", {
        errorMessage,
        failedStep: timer.step,
        stepDurations: timer.durations,
      }),
      logErrorToSlack({
        source: "/api/cron/post-threads",
        errorMessage,
        errorStack,
        step: timer.step,
        envStatus,
        duration: Object.values(timer.durations).reduce((a, b) => a + b, 0),
      }),
    ]);

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        failedStep: timer.step,
        stepDurations: timer.durations,
        envStatus,
      },
      { status: 500 },
    );
  }
}
