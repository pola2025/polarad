/**
 * Vercel Cron Job: polarad Instagram Q&A 배너 자동 게시
 * 스케줄: 월/수/금 12:00 KST
 *
 * 1. Airtable에서 현재 배너 인덱스 조회
 * 2. R2에 미리 업로드된 배너 이미지 URL 사용
 * 3. Instagram Graph API로 게시
 * 4. Airtable 인덱스 업데이트
 */

import { NextResponse } from "next/server";

const CRON_SECRET = process.env.CRON_SECRET;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = "-1003280236380";

const INSTAGRAM_ACCESS_TOKEN = process.env.POLARAD_INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_ACCOUNT_ID =
  process.env.POLARAD_INSTAGRAM_ACCOUNT_ID || "17841441970375843";
const GRAPH_API_VERSION = "v21.0";
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

const AIRTABLE_KEY = "instagram_polarad_banner_index";
const BANNER_COUNT = 24;

// R2에 미리 업로드된 배너 이미지 URL 베이스
const R2_BANNER_BASE =
  "https://pub-c873926e91684ac7a7f53f44d4cc5b9f.r2.dev/instagram/polarad/qa-banners";

// ─────────────────────────────────────────────
// 배너 데이터 (24개)
// ─────────────────────────────────────────────
interface Banner {
  q: string;
  a: string;
  sub: string;
  img: string; // bg image filename under public/images/instagram/bg/
}

const BANNERS: Banner[] = [
  // Batch 1: 핵심 서비스
  {
    q: "월 22만원에\n진짜 다 해줘요?",
    a: "홈페이지 + 광고세팅\n+ 월간 리포트 포함",
    sub: "운영형 구독 하나로",
    img: "ab-05-gradient-mesh.webp",
  },
  {
    q: "홈페이지도\n만들어줘요?",
    a: "기획부터 개발까지\n5~7일 완성",
    sub: "모바일 최적화 포함",
    img: "ab-06-liquid-marble.webp",
  },
  {
    q: "광고도 직접\n세팅해줘요?",
    a: "Meta 광고 캠페인\n세팅 + 최적화 전담",
    sub: "1캠페인 멀티소재 운영",
    img: "ab-07-fractal-spiral.webp",
  },
  // Batch 2: 요금제
  {
    q: "제일 싼 건\n얼마예요?",
    a: "접수형 월 5만원\n부터 시작",
    sub: "홈페이지 + DB 접수 기본",
    img: "ab-08-bokeh-lights.webp",
  },
  {
    q: "운영형이랑\n프리미엄 차이가?",
    a: "광고운영 포함 여부\n+ 전담매니저",
    sub: "운영형 22만 · 프리미엄 55만",
    img: "ab-09-silk-fabric.webp",
  },
  {
    q: "약정 기간은\n얼마예요?",
    a: "6개월 약정\n카드결제 가능",
    sub: "부담 없이 시작",
    img: "ab-10-water-ripple.webp",
  },
  // Batch 3: 프로세스
  {
    q: "광고비는\n별도인가요?",
    a: "네, 월 30만원\n부터 추천",
    sub: "구독료와 별도 · 직접 관리",
    img: "01-modern-office.webp",
  },
  {
    q: "문의 오면\n어떻게 알아요?",
    a: "이메일 + 텔레그램\n실시간 알림",
    sub: "놓치는 DB 없이",
    img: "03-minimal-desk.webp",
  },
  {
    q: "리포트는\n어떻게 받아요?",
    a: "매월 투명한\n성과 리포트 제공",
    sub: "클릭·노출·전환 한눈에",
    img: "04-handshake-closeup.webp",
  },
  // Batch 4: 신뢰
  {
    q: "해지하면\n데이터는요?",
    a: "100% 고객사 소유\n전부 가져갈 수 있어요",
    sub: "락인 없는 구독",
    img: "06-coworking-lounge.webp",
  },
  {
    q: "아무 업체나\n받나요?",
    a: "3단계 심사 후\n진행합니다",
    sub: "서로 맞는지 먼저 확인",
    img: "09-reception-desk.webp",
  },
  {
    q: "환불은\n되나요?",
    a: "1개월차 30%\n기간별 환불 정책 공개",
    sub: "투명한 환불 기준",
    img: "10-conference-presentation.webp",
  },
  // Batch 5: 시작 방법
  {
    q: "시작하려면\n뭘 해야해요?",
    a: "간편진단\n3분이면 끝",
    sub: "복잡한 절차 없이",
    img: "mk-12-rocket-launch.webp",
  },
  {
    q: "오픈까지\n얼마나 걸려요?",
    a: "평균 5~7일 내\n완성",
    sub: "기획·디자인·개발 올인원",
    img: "mk-15-calendar-planning.webp",
  },
  {
    q: "광고 소재도\n만들어줘요?",
    a: "프리미엄은\n소재 제작 포함",
    sub: "전문 디자이너 배정",
    img: "ab-11-smoke-wisps.webp",
  },
  // Batch 6: Meta 광고
  {
    q: "Meta 광고\n효과 있어요?",
    a: "인테리어 업종\n검증된 구조",
    sub: "데이터 기반 운영",
    img: "mk-02-growth-chart-abstract.webp",
  },
  {
    q: "광고비 30만원으로\n될까요?",
    a: "타겟 좁게 +\n소재 3개면 가능",
    sub: "소액으로 시작 OK",
    img: "mk-08-target-bullseye.webp",
  },
  {
    q: "CPR이\n뭐예요?",
    a: "문의 1건당 비용\n$20 이하 목표",
    sub: "Cost Per Result",
    img: "mk-09-funnel-conversion.webp",
  },
  // Batch 7: 차별점
  {
    q: "다른 대행사랑\n뭐가 달라요?",
    a: "홈페이지+광고+DB\n하나로 통합",
    sub: "따로 맡길 필요 없이",
    img: "mk-13-puzzle-pieces.webp",
  },
  {
    q: "직접 해도\n되지 않나요?",
    a: "되지만 시간 =\n비용입니다",
    sub: "본업에 집중하세요",
    img: "ab-24-molten-gold.webp",
  },
  {
    q: "효과 없으면\n어떡해요?",
    a: "30일 검토 미팅\n+ 데이터 공개",
    sub: "감이 아닌 숫자로 판단",
    img: "ab-13-topography-lines.webp",
  },
  // Batch 8: CTA
  {
    q: "어떤 업종이\n가능해요?",
    a: "고객DB 필요한\n업종 전부",
    sub: "인테리어·학원·병원·법률 등",
    img: "07-elevator-lobby.webp",
  },
  {
    q: "상담은\n무료인가요?",
    a: "네, 간편진단\n완전 무료",
    sub: "부담 없이 문의하세요",
    img: "mk-14-handshake-digital.webp",
  },
  {
    q: "지금 시작하면\n언제부터?",
    a: "상담 후 5~7일 내\n오픈",
    sub: "빠른 시작, 확실한 결과",
    img: "mk-05-paper-airplane-launch.webp",
  },
];

// ─────────────────────────────────────────────
// 캡션 데이터 (24개)
// ─────────────────────────────────────────────
const CAPTIONS: string[] = [
  // #01
  `월 22만원에 진짜 다 해주냐구요? 🤔

네. 진짜 다 됩니다 ✅

✔️ 랜딩페이지 제작
✔️ Meta 광고 세팅 + 운영
✔️ 광고 소재 제작
✔️ DB 접수 자동화
✔️ 월간 성과 리포트

인테리어 사장님들이
제일 많이 하시는 질문이에요.

홈페이지 따로, 광고 따로, DB 관리 따로 —
각각 맡기면 💸 비용도 커지고
중간에서 조율하느라 시간만 사라지거든요.

폴라애드는 이걸 구독 하나로 묶었습니다.

👷 사장님은 시공에만 집중하세요.
📲 온라인에서 고객 만나는 건 저희가 합니다.

👉 자세한 내용은 프로필 링크 참고해 주세요.

.
.
#온라인마케팅 #인테리어마케팅 #마케팅구독
#폴라애드 #Meta광고 #인테리어업체 #광고대행`,

  // #02
  `홈페이지도 만들어주냐구요? 🏠

네, 기획부터 개발까지 전부 포함이에요 ✅

✔️ 업종 맞춤 디자인
✔️ 모바일 최적화
✔️ 문의 폼 + DB 자동 접수
✔️ 5~7일 내 완성

따로 웹에이전시 찾고, 견적 받고,
수정 요청하고... 그 과정이 꽤 번거롭잖아요.

폴라애드 구독에는
홈페이지 제작이 기본 포함이라
별도 비용 없이 바로 시작할 수 있어요.

모바일에서 보기 좋게,
문의가 바로 들어오게 만들어드립니다 📱

👉 자세한 내용은 프로필 링크 참고해 주세요.

.
.
#홈페이지제작 #랜딩페이지 #인테리어홈페이지
#폴라애드 #웹사이트 #마케팅구독 #모바일최적화`,

  // #03
  `광고도 직접 세팅해주냐구요? 📢

네, Meta 광고 캠페인 세팅부터
최적화까지 전담합니다 ✅

✔️ 캠페인 구조 설계
✔️ 타겟 오디언스 세팅
✔️ 광고 소재 제작
✔️ 성과 모니터링 + 최적화

1캠페인 멀티소재 구조로
효율적으로 운영해요.

사장님이 광고 관리자 들어가서
이것저것 만질 필요 없습니다.

세팅도, 운영도, 최적화도
전부 저희가 하니까요 🎯

👉 자세한 내용은 프로필 링크 참고해 주세요.

.
.
#Meta광고 #페이스북광고 #인스타광고
#폴라애드 #광고세팅 #인테리어마케팅 #광고운영`,

  // #04
  `제일 싼 건 얼마냐구요? 💰

접수형 월 5만원부터 시작이에요 ✅

✔️ 홈페이지(랜딩페이지) 제작
✔️ 문의 접수 폼
✔️ DB 이메일 알림

아직 광고까지는 생각 없고,
일단 홈페이지부터 갖추고 싶다면
접수형이 딱이에요.

월 5만원이면 커피 몇 잔 값으로
온라인 영업 창구가 하나 생기는 거니까요 ☕

나중에 광고 시작하고 싶으면
운영형으로 업그레이드하면 됩니다.

👉 자세한 내용은 프로필 링크 참고해 주세요.

.
.
#마케팅구독 #월5만원 #소자본마케팅
#폴라애드 #인테리어업체 #홈페이지 #접수형`,

  // #05
  `운영형이랑 프리미엄 차이가 뭐냐구요? 🤷

핵심은 이거예요 👇

✔️ 운영형 (월 22만원)
→ 홈페이지 + 광고 세팅/운영 + 리포트

✔️ 프리미엄 (월 55만원)
→ 운영형 전부 + 광고 소재 제작 + 전담매니저

광고 소재를 직접 준비할 수 있다면
운영형으로 충분합니다.

소재 제작까지 맡기고 싶거나
전담매니저가 필요하다면
프리미엄이 맞아요 🎯

어떤 게 맞는지 모르겠다면
간편진단 먼저 해보세요.

👉 자세한 내용은 프로필 링크 참고해 주세요.

.
.
#마케팅구독 #요금제비교 #운영형 #프리미엄
#폴라애드 #인테리어마케팅 #광고대행`,

  // #06
  `약정 기간은 얼마냐구요? 📋

6개월 약정이에요 ✅

✔️ 6개월 기본 약정
✔️ 카드결제 가능
✔️ 기간별 환불 정책 공개

왜 6개월이냐면,
광고 성과가 안정되려면
최소 2~3개월은 필요하거든요.

세팅 → 테스트 → 최적화 →
안정적 DB 유입까지
한 사이클 돌리는 데 딱 맞는 기간이에요 📊

짧게 하고 효과 없다고 끊으면
서로 아깝잖아요.

👉 자세한 내용은 프로필 링크 참고해 주세요.

.
.
#마케팅약정 #6개월 #카드결제
#폴라애드 #인테리어마케팅 #마케팅구독 #광고대행`,

  // #07
  `광고비는 별도냐구요? 💸

네, 구독료와 광고비는 별도예요 ✅

✔️ 구독료 = 서비스 이용료 (홈페이지+세팅+운영)
✔️ 광고비 = Meta에 직접 결제 (월 30만원~)
✔️ 광고비 관리 권한은 사장님께

광고비를 저희가 받아서 쓰는 구조가 아니에요.
사장님 계정으로 직접 결제되니까
투명하게 확인할 수 있습니다 🔍

월 30만원부터 시작하면
인테리어 업종 기준 DB 15건 전후
확보할 수 있어요.

👉 자세한 내용은 프로필 링크 참고해 주세요.

.
.
#광고비 #Meta광고비 #인테리어마케팅
#폴라애드 #마케팅구독 #투명한광고 #광고운영`,

  // #08
  `문의 오면 어떻게 아냐구요? 📲

실시간으로 알림 보내드려요 ✅

✔️ 이메일 즉시 알림
✔️ 텔레그램 실시간 알림
✔️ 고객 이름 + 연락처 + 문의내용 포함

홈페이지에서 문의가 접수되면
이메일과 텔레그램으로
동시에 알림이 갑니다.

현장에서 시공 중이어도
폰으로 바로 확인할 수 있어요 📱

DB 놓치면 아깝잖아요.
접수 즉시 알려드리니까
빠르게 응대하실 수 있습니다.

👉 자세한 내용은 프로필 링크 참고해 주세요.

.
.
#DB알림 #실시간알림 #텔레그램
#폴라애드 #인테리어마케팅 #마케팅구독 #문의접수`,

  // #09
  `리포트는 어떻게 받냐구요? 📊

매월 성과 리포트 보내드려요 ✅

✔️ 광고 노출수 · 클릭수
✔️ 문의(DB) 접수 건수
✔️ 비용 대비 전환율
✔️ 다음 달 운영 방향

숫자를 그냥 나열하는 게 아니라,
"이번 달 뭐가 잘 됐고,
다음 달은 이렇게 하겠습니다"
까지 정리해서 드려요.

감으로 하는 마케팅은 끝.
데이터로 보여드립니다 📈

👉 자세한 내용은 프로필 링크 참고해 주세요.

.
.
#성과리포트 #마케팅리포트 #데이터분석
#폴라애드 #인테리어마케팅 #마케팅구독 #투명운영`,

  // #10
  `해지하면 데이터는 어떻게 되냐구요? 🔐

100% 고객사 소유예요 ✅

✔️ 홈페이지 소스코드
✔️ 광고 계정 데이터
✔️ 접수된 DB 전체
✔️ 리포트 자료

해지하더라도 전부 가져가실 수 있어요.

"구독 끊으면 다 날아가는 거 아니야?"
이런 걱정 안 하셔도 됩니다.

저희가 잘해서 계속 쓰시게 만드는 게 맞지,
데이터 묶어놓고 못 나가게 하는 건
아니니까요 🤝

👉 자세한 내용은 프로필 링크 참고해 주세요.

.
.
#데이터소유권 #고객데이터 #투명운영
#폴라애드 #인테리어마케팅 #마케팅구독 #해지`,

  // #11
  `아무 업체나 받냐구요? 🤔

아뇨, 3단계 심사 후 진행해요 ✅

✔️ 1단계: 업종 적합성 확인
✔️ 2단계: 현재 마케팅 상태 진단
✔️ 3단계: 기대치 조율 미팅

솔직히, 모든 업체에
다 효과가 있는 건 아니거든요.

서로 안 맞는데 억지로 진행하면
사장님도 저희도 시간 낭비예요.

그래서 먼저 맞는지 확인하고,
확실할 때만 시작합니다 🎯

👉 자세한 내용은 프로필 링크 참고해 주세요.

.
.
#업체심사 #마케팅상담 #맞춤서비스
#폴라애드 #인테리어마케팅 #마케팅구독 #3단계심사`,

  // #12
  `환불은 되냐구요? 💳

네, 기간별 환불 정책이 있어요 ✅

✔️ 1개월차: 30% 환불
✔️ 2~3개월차: 20% 환불
✔️ 4개월차: 15% 환불
✔️ 5개월차~: 환불 불가

환불 조건을 숨기는 곳 많잖아요.
저희는 처음부터 공개합니다.

다만 솔직히 말씀드리면,
마케팅은 시간이 좀 필요해요.

1개월 만에 "효과 없다"고 끊으시면
아쉬운 건 사실이에요 📉

그래도 규정은 규정.
투명하게 운영합니다.

👉 자세한 내용은 프로필 링크 참고해 주세요.

.
.
#환불정책 #투명운영 #마케팅구독
#폴라애드 #인테리어마케팅 #환불 #약정`,

  // #13
  `시작하려면 뭘 해야 되냐구요? 🚀

간편진단 3분이면 끝이에요 ✅

✔️ 업종 선택
✔️ 현재 마케팅 상태 체크
✔️ 원하는 서비스 선택
✔️ 연락처 입력

복잡한 상담 절차 없어요.
홈페이지에서 간편진단 작성하시면
저희가 검토 후 연락드립니다 📞

"나한테 맞는 건지 모르겠다"
→ 그래서 간편진단이 있는 거예요.

일단 해보시고, 맞으면 시작하면 됩니다.

👉 자세한 내용은 프로필 링크 참고해 주세요.

.
.
#간편진단 #마케팅시작 #3분상담
#폴라애드 #인테리어마케팅 #마케팅구독 #무료상담`,

  // #14
  `오픈까지 얼마나 걸리냐구요? ⏱️

평균 5~7일이에요 ✅

✔️ Day 1~2: 기획 + 콘텐츠 정리
✔️ Day 3~5: 디자인 + 개발
✔️ Day 6~7: 검수 + 오픈

홈페이지 만들고, 광고 세팅하고,
알림 연동하고... 이걸 일주일 안에 끝내요.

보통 웹에이전시에 맡기면
2~4주 걸리잖아요.

저희는 구독 시작일부터
빠르게 움직입니다 🏃

빨리 시작해야 빨리 DB 받으니까요.

👉 자세한 내용은 프로필 링크 참고해 주세요.

.
.
#빠른오픈 #5일완성 #홈페이지제작
#폴라애드 #인테리어마케팅 #마케팅구독 #랜딩페이지`,

  // #15
  `광고 소재도 만들어주냐구요? 🎨

프리미엄 구독이면 포함이에요 ✅

✔️ 광고 이미지 제작
✔️ 카피라이팅
✔️ A/B 테스트용 소재
✔️ 전문 디자이너 배정

운영형은 소재를 사장님이
준비해 주셔야 해요.
(시공 사진, 포트폴리오 등)

소재까지 맡기고 싶다면
프리미엄이 맞습니다 🎯

어떤 게 나한테 맞는지 모르겠다면
간편진단부터 해보세요.

👉 자세한 내용은 프로필 링크 참고해 주세요.

.
.
#광고소재 #디자인 #마케팅소재
#폴라애드 #인테리어마케팅 #프리미엄 #광고제작`,

  // #16
  `Meta 광고 효과 있냐구요? 📈

인테리어 업종에서 검증된 구조예요 ✅

✔️ 지역 타겟팅으로 정확한 노출
✔️ 관심사 기반 오디언스
✔️ 전환 최적화 캠페인
✔️ 데이터 기반 운영

"SNS 광고는 안 먹힌다"는 분들,
대부분 세팅이 잘못된 거예요.

타겟 좁게 잡고,
전환에 맞는 캠페인 구조로 돌리면
인테리어 업종도 충분히 됩니다 🎯

감이 아니라 데이터로 합니다.

👉 자세한 내용은 프로필 링크 참고해 주세요.

.
.
#Meta광고 #인스타광고 #페이스북광고
#폴라애드 #인테리어마케팅 #광고효과 #전환광고`,

  // #17
  `광고비 30만원으로 되냐구요? 💵

네, 충분히 시작할 수 있어요 ✅

✔️ 타겟 좁게 (지역 + 관심사)
✔️ 소재 3개 이상 테스트
✔️ 전환 최적화 캠페인
✔️ CPR $20 이하 목표

30만원이면 적다고 생각하실 수 있는데,
타겟을 정확하게 잡으면
소액으로도 DB가 들어와요.

처음부터 100만원 태울 필요 없어요.
작게 시작하고, 데이터 보고,
잘 되면 늘리면 됩니다 📊

👉 자세한 내용은 프로필 링크 참고해 주세요.

.
.
#광고비 #소액광고 #30만원
#폴라애드 #인테리어마케팅 #Meta광고 #마케팅예산`,

  // #18
  `CPR이 뭐냐구요? 🧮

문의 1건당 드는 비용이에요 ✅

✔️ CPR = Cost Per Result
✔️ 광고비 ÷ 접수 건수
✔️ 목표: $20 이하 (약 2.7만원)

예를 들어 광고비 30만원 썼는데
문의가 15건 들어왔다면
CPR은 2만원이에요.

이 숫자가 낮을수록
광고 효율이 좋은 거예요 📉

저희는 이 숫자를 매달 공유하고
더 낮추기 위해 최적화합니다.

👉 자세한 내용은 프로필 링크 참고해 주세요.

.
.
#CPR #마케팅용어 #광고효율
#폴라애드 #인테리어마케팅 #Meta광고 #전환비용`,

  // #19
  `다른 대행사랑 뭐가 다르냐구요? 🔄

홈페이지+광고+DB를 하나로 통합했어요 ✅

✔️ 홈페이지 제작 — 따로 안 맡겨도 됨
✔️ 광고 세팅/운영 — 따로 안 맡겨도 됨
✔️ DB 관리 — 따로 안 맡겨도 됨

보통은 이렇잖아요:
웹에이전시 따로, 광고대행사 따로,
DB 관리 따로...

비용도 3배, 소통도 3배.

폴라애드는 이걸 구독 하나로 끝내요.
한 팀이 전부 보니까
연결이 매끄럽습니다 🤝

👉 자세한 내용은 프로필 링크 참고해 주세요.

.
.
#올인원마케팅 #대행사비교 #통합마케팅
#폴라애드 #인테리어마케팅 #마케팅구독 #차별점`,

  // #20
  `직접 해도 되지 않냐구요? 🤔

되죠. 근데 시간이 비용이에요 ✅

✔️ 홈페이지 만드는 시간
✔️ 광고 공부하는 시간
✔️ 소재 만드는 시간
✔️ DB 관리하는 시간

이 시간에 시공 한 건 더 하시면
그게 더 남는 장사 아닌가요?

마케팅은 전문가한테 맡기고
사장님은 본업에 집중하세요 👷

잘하는 걸 더 잘하는 게
결국 돈 버는 방법이에요 💰

👉 자세한 내용은 프로필 링크 참고해 주세요.

.
.
#본업집중 #시간은돈 #마케팅대행
#폴라애드 #인테리어마케팅 #마케팅구독 #효율`,

  // #21
  `효과 없으면 어떡하냐구요? 😟

30일 검토 미팅 + 데이터 공개해요 ✅

✔️ 30일 시점 성과 리뷰 미팅
✔️ 노출·클릭·전환 데이터 공개
✔️ 문제점 분석 + 개선안 제시
✔️ 필요 시 전략 수정

"효과 있어요~" 말로만 하는 거 아니에요.
숫자로 보여드립니다.

데이터가 안 좋으면
저희도 바로 보이거든요 📊

그래서 개선안을 먼저 제시하고
다음 달 전략을 바꿉니다.

감이 아닌 숫자로 판단해요.

👉 자세한 내용은 프로필 링크 참고해 주세요.

.
.
#성과보장 #데이터공개 #투명운영
#폴라애드 #인테리어마케팅 #마케팅구독 #30일리뷰`,

  // #22
  `어떤 업종이 가능하냐구요? 🏢

고객DB가 필요한 업종 전부 가능해요 ✅

✔️ 인테리어 (주력)
✔️ 학원 · 교육
✔️ 병원 · 클리닉
✔️ 법률 · 세무
✔️ 부동산 · 건설

공통점이 있어요.
"온라인으로 문의를 받아야 하는 업종"이면
저희 서비스가 맞습니다 🎯

쇼핑몰이나 온라인 판매는
구조가 달라서 제외해요.

내 업종이 맞는지 궁금하면
간편진단 먼저 해보세요.

👉 자세한 내용은 프로필 링크 참고해 주세요.

.
.
#업종별마케팅 #인테리어 #학원마케팅
#폴라애드 #마케팅구독 #DB마케팅 #온라인마케팅`,

  // #23
  `상담은 무료냐구요? 🙋

네, 간편진단 완전 무료예요 ✅

✔️ 홈페이지에서 3분 작성
✔️ 업종 + 현재 상태 체크
✔️ 검토 후 맞춤 안내
✔️ 부담 없이, 강매 없이

"상담 받으면 가입해야 하는 거 아니야?"
절대 아닙니다.

맞으면 시작하고,
안 맞으면 안 하면 돼요.

저희도 안 맞는 분한테
억지로 권하지 않습니다 🙅

궁금한 건 편하게 물어보세요.

👉 자세한 내용은 프로필 링크 참고해 주세요.

.
.
#무료상담 #간편진단 #부담없이
#폴라애드 #인테리어마케팅 #마케팅구독 #마케팅상담`,

  // #24
  `지금 시작하면 언제부터 되냐구요? ⚡

상담 후 5~7일이면 오픈이에요 ✅

✔️ Day 1: 간편진단 + 상담
✔️ Day 2~3: 기획 + 콘텐츠 정리
✔️ Day 4~6: 홈페이지 제작 + 광고 세팅
✔️ Day 7: 검수 + 오픈 🎉

결심했으면 빨리 시작하는 게 답이에요.

하루 늦으면 하루치 DB를
놓치는 거니까요 📉

지금 간편진단 작성하시면
내일부터 움직입니다.

본업에만 집중하세요.
고객은 저희가 데려옵니다 🤝

👉 자세한 내용은 프로필 링크 참고해 주세요.

.
.
#지금시작 #빠른오픈 #5일완성
#폴라애드 #인테리어마케팅 #마케팅구독 #간편진단`,
];

// ─────────────────────────────────────────────
// Airtable 인덱스 관리
// ─────────────────────────────────────────────
async function getBannerIndex(): Promise<number> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey || !baseId) {
    console.log("Airtable 미설정 - 인덱스 0 반환");
    return 0;
  }

  try {
    const filter = encodeURIComponent(`{key}='${AIRTABLE_KEY}'`);
    const res = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent("설정")}?filterByFormula=${filter}&maxRecords=1`,
      { headers: { Authorization: `Bearer ${apiKey}` } },
    );
    const data = await res.json();
    const record = data.records?.[0];
    return record?.fields?.value ? parseInt(record.fields.value, 10) : 0;
  } catch (err) {
    console.error("배너 인덱스 조회 실패:", err);
    return 0;
  }
}

async function setBannerIndex(newIndex: number): Promise<void> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey || !baseId) return;

  try {
    const filter = encodeURIComponent(`{key}='${AIRTABLE_KEY}'`);
    const res = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent("설정")}?filterByFormula=${filter}&maxRecords=1`,
      { headers: { Authorization: `Bearer ${apiKey}` } },
    );
    const data = await res.json();
    const record = data.records?.[0];

    if (record) {
      await fetch(
        `https://api.airtable.com/v0/${baseId}/${encodeURIComponent("설정")}/${record.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fields: { value: String(newIndex) } }),
        },
      );
    } else {
      await fetch(
        `https://api.airtable.com/v0/${baseId}/${encodeURIComponent("설정")}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fields: { key: AIRTABLE_KEY, value: String(newIndex) },
          }),
        },
      );
    }
    console.log(`배너 인덱스 업데이트: ${newIndex}`);
  } catch (err) {
    console.error("배너 인덱스 업데이트 실패:", err);
  }
}

// ─────────────────────────────────────────────
// Instagram Graph API
// ─────────────────────────────────────────────
async function waitForContainer(containerId: string): Promise<void> {
  for (let i = 0; i < 12; i++) {
    const res = await fetch(
      `${GRAPH_API_BASE}/${containerId}?fields=status_code&access_token=${INSTAGRAM_ACCESS_TOKEN}`,
    );
    const data = await res.json();
    if (data.status_code === "FINISHED") return;
    if (data.status_code === "ERROR")
      throw new Error("미디어 컨테이너 처리 실패");
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error("미디어 컨테이너 처리 타임아웃");
}

async function publishToInstagram(
  imageUrl: string,
  caption: string,
): Promise<{ postId: string; permalink?: string }> {
  // 1. 컨테이너 생성
  const containerRes = await fetch(
    `${GRAPH_API_BASE}/${INSTAGRAM_ACCOUNT_ID}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: imageUrl,
        caption,
        access_token: INSTAGRAM_ACCESS_TOKEN,
      }),
    },
  );
  const containerData = await containerRes.json();

  if (containerData.error) {
    throw new Error(`컨테이너 생성 실패: ${containerData.error.message}`);
  }

  const containerId: string = containerData.id;
  console.log(`컨테이너 생성: ${containerId}`);

  await waitForContainer(containerId);

  // 2. 게시
  const publishRes = await fetch(
    `${GRAPH_API_BASE}/${INSTAGRAM_ACCOUNT_ID}/media_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: containerId,
        access_token: INSTAGRAM_ACCESS_TOKEN,
      }),
    },
  );
  const publishData = await publishRes.json();

  if (publishData.error) {
    throw new Error(`게시 실패: ${publishData.error.message}`);
  }

  const postId: string = publishData.id;

  // 3. permalink 조회
  let permalink: string | undefined;
  try {
    const plRes = await fetch(
      `${GRAPH_API_BASE}/${postId}?fields=permalink&access_token=${INSTAGRAM_ACCESS_TOKEN}`,
    );
    const plData = await plRes.json();
    permalink = plData.permalink;
  } catch {
    // permalink 실패는 무시
  }

  return { postId, permalink };
}

// ─────────────────────────────────────────────
// Telegram
// ─────────────────────────────────────────────
async function sendTelegram(message: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN) return;
  try {
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
          disable_web_page_preview: false,
        }),
      },
    );
  } catch (err) {
    console.error("텔레그램 알림 실패:", err);
  }
}

// ─────────────────────────────────────────────
// Handler
// ─────────────────────────────────────────────
export async function GET(request: Request) {
  const url = new URL(request.url);
  const forceRun = url.searchParams.get("force") === "true";
  const startTime = Date.now();

  // 인증
  const authHeader = request.headers.get("authorization");
  if (!forceRun && CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("polarad Instagram 배너 게시 시작");
  console.log(`Force: ${forceRun}`);

  try {
    // 1. 배너 인덱스 조회
    const currentIndex = await getBannerIndex();
    const bannerIndex = currentIndex % BANNER_COUNT;
    const banner = BANNERS[bannerIndex];
    const caption = CAPTIONS[bannerIndex];
    console.log(
      `배너 #${bannerIndex + 1}/${BANNER_COUNT}: ${banner.q.replace(/\n/g, " ")}`,
    );

    // 2. R2에 미리 업로드된 배너 이미지 URL
    const bannerNum = String(bannerIndex + 1).padStart(2, "0");
    const imageUrl = `${R2_BANNER_BASE}/banner-${bannerNum}.png`;
    console.log(`배너 이미지: ${imageUrl}`);

    // 3. Instagram 게시
    if (!INSTAGRAM_ACCESS_TOKEN) {
      throw new Error("POLARAD_INSTAGRAM_ACCESS_TOKEN 미설정");
    }

    console.log("Instagram 게시 중...");
    const { postId, permalink } = await publishToInstagram(imageUrl, caption);
    console.log(`Instagram 게시 완료: ${permalink || postId}`);

    // 5. Airtable 인덱스 업데이트 (다음 배너)
    const nextIndex = (currentIndex + 1) % BANNER_COUNT;
    await setBannerIndex(nextIndex);

    const duration = Date.now() - startTime;

    // 6. 텔레그램 성공 알림
    await sendTelegram(
      `📸 *polarad Instagram 배너 게시 완료*\n\n` +
        `🖼️ *배너:* #${bannerIndex + 1}/${BANNER_COUNT}\n` +
        `❓ *Q:* ${banner.q.replace(/\n/g, " ")}\n` +
        `✅ *A:* ${banner.a.replace(/\n/g, " ")}\n` +
        `${permalink ? `🔗 *링크:* [게시글 보기](${permalink})\n` : ""}` +
        `⏱️ *소요시간:* ${(duration / 1000).toFixed(1)}초\n\n` +
        `다음 배너: #${nextIndex + 1}`,
    );

    return NextResponse.json({
      success: true,
      bannerIndex: bannerIndex + 1,
      q: banner.q,
      r2Url: imageUrl,
      instagram: { postId, permalink },
      nextBannerIndex: nextIndex + 1,
      duration,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    const message = error instanceof Error ? error.message : "Unknown error";

    console.error("polarad Instagram 게시 실패:", message);

    await sendTelegram(
      `❌ *polarad Instagram 배너 게시 실패*\n\n` +
        `⚠️ *오류:* ${message}\n` +
        `⏱️ *소요시간:* ${(duration / 1000).toFixed(1)}초\n\n` +
        `💡 수동 실행: polarad.co.kr/api/cron/instagram-polarad?force=true`,
    );

    return NextResponse.json({ error: message, duration }, { status: 500 });
  }
}

export const runtime = "nodejs";
export const maxDuration = 120;
