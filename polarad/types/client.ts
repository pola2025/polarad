/**
 * Polarad 마케팅 패키지 - 클라이언트 타입 정의
 */

import { AuthStatus, PlanType } from "@prisma/client";

export interface ClientFormData {
  clientId: string;
  clientName: string;
  email: string;
  phone?: string;
  metaAdAccountId?: string;
  metaAccessToken?: string;
  metaRefreshToken?: string;
  tokenExpiresAt?: string;
  servicePeriodStart?: string;
  servicePeriodEnd?: string;
  telegramChatId?: string;
  telegramEnabled?: boolean;
  planType?: PlanType;
  isActive?: boolean;
  memo?: string;
}

export interface ClientListItem {
  id: string;
  clientId: string;
  clientName: string;
  email: string;
  phone: string | null;
  metaAdAccountId: string | null;
  tokenExpiresAt: Date | null;
  authStatus: AuthStatus;
  planType: PlanType;
  isActive: boolean;
  telegramEnabled: boolean;
  servicePeriodEnd: Date | null;
  createdAt: Date;
}

export interface ClientDetail extends ClientListItem {
  metaAccessToken: string | null;
  metaRefreshToken: string | null;
  servicePeriodStart: Date | null;
  telegramChatId: string | null;
  memo: string | null;
  updatedAt: Date;
}

export interface ClientStats {
  total: number;
  active: number;
  tokenExpiring: number;
  authRequired: number;
  telegramEnabled: number;
}
