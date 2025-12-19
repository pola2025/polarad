/**
 * Cloudinary 이미지 업로드 유틸리티
 * Instagram 자동화용 이미지 호스팅
 */

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

interface CloudinaryUploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

/**
 * Base64 이미지를 Cloudinary에 업로드
 * @param base64Data - base64 인코딩된 이미지 데이터 (data:image/png;base64,... 형식)
 * @param folder - 저장할 폴더명
 * @param publicId - 파일명 (선택)
 */
export async function uploadToCloudinary(
  base64Data: string,
  folder: string = 'instagram',
  publicId?: string
): Promise<CloudinaryUploadResult> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return {
      success: false,
      error: 'Cloudinary 환경변수가 설정되지 않았습니다',
    };
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const uploadPreset = 'ml_default'; // Cloudinary 기본 preset

    // 서명 생성을 위한 파라미터
    const params: Record<string, string> = {
      folder,
      timestamp: timestamp.toString(),
    };

    if (publicId) {
      params.public_id = publicId;
    }

    // 서명 생성 (알파벳 순서로 정렬)
    const signature = await generateSignature(params);

    // FormData 생성
    const formData = new FormData();
    formData.append('file', base64Data);
    formData.append('api_key', CLOUDINARY_API_KEY);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('folder', folder);

    if (publicId) {
      formData.append('public_id', publicId);
    }

    // Cloudinary 업로드 API 호출
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json();

    if (result.error) {
      console.error('Cloudinary 업로드 실패:', result.error);
      return {
        success: false,
        error: result.error.message || 'Upload failed',
      };
    }

    console.log('✅ Cloudinary 업로드 성공:', result.secure_url);

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary 업로드 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Buffer를 Cloudinary에 업로드
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string = 'instagram',
  publicId?: string
): Promise<CloudinaryUploadResult> {
  // Buffer를 base64로 변환
  const base64Data = `data:image/png;base64,${buffer.toString('base64')}`;
  return uploadToCloudinary(base64Data, folder, publicId);
}

/**
 * Cloudinary 서명 생성
 */
async function generateSignature(params: Record<string, string>): Promise<string> {
  // 파라미터를 알파벳 순으로 정렬하여 문자열 생성
  const sortedKeys = Object.keys(params).sort();
  const paramString = sortedKeys
    .map((key) => `${key}=${params[key]}`)
    .join('&');

  // API Secret 추가
  const stringToSign = paramString + CLOUDINARY_API_SECRET;

  // SHA-1 해시 생성
  const encoder = new TextEncoder();
  const data = encoder.encode(stringToSign);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

/**
 * 이미지 URL 최적화 (Cloudinary 변환)
 * Instagram용 1080x1350 크롭
 */
export function getOptimizedUrl(publicId: string, options?: {
  width?: number;
  height?: number;
  crop?: string;
  format?: string;
}): string {
  const { width = 1080, height = 1350, crop = 'fill', format = 'jpg' } = options || {};

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/w_${width},h_${height},c_${crop},f_${format}/${publicId}`;
}
