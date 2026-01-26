import type { Metadata } from 'next'
import Link from 'next/link'
import { ProductSchema } from '@/components/seo/ProductSchema'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import { FAQSchema } from '@/components/seo/FAQSchema'
import { ArrowRight, CheckCircle2, Check } from 'lucide-react'
import Image from 'next/image'

export const metadata: Metadata = {
  title: '서비스 안내 | DB접수 랜딩 서비스 - 폴라애드',
  description: '영상으로 보는 DB접수 랜딩 서비스. 광고 클릭부터 텔레그램 알림까지 전 과정을 확인하세요. 월 3만원(VAT 별도).',
  keywords: [
    '리드수집', '랜딩페이지', '접수자동화', 'DB수집', '소상공인마케팅',
    '카카오로그인', '잠재고객발굴', '온라인접수', '리드제너레이션', '폴라애드'
  ],
  openGraph: {
    title: '서비스 안내 | DB접수 랜딩 서비스 - 폴라애드',
    description: '영상으로 보는 DB접수 랜딩 서비스. 광고 클릭부터 텔레그램 알림까지.',
    url: 'https://polarad.co.kr/service',
    type: 'website',
    locale: 'ko_KR',
    siteName: '폴라애드',
  },
  alternates: {
    canonical: 'https://polarad.co.kr/service',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ServicePage() {
  const faqs = [
    {
      question: '상품 구성은 어떻게 되나요?',
      answer: '36만원(VAT 별도) 올인원 패키지입니다. 리드 수집 랜딩페이지 제작 + 1년간 접수 자동화(카카오 로그인, 텔레그램 알림, 실시간 대시보드)가 포함됩니다. 수정이 필요한 경우 건당 3만원입니다.'
    },
    {
      question: '카카오 로그인이 왜 필요한가요?',
      answer: '카카오 로그인을 통해 정확한 연락처와 본인 인증된 정보를 수집할 수 있습니다. 스팸 접수를 방지하고, 진성 고객만 필터링하여 영업 효율을 극대화합니다.'
    },
    {
      question: '제작 기간은 얼마나 걸리나요?',
      answer: '기획 내용 확정 후 영업일 기준 5~7일 내에 제작 완료됩니다. 랜딩페이지 제작, 카카오 앱 설정, 텔레그램 연동까지 모두 포함됩니다.'
    },
    {
      question: '1년 이후에는 어떻게 되나요?',
      answer: '1년 후 서비스 연장을 원하시면 월 1만원(VAT 별도)에 유지 가능합니다. 연장하지 않으시면 서비스 이용이 종료됩니다.'
    },
    {
      question: '환불이 가능한가요?',
      answer: '서비스 제작 시작 전에는 전액 환불이 가능합니다. 제작 시작 후에는 단순 변심으로 인한 환불이 불가합니다.'
    },
  ]

  const features = [
    '맞춤형 랜딩페이지 제작',
    '카카오 로그인 연동 (스팸 차단)',
    '텔레그램 실시간 알림',
    '관리 대시보드 제공',
    '1년 운영 포함',
    '5~7일 내 제작 완료',
  ]

  return (
    <>
      <ProductSchema
        name="접수 최적화 랜딩서비스"
        description="리드 수집 랜딩페이지 제작 + 1년간 접수 자동화"
        price="360000"
        currency="KRW"
        availability="InStock"
      />

      <BreadcrumbSchema
        items={[
          { name: '홈', url: 'https://polarad.co.kr' },
          { name: '서비스 안내', url: 'https://polarad.co.kr/service' }
        ]}
      />

      <FAQSchema faqs={faqs} />

      {/* Hero Section */}
      <section className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-gray-900 text-white">
        <div className="container text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/20 text-primary-400 font-medium mb-6">
            <span>월 3만원 (VAT 별도)</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold mb-4 break-keep">
            DB접수 랜딩 서비스
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto break-keep">
            영상으로 서비스 작동 방식을 확인하세요.<br />
            광고 클릭부터 텔레그램 알림까지 전 과정을 보여드립니다.
          </p>
        </div>
      </section>

      {/* YouTube Videos Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-12">
            서비스 시연 영상
          </h2>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/C1k-NlmqO3k"
                  title="폴라애드 DB접수 랜딩 서비스 소개"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900">서비스 전체 플로우</h3>
                <p className="text-sm text-gray-500 mt-1">
                  광고 클릭부터 포털 관리까지 45초로 확인하세요
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Flow Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-4">
            서비스 작동 흐름
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
            고객이 광고를 클릭하는 순간부터 사장님께 알림이 도착하기까지
          </p>

          <div className="space-y-16 max-w-4xl mx-auto">
            {/* STEP 01: 광고에서 랜딩으로 */}
            <div className="bg-gray-50 rounded-2xl p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">1</div>
                <div>
                  <h3 className="font-bold text-gray-900">광고에서 랜딩으로</h3>
                  <p className="text-sm text-gray-500">Meta, 네이버, 구글 등 어디서든 URL로 연결</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 lg:gap-8 py-6">
                <div className="flex flex-col gap-3">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-md border border-gray-100">
                    <Image src="/images/meta-logo.svg" alt="Meta" width={32} height={32} />
                  </div>
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-md border border-gray-100">
                    <Image src="/images/naver-logo.svg" alt="Naver" width={32} height={32} />
                  </div>
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-md border border-gray-100">
                    <Image src="/images/google-logo.svg" alt="Google" width={32} height={32} />
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-gray-400" />
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 w-48">
                  <div className="text-center">
                    <div className="bg-gray-100 w-12 h-4 rounded mx-auto mb-2"></div>
                    <div className="text-sm font-bold text-gray-800 mb-1">무료 상담 신청</div>
                    <div className="text-[10px] text-gray-500 mb-3">지금 바로 전문가와 상담하세요</div>
                    <div className="bg-[#FEE500] rounded-lg py-2 flex items-center justify-center gap-1.5">
                      <div className="w-4 h-4 bg-[#3C1E1E] rounded-full"></div>
                      <span className="text-[11px] font-semibold text-[#3C1E1E]">카카오 로그인</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-600 text-sm">
                  💡 URL만 있으면 어디든 연결 가능
                </span>
              </div>
            </div>

            {/* STEP 02: 고객 신청 플로우 */}
            <div className="bg-gray-50 rounded-2xl p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">2</div>
                <div>
                  <h3 className="font-bold text-gray-900">고객 신청 플로우</h3>
                  <p className="text-sm text-gray-500">카카오 로그인 → 폼 작성 → 접수 완료</p>
                </div>
              </div>
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-[#FEE500] flex items-center justify-center mx-auto mb-2">
                      <span className="text-lg">🔐</span>
                    </div>
                    <span className="text-xs text-gray-600">카카오<br />로그인</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300" />
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-2">
                      <span className="text-lg">📝</span>
                    </div>
                    <span className="text-xs text-gray-600">폼<br />작성</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300" />
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                      <Check className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-xs text-gray-600">접수<br />완료</span>
                  </div>
                </div>
                <div className="bg-[#FEE500]/10 border border-[#FEE500]/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 bg-[#3C1E1E] rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-[#FEE500] rounded-full"></div>
                    </div>
                    <span className="text-sm font-semibold text-[#8B6914]">카카오 로그인 혜택</span>
                  </div>
                  <ul className="space-y-1.5 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span>실제 고객 검증 & 반복접수 차단</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span>블랙리스트 설정 가능</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span>Meta 외 모든 광고 영역 URL 추가 가능</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="text-center mt-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-600 text-sm">
                  ⚡ 10초 만에 접수 완료
                </span>
              </div>
            </div>

            {/* STEP 03: 실시간 알림 */}
            <div className="bg-gray-50 rounded-2xl p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">3</div>
                <div>
                  <h3 className="font-bold text-gray-900">실시간 알림</h3>
                  <p className="text-sm text-gray-500">접수 즉시 텔레그램으로 알림 전송</p>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 py-4">
                <div className="text-center">
                  <div className="bg-green-50 rounded-xl p-6 mb-2">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Check className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-sm font-medium text-gray-800">신청 완료</div>
                  </div>
                  <span className="text-xs text-gray-500 bg-green-100 px-3 py-1 rounded-full">고객 화면</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs font-medium text-cyan-600 mb-1">실시간</span>
                  <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-lg">🔔</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-[#212121] rounded-xl p-4 text-left mb-2 w-56">
                    <div className="text-white text-xs font-medium mb-2">🔔 새로운 리드 접수</div>
                    <div className="text-gray-300 text-[11px] space-y-0.5">
                      <div>🏢 클라이언트: 폴라애드</div>
                      <div>👤 이름: 홍**</div>
                      <div>📞 연락처: <span className="text-cyan-400">010-0000-0000</span></div>
                      <div>⏰ 시간: 01/24 오후 2:32:15</div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 bg-cyan-100 px-3 py-1 rounded-full">텔레그램 알림</span>
                </div>
              </div>
              <div className="text-center mt-4">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-600 text-sm">
                  🔔 놓치는 리드 없이 실시간 확인
                </span>
              </div>
            </div>

            {/* STEP 04: 광고주 포털 */}
            <div className="bg-gray-50 rounded-2xl p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold">4</div>
                <div>
                  <h3 className="font-bold text-gray-900">광고주 포털</h3>
                  <p className="text-sm text-gray-500">로그인 → 통계 대시보드 → 접수내역 관리</p>
                </div>
              </div>
              <div className="grid lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">23%</div>
                    <span className="font-medium text-gray-800">전환율 분석</span>
                  </div>
                  <div className="text-sm text-gray-500">30일 전환율, 로그인율, 접수율을 한눈에</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                      <span className="text-white">📊</span>
                    </div>
                    <span className="font-medium text-gray-800">전환 퍼널</span>
                  </div>
                  <div className="text-sm text-gray-500">방문 → 로그인 → 접수완료 단계별 분석</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-violet-500 rounded-lg flex items-center justify-center">
                      <span className="text-white">👥</span>
                    </div>
                    <span className="font-medium text-gray-800">접수내역 관리</span>
                  </div>
                  <div className="text-sm text-gray-500">신규, 연락완료, 전환 상태로 분류</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-gray-900 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-bold text-center mb-12">
              서비스에 포함된 내용
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-gray-800 rounded-xl p-4">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  <span className="text-gray-100">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <div className="inline-block bg-gray-800 rounded-2xl p-6 lg:p-8">
                <div className="text-sm text-gray-400 mb-2">1년 이용료</div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  36<span className="text-2xl">만원</span>
                </div>
                <div className="text-sm text-gray-500">VAT 별도 / 월 3만원</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary-600">
        <div className="container text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            지금 시작하세요
          </h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto break-keep">
            무료 상담을 통해 사업에 맞는 랜딩 페이지를 설계해 드립니다.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            무료 상담 신청하기
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-12">
            자주 묻는 질문
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group bg-gray-50 rounded-xl">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <svg
                    className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-gray-600">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
