'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { CheckCircle2 } from 'lucide-react'

const features = [
  '맞춤형 랜딩페이지 제작',
  '카카오 로그인 연동 (스팸 차단)',
  '텔레그램 실시간 알림',
  '관리 대시보드 제공',
  '1년 운영 포함',
  '5~7일 내 제작 완료',
]

export function EstimatorCalculator() {
  return (
    <Card variant="light">
      <CardHeader className="pb-3 lg:pb-4">
        <CardTitle variant="light" className="text-lg lg:text-xl">DB접수 랜딩 서비스</CardTitle>
      </CardHeader>
      <CardContent variant="light" className="pt-0">
        <div className="space-y-4 lg:space-y-6">
          {/* 서비스 소개 */}
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
            <p className="text-sm text-gray-700 mb-3">
              리드 수집 랜딩페이지 제작 + 1년간 접수 자동화
            </p>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-3xl lg:text-4xl font-bold text-primary-600">36</span>
              <span className="text-lg lg:text-xl font-bold text-primary-600">만원</span>
              <span className="text-sm text-gray-500">(VAT 별도)</span>
            </div>
            <p className="text-xs text-center text-gray-500 mt-2">월 3만원 / 1년 이용권</p>
          </div>

          {/* 포함 내용 */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h4 className="font-bold text-gray-900 text-sm lg:text-base mb-3">서비스 포함 내용</h4>
            <ul className="space-y-2">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs lg:text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-primary-500 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 추가 옵션 */}
          <div className="border border-gray-200 rounded-xl p-3 lg:p-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900 text-sm lg:text-base">추가 옵션</span>
            </div>
            <div className="space-y-2 text-xs lg:text-sm text-gray-600">
              <div className="flex justify-between">
                <span>수정 요청</span>
                <span className="font-medium text-gray-900">건당 3만원</span>
              </div>
              <div className="flex justify-between">
                <span>1년 후 연장</span>
                <span className="font-medium text-gray-900">월 1만원 (VAT 별도)</span>
              </div>
            </div>
          </div>

          {/* 안내 */}
          <p className="text-xs text-gray-500 text-center">
            무료 상담을 통해 사업에 맞는 랜딩 페이지를 설계해 드립니다
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
