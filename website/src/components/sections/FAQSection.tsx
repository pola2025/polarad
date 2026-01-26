'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function FAQSection() {
  const faqs = [
    {
      question: '상품 구성은 어떻게 되나요?',
      answer: '36만원(VAT 별도) 올인원 패키지입니다. 리드 수집 랜딩페이지 제작 + 1년간 접수 자동화(카카오 로그인, 텔레그램 알림, 실시간 대시보드)가 포함됩니다. 수정이 필요한 경우 건당 3만원(VAT 별도)입니다.'
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
      answer: '1년 후 자동화 서비스 연장을 원하시면 월 1만원(VAT 별도)에 유지 가능합니다. 연장하지 않으셔도 랜딩페이지는 계속 사용 가능합니다.'
    },
    {
      question: '환불이 가능한가요?',
      answer: '서비스 제작 시작 전에는 전액 환불이 가능합니다. 제작 시작 후에는 단순 변심으로 인한 환불이 불가합니다.'
    },
  ]

  return (
    <section className="py-12 sm:py-20 bg-white">
      <div className="container">
        <div className="max-w-3xl mx-auto space-y-8 sm:space-y-12">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-3 sm:mb-4">자주 묻는 질문</h2>
            <p className="text-sm sm:text-base text-neutral-600">궁금한 점이 있으신가요?</p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-neutral-200 rounded-xl overflow-hidden">
                <details className="group">
                  <summary className="flex justify-between items-center gap-3 p-4 sm:p-6 cursor-pointer list-none bg-white hover:bg-neutral-50 transition-colors">
                    <span className="font-bold text-sm sm:text-lg text-neutral-900 text-left whitespace-nowrap">{faq.question}</span>
                    <ChevronDown className="w-4 sm:w-5 h-4 sm:h-5 text-neutral-400 transition-transform group-open:rotate-180 shrink-0" />
                  </summary>
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0 text-sm sm:text-base text-neutral-600 bg-white leading-relaxed border-t border-neutral-100 mt-[-1px]">
                    <div className="pt-3 sm:pt-4 break-keep">
                      {faq.answer}
                    </div>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
