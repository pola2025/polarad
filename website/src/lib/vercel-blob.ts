/**
 * Vercel Blob 이미지 업로드 유틸리티
 * Instagram 자동화용 이미지 호스팅 (Cloudinary 대체)
 *
 * 특징:
 * - WebP 변환으로 용량 최적화 (10-30KB 목표)
 * - Vercel Pro 플랜 무료 할당량 내 사용
 */

import { put } from '@vercel/blob';
import sharp from 'sharp';

interface BlobUploadResult {
  success: boolean;
  url?: string;
  size?: number;
  error?: string;
}

/**
 * 이미지를 WebP로 변환 및 압축
 * Instagram 1080x1350 사이즈, 10-30KB 목표
 */
async function compressToWebP(
  buffer: Buffer,
  targetSizeKB: number = 30
): Promise<Buffer> {
  // 초기 품질 설정
  let quality = 80;
  let compressed = await sharp(buffer)
    .resize(1080, 1350, { fit: 'cover' })
    .webp({ quality })
    .toBuffer();

  // 목표 크기보다 크면 품질 낮춰서 재압축
  const targetBytes = targetSizeKB * 1024;

  while (compressed.length > targetBytes && quality > 20) {
    quality -= 10;
    compressed = await sharp(buffer)
      .resize(1080, 1350, { fit: 'cover' })
      .webp({ quality })
      .toBuffer();
  }

  console.log(
    `📦 WebP 압축 완료: ${(compressed.length / 1024).toFixed(1)}KB (품질: ${quality}%)`
  );

  return compressed;
}

/**
 * Buffer를 Vercel Blob에 업로드
 * @param buffer - 이미지 Buffer (PNG/JPEG)
 * @param folder - 저장 폴더명
 * @param filename - 파일명 (확장자 제외)
 */
export async function uploadToVercelBlob(
  buffer: Buffer,
  folder: string = 'instagram',
  filename?: string
): Promise<BlobUploadResult> {
  try {
    // WebP로 압축
    console.log('🔄 WebP 변환 중...');
    const webpBuffer = await compressToWebP(buffer, 30);

    // 파일명 생성
    const timestamp = Date.now();
    const name = filename || `image-${timestamp}`;
    const pathname = `${folder}/${name}.webp`;

    console.log(`☁️ Vercel Blob 업로드 중: ${pathname}`);

    // Vercel Blob 업로드
    const blob = await put(pathname, webpBuffer, {
      access: 'public',
      contentType: 'image/webp',
    });

    console.log(`✅ Vercel Blob 업로드 성공: ${blob.url}`);
    console.log(`   크기: ${(webpBuffer.length / 1024).toFixed(1)}KB`);

    return {
      success: true,
      url: blob.url,
      size: webpBuffer.length,
    };
  } catch (error) {
    console.error('❌ Vercel Blob 업로드 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Base64 이미지를 Vercel Blob에 업로드
 * @param base64Data - base64 인코딩된 이미지 (data:image/png;base64,... 형식)
 * @param folder - 저장 폴더명
 * @param filename - 파일명 (확장자 제외)
 */
export async function uploadBase64ToVercelBlob(
  base64Data: string,
  folder: string = 'instagram',
  filename?: string
): Promise<BlobUploadResult> {
  // Base64에서 Buffer로 변환
  const base64Content = base64Data.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Content, 'base64');

  return uploadToVercelBlob(buffer, folder, filename);
}
