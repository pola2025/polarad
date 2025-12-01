import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Clock } from 'lucide-react'

export function BusinessHoursSection() {
  return (
    <Card variant="light">
      <CardHeader className="pb-2 lg:pb-4">
        <CardTitle variant="light" className="text-base lg:text-lg flex items-center gap-2">
          <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
          운영 시간
        </CardTitle>
      </CardHeader>
      <CardContent variant="light" className="pt-2 lg:pt-4">
        <div className="space-y-1.5 lg:space-y-2 text-xs lg:text-sm">
          <div className="flex justify-between py-1.5 lg:py-2 border-b border-gray-200">
            <span className="text-gray-600">월 - 금</span>
            <span className="font-semibold text-gray-900">09:00 - 18:00</span>
          </div>
          <div className="flex justify-between py-1.5 lg:py-2 border-b border-gray-200">
            <span className="text-gray-600">토요일</span>
            <span className="font-semibold text-red-500">휴무</span>
          </div>
          <div className="flex justify-between py-1.5 lg:py-2">
            <span className="text-gray-600">일요일 / 공휴일</span>
            <span className="font-semibold text-red-500">휴무</span>
          </div>
        </div>

        {/* 빠른 응답 안내 */}
        <div className="mt-3 lg:mt-4 bg-primary-50 border border-primary-100 rounded-lg p-2.5 lg:p-3">
          <p className="text-[10px] lg:text-xs text-primary-700">
            <span className="font-semibold">빠른 응답!</span> 상담 신청 후 1영업일 내 연락드립니다.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
