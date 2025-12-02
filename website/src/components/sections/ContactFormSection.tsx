'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Send } from 'lucide-react'

export function ContactFormSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  })
  const [privacyAgreed, setPrivacyAgreed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!privacyAgreed) {
      alert('개인정보 수집 및 이용에 동의해주세요.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('https://pola-homepage.mkt9834.workers.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          privacyAgreed: privacyAgreed
        })
      })

      const result = await response.json()

      if (result.success) {
        // GA4 전환 이벤트 - 패키지 상담
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'package_form_submit', {
            event_category: 'conversion',
            event_label: 'package_consult'
          })
        }

        alert('상담 신청이 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.')
        // 폼 초기화
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          message: ''
        })
        setPrivacyAgreed(false)
      } else {
        alert('신청 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('신청 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  return (
    <Card variant="light">
      <CardHeader className="pb-2 lg:pb-4">
        <CardTitle variant="light" className="text-lg lg:text-xl">무료 상담 신청</CardTitle>
        <p className="text-xs lg:text-sm text-gray-500 mt-1 lg:mt-2">
          1영업일 내에 답변 드리겠습니다
        </p>
      </CardHeader>
      <CardContent variant="light" className="pt-2 lg:pt-4">
        <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
          {/* 2열 그리드 - 이름/회사명 */}
          <div className="grid grid-cols-2 gap-2 lg:gap-3">
            <div className="min-w-0">
              <Input
                label="이름"
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="홍길동"
                variant="light"
              />
            </div>
            <div className="min-w-0">
              <Input
                label="회사명"
                id="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                required
                placeholder="회사명"
                variant="light"
              />
            </div>
          </div>

          {/* 2열 그리드 - 이메일/연락처 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-3">
            <div className="min-w-0">
              <Input
                label="이메일"
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="email@company.com"
                variant="light"
              />
            </div>
            <div className="min-w-0">
              <Input
                label="연락처"
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="010-0000-0000"
                variant="light"
              />
            </div>
          </div>

          <Textarea
            label="문의 내용"
            id="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            placeholder="문의하실 내용을 자세히 적어주세요"
            variant="light"
            className="text-sm"
          />

          {/* 개인정보 동의 체크박스 */}
          <label className="flex items-start gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={privacyAgreed}
              onChange={(e) => setPrivacyAgreed(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
            />
            <span className="text-xs lg:text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
              <span className="text-red-500">*</span> 개인정보 수집 및 이용에 동의합니다
            </span>
          </label>

          <Button type="submit" className="w-full" size="lg" disabled={!privacyAgreed || isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                신청 중...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                상담 신청하기
              </>
            )}
          </Button>

          <p className="text-[10px] lg:text-xs text-center text-gray-400">
            수집된 개인정보는 상담 목적으로만 사용되며,<br className="sm:hidden" /> 상담 완료 후 파기됩니다.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
