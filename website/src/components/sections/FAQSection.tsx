'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function FAQSection() {
  const faqs = [
    {
      question: '올인원 패키지에 무엇이 포함되나요?',
      answer: '홈페이지 제작(10페이지 이내), Meta 광고 자동화 설정, 인쇄물(명함 200매, 대봉투 500매, 계약서 500매, 명찰), 도메인+호스팅 1년 무료가 포함됩니다.'
    },
    {
      question: '제작 기간은 얼마나 걸리나요?',
      answer: '기획서 확정 후 홈페이지는 30~45 영업일, 인쇄물은 7~10 영업일, 광고 설정은 5~7 영업일이 소요됩니다.'
    },
    {
      question: '환불이 가능한가요?',
      answer: '서비스 제작 시작 전에는 전액 환불이 가능합니다. 제작 시작 후에는 단순 변심으로 인한 환불이 불가하며, 품질상 심각한 하자가 있는 경우에만 환불이 가능합니다.'
    },
    {
      question: '로고가 없어도 제작이 가능한가요?',
      answer: '로고가 없는경우 로고제외 후 제작가능합니다. 로고반영 희망시 로고 (AI 파일형식) 전달주시면 반영가능합니다.'
    },
    {
      question: '광고 소재(이미지/영상)도 제작해주시나요?',
      answer: '아니요, 광고 소재는 대표님이 직접 제작해서 전달해주셔야 합니다. 전달주신 소재로 광고 세팅을 도와드립니다.'
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
