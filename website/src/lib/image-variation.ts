/**
 * 이미지 베리에이션 시스템
 * - 중복 이미지 방지를 위한 프롬프트 베리에이션
 * - 기존 이미지와의 유사도 검사
 */

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// 베리에이션 요소 풀
export const VARIATION_POOL = {
  // 인원 구성
  people: [
    '30대 한국인 여성 마케터 1명',
    '30대 한국인 남성 마케터 1명',
    '20대 한국인 여성과 30대 남성 2명',
    '30대 한국인 남녀 혼성 3명 팀',
    '20~30대 한국인 4명 팀 회의',
    '40대 한국인 남성 팀장과 20대 여성 직원',
    '20대 한국인 여성 2명',
  ],

  // 장소
  location: [
    '밝은 자연광이 들어오는 모던한 오피스',
    '통유리창이 있는 회의실',
    '아늑한 카페 창가 자리',
    '미니멀한 공유 오피스 공간',
    '세련된 스타트업 사무실',
    '화이트 인테리어의 깔끔한 사무실',
    '도시 전경이 보이는 고층 오피스',
  ],

  // 활동/상황
  activity: [
    '노트북으로 데이터 분석하는 모습',
    '태블릿으로 SNS 피드 확인하는 모습',
    '대형 모니터 앞에서 광고 성과 분석하는 모습',
    '화이트보드에 마케팅 전략 논의하는 모습',
    '스마트폰으로 인스타그램 확인하는 모습',
    '노트북과 커피와 함께 집중하는 모습',
    '팀원들과 화면을 보며 토론하는 모습',
  ],

  // 앵글/구도
  angle: [
    '정면에서 촬영',
    '약간 측면(45도)에서 촬영',
    '어깨 너머로 화면이 보이게 촬영',
    '위에서 약간 내려다보는 앵글',
    '테이블 위 기기들과 함께 촬영',
  ],

  // 분위기
  mood: [
    '밝고 활기찬 분위기',
    '집중하는 진지한 분위기',
    '편안하고 캐주얼한 분위기',
    '전문적이고 비즈니스적인 분위기',
    '협업하는 에너지 넘치는 분위기',
  ],

  // 소품/디테일
  props: [
    '맥북과 아이패드',
    '커피잔과 노트',
    '큰 모니터 2대',
    '포스트잇과 화이트보드',
    '스마트폰과 노트북',
    '회의 테이블 위 노트북들',
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

// 하이브리드 이미지 프롬프트 생성 (한국인 + 맥락)
export function buildImagePrompt(title: string, variation: VariationCombo): string {
  return `Create a photorealistic 1024x1024 stock photo for a Korean digital marketing blog.

**Subject**: ${variation.people}
**Setting**: ${variation.location}
**Action**: ${variation.activity}
**Camera angle**: ${variation.angle}
**Atmosphere**: ${variation.mood}
**Props visible**: ${variation.props}

**Article context**: "${title}"

**STRICT REQUIREMENTS**:
- Real Korean people (NOT Western, NOT anime/illustration)
- Professional business/marketing context
- Modern, clean, bright environment
- Natural lighting, high quality photography
- ABSOLUTELY NO TEXT, letters, numbers, watermarks, logos, UI elements
- NO abstract shapes, NO geometric patterns
- Photorealistic stock photo style like Shutterstock/Getty Images`;
}

// 특정 슬러그용 시드 기반 프롬프트 (재생성 시 일관성)
export function buildSeededImagePrompt(title: string, slug: string): string {
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

  return buildImagePrompt(title, variation);
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
