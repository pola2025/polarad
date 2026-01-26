/**
 * Cloudflare R2 Storage 유틸리티
 * - 이미지 업로드
 * - 공개 URL 생성
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

// R2 설정 (환경변수에 줄바꿈/공백/특수문자가 포함되어 있을 수 있으므로 정리)
// trim()만으로는 줄바꿈(\r\n)이 제거되지 않을 수 있음
const cleanEnvVar = (value: string | undefined): string | undefined => {
  if (!value) return undefined;
  // 모든 종류의 공백, 줄바꿈, 캐리지 리턴 제거
  return value.replace(/[\s\r\n]+/g, '').trim();
};

const R2_ACCOUNT_ID = cleanEnvVar(process.env.R2_ACCOUNT_ID);
const R2_ACCESS_KEY_ID = cleanEnvVar(process.env.R2_ACCESS_KEY_ID);
const R2_SECRET_ACCESS_KEY = cleanEnvVar(process.env.R2_SECRET_ACCESS_KEY);
const R2_BUCKET_NAME = cleanEnvVar(process.env.R2_BUCKET_NAME) || 'pola-newsletter';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL?.trim(); // URL은 공백만 제거 (슬래시 등 유지)

// S3 클라이언트 생성 (lazy initialization)
let s3Client: S3Client | null = null;



/**
 * 이미지를 WebP로 변환 및 압축
 * Instagram 1080x1350 사이즈, 10-30KB 목표
 */
async function compressToWebP(
  buffer: Buffer,
  targetSizeKB: number = 30
): Promise<Buffer> {
  let quality = 80;
  let compressed = await sharp(buffer)
    .resize(1080, 1350, { fit: 'cover' })
    .webp({ quality })
    .toBuffer();

  const targetBytes = targetSizeKB * 1024;

  while (compressed.length > targetBytes && quality > 20) {
    quality -= 10;
    compressed = await sharp(buffer)
      .resize(1080, 1350, { fit: 'cover' })
      .webp({ quality })
      .toBuffer();
  }

  console.log(`📦 WebP 압축 완료: ${(compressed.length / 1024).toFixed(1)}KB (품질: ${quality}%)`);

  return compressed;
}

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
 * Instagram용 이미지 업로드 (WebP 압축 포함)
 * Cloudinary 대체용
 */
export async function uploadInstagramImageToR2(
  buffer: Buffer,
  filename: string
): Promise<{ success: boolean; url?: string; size?: number; error?: string }> {
  try {
    console.log('🔄 WebP 변환 중...');
    const webpBuffer = await compressToWebP(buffer, 30);

    const webpFilename = `${filename}.webp`;
    const url = await uploadImageToR2(webpBuffer, webpFilename, 'instagram/polamkt');

    console.log(`✅ Instagram 이미지 업로드 완료: ${url}`);
    console.log(`   크기: ${(webpBuffer.length / 1024).toFixed(1)}KB`);

    return {
      success: true,
      url,
      size: webpBuffer.length,
    };
  } catch (error) {
    console.error('❌ Instagram 이미지 업로드 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * R2 설정 확인
 */
export function isR2Configured(): boolean {
  return !!(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY);
}
