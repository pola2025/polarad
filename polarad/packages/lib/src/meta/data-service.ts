/**
 * Meta Ads 데이터 서비스
 *
 * raw_data 저장, 집계, 정합성 검증 등을 담당합니다.
 */

import { prisma, Prisma } from "@polarad/database";
import {
  fetchMetaAdsData,
  transformToInsight,
  type MetaApiRawItem,
  type MetaInsight,
} from "./api";
import { tokenManager } from "./token-manager";

export interface DataSyncResult {
  success: boolean;
  recordsAggregated: number;
  rawRecords?: number;
  datesVerified?: number;
  error?: string;
  mismatches?: Array<{
    date: string;
    raw: { leads: number; spend: string };
    agg: { leads: number; spend: string };
    issue: string;
  }>;
}

export interface ServicePeriodResult {
  valid: boolean;
  endDate: Date | null;
}

/**
 * 서비스 기간 확인
 */
export async function checkServicePeriod(
  clientId: string
): Promise<ServicePeriodResult> {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: {
      servicePeriodEnd: true,
      isActive: true,
    },
  });

  if (!client) {
    return { valid: false, endDate: null };
  }

  if (!client.isActive) {
    return { valid: false, endDate: client.servicePeriodEnd };
  }

  if (!client.servicePeriodEnd) {
    return { valid: true, endDate: null }; // 종료일 미설정 = 무제한
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isValid = client.servicePeriodEnd >= today;

  return { valid: isValid, endDate: client.servicePeriodEnd };
}

/**
 * Meta API에서 데이터 조회 후 raw_data에 저장
 */
export async function collectAndSaveData(
  clientId: string,
  startDate: string,
  endDate: string
): Promise<{ success: boolean; recordsCount: number; error?: string }> {
  console.log(`🔄 Collecting data for client ${clientId}`);
  console.log(`📅 Period: ${startDate} ~ ${endDate}`);

  try {
    // 1. 서비스 기간 확인
    const servicePeriod = await checkServicePeriod(clientId);
    if (!servicePeriod.valid) {
      console.log(
        `⏹️ Service expired for client (End: ${servicePeriod.endDate})`
      );
      return {
        success: false,
        recordsCount: 0,
        error: "Service period expired",
      };
    }

    // 2. 토큰 유효성 확인 및 갱신
    const accessToken = await tokenManager.ensureValidToken(clientId);

    // 3. 클라이언트의 광고 계정 ID 조회
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { metaAdAccountId: true },
    });

    if (!client?.metaAdAccountId) {
      return {
        success: false,
        recordsCount: 0,
        error: "No Meta Ad Account ID configured",
      };
    }

    // 4. Meta API 호출
    const rawData = await fetchMetaAdsData(
      client.metaAdAccountId,
      accessToken,
      startDate,
      endDate
    );

    console.log(`📊 Fetched ${rawData.length} records from Meta API`);

    // 5. raw_data에 저장
    await saveRawData(clientId, rawData);

    // 6. 일별 집계 생성 + 정합성 검증
    const syncResult = await syncAndVerify(clientId, startDate, endDate);
    if (!syncResult.success) {
      console.warn(`⚠️ Data integrity issue: ${syncResult.error}`);
    }

    console.log(`✅ Completed: ${rawData.length} records`);

    return {
      success: true,
      recordsCount: rawData.length,
    };
  } catch (error) {
    console.error(`❌ Failed to collect data:`, error);

    // 토큰 관련 에러인 경우 auth_status 업데이트
    const errorMessage = (error as Error).message;
    if (errorMessage.includes("token") || errorMessage.includes("auth")) {
      await tokenManager.updateAuthStatus(clientId, "AUTH_REQUIRED");
    }

    return {
      success: false,
      recordsCount: 0,
      error: errorMessage,
    };
  }
}

/**
 * raw_data에 저장 (upsert)
 */
export async function saveRawData(
  clientId: string,
  insights: MetaApiRawItem[]
): Promise<void> {
  if (!insights || insights.length === 0) {
    console.log("⚠️ No data to save");
    return;
  }

  let savedCount = 0;

  for (const item of insights) {
    const insight = transformToInsight(item);

    try {
      await prisma.metaRawData.upsert({
        where: {
          clientId_date_adId_platform_device: {
            clientId,
            date: new Date(insight.date),
            adId: insight.adId,
            platform: insight.platform,
            device: insight.device,
          },
        },
        update: {
          adName: insight.adName,
          campaignId: insight.campaignId,
          campaignName: insight.campaignName,
          currency: insight.currency,
          impressions: insight.impressions,
          reach: insight.reach,
          clicks: insight.clicks,
          leads: insight.leads,
          spend: new Prisma.Decimal(insight.spend),
          videoViews: insight.videoViews,
          avgWatchTime: new Prisma.Decimal(insight.avgWatchTime),
          costPerVideoView: new Prisma.Decimal(insight.costPerVideoView),
          costPerLead: new Prisma.Decimal(insight.costPerLead),
        },
        create: {
          clientId,
          date: new Date(insight.date),
          adId: insight.adId,
          adName: insight.adName,
          campaignId: insight.campaignId,
          campaignName: insight.campaignName,
          platform: insight.platform,
          device: insight.device,
          currency: insight.currency,
          impressions: insight.impressions,
          reach: insight.reach,
          clicks: insight.clicks,
          leads: insight.leads,
          spend: new Prisma.Decimal(insight.spend),
          videoViews: insight.videoViews,
          avgWatchTime: new Prisma.Decimal(insight.avgWatchTime),
          costPerVideoView: new Prisma.Decimal(insight.costPerVideoView),
          costPerLead: new Prisma.Decimal(insight.costPerLead),
        },
      });
      savedCount++;
    } catch (error) {
      console.error("Failed to save record:", error);
      throw error;
    }
  }

  console.log(`💾 Saved ${savedCount} records to meta_raw_data`);
}

/**
 * raw_data에서 일별 집계 생성
 */
export async function aggregateFromRaw(
  clientId: string,
  startDate: string,
  endDate: string
): Promise<{ success: boolean; recordsAggregated: number; rawRecords: number }> {
  console.log(`📊 Aggregating: ${startDate} ~ ${endDate}`);

  // 1. raw_data에서 해당 기간 데이터 조회
  const rawData = await prisma.metaRawData.findMany({
    where: {
      clientId,
      date: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    },
    orderBy: { date: "asc" },
  });

  if (rawData.length === 0) {
    console.log(`   ⚠️ 해당 기간 raw_data 없음`);
    return { success: true, recordsAggregated: 0, rawRecords: 0 };
  }

  // 2. 날짜별로 집계
  const aggregates: Map<
    string,
    {
      date: Date;
      impressions: number;
      reach: number;
      clicks: number;
      leads: number;
      spend: number;
      adCount: Set<string>;
    }
  > = new Map();

  rawData.forEach((row) => {
    const dateKey = row.date.toISOString().split("T")[0];

    if (!aggregates.has(dateKey)) {
      aggregates.set(dateKey, {
        date: row.date,
        impressions: 0,
        reach: 0,
        clicks: 0,
        leads: 0,
        spend: 0,
        adCount: new Set(),
      });
    }

    const agg = aggregates.get(dateKey)!;
    agg.impressions += row.impressions;
    agg.reach += row.reach;
    agg.clicks += row.clicks;
    agg.leads += row.leads;
    agg.spend += Number(row.spend);
    agg.adCount.add(row.adId);
  });

  // 3. 기존 데이터 삭제 후 삽입
  await prisma.metaDailyAggregate.deleteMany({
    where: {
      clientId,
      date: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    },
  });

  // 4. 새 데이터 삽입
  const records = Array.from(aggregates.entries()).map(([, agg]) => ({
    clientId,
    date: agg.date,
    totalImpressions: agg.impressions,
    totalReach: agg.reach,
    totalClicks: agg.clicks,
    totalLeads: agg.leads,
    totalSpend: new Prisma.Decimal(agg.spend),
    adCount: agg.adCount.size,
    avgCtr:
      agg.impressions > 0
        ? new Prisma.Decimal((agg.clicks / agg.impressions) * 100)
        : null,
    avgCpl:
      agg.leads > 0 ? new Prisma.Decimal(agg.spend / agg.leads) : null,
  }));

  if (records.length > 0) {
    await prisma.metaDailyAggregate.createMany({
      data: records,
    });
  }

  console.log(`   ✅ ${records.length}개 레코드 집계 완료`);

  return {
    success: true,
    recordsAggregated: records.length,
    rawRecords: rawData.length,
  };
}

/**
 * 정합성 검증 (raw_data vs daily_aggregates)
 */
export async function verifyIntegrity(
  clientId: string,
  startDate: string,
  endDate: string
): Promise<{
  isValid: boolean;
  mismatches: Array<{
    date: string;
    raw: { leads: number; spend: string };
    agg: { leads: number; spend: string };
    issue: string;
  }>;
  datesChecked: number;
}> {
  console.log(`🔍 Verifying integrity: ${startDate} ~ ${endDate}`);

  // 1. raw_data 날짜별 합계
  const rawData = await prisma.metaRawData.findMany({
    where: {
      clientId,
      date: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    },
    select: { date: true, leads: true, spend: true },
  });

  const rawByDate: Map<string, { leads: number; spend: number }> = new Map();
  rawData.forEach((row) => {
    const dateKey = row.date.toISOString().split("T")[0];
    if (!rawByDate.has(dateKey)) {
      rawByDate.set(dateKey, { leads: 0, spend: 0 });
    }
    const agg = rawByDate.get(dateKey)!;
    agg.leads += row.leads;
    agg.spend += Number(row.spend);
  });

  // 2. daily_aggregates 날짜별 합계
  const aggData = await prisma.metaDailyAggregate.findMany({
    where: {
      clientId,
      date: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    },
    select: { date: true, totalLeads: true, totalSpend: true },
  });

  const aggByDate: Map<string, { leads: number; spend: number }> = new Map();
  aggData.forEach((row) => {
    const dateKey = row.date.toISOString().split("T")[0];
    if (!aggByDate.has(dateKey)) {
      aggByDate.set(dateKey, { leads: 0, spend: 0 });
    }
    const agg = aggByDate.get(dateKey)!;
    agg.leads += row.totalLeads;
    agg.spend += Number(row.totalSpend);
  });

  // 3. 비교
  const allDates = [
    ...new Set([...rawByDate.keys(), ...aggByDate.keys()]),
  ].sort();
  const mismatches: Array<{
    date: string;
    raw: { leads: number; spend: string };
    agg: { leads: number; spend: string };
    issue: string;
  }> = [];

  allDates.forEach((date) => {
    const raw = rawByDate.get(date) || { leads: 0, spend: 0 };
    const agg = aggByDate.get(date) || { leads: 0, spend: 0 };

    const leadMatch = raw.leads === agg.leads;
    const spendMatch = Math.abs(raw.spend - agg.spend) < 0.01;

    if (!leadMatch || !spendMatch) {
      mismatches.push({
        date,
        raw: { leads: raw.leads, spend: raw.spend.toFixed(2) },
        agg: { leads: agg.leads, spend: agg.spend.toFixed(2) },
        issue: !leadMatch ? "leads_mismatch" : "spend_mismatch",
      });
    }
  });

  const isValid = mismatches.length === 0;

  if (isValid) {
    console.log(`   ✅ 정합성 검증 통과 (${allDates.length}일)`);
  } else {
    console.log(`   ❌ 정합성 불일치 ${mismatches.length}건 발견`);
    mismatches.forEach((m) => {
      console.log(
        `      ${m.date}: raw(${m.raw.leads}건, $${m.raw.spend}) vs agg(${m.agg.leads}건, $${m.agg.spend})`
      );
    });
  }

  return { isValid, mismatches, datesChecked: allDates.length };
}

/**
 * 집계 + 정합성 검증 + 자동 복구 (통합 함수)
 */
export async function syncAndVerify(
  clientId: string,
  startDate: string,
  endDate: string
): Promise<DataSyncResult> {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🔄 Data Sync & Verify: ${startDate} ~ ${endDate}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  // 1. 집계 실행
  const aggResult = await aggregateFromRaw(clientId, startDate, endDate);

  // 2. 정합성 검증
  const verifyResult = await verifyIntegrity(clientId, startDate, endDate);

  // 3. 불일치 시 한 번 더 재집계 시도
  if (!verifyResult.isValid) {
    console.log(`\n⚠️ 정합성 불일치 발견 → 재집계 시도...\n`);

    await aggregateFromRaw(clientId, startDate, endDate);
    const reVerify = await verifyIntegrity(clientId, startDate, endDate);

    if (!reVerify.isValid) {
      console.error(`\n❌ 재집계 후에도 정합성 불일치!`);
      console.error(`   → 수동 확인 필요\n`);

      return {
        success: false,
        recordsAggregated: aggResult.recordsAggregated,
        error: "integrity_mismatch_after_retry",
        mismatches: reVerify.mismatches,
      };
    }
  }

  console.log(
    `\n✅ Data Sync 완료! (${aggResult.recordsAggregated}개 레코드)\n`
  );

  return {
    success: true,
    recordsAggregated: aggResult.recordsAggregated,
    rawRecords: aggResult.rawRecords,
    datesVerified: verifyResult.datesChecked,
  };
}

/**
 * 주간 요약 생성
 */
export async function generateWeeklySummary(
  clientId: string,
  weekStart: string,
  weekEnd: string
): Promise<void> {
  console.log(`📊 Generating weekly summary: ${weekStart} ~ ${weekEnd}`);

  // 주차 계산
  const startDate = new Date(weekStart);
  const weekYear = startDate.getFullYear();
  const weekNumber = getISOWeekNumber(startDate);

  // raw_data에서 광고별 집계
  const rawData = await prisma.metaRawData.findMany({
    where: {
      clientId,
      date: {
        gte: new Date(weekStart),
        lte: new Date(weekEnd),
      },
    },
  });

  // 광고별 집계
  const adAggregates: Map<
    string,
    {
      adId: string;
      adName: string;
      campaignId: string;
      campaignName: string;
      impressions: number;
      reach: number;
      clicks: number;
      leads: number;
      spend: number;
      videoViews: number;
    }
  > = new Map();

  rawData.forEach((row) => {
    if (!adAggregates.has(row.adId)) {
      adAggregates.set(row.adId, {
        adId: row.adId,
        adName: row.adName || "Unknown",
        campaignId: row.campaignId || "",
        campaignName: row.campaignName || "Unknown",
        impressions: 0,
        reach: 0,
        clicks: 0,
        leads: 0,
        spend: 0,
        videoViews: 0,
      });
    }

    const agg = adAggregates.get(row.adId)!;
    agg.impressions += row.impressions;
    agg.reach += row.reach;
    agg.clicks += row.clicks;
    agg.leads += row.leads;
    agg.spend += Number(row.spend);
    agg.videoViews += row.videoViews;
  });

  // 기존 주간 요약 삭제
  await prisma.metaWeeklySummary.deleteMany({
    where: {
      clientId,
      weekYear,
      weekNumber,
    },
  });

  // 새 주간 요약 저장
  const summaries = Array.from(adAggregates.values()).map((agg) => ({
    clientId,
    weekYear,
    weekNumber,
    weekStart: new Date(weekStart),
    weekEnd: new Date(weekEnd),
    adId: agg.adId,
    adName: agg.adName,
    campaignId: agg.campaignId,
    campaignName: agg.campaignName,
    totalImpressions: agg.impressions,
    totalReach: agg.reach,
    totalClicks: agg.clicks,
    totalLeads: agg.leads,
    totalSpend: new Prisma.Decimal(agg.spend),
    totalVideoViews: agg.videoViews,
    avgCtr:
      agg.impressions > 0
        ? new Prisma.Decimal((agg.clicks / agg.impressions) * 100)
        : null,
    avgCpl: agg.leads > 0 ? new Prisma.Decimal(agg.spend / agg.leads) : null,
    efficiencyGrade: calculateEfficiencyGrade(agg.leads, agg.spend),
  }));

  if (summaries.length > 0) {
    await prisma.metaWeeklySummary.createMany({
      data: summaries,
    });
  }

  console.log(`   ✅ 주간 요약 생성 완료 (${summaries.length}개 광고)`);
}

/**
 * ISO 주차 번호 계산
 */
function getISOWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/**
 * 효율 등급 계산 (CPL 기준)
 */
function calculateEfficiencyGrade(leads: number, spend: number): string | null {
  if (leads === 0 || spend === 0) return null;

  const cpl = spend / leads;

  // CPL 기준 등급 (한국 시장 기준, KRW 가정)
  if (cpl <= 5000) return "S";
  if (cpl <= 10000) return "A";
  if (cpl <= 20000) return "B";
  if (cpl <= 35000) return "C";
  if (cpl <= 50000) return "D";
  return "F";
}

/**
 * 데이터 수집 기간 계산 (환경변수 기반)
 */
export function getDataCollectionPeriod(): { start: string; end: string } {
  const now = new Date();
  const kstNow = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );

  const dataDays = process.env.DATA_DAYS
    ? parseInt(process.env.DATA_DAYS)
    : null;
  const dataPeriod = process.env.DATA_PERIOD || null;

  // 1. DATA_DAYS가 지정된 경우: 오늘부터 N일 전까지
  if (dataDays) {
    const endDate = new Date(kstNow);
    endDate.setDate(endDate.getDate() - 1); // 어제까지

    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - (dataDays - 1));

    return {
      start: startDate.toISOString().split("T")[0],
      end: endDate.toISOString().split("T")[0],
    };
  }

  // 2. DATA_PERIOD=last_month: 지난달 1일~말일
  if (dataPeriod === "last_month") {
    const year = kstNow.getFullYear();
    const month = kstNow.getMonth();

    const lastMonthDate =
      month === 0 ? new Date(year - 1, 11, 1) : new Date(year, month - 1, 1);

    const firstDay = new Date(
      lastMonthDate.getFullYear(),
      lastMonthDate.getMonth(),
      1
    );
    const lastDay = new Date(
      lastMonthDate.getFullYear(),
      lastMonthDate.getMonth() + 1,
      0
    );

    return {
      start: firstDay.toISOString().split("T")[0],
      end: lastDay.toISOString().split("T")[0],
    };
  }

  // 3. 기본값: 지난주 월~일
  const dayOfWeek = kstNow.getDay();
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const thisMonday = new Date(kstNow);
  thisMonday.setDate(kstNow.getDate() - daysFromMonday);

  const lastMonday = new Date(thisMonday);
  lastMonday.setDate(thisMonday.getDate() - 7);

  const lastSunday = new Date(lastMonday);
  lastSunday.setDate(lastMonday.getDate() + 6);

  return {
    start: lastMonday.toISOString().split("T")[0],
    end: lastSunday.toISOString().split("T")[0],
  };
}
