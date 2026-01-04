'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { CheckCircle2, Sparkles } from 'lucide-react'

interface Tier {
  id: string
  name: string
  price: number
  promoPrice?: number
  description: string
  features: string[]
  isPromo?: boolean
}

const tiers: Tier[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 300000,
    description: 'Meta 광고세팅 + 자동화 설정',
    features: [
      'Meta 광고 계정 세팅',
      'Meta 자동화 최초 설정',
    ],
  },
  {
    id: 'normal',
    name: 'Normal',
    price: 600000,
    description: '랜딩 1P + Meta 자동화 1개월',
    features: [
      '랜딩페이지 1페이지',
      'Meta 광고 계정 세팅',
      'Meta 자동화 1개월 제공',
      '도메인 1년 제공',
      '반응형 디자인',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 1100000,
    description: '홈페이지 5P + Meta 자동화 2개월',
    features: [
      '홈페이지 5페이지 (섹션 최대 4개)',
      'Meta 광고 계정 세팅',
      'Meta 자동화 2개월 제공',
      '도메인 1년 제공',
      '반응형 디자인',
      'SEO 기본 설정',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 2200000,
    promoPrice: 1650000,
    description: '홈페이지 10P + 6개월 자동화',
    features: [
      '홈페이지 10페이지',
      'Meta 광고 계정 세팅',
      'Meta 자동화 6개월 제공',
      '게시글 자동생성기 설치',
      '도메인 1년 제공',
      '텔레그램 알림 + SMS 발송',
      '반응형 디자인',
      'SEO 최적화',
    ],
    isPromo: true,
  },
]

export function EstimatorCalculator() {
  const [selectedTier, setSelectedTier] = useState<string>('premium')
  const [addPrint, setAddPrint] = useState(false)

  const currentTier = tiers.find(t => t.id === selectedTier)
  const printPrice = selectedTier === 'basic' ? 1100000 : 550000 // 단독 110만 / 추가 55만

  const basePrice = currentTier?.promoPrice || currentTier?.price || 0
  const totalPrice = basePrice + (addPrint ? printPrice : 0)

  return (
    <Card variant="light">
      <CardHeader className="pb-3 lg:pb-4">
        <CardTitle variant="light" className="text-lg lg:text-xl">상품 선택</CardTitle>
      </CardHeader>
      <CardContent variant="light" className="pt-0">
        <div className="space-y-4 lg:space-y-6">
          {/* Tier Selection */}
          <div className="grid grid-cols-2 gap-2 lg:gap-3">
            {tiers.map((tier) => (
              <button
                key={tier.id}
                type="button"
                onClick={() => setSelectedTier(tier.id)}
                className={`relative p-3 lg:p-4 rounded-xl border-2 text-left transition-all ${
                  selectedTier === tier.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {tier.isPromo && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    할인
                  </div>
                )}
                <div className="text-xs lg:text-sm font-bold text-gray-900 mb-1">{tier.name}</div>
                <div className="flex items-baseline gap-1">
                  {tier.promoPrice ? (
                    <>
                      <span className="text-gray-400 line-through text-xs">{(tier.price / 10000).toFixed(0)}만</span>
                      <span className="text-lg lg:text-xl font-bold text-primary-600">{(tier.promoPrice / 10000).toFixed(0)}만</span>
                    </>
                  ) : (
                    <span className="text-lg lg:text-xl font-bold text-gray-900">{(tier.price / 10000).toFixed(0)}만</span>
                  )}
                </div>
                <div className="text-[10px] lg:text-xs text-gray-500 mt-1">{tier.description}</div>
              </button>
            ))}
          </div>

          {/* Selected Tier Features */}
          {currentTier && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-gray-900 text-sm lg:text-base">{currentTier.name} 구성</h4>
                {currentTier.isPromo && (
                  <span className="text-xs text-red-600 font-medium">~1/31 선착순 10개</span>
                )}
              </div>
              <ul className="space-y-1.5 lg:space-y-2">
                {currentTier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs lg:text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-primary-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
                {currentTier.id === 'premium' && currentTier.promoPrice && (
                  <li className="flex items-center gap-2 text-xs lg:text-sm text-amber-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>+6개월 자동화 추가 무료 (총 1년)</span>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Add-on: Print */}
          <div className="border border-gray-200 rounded-xl p-3 lg:p-4 bg-white">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={addPrint}
                onChange={(e) => setAddPrint(e.target.checked)}
                className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 text-sm lg:text-base">인쇄물 패키지 추가</span>
                  <span className="text-sm lg:text-base font-bold text-gray-900">
                    +{(printPrice / 10000).toFixed(0)}만원
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  명함 200매 + 대봉투 500매 + 계약서 500매 + 명찰
                </p>
                {selectedTier === 'basic' && (
                  <p className="text-xs text-gray-400 mt-0.5">* 단독 구매 시 110만원</p>
                )}
                {selectedTier !== 'basic' && (
                  <p className="text-xs text-gray-400 mt-0.5">* 상품과 함께 구매 시 55만원</p>
                )}
              </div>
            </label>
          </div>

          {/* Total Price */}
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <span className="text-xs lg:text-sm font-medium text-primary-700">예상 금액</span>
              <span className="text-xl lg:text-3xl font-bold text-primary-600">
                {totalPrice.toLocaleString()}원
              </span>
            </div>
            <p className="text-xs text-primary-600/70 text-center mt-2">VAT 포함 / 1회 제작비</p>
          </div>

          {/* Notice */}
          <p className="text-xs text-gray-500 text-center">
            호스팅은 제공 항목에 포함되지 않습니다<br className="sm:hidden" />
            <span className="hidden sm:inline"> </span>(무료 호스팅 활용 가능)
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
