import { NextResponse } from 'next/server'

export async function GET() {
  const content = `# 폴라애드 (PolaAd)
> 중소기업을 위한 온라인 영업 자동화 솔루션

## 회사 개요
- 회사명: 폴라애드 (PolaAd)
- 웹사이트: https://polarad.co.kr
- 업종: 온라인 마케팅, 홈페이지 제작, Meta 광고 대행
- 타겟 고객: 중소기업, 법인영업, 경영컨설팅 업체

## 주요 서비스
1. **온라인 영업 올인원 패키지** (330만원)
   - 홈페이지 제작 (10페이지)
   - Meta 광고 자동화 설정
   - 인쇄물 4종 (명함, 대봉투, 계약서, 명찰)
   - 도메인 + 호스팅 1년 무료

2. **DB 수집 광고**
   - Meta (Facebook/Instagram) 리드 광고
   - 잠재고객 DB 수집 및 관리
   - 24시간 자동화된 리드 제너레이션

3. **홈페이지 제작**
   - 반응형 웹사이트
   - SEO 최적화
   - 평균 30일 제작

## 주요 페이지
- 홈: https://polarad.co.kr
- 서비스 안내: https://polarad.co.kr/service
- 포트폴리오: https://polarad.co.kr/portfolio
- 마케팅 소식: https://polarad.co.kr/marketing-news
- 회사소개: https://polarad.co.kr/about
- 상담신청: https://polarad.co.kr/contact

## 연락처
- 전화: 032-345-9834
- 이메일: mkt@polarad.co.kr
- 주소: 서울특별시 금천구 가산디지털2로 98, 롯데 IT 캐슬 2동 11층 1107

## 영업시간
- 평일: 09:00 - 18:00
- 점심시간: 12:00 - 13:00
- 주말/공휴일: 휴무

## 핵심 가치
- 단순함: 홈페이지, 광고, 인쇄물을 한 번에 해결
- 신속함: 기획부터 완성까지 최대 30일
- 합리성: 개별 진행 대비 시간과 비용 절약

## 마케팅 소식 카테고리
- 마케팅 트렌드 (/marketing-news/category/marketing-trend)
- SNS 마케팅 (/marketing-news/category/sns-marketing)
- Meta 광고 (/marketing-news/category/meta-ads)
- AI 마케팅 (/marketing-news/category/ai-news)
- AI 활용 팁 (/marketing-news/category/ai-tips)
- 마케팅 용어 (/marketing-news/category/marketing-terms)
`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400', // 24시간 캐시
    },
  })
}
