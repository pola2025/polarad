/**
 * Meta Ads 모듈 - 광고 데이터 수집 및 관리
 *
 * @example
 * import { tokenManager, collectAndSaveData } from "@polarad/lib/meta";
 *
 * // 토큰 유효성 확인 후 데이터 수집
 * const accessToken = await tokenManager.ensureValidToken(clientId);
 * const result = await collectAndSaveData(clientId, "2025-01-01", "2025-01-07");
 */

// API 모듈
export {
  fetchMetaAdsData,
  transformToInsight,
  getActionValue,
  getVideoAvgTime,
  getCostPerAction,
  validateMetaToken,
  validateAdAccount,
  type MetaInsight,
  type MetaApiRawItem,
  type MetaApiResponse,
} from "./api";

// 암호화 모듈
export {
  encrypt,
  decrypt,
  validateKey,
  generateNewKey,
} from "./encryption";

// 토큰 관리
export {
  TokenManager,
  tokenManager,
  sendAdminAlert,
  type TokenValidationResult,
  type TokenRefreshResult,
} from "./token-manager";

// 데이터 서비스
export {
  checkServicePeriod,
  collectAndSaveData,
  saveRawData,
  aggregateFromRaw,
  verifyIntegrity,
  syncAndVerify,
  generateWeeklySummary,
  getDataCollectionPeriod,
  type DataSyncResult,
  type ServicePeriodResult,
} from "./data-service";
