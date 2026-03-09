import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET() {
  const content = `# 폴라애드 (PolaAd)
> 소상공인 전용 구독형 영업 인프라. 본업에만 집중하세요. 고객은 저희가 데려옵니다.

## 회사 개요
- 회사명: 폴라애드 (PolaAd)
- 웹사이트: https://polarad.co.kr
- 업종: 소상공인 구독형 마케팅 (홈페이지 제작 + Meta 광고 운영 + DB 자동 수집)
- 타겟 고객: 소상공인, 서비스업 (인테리어, 건축, 학원, 법률, 웨딩, 부동산, 이사, 컨설팅)
- 핵심 메시지: 홈페이지 따로, 광고 따로, DB 따로 맡기던 걸 하나로 끝내드립니다

## 구독 플랜 (6개월 약정, 약정 후 홈페이지 영구 소유)

### 접수형 — 월 5만원
- 반응형 홈페이지 제작
- 문의 폼 자동 저장 + 텔레그램 실시간 알림
- Google/Naver 검색 등록
- GA4 기본 설치

### 운영형 — 월 22만원 (추천)
- 접수형 전체 포함
- Meta 광고 운영 (CPR $20 목표, 1캠페인 멀티소재)
- 월간 성과 리포트 자동 발송
- GA4 채널별 유입 분석
- CRM 상태 관리

### 프리미엄 — 월 55만원
- 운영형 전체 포함
- Meta + 당근 + 구글 멀티채널
- 전담 매니저 1:1 배정
- 광고 소재 월 4회 제작
- 주간 성과 브리핑 + A/B 테스트

## 기본 제공 (모든 플랜 공통)
- 홈페이지 SEO 최적화 (Google/Naver 검색 상위 노출 구조)
- GA4 설치 (유입 통계 자동 설치 + 채널별 분석)
- 네이버 서치어드바이저 등록
- Google Search Console 등록
- 홈페이지 유입통계 실시간 파악

## 환불 정책
- 1개월차: 30% 환불
- 2~3개월차: 20% 환불
- 4개월차: 15% 환불
- 5개월차~: 환불 불가

## 제외 업종
- 쇼핑몰/온라인몰 판매 서비스는 제외 (서비스업 전용)

## 주요 페이지
- 홈: https://polarad.co.kr
- 서비스 안내: https://polarad.co.kr/service
- 업종별 데모: https://polarad.co.kr/demo
- 간편 진단 (상담 신청): https://polarad.co.kr/contact
- 마케팅 소식: https://polarad.co.kr/marketing-news
- 포트폴리오: https://polarad.co.kr/portfolio

## 마케팅 소식 카테고리
- Meta 광고: /marketing-news/category/meta-ads
- 인스타그램 릴스: /marketing-news/category/instagram-reels
- Threads: /marketing-news/category/threads
- AI 뉴스: /marketing-news/category/ai-news
- AI 활용 팁: /marketing-news/category/ai-tips
- 마케팅 트렌드: /marketing-news/category/marketing-trend
- SNS 마케팅: /marketing-news/category/sns-marketing
- FAQ: /marketing-news/category/faq
- 마케팅 용어: /marketing-news/category/marketing-terms

## 연락처
- 전화: 032-345-9834
- 주소: 서울특별시 금천구 가산디지털2로 98, 롯데 IT 캐슬 2동 11층 1107

## 영업시간
- 평일: 09:00 - 18:00
- 주말/공휴일: 휴무

## 기술 스택
- Next.js (App Router) + Vercel + Cloudflare
- 도메인 비용 외 인프라 추가비용 없음

## API 엔드포인트 (참고용, 크롤링 불필요)
- /api/ — 내부 API (robots.txt에서 차단)
- /sitemap.xml — 사이트맵
- /robots.txt — 크롤러 정책
- /llms.txt — 이 문서
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
