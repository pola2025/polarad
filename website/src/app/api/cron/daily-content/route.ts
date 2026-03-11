/**
 * Vercel Cron: 일일 콘텐츠 자동 배포 (3채널 통합)
 * 스케줄: 매일 오전 11시 KST = UTC 02:00
 *
 * Instagram + Threads + 홈페이지(Airtable) 동시 게시
 * Airtable Settings에서 현재 Day 인덱스 추적
 */

import { NextResponse } from "next/server";
import { DAILY_SCHEDULE, type DaySchedule } from "@/lib/daily-content-data";

const CRON_SECRET = process.env.CRON_SECRET;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = "-1003280236380";

// Instagram
const INSTAGRAM_TOKEN = process.env.POLARAD_INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_ACCOUNT_ID =
  process.env.POLARAD_INSTAGRAM_ACCOUNT_ID || "17841441970375843";
const IG_API = "https://graph.facebook.com/v21.0";

// Threads
const THREADS_TOKEN = process.env.THREADS_ACCESS_TOKEN;
const THREADS_USER_ID = process.env.THREADS_USER_ID || "26489247170700372";
const THREADS_API = "https://graph.threads.net/v1.0";

// Airtable
const AIRTABLE_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE = process.env.AIRTABLE_BASE_ID || "appbqw2GAixv7vSBV";
const AIRTABLE_TABLE = process.env.AIRTABLE_TABLE_NAME || "뉴스레터";
const AIRTABLE_SETTINGS = "Settings";

const R2_BASE = "https://pub-c873926e91684ac7a7f53f44d4cc5b9f.r2.dev";

// ── Airtable Day 인덱스 관리 ──
async function getCurrentDay(): Promise<{ day: number; recordId?: string }> {
  if (!AIRTABLE_KEY) return { day: 1 };
  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(AIRTABLE_SETTINGS)}?filterByFormula={key}='daily_content_day'`,
      { headers: { Authorization: `Bearer ${AIRTABLE_KEY}` } },
    );
    const data = await res.json();
    if (data.records?.length > 0) {
      return {
        day: parseInt(data.records[0].fields.value, 10) || 1,
        recordId: data.records[0].id,
      };
    }
    return { day: 1 };
  } catch {
    return { day: 1 };
  }
}

async function updateDay(day: number, recordId?: string): Promise<void> {
  if (!AIRTABLE_KEY) return;
  try {
    if (recordId) {
      await fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(AIRTABLE_SETTINGS)}/${recordId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${AIRTABLE_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fields: { value: String(day) } }),
        },
      );
    } else {
      await fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(AIRTABLE_SETTINGS)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AIRTABLE_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            records: [
              { fields: { key: "daily_content_day", value: String(day) } },
            ],
          }),
        },
      );
    }
  } catch (e) {
    console.error("[DailyContent] Day 인덱스 저장 실패:", e);
  }
}

// ── 텔레그램 알림 ──
async function notify(type: "success" | "error", msg: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN) return;
  try {
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: msg,
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        }),
      },
    );
  } catch {}
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── 1. Instagram 게시 ──
async function postInstagram(
  schedule: DaySchedule,
): Promise<{ permalink: string }> {
  if (!INSTAGRAM_TOKEN)
    throw new Error("POLARAD_INSTAGRAM_ACCESS_TOKEN 미설정");

  const dayNum = String(schedule.day).padStart(2, "0");
  const imageUrl = `${R2_BASE}/instagram/polarad/30day/day-${dayNum}.png`;

  // 컨테이너 생성
  const cRes = await fetch(`${IG_API}/${INSTAGRAM_ACCOUNT_ID}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image_url: imageUrl,
      caption: schedule.caption,
      access_token: INSTAGRAM_TOKEN,
    }),
  });
  const cData = await cRes.json();
  if (cData.error) throw new Error(`컨테이너: ${cData.error.message}`);

  // 처리 대기
  for (let i = 0; i < 15; i++) {
    await sleep(2000);
    const sRes = await fetch(
      `${IG_API}/${cData.id}?fields=status_code&access_token=${INSTAGRAM_TOKEN}`,
    );
    const sData = await sRes.json();
    if (sData.status_code === "FINISHED") break;
    if (sData.status_code === "ERROR") throw new Error("미디어 처리 실패");
  }

  // 게시
  const pRes = await fetch(`${IG_API}/${INSTAGRAM_ACCOUNT_ID}/media_publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      creation_id: cData.id,
      access_token: INSTAGRAM_TOKEN,
    }),
  });
  const pData = await pRes.json();
  if (pData.error) throw new Error(`게시: ${pData.error.message}`);

  const plRes = await fetch(
    `${IG_API}/${pData.id}?fields=permalink&access_token=${INSTAGRAM_TOKEN}`,
  );
  const plData = await plRes.json();
  return { permalink: plData.permalink || "" };
}

// ── 2. Threads 게시 ──
async function postThreads(
  schedule: DaySchedule,
): Promise<{ permalink: string }> {
  if (!THREADS_TOKEN) throw new Error("THREADS_ACCESS_TOKEN 미설정");
  if (!schedule.threadBody) throw new Error("쓰레드 본문 없음");

  // 본문 컨테이너
  const cRes = await fetch(`${THREADS_API}/${THREADS_USER_ID}/threads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      media_type: "TEXT",
      text: schedule.threadBody,
      access_token: THREADS_TOKEN,
    }),
  });
  const cData = await cRes.json();
  if (cData.error) throw new Error(`컨테이너: ${cData.error.message}`);

  await sleep(3000);

  const pRes = await fetch(
    `${THREADS_API}/${THREADS_USER_ID}/threads_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: cData.id,
        access_token: THREADS_TOKEN,
      }),
    },
  );
  const pData = await pRes.json();
  if (pData.error) throw new Error(`게시: ${pData.error.message}`);

  const plRes = await fetch(
    `${THREADS_API}/${pData.id}?fields=permalink&access_token=${THREADS_TOKEN}`,
  );
  const plData = await plRes.json();

  // 셀프댓글
  if (schedule.threadComment) {
    await sleep(3000);
    const rRes = await fetch(`${THREADS_API}/${THREADS_USER_ID}/threads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        media_type: "TEXT",
        text: schedule.threadComment,
        reply_to_id: pData.id,
        access_token: THREADS_TOKEN,
      }),
    });
    const rData = await rRes.json();
    if (!rData.error) {
      await sleep(3000);
      await fetch(`${THREADS_API}/${THREADS_USER_ID}/threads_publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creation_id: rData.id,
          access_token: THREADS_TOKEN,
        }),
      });
    }
  }

  return { permalink: plData.permalink || "" };
}

// ── 3. 홈페이지 게시글 ──
async function postArticle(schedule: DaySchedule): Promise<{ url: string }> {
  if (!AIRTABLE_KEY) throw new Error("AIRTABLE_API_KEY 미설정");
  if (!schedule.article) throw new Error("게시글 데이터 없음");

  const dayNum = String(schedule.day).padStart(2, "0");
  const thumbnailUrl = `${R2_BASE}/article-thumbnails/day-${dayNum}.webp`;
  const today = new Date().toISOString().split("T")[0];

  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(AIRTABLE_TABLE)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              date: today,
              publishedAt: new Date().toISOString(),
              title: schedule.title,
              description: schedule.article.description,
              category: schedule.article.category,
              content: schedule.article.content,
              tags: schedule.article.tags,
              seoKeywords: schedule.article.seoKeywords,
              status: "published",
              slug: schedule.article.slug,
              thumbnailUrl,
              views: 0,
            },
          },
        ],
      }),
    },
  );
  const data = await res.json();
  if (data.error) throw new Error(`Airtable: ${JSON.stringify(data.error)}`);

  return {
    url: `https://www.polarad.co.kr/marketing-news/${schedule.article.slug}`,
  };
}

// ── 메인 핸들러 ──
export async function GET(request: Request) {
  const url = new URL(request.url);
  const forceRun = url.searchParams.get("force") === "true";
  const forceDay = url.searchParams.get("day");

  // 인증
  const authHeader = request.headers.get("authorization");
  if (!forceRun && CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 현재 Day 조회
    const { day: currentDay, recordId } = await getCurrentDay();
    const dayToPost = forceDay ? parseInt(forceDay, 10) : currentDay;

    const schedule = DAILY_SCHEDULE.find((s) => s.day === dayToPost);
    if (!schedule) {
      return NextResponse.json(
        { error: `Day ${dayToPost} 스케줄 없음 (1~30)`, currentDay },
        { status: 400 },
      );
    }

    console.log(`🚀 Day ${dayToPost} 콘텐츠 배포 시작`);

    const results: Record<string, string> = {};
    const errors: string[] = [];

    // 1. Instagram
    try {
      const ig = await postInstagram(schedule);
      results.instagram = ig.permalink;
      console.log(`✅ Instagram: ${ig.permalink}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`Instagram: ${msg}`);
      console.error(`❌ Instagram: ${msg}`);
    }

    // 2. Threads
    try {
      const th = await postThreads(schedule);
      results.threads = th.permalink;
      console.log(`✅ Threads: ${th.permalink}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`Threads: ${msg}`);
      console.error(`❌ Threads: ${msg}`);
    }

    // 3. 홈페이지
    try {
      const art = await postArticle(schedule);
      results.article = art.url;
      console.log(`✅ 홈페이지: ${art.url}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`홈페이지: ${msg}`);
      console.error(`❌ 홈페이지: ${msg}`);
    }

    // Day 인덱스 업데이트 (다음 Day로)
    if (!forceDay && errors.length === 0) {
      const nextDay = dayToPost >= 30 ? 1 : dayToPost + 1;
      await updateDay(nextDay, recordId);
    }

    // 텔레그램 알림
    const successCount = Object.keys(results).length;
    if (errors.length === 0) {
      await notify(
        "success",
        `📢 *Day ${dayToPost} 콘텐츠 배포 완료*\n\n📸 Instagram: ${results.instagram || "N/A"}\n🧵 Threads: ${results.threads || "N/A"}\n📝 홈페이지: ${results.article || "N/A"}`,
      );
    } else {
      await notify(
        "error",
        `⚠️ *Day ${dayToPost} 배포 부분 실패*\n\n✅ 성공: ${successCount}개\n❌ 실패: ${errors.length}개\n\n${errors.join("\n")}`,
      );
    }

    return NextResponse.json({
      success: errors.length === 0,
      day: dayToPost,
      results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`❌ 치명적 오류: ${msg}`);

    await notify("error", `❌ *Daily Content 크론 치명적 오류*\n\n${msg}`);

    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
