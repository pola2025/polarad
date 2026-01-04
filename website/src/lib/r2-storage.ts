/**
 * Cloudflare R2 Storage 유틸리티
 * - 이미지 업로드
 * - 공개 URL 생성
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// R2 설정 (환경변수에 줄바꿈/공백이 포함되어 있을 수 있으므로 trim 처리)
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID?.trim();
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID?.trim();
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY?.trim();
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME?.trim() || 'pola-newsletter';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL?.trim(); // 커스텀 도메인 또는 r2.dev URL

// S3 클라이언트 생성 (lazy initialization)
let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3Client) {
    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
      throw new Error('R2 credentials not configured');
    }

    s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return s3Client;
}

/**
 * 이미지를 R2에 업로드
 * @param buffer 이미지 버퍼
 * @param filename 파일명 (예: "thumbnail-123.webp")
 * @param folder 폴더 경로 (예: "marketing-news")
 * @returns 공개 URL
 */
export async function uploadImageToR2(
  buffer: Buffer,
  filename: string,
  folder: string = 'marketing-news'
): Promise<string> {
  const client = getS3Client();

  const key = `${folder}/${filename}`;

  // Content-Type 결정
  const contentType = filename.endsWith('.webp')
    ? 'image/webp'
    : filename.endsWith('.png')
      ? 'image/png'
      : 'image/jpeg';

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000', // 1년 캐시
  });

  await client.send(command);

  console.log(`✅ R2 업로드 완료: ${key}`);

  // 공개 URL 반환
  if (R2_PUBLIC_URL) {
    return `${R2_PUBLIC_URL}/${key}`;
  }

  // 기본 R2.dev URL (퍼블릭 액세스 활성화 필요)
  return `https://pub-${R2_ACCOUNT_ID}.r2.dev/${key}`;
}

/**
 * R2 설정 확인
 */
export function isR2Configured(): boolean {
  return !!(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY);
}
