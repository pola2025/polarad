/**
 * Threads Publishing API 유틸리티
 * Meta Threads API를 사용하여 자동 게시
 *
 * 환경변수:
 * - THREADS_ACCESS_TOKEN: Threads/Meta 액세스 토큰
 * - THREADS_USER_ID: Threads 사용자 ID
 */

const THREADS_ACCESS_TOKEN = process.env.THREADS_ACCESS_TOKEN;
const THREADS_USER_ID = process.env.THREADS_USER_ID;
const THREADS_API_BASE = "https://graph.threads.net/v1.0";

export interface ThreadsPostResult {
  success: boolean;
  postId?: string;
  permalink?: string;
  replyId?: string;
  error?: string;
  step?: string;
}

export interface ThreadsEpisode {
  number: number;
  season: number;
  title: string;
  body: string;
  selfComment: string;
  hashtags: string[];
}

/**
 * Threads API 설정 확인
 */
export function isThreadsConfigured(): boolean {
  return !!(THREADS_ACCESS_TOKEN && THREADS_USER_ID);
}

/**
 * Threads에 텍스트 게시물 생성
 * 1단계: 미디어 컨테이너 생성
 * 2단계: 게시
 */
export async function publishToThreads(
  text: string,
): Promise<ThreadsPostResult> {
  if (!THREADS_ACCESS_TOKEN || !THREADS_USER_ID) {
    return {
      success: false,
      error: "THREADS_ACCESS_TOKEN 또는 THREADS_USER_ID 미설정",
      step: "config",
    };
  }

  try {
    // 1단계: 텍스트 컨테이너 생성
    console.log("🧵 Threads 컨테이너 생성 중...");
    const containerRes = await fetch(
      `${THREADS_API_BASE}/${THREADS_USER_ID}/threads`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          media_type: "TEXT",
          text,
          access_token: THREADS_ACCESS_TOKEN,
        }),
      },
    );

    const containerData = await containerRes.json();
    if (containerData.error) {
      return {
        success: false,
        error: `컨테이너 생성 실패: ${containerData.error.message} (code: ${containerData.error.code}, subcode: ${containerData.error.error_subcode || "N/A"})`,
        step: "container",
      };
    }

    const containerId = containerData.id;
    console.log(`✅ 컨테이너 생성: ${containerId}`);

    // 컨테이너 준비 대기
    await waitForThreadsContainer(containerId);

    // 2단계: 게시
    console.log("📤 Threads 게시 중...");
    const publishRes = await fetch(
      `${THREADS_API_BASE}/${THREADS_USER_ID}/threads_publish`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creation_id: containerId,
          access_token: THREADS_ACCESS_TOKEN,
        }),
      },
    );

    const publishData = await publishRes.json();
    if (publishData.error) {
      return {
        success: false,
        error: `게시 실패: ${publishData.error.message} (code: ${publishData.error.code})`,
        step: "publish",
      };
    }

    const postId = publishData.id;
    console.log(`✅ Threads 게시 완료: ${postId}`);

    // 퍼머링크 조회
    const permalink = await getThreadsPermalink(postId);

    return { success: true, postId, permalink };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      step: "network",
    };
  }
}

/**
 * Threads 셀프 댓글(답글) 게시
 */
export async function replyToThread(
  parentPostId: string,
  text: string,
): Promise<ThreadsPostResult> {
  if (!THREADS_ACCESS_TOKEN || !THREADS_USER_ID) {
    return { success: false, error: "Threads 미설정", step: "config" };
  }

  try {
    // 1단계: 답글 컨테이너 생성
    console.log("💬 Threads 셀프댓글 컨테이너 생성 중...");
    const containerRes = await fetch(
      `${THREADS_API_BASE}/${THREADS_USER_ID}/threads`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          media_type: "TEXT",
          text,
          reply_to_id: parentPostId,
          access_token: THREADS_ACCESS_TOKEN,
        }),
      },
    );

    const containerData = await containerRes.json();
    if (containerData.error) {
      return {
        success: false,
        error: `답글 컨테이너 실패: ${containerData.error.message}`,
        step: "reply_container",
      };
    }

    const containerId = containerData.id;
    await waitForThreadsContainer(containerId);

    // 2단계: 답글 게시
    console.log("📤 셀프댓글 게시 중...");
    const publishRes = await fetch(
      `${THREADS_API_BASE}/${THREADS_USER_ID}/threads_publish`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creation_id: containerId,
          access_token: THREADS_ACCESS_TOKEN,
        }),
      },
    );

    const publishData = await publishRes.json();
    if (publishData.error) {
      return {
        success: false,
        error: `답글 게시 실패: ${publishData.error.message}`,
        step: "reply_publish",
      };
    }

    console.log(`✅ 셀프댓글 게시 완료: ${publishData.id}`);
    return { success: true, replyId: publishData.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      step: "reply_network",
    };
  }
}

/**
 * 컨테이너 준비 대기 (최대 30초)
 */
async function waitForThreadsContainer(
  containerId: string,
  maxAttempts = 15,
): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(
      `${THREADS_API_BASE}/${containerId}?fields=status&access_token=${THREADS_ACCESS_TOKEN}`,
    );
    const data = await res.json();

    if (data.status === "FINISHED") return;
    if (data.status === "ERROR") {
      throw new Error(`Threads 컨테이너 처리 실패: ${JSON.stringify(data)}`);
    }

    // 2초 대기
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw new Error("Threads 컨테이너 처리 타임아웃 (30초)");
}

/**
 * 퍼머링크 조회
 */
async function getThreadsPermalink(
  postId: string,
): Promise<string | undefined> {
  try {
    const res = await fetch(
      `${THREADS_API_BASE}/${postId}?fields=permalink&access_token=${THREADS_ACCESS_TOKEN}`,
    );
    const data = await res.json();
    return data.permalink;
  } catch {
    return undefined;
  }
}

/**
 * 시즌1 에피소드 데이터
 * docs/threads-season1-drafts.md 기반
 */
export const SEASON1_EPISODES: ThreadsEpisode[] = [
  {
    number: 1,
    season: 1,
    title: "바이럴이 뭔지도 모르고 시작했다",
    body: `17년차 마케터 ep.1

2009년, 바이럴마케팅이라는 단어가 생소하던 시절에 이 업을 시작했다.

솔직히 그때 내가 뭘 알았겠어. 블로그 글 쓰는 게 일의 80% 이상이었고 나머지는 카페 글, 지식인 답변. 지금 생각하면 단순한 작업인데 그때는 그게 "온라인마케팅"의 전부였어.

근데 신기한 게 그 단순한 작업이 진짜 효과가 있었다는 거지. 검색하면 우리가 쓴 글이 1페이지에 깔리고, 전화가 오고, 매출이 올랐어. 클라이언트가 좋아하니까 나도 재밌었고.

그렇게 시작이었다.

#온라인마케팅 #마케터일상 #폴라애드`,
    selfComment: `지금 돌아보면 그때가 온라인마케팅의 골드러시 같은 시기였어. 블로그 하나 잘 쓰면 진짜 매출이 바뀌던 시절.

요즘은 채널도 많고 알고리즘도 복잡하고 광고비도 올랐지만, 본질은 그때나 지금이나 같더라구. 고객이 검색하거나 스크롤할 때 우리 콘텐츠가 거기 있느냐 없느냐.

17년 하면서 도구는 계속 바뀌었는데 이 원리 하나는 안 바뀌었어. 다음 편에서는 이름만 대면 아는 그 브랜드 이야기 해볼게.`,
    hashtags: ["#온라인마케팅", "#마케터일상", "#폴라애드"],
  },
  {
    number: 2,
    season: 1,
    title: "이름만 대면 아는 그 가발업체",
    body: `17년차 마케터 ep.2

바이럴 시작하고 얼마 안 돼서 꽤 큰 클라이언트를 맡게 됐다. 이름만 대면 다 아는 가발업체, 쇼핑몰, 병원들.

처음에 브랜드 이름 듣고 솔직히 긴장했지. 이런 데가 우리한테 맡긴다고? 근데 막상 해보니까 큰 브랜드나 작은 브랜드나 원하는 건 똑같았어. "검색했을 때 좋은 얘기가 보이게 해주세요."

그래서 미친 듯이 글을 썼다. 블로그, 카페, 지식인. 하루에 몇 개씩 올리면서 키워드 잡고 상위노출 만들고. 그때 체력으로 밀어붙이는 법을 배웠어.

#온라인마케팅 #바이럴마케팅 #폴라애드`,
    selfComment: `큰 브랜드 할 때 배운 게 하나 있는데, 브랜드가 크다고 마케팅이 쉬운 게 아니라는 거야. 오히려 신경 쓸 게 더 많아. 톤앤매너 맞춰야지, 경쟁사 모니터링 해야지, 부정적 키워드 관리해야지.

근데 이 경험이 나중에 엄청 도움이 됐어. 작은 업체 할 때도 큰 브랜드 하듯이 체계적으로 접근하니까 결과가 달랐거든.

시작은 블로그 글쓰기였는데 그 안에서 마케팅의 기본기를 전부 배운 셈이지. 다음 편은 판이 완전히 바뀐 이야기.`,
    hashtags: ["#온라인마케팅", "#바이럴마케팅", "#폴라애드"],
  },
  {
    number: 3,
    season: 1,
    title: "성형외과에 들어가면서 판이 바뀌었다",
    body: `17년차 마케터 ep.3

2011년, 성형외과 마케팅에 진입했다. 이때부터 진짜 "마케팅"을 하기 시작한 거 같아.

그전까지는 바이럴, 그러니까 블로그 글 깔아주는 게 메인이었는데 성형외과는 달랐어. 블로그만으로 안 됐거든. 홈페이지, 이벤트 기획, 상담 동선 설계, 광고 세팅까지 전체를 핸들링해야 했어.

처음엔 이걸 어떻게 하나 싶었는데 하다 보니까 이게 진짜 마케팅이더라구. 부분이 아니라 전체를 보는 눈이 이때 생겼어. 한 채널만 잘한다고 되는 게 아니라 전체 흐름이 맞아야 환자가 온다는 걸 몸으로 배운 시기.

#온라인마케팅 #의료마케팅 #폴라애드`,
    selfComment: `성형외과 마케팅이 빡센 이유가 있어. 일단 경쟁이 미쳤고, 의료법 때문에 할 수 있는 표현이 제한적이야. "전후사진 이렇게 올리면 안 됩니다" "이 문구 심의 걸립니다" 이런 거 매일 체크하면서 했거든.

근데 이 제약 속에서 마케팅하는 법을 배우니까 다른 업종은 오히려 쉬웠어. 할 수 있는 게 훨씬 많으니까. 제약이 있는 환경에서 훈련하면 자유로운 환경에서 더 잘하게 되더라구.

지금 인테리어 업종 마케팅하면서도 이때 배운 게 계속 쓰이고 있어. 다음 편은 에이전시 대대행의 세계 이야기.`,
    hashtags: ["#온라인마케팅", "#의료마케팅", "#폴라애드"],
  },
];

/**
 * Airtable 설정 테이블에서 현재 에피소드 인덱스 조회
 */
export async function getCurrentEpisodeIndex(): Promise<number> {
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.log("⚠️ Airtable 미설정 - 에피소드 인덱스 0 반환");
    return 0;
  }

  try {
    const filterFormula = encodeURIComponent("{key}='threads_episode_index'");
    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent("설정")}?filterByFormula=${filterFormula}&maxRecords=1`,
      { headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` } },
    );
    const data = await res.json();
    const record = data.records?.[0];
    return record?.fields?.value ? parseInt(record.fields.value, 10) : 0;
  } catch (error) {
    console.error("에피소드 인덱스 조회 실패:", error);
    return 0;
  }
}

/**
 * 에피소드 인덱스 업데이트
 */
export async function updateEpisodeIndex(newIndex: number): Promise<boolean> {
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) return false;

  try {
    // 기존 레코드 조회
    const filterFormula = encodeURIComponent("{key}='threads_episode_index'");
    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent("설정")}?filterByFormula=${filterFormula}&maxRecords=1`,
      { headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` } },
    );
    const data = await res.json();
    const record = data.records?.[0];

    if (record) {
      // 업데이트
      await fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent("설정")}/${record.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fields: { value: String(newIndex) } }),
        },
      );
    } else {
      // 새 레코드 생성
      await fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent("설정")}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fields: { key: "threads_episode_index", value: String(newIndex) },
          }),
        },
      );
    }
    return true;
  } catch (error) {
    console.error("에피소드 인덱스 업데이트 실패:", error);
    return false;
  }
}
