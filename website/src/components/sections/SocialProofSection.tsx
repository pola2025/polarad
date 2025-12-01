'use client'

import { useRef, useState } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card } from '../ui/Card'
import { motion } from 'framer-motion'

export default function SocialProofSection() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const sliderRef = useRef<HTMLDivElement>(null)
    const reviews = [
        {
            company: "K 경영컨설팅",
            role: "법인 영업 5년차",
            content: "매달 200만원씩 DB를 사서 썼는데, 결번이 30%였습니다. PolaAd 시스템 도입 후에는 제가 직접 타겟팅한 대표님들이 상담 신청을 하니 미팅 성사율이 3배가 넘었습니다. 이제 DB 구매는 끊었습니다.",
            metric: "월 매출 1,500만 → 5,200만",
            tag: "정책자금"
        },
        {
            company: "S 세무회계",
            role: "대표 세무사",
            content: "블로그 상위노출, 인스타 대행 다 해봤지만 효과가 없었습니다. 여기는 'DB를 뽑는 기계'를 만들어줍니다. 아침에 출근하면 상담 신청이 3~4건씩 와있으니 영업 직원들이 신나서 일합니다.",
            metric: "상담 신청 월 5건 → 42건",
            tag: "세무기장"
        },
        {
            company: "M 보험법인",
            role: "지점장",
            content: "영업 사원들에게 '지인 영업' 강요하다가 다 퇴사했었습니다. 이제는 회사가 DB를 제공해주니 채용도 잘되고, 팀원들 정착률도 높아졌습니다. 진작 할 걸 그랬습니다.",
            metric: "팀원 정착률 20% → 90%",
            tag: "법인보험"
        }
    ]

    return (
        <section className="py-20 lg:py-32 bg-white overflow-hidden">
            <div className="container">
                <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-sm font-bold mb-6">
                        <Star className="w-4 h-4 fill-primary-600" />
                        <span>검증된 성공 사례</span>
                    </div>
                    <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight break-keep">
                        &ldquo;시스템을 도입하자,<br />
                        <span className="text-primary-600">매출이 폭발했습니다&rdquo;</span>
                    </h2>
                    <p className="text-lg text-gray-600 break-keep text-balance">
                        이미 120개 이상의 법인이 PolaAd 시스템을 통해<br />
                        &lsquo;을&rsquo;의 영업에서 &lsquo;갑&rsquo;의 영업으로 전환했습니다.
                    </p>
                </div>

                {/* Desktop Grid */}
                <div className="hidden lg:grid lg:grid-cols-3 gap-8">
                    {reviews.map((review, idx) => (
                        <Card key={idx} className="p-8 bg-gray-50 border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="bg-white p-3 rounded-xl shadow-sm text-primary-500">
                                    <Quote className="w-6 h-6" />
                                </div>
                                <span className="px-3 py-1 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-500">
                                    {review.tag}
                                </span>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-center gap-1 text-yellow-400 mb-2">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} className="w-4 h-4 fill-yellow-400" />
                                    ))}
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg mb-1">{review.metric}</h3>
                                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary-500 w-3/4 group-hover:w-full transition-all duration-1000"></div>
                                </div>
                            </div>

                            <p className="text-gray-600 leading-relaxed mb-6 min-h-[100px] break-keep">
                                &ldquo;{review.content}&rdquo;
                            </p>

                            <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                                    {review.company[0]}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">{review.company}</div>
                                    <div className="text-xs text-gray-500">{review.role}</div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Mobile Slider */}
                <div className="lg:hidden relative">
                    <div className="overflow-hidden" ref={sliderRef}>
                        <motion.div
                            className="flex"
                            animate={{ x: `-${currentIndex * 100}%` }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        >
                            {reviews.map((review, idx) => (
                                <div key={idx} className="w-full flex-shrink-0 px-2">
                                    <Card className="p-6 bg-gray-50 border border-gray-100">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="bg-white p-2.5 rounded-xl shadow-sm text-primary-500">
                                                <Quote className="w-5 h-5" />
                                            </div>
                                            <span className="px-2.5 py-1 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-500">
                                                {review.tag}
                                            </span>
                                        </div>

                                        <div className="mb-4">
                                            <div className="flex items-center gap-1 text-yellow-400 mb-2">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400" />
                                                ))}
                                            </div>
                                            <h3 className="font-bold text-gray-900 text-base mb-1">{review.metric}</h3>
                                            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary-500 w-3/4"></div>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600 leading-relaxed mb-4 break-keep">
                                            &ldquo;{review.content}&rdquo;
                                        </p>

                                        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                                            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm">
                                                {review.company[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm">{review.company}</div>
                                                <div className="text-xs text-gray-500">{review.role}</div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-center gap-4 mt-6">
                        <button
                            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                            disabled={currentIndex === 0}
                            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            aria-label="이전 후기"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex gap-2">
                            {reviews.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                                        idx === currentIndex ? 'bg-primary-500' : 'bg-gray-300'
                                    }`}
                                    aria-label={`${idx + 1}번째 후기로 이동`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentIndex(Math.min(reviews.length - 1, currentIndex + 1))}
                            disabled={currentIndex === reviews.length - 1}
                            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            aria-label="다음 후기"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
