/**
 * Content Studio 로그아웃 API
 * POST /api/content-studio/auth/logout
 */

import { NextResponse } from 'next/server';
import { clearTokenCookie } from '@/lib/content-studio';

export async function POST(): Promise<NextResponse> {
  const response = NextResponse.json({ success: true });
  response.headers.set('Set-Cookie', clearTokenCookie());
  return response;
}
