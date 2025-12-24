/**
 * 주제 아카이브 관리
 * Airtable "주제아카이브" 테이블과 연동
 */

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const TOPIC_ARCHIVE_TABLE = '주제아카이브';

type CategoryKey = 'meta-ads' | 'instagram-reels' | 'threads' | 'faq' | 'ai-tips' | 'ai-news';

interface TopicArchiveRecord {
  id: string;
  fields: {
    title: string;
    category: CategoryKey;
    used?: boolean;
    usedAt?: string;
    createdAt?: string;
  };
}

interface AirtableListResponse {
  records: TopicArchiveRecord[];
  offset?: string;
}

/**
 * 카테고리별 미사용 주제 개수 조회
 */
export async function getUnusedTopicCount(category: CategoryKey): Promise<number> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.warn('[TopicArchive] API credentials not configured');
    return 0;
  }

  const filterFormula = `AND({category}='${category}', NOT({used}))`;
  const params = new URLSearchParams({
    filterByFormula: filterFormula,
    'fields[]': 'title', // 최소 필드만 요청
  });

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TOPIC_ARCHIVE_TABLE)}?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('[TopicArchive] Count API error:', res.status);
      return 0;
    }

    const data: AirtableListResponse = await res.json();
    return data.records.length;
  } catch (error) {
    console.error('[TopicArchive] Count fetch error:', error);
    return 0;
  }
}

/**
 * 모든 카테고리의 미사용 주제 개수 조회
 */
export async function getAllUnusedTopicCounts(): Promise<Record<CategoryKey, number>> {
  const categories: CategoryKey[] = ['meta-ads', 'instagram-reels', 'threads', 'faq', 'ai-tips', 'ai-news'];
  const counts: Record<CategoryKey, number> = {
    'meta-ads': 0,
    'instagram-reels': 0,
    'threads': 0,
    'faq': 0,
    'ai-tips': 0,
    'ai-news': 0,
  };

  await Promise.all(
    categories.map(async (category) => {
      counts[category] = await getUnusedTopicCount(category);
    })
  );

  return counts;
}

/**
 * 미사용 주제 가져오기 (가장 오래된 것 우선)
 */
export async function getUnusedTopic(category: CategoryKey): Promise<string | null> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.warn('[TopicArchive] API credentials not configured');
    return null;
  }

  const filterFormula = `AND({category}='${category}', NOT({used}))`;
  const params = new URLSearchParams({
    filterByFormula: filterFormula,
    'sort[0][field]': 'createdAt',
    'sort[0][direction]': 'asc',
    maxRecords: '1',
  });

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TOPIC_ARCHIVE_TABLE)}?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('[TopicArchive] Get topic API error:', res.status);
      return null;
    }

    const data: AirtableListResponse = await res.json();

    if (data.records.length === 0) {
      console.warn(`[TopicArchive] No unused topics for category: ${category}`);
      return null;
    }

    const record = data.records[0];
    const title = record.fields.title;

    // 사용됨으로 마킹
    await markTopicAsUsed(record.id);

    console.log(`[TopicArchive] Retrieved topic: "${title}" (category: ${category})`);
    return title;
  } catch (error) {
    console.error('[TopicArchive] Get topic fetch error:', error);
    return null;
  }
}

/**
 * 주제를 사용됨으로 마킹
 */
async function markTopicAsUsed(recordId: string): Promise<boolean> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    return false;
  }

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TOPIC_ARCHIVE_TABLE)}/${recordId}`;

  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          used: true,
          usedAt: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        },
      }),
    });

    if (!res.ok) {
      console.error('[TopicArchive] Mark used API error:', res.status);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[TopicArchive] Mark used fetch error:', error);
    return false;
  }
}

/**
 * 새 주제 추가 (대량 생성용)
 */
export async function addTopicsToArchive(
  topics: Array<{ title: string; category: CategoryKey }>
): Promise<{ success: number; failed: number }> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.warn('[TopicArchive] API credentials not configured');
    return { success: 0, failed: topics.length };
  }

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TOPIC_ARCHIVE_TABLE)}`;

  let success = 0;
  let failed = 0;

  // Airtable는 한 번에 10개까지만 생성 가능
  const batches = [];
  for (let i = 0; i < topics.length; i += 10) {
    batches.push(topics.slice(i, i + 10));
  }

  for (const batch of batches) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          records: batch.map((topic) => ({
            fields: {
              title: topic.title,
              category: topic.category,
              used: false,
            },
          })),
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('[TopicArchive] Add topics API error:', res.status, errorText);
        failed += batch.length;
      } else {
        const result = await res.json();
        success += result.records.length;
      }

      // Rate limit 방지: 배치 간 500ms 대기
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error('[TopicArchive] Add topics fetch error:', error);
      failed += batch.length;
    }
  }

  return { success, failed };
}

/**
 * 특정 카테고리에 이미 존재하는 주제인지 체크
 */
export async function topicExists(title: string, category: CategoryKey): Promise<boolean> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    return false;
  }

  // 제목에서 특수문자 이스케이프
  const escapedTitle = title.replace(/'/g, "\\'");
  const filterFormula = `AND({category}='${category}', {title}='${escapedTitle}')`;
  const params = new URLSearchParams({
    filterByFormula: filterFormula,
    maxRecords: '1',
  });

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TOPIC_ARCHIVE_TABLE)}?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
      cache: 'no-store',
    });

    if (!res.ok) {
      return false;
    }

    const data: AirtableListResponse = await res.json();
    return data.records.length > 0;
  } catch (error) {
    console.error('[TopicArchive] Check exists error:', error);
    return false;
  }
}
