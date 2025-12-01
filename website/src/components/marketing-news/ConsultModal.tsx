'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Send, CheckCircle } from 'lucide-react'

interface ConsultModalProps {
  isOpen: boolean
  onClose: () => void
  source?: string // 어떤 글에서 왔는지 (slug)
}

export function ConsultModal({ isOpen, onClose, source = 'marketing-news' }: ConsultModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: '',
    message: ''
  })
  const [privacyAgreed, setPrivacyAgreed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!privacyAgreed) {
      alert('개인정보 수집 및 이용에 동의해주세요.')
      return
    }

    setIsSubmitting(true)

    try {
      // 마케팅 상담용 별도 endpoint (type: 'marketing-consult')
      const response = await fetch('https://pola-homepage.mkt9834.workers.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'marketing-consult', // 올인원 패키지와 구분
          name: formData.name,
          company: formData.company,
          phone: formData.phone,
          message: formData.message,
          source: source,
          privacyAgreed: privacyAgreed
        })
      })

      const result = await response.json()

      if (result.success) {
        setIsSuccess(true)
        // 3초 후 모달 닫기
        setTimeout(() => {
          setIsSuccess(false)
          setFormData({ name: '', phone: '', company: '', message: '' })
          setPrivacyAgreed(false)
          onClose()
        }, 3000)
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

  // 성공 화면
  if (isSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">신청 완료!</h3>
          <p className="text-gray-600">
            빠른 시일 내에 연락드리겠습니다.
          </p>
        </div>
      </Modal>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="무료 마케팅 상담" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
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
          <Input
            label="회사명"
            id="company"
            type="text"
            value={formData.company}
            onChange={handleChange}
            placeholder="(선택)"
            variant="light"
          />
        </div>

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

        <Textarea
          label="문의 내용"
          id="message"
          value={formData.message}
          onChange={handleChange}
          rows={3}
          placeholder="궁금한 점이나 상담받고 싶은 내용을 적어주세요"
          variant="light"
        />

        {/* 개인정보 동의 */}
        <label className="flex items-start gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={privacyAgreed}
            onChange={(e) => setPrivacyAgreed(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
          />
          <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
            <span className="text-red-500">*</span> 개인정보 수집 및 이용에 동의합니다
          </span>
        </label>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={!privacyAgreed || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
              신청 중...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              무료 상담 신청
            </>
          )}
        </Button>

        <p className="text-xs text-center text-gray-400">
          수집된 개인정보는 상담 목적으로만 사용됩니다.
        </p>
      </form>
    </Modal>
  )
}
