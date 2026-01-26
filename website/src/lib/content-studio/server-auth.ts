/**
 * Content Studio 서버 컴포넌트용 인증 헬퍼
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken, getClientById } from './index';
import type { AirtableClient, JWTPayload } from './types';

/**
 * 서버 컴포넌트에서 인증 확인
 * 인증되지 않으면 로그인 페이지로 리다이렉트
 */
export async function requireAuth(): Promise<{
  payload: JWTPayload;
  client: AirtableClient;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get('cs_token')?.value;

  if (!token) {
    redirect('/content-studio/login');
  }

  const payload = await verifyToken(token);

  if (!payload) {
    redirect('/content-studio/login');
  }

  const client = await getClientById(payload.clientId);

  if (!client || client.status === 'suspended') {
    redirect('/content-studio/login');
  }

  return { payload, client };
}

/**
 * 서버 컴포넌트에서 인증 확인 (선택적)
 * 인증되지 않아도 에러 없음
 */
export async function getAuth(): Promise<{
  payload: JWTPayload | null;
  client: AirtableClient | null;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get('cs_token')?.value;

  if (!token) {
    return { payload: null, client: null };
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return { payload: null, client: null };
  }

  const client = await getClientById(payload.clientId);

  if (!client || client.status === 'suspended') {
    return { payload: null, client: null };
  }

  return { payload, client };
}

/**
 * 이미 로그인되어 있으면 대시보드로 리다이렉트
 */
export async function redirectIfAuthenticated(): Promise<void> {
  const { payload } = await getAuth();

  if (payload) {
    redirect('/content-studio');
  }
}
