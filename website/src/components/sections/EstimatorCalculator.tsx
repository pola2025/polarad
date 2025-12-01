'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Minus, Plus } from 'lucide-react'

export function EstimatorCalculator() {
  const [pages, setPages] = useState(10)

  const BASE_PRICE = 3000000 // VAT 별도
  const ADDITIONAL_PAGE_PRICE = 200000 // VAT 별도
  const VAT_RATE = 0.1

  const additionalPages = Math.max(0, pages - 10)
  const priceBeforeVAT = BASE_PRICE + (additionalPages * ADDITIONAL_PAGE_PRICE)
  const vat = priceBeforeVAT * VAT_RATE
  const totalPrice = priceBeforeVAT + vat

  return (
    <Card variant="light">
      <CardHeader className="pb-3 lg:pb-4">
        <CardTitle variant="light" className="text-lg lg:text-xl">견적 계산</CardTitle>
      </CardHeader>
      <CardContent variant="light" className="pt-0">
        <div className="space-y-4 lg:space-y-6">
          {/* Page Counter */}
          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2 lg:mb-3">
              필요한 페이지 수
            </label>
            <div className="flex items-center gap-2 lg:gap-4">
              <button
                type="button"
                onClick={() => setPages(Math.max(1, pages - 1))}
                className="w-9 h-9 lg:w-12 lg:h-12 rounded-lg bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors text-gray-700 font-semibold border border-gray-300 flex items-center justify-center shrink-0"
                aria-label="페이지 수 감소"
              >
                <Minus className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
              <input
                type="number"
                value={pages}
                onChange={(e) => setPages(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 min-w-0 text-center text-lg lg:text-2xl font-bold border-2 border-gray-300 rounded-lg py-2 lg:py-3 focus:outline-none focus:border-primary-500 bg-gray-50 text-gray-900"
                min="1"
              />
              <button
                type="button"
                onClick={() => setPages(pages + 1)}
                className="w-9 h-9 lg:w-12 lg:h-12 rounded-lg bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors text-gray-700 font-semibold border border-gray-300 flex items-center justify-center shrink-0"
                aria-label="페이지 수 증가"
              >
                <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
            </div>
            <p className="text-xs lg:text-sm text-gray-500 mt-2">
              기본 10페이지 포함. 추가 페이지당 20만원(VAT 별도)
            </p>
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-gray-200 pt-4 lg:pt-6 space-y-2 lg:space-y-3">
            <div className="flex justify-between text-xs lg:text-sm text-gray-600">
              <span>기본 패키지 (10페이지)</span>
              <span className="font-semibold text-gray-900">3,000,000원</span>
            </div>

            {additionalPages > 0 && (
              <div className="flex justify-between text-xs lg:text-sm text-gray-600">
                <span>추가 페이지 ({additionalPages}페이지)</span>
                <span className="font-semibold text-gray-900">
                  {(additionalPages * ADDITIONAL_PAGE_PRICE).toLocaleString()}원
                </span>
              </div>
            )}

            <div className="flex justify-between text-xs lg:text-sm text-gray-600 border-t border-gray-200 pt-2 lg:pt-3">
              <span>소계 (VAT 별도)</span>
              <span className="font-semibold text-gray-900">{priceBeforeVAT.toLocaleString()}원</span>
            </div>

            <div className="flex justify-between text-xs lg:text-sm text-gray-600">
              <span>부가세 (10%)</span>
              <span className="font-semibold text-gray-900">{vat.toLocaleString()}원</span>
            </div>

            {/* 총 결제 금액 - 강조 */}
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-3 lg:p-4 mt-3 lg:mt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm lg:text-base font-bold text-primary-700">총 결제 금액</span>
                <span className="text-xl lg:text-2xl font-bold text-primary-600">{totalPrice.toLocaleString()}원</span>
              </div>
            </div>
          </div>

          {/* Package Includes */}
          <div className="bg-gray-50 rounded-lg p-3 lg:p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm lg:text-base">패키지 포함 내역</h4>
            <ul className="space-y-1 lg:space-y-1.5 text-xs lg:text-sm text-gray-600">
              <li className="flex items-center gap-1.5">
                <span className="text-primary-500">✓</span>
                홈페이지 제작 ({pages}페이지)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-primary-500">✓</span>
                <span className="hidden sm:inline">인쇄물 (명함 200매, 대봉투 500매, 계약서 500매, 명찰)</span>
                <span className="sm:hidden">인쇄물 4종 (명함, 대봉투, 계약서, 명찰)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-primary-500">✓</span>
                Meta 광고 자동화 설정
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-primary-500">✓</span>
                도메인 + 호스팅 1년 무료
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-primary-500">✓</span>
                DB 자동화 1개
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
