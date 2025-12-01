import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Mail, Phone, MapPin } from 'lucide-react'

export function ContactInfoSection() {
  return (
    <Card variant="light">
      <CardHeader className="pb-2 lg:pb-4">
        <CardTitle variant="light" className="text-base lg:text-lg">연락처 정보</CardTitle>
      </CardHeader>
      <CardContent variant="light" className="pt-2 lg:pt-4 space-y-3 lg:space-y-4">
        <div className="flex items-start gap-2.5 lg:gap-3">
          <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4 lg:w-5 lg:h-5 text-primary-500" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 text-xs lg:text-sm mb-0.5">이메일</div>
            <a href="mailto:mkt@polarad.co.kr" className="text-primary-600 hover:underline text-xs lg:text-sm break-all">
              mkt@polarad.co.kr
            </a>
          </div>
        </div>

        <div className="flex items-start gap-2.5 lg:gap-3">
          <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <Phone className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-500" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 text-xs lg:text-sm mb-0.5">전화</div>
            <a href="tel:032-345-9834" className="text-primary-600 hover:underline text-xs lg:text-sm">
              032-345-9834
            </a>
            <div className="text-[10px] lg:text-xs text-gray-500 mt-0.5">
              평일 09:00 - 18:00
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2.5 lg:gap-3">
          <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-amber-500" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 text-xs lg:text-sm mb-0.5">주소</div>
            <div className="text-gray-600 text-xs lg:text-sm leading-relaxed">
              <span className="hidden sm:inline">서울특별시 금천구 가산디지털2로 98<br />롯데 IT 캐슬 2동 11층 1107</span>
              <span className="sm:hidden">서울 금천구 가산디지털2로 98</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
