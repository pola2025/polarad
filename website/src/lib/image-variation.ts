/**
 * 이미지 베리에이션 시스템
 * - 중복 이미지 방지를 위한 프롬프트 베리에이션
 * - 기존 이미지와의 유사도 검사
 */

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// 베리에이션 요소 풀 (영어 프롬프트 - Gemini 이미지 생성 호환)
export const VARIATION_POOL = {
  // 인원 구성
  people: [
    'one female marketing professional in her 30s',
    'one male marketing professional in his 30s',
    'two professionals, a woman in her 20s and a man in his 30s',
    'a mixed team of 3 professionals in their 30s',
    'a team of 4 professionals in their 20s-30s in a meeting',
    'a male team leader in his 40s with a female staff member in her 20s',
    'two female professionals in their 20s',
  ],

  // 장소
  location: [
    'a modern office with bright natural lighting',
    'a conference room with floor-to-ceiling glass windows',
    'a cozy cafe window seat',
    'a minimalist co-working space',
    'a stylish startup office',
    'a clean office with white interior design',
    'a high-rise office with city skyline view',
  ],

  // 활동/상황
  activity: [
    'analyzing data on a laptop',
    'checking social media feed on a tablet',
    'reviewing ad performance metrics on a large monitor',
    'discussing marketing strategy on a whiteboard',
    'checking Instagram on a smartphone',
    'focusing on work with a laptop and coffee',
    'having a discussion while looking at screens together',
  ],

  // 앵글/구도
  angle: [
    'shot from the front',
    'shot from a slight side angle (45 degrees)',
    'over-the-shoulder shot showing the screen',
    'slightly elevated angle looking down',
    'shot including devices on the table',
  ],

  // 분위기
  mood: [
    'bright and energetic atmosphere',
    'focused and serious atmosphere',
    'relaxed and casual atmosphere',
    'professional business atmosphere',
    'collaborative and dynamic atmosphere',
  ],

  // 소품/디테일
  props: [
    'MacBook and iPad',
    'coffee cup and notebook',
    'two large monitors',
    'post-it notes and whiteboard',
    'smartphone and laptop',
    'laptops on a meeting table',
  ],
} as const;

// 사용된 조합 추적용 인터페이스
export interface VariationCombo {
  people: string;
  location: string;
  activity: string;
  angle: string;
  mood: string;
  props: string;
}

// 기존 이미지들의 조합 기록 파일 경로
// Vercel 서버리스 환경에서는 /tmp만 쓰기 가능
const isVercel = process.env.VERCEL === '1';
const USED_COMBOS_PATH = isVercel
  ? '/tmp/used-image-combos.json'
  : path.join(process.cwd(), 'src', 'lib', 'used-image-combos.json');

// 사용된 조합 로드
export async function loadUsedCombos(): Promise<VariationCombo[]> {
  try {
    const data = await fs.readFile(USED_COMBOS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// 사용된 조합 저장
export async function saveUsedCombo(combo: VariationCombo): Promise<void> {
  const combos = await loadUsedCombos();
  combos.push(combo);

  // 최근 50개만 유지 (오래된 것은 재사용 가능)
  const recentCombos = combos.slice(-50);
  await fs.writeFile(USED_COMBOS_PATH, JSON.stringify(recentCombos, null, 2));
}

// 랜덤 선택 함수
function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 조합의 해시 생성 (유사도 비교용)
function getComboHash(combo: VariationCombo): string {
  const str = `${combo.people}|${combo.location}|${combo.activity}`;
  return crypto.createHash('md5').update(str).digest('hex').slice(0, 8);
}

// 새로운 유니크 조합 생성
export async function generateUniqueVariation(): Promise<VariationCombo> {
  const usedCombos = await loadUsedCombos();
  const usedHashes = new Set(usedCombos.map(getComboHash));

  let attempts = 0;
  const maxAttempts = 20;

  while (attempts < maxAttempts) {
    const combo: VariationCombo = {
      people: pickRandom(VARIATION_POOL.people),
      location: pickRandom(VARIATION_POOL.location),
      activity: pickRandom(VARIATION_POOL.activity),
      angle: pickRandom(VARIATION_POOL.angle),
      mood: pickRandom(VARIATION_POOL.mood),
      props: pickRandom(VARIATION_POOL.props),
    };

    const hash = getComboHash(combo);

    // 중복 아니면 반환
    if (!usedHashes.has(hash)) {
      return combo;
    }

    attempts++;
  }

  // 최대 시도 후에도 유니크하지 않으면 그냥 새 조합 반환
  return {
    people: pickRandom(VARIATION_POOL.people),
    location: pickRandom(VARIATION_POOL.location),
    activity: pickRandom(VARIATION_POOL.activity),
    angle: pickRandom(VARIATION_POOL.angle),
    mood: pickRandom(VARIATION_POOL.mood),
    props: pickRandom(VARIATION_POOL.props),
  };
}

// 하이브리드 이미지 프롬프트 생성 (영어 프롬프트)
export function buildImagePrompt(title: string, variation: VariationCombo): string {
  return `Create a photorealistic 1200x630 professional stock photo.

Subject: ${variation.people}
Setting: ${variation.location}
Action: ${variation.activity}
Camera: ${variation.angle}
Mood: ${variation.mood}
Props: ${variation.props}

Style requirements:
- Professional business/marketing context
- Modern, clean, bright environment
- Natural lighting, high quality photography
- NO text, letters, numbers, watermarks, logos
- NO abstract shapes or geometric patterns
- Photorealistic stock photo style
- Landscape orientation (1200x630)`;
}

// 특정 슬러그용 시드 기반 프롬프트 (재생성 시 일관성)
export function buildSeededImagePrompt(slug: string): string {
  // slug를 시드로 사용해 동일 글은 항상 같은 베리에이션 선택
  const hash = crypto.createHash('md5').update(slug).digest('hex');

  const getIndex = (offset: number, max: number) => {
    const num = parseInt(hash.slice(offset, offset + 2), 16);
    return num % max;
  };

  const variation: VariationCombo = {
    people: VARIATION_POOL.people[getIndex(0, VARIATION_POOL.people.length)],
    location: VARIATION_POOL.location[getIndex(2, VARIATION_POOL.location.length)],
    activity: VARIATION_POOL.activity[getIndex(4, VARIATION_POOL.activity.length)],
    angle: VARIATION_POOL.angle[getIndex(6, VARIATION_POOL.angle.length)],
    mood: VARIATION_POOL.mood[getIndex(8, VARIATION_POOL.mood.length)],
    props: VARIATION_POOL.props[getIndex(10, VARIATION_POOL.props.length)],
  };

  return buildImagePrompt('', variation);
}

// 기존 이미지 해시 계산 (간단한 perceptual hash 대용)
export async function getImageFingerprint(imagePath: string): Promise<string | null> {
  try {
    const buffer = await fs.readFile(imagePath);
    // 파일 크기 + 처음/중간/끝 바이트 조합으로 간단한 fingerprint
    const size = buffer.length;
    const sample = Buffer.concat([
      buffer.slice(0, 100),
      buffer.slice(Math.floor(size / 2), Math.floor(size / 2) + 100),
      buffer.slice(-100)
    ]);
    return crypto.createHash('md5').update(sample).digest('hex');
  } catch {
    return null;
  }
}

// 이미지 중복 검사
export async function checkImageDuplicate(
  newImageBuffer: Buffer,
  existingImagesDir: string
): Promise<{ isDuplicate: boolean; matchedFile?: string }> {
  try {
    const files = await fs.readdir(existingImagesDir);
    const imageFiles = files.filter(f => /\.(webp|png|jpg|jpeg)$/i.test(f));

    // 새 이미지의 fingerprint
    const size = newImageBuffer.length;
    const newSample = Buffer.concat([
      newImageBuffer.slice(0, 100),
      newImageBuffer.slice(Math.floor(size / 2), Math.floor(size / 2) + 100),
      newImageBuffer.slice(-100)
    ]);
    const newHash = crypto.createHash('md5').update(newSample).digest('hex');

    for (const file of imageFiles) {
      const filePath = path.join(existingImagesDir, file);
      const existingHash = await getImageFingerprint(filePath);

      if (existingHash === newHash) {
        return { isDuplicate: true, matchedFile: file };
      }
    }

    return { isDuplicate: false };
  } catch {
    return { isDuplicate: false };
  }
}
