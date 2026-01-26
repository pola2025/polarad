/**
 * Content Studio 인증 시스템
 * JWT 기반 인증 처리
 */

import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import type { JWTPayload } from './types';

// 환경변수
const JWT_SECRET = process.env.CONTENT_STUDIO_JWT_SECRET || 'default-secret-change-me';
const JWT_EXPIRES_IN = '7d';  // 7일

// TextEncoder for jose
const secretKey = new TextEncoder().encode(JWT_SECRET);

/**
 * 비밀번호 해싱
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * 비밀번호 검증
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * JWT 토큰 생성
 */
export async function createToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  const token = await new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secretKey);

  return token;
}

/**
 * JWT 토큰 검증 및 디코딩
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * 쿠키에서 토큰 추출
 */
export function extractTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').reduce(
    (acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>
  );

  return cookies['cs_token'] || null;
}

/**
 * Authorization 헤더에서 토큰 추출
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) return null;

  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  return null;
}

/**
 * 토큰 쿠키 설정 문자열 생성
 */
export function createTokenCookie(token: string): string {
  const maxAge = 7 * 24 * 60 * 60; // 7일 (초)
  return `cs_token=${token}; Path=/content-studio; HttpOnly; SameSite=Strict; Max-Age=${maxAge}`;
}

/**
 * 토큰 쿠키 삭제 문자열 생성
 */
export function clearTokenCookie(): string {
  return 'cs_token=; Path=/content-studio; HttpOnly; SameSite=Strict; Max-Age=0';
}
