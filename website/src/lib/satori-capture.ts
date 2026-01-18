/**
 * Satori 기반 HTML → 이미지 변환
 * 외부 서비스 의존 없이 자체 캡처
 */

import satori, { type Font } from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { html } from 'satori-html';

// Satori 폰트 타입
type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

// 폰트 캐시 (한 번 로드 후 재사용)
let fontsCache: Font[] | null = null;

/**
 * 폰트 로드 (캐싱됨)
 */
async function loadFonts(): Promise<Font[]> {
  if (fontsCache) {
    return fontsCache;
  }

  console.log('📦 폰트 로딩 중...');
  const fonts: Font[] = [];

  const fontUrls: { url: string; weight: FontWeight }[] = [
    {
      url: 'https://github.com/orioncactus/pretendard/raw/main/packages/pretendard/dist/public/static/Pretendard-Bold.otf',
      weight: 700,
    },
    {
      url: 'https://github.com/orioncactus/pretendard/raw/main/packages/pretendard/dist/public/static/Pretendard-ExtraBold.otf',
      weight: 800,
    },
    {
      url: 'https://github.com/orioncactus/pretendard/raw/main/packages/pretendard/dist/public/static/Pretendard-SemiBold.otf',
      weight: 600,
    },
    {
      url: 'https://github.com/orioncactus/pretendard/raw/main/packages/pretendard/dist/public/static/Pretendard-Regular.otf',
      weight: 400,
    },
  ];

  for (const font of fontUrls) {
    try {
      const response = await fetch(font.url);
      if (response.ok) {
        const buffer = await response.arrayBuffer();
        fonts.push({
          name: 'Pretendard',
          data: Buffer.from(buffer),
          weight: font.weight,
          style: 'normal',
        });
      }
    } catch (error) {
      console.warn(`폰트 로드 실패 (weight: ${font.weight}):`, error);
    }
  }

  fontsCache = fonts;
  console.log(`✅ 폰트 로드 완료 (${fonts.length}개)`);
  return fonts;
}

/**
 * 이모지를 유니코드 코드포인트로 변환
 */
function getIconCode(emoji: string): string {
  const cleaned = emoji.replace(/\uFE0F/g, '');
  return [...cleaned]
    .map((char) => char.codePointAt(0)!.toString(16))
    .join('-');
}

/**
 * Twemoji SVG 로드
 */
async function loadTwemoji(code: string): Promise<string | null> {
  const url = `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${code}.svg`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      return await response.text();
    }
  } catch {
    // 실패 시 조용히 무시
  }
  return null;
}

/**
 * HTML을 PNG 이미지로 변환 (Satori + resvg-js)
 *
 * @param htmlContent - HTML 문자열
 * @param width - 이미지 너비 (기본: 1080)
 * @param height - 이미지 높이 (기본: 1350)
 * @returns PNG 버퍼 또는 null
 */
export async function captureHtmlWithSatori(
  htmlContent: string,
  width: number = 1080,
  height: number = 1350
): Promise<Buffer | null> {
  try {
    console.log('📸 Satori 캡처 시작...');
    const startTime = Date.now();

    // 1. 폰트 로드
    const fonts = await loadFonts();
    if (fonts.length === 0) {
      console.error('❌ 폰트 로드 실패');
      return null;
    }

    // 2. HTML → React 엘리먼트 변환 (satori-html VNode → satori ReactNode 타입 호환)
    const template = html(htmlContent) as Parameters<typeof satori>[0];

    // 3. SVG 생성
    const svg = await satori(template, {
      width,
      height,
      fonts,
      loadAdditionalAsset: async (code: string, segment: string): Promise<string | Font[]> => {
        if (code === 'emoji') {
          const iconCode = getIconCode(segment);
          const svgContent = await loadTwemoji(iconCode);
          if (svgContent) {
            return `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`;
          }
        }
        // 이모지를 찾지 못하면 빈 폰트 배열 반환 (기본 폴백)
        return [];
      },
    });

    // 4. SVG → PNG 변환
    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width', value: width },
    });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    const duration = Date.now() - startTime;
    console.log(`✅ Satori 캡처 완료: ${(pngBuffer.length / 1024).toFixed(1)}KB, ${duration}ms`);

    return pngBuffer;

  } catch (error) {
    console.error('❌ Satori 캡처 실패:', error);
    return null;
  }
}

/**
 * 폰트 캐시 초기화 (테스트용)
 */
export function clearFontCache() {
  fontsCache = null;
}
