'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Printer, Globe, Target, ChevronDown,
    CheckCircle2, AlertTriangle, Info
} from 'lucide-react'

interface AccordionItemProps {
    id: string
    icon: React.ElementType
    title: string
    color: string
    isOpen: boolean
    onToggle: () => void
    children: React.ReactNode
}

function AccordionItem({ id, icon: Icon, title, color, isOpen, onToggle, children }: AccordionItemProps) {
    const colorClasses = {
        amber: {
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            borderOpen: 'border-amber-400',
            icon: 'bg-amber-100 text-amber-600',
            hover: 'hover:bg-amber-100/50'
        },
        blue: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            borderOpen: 'border-blue-400',
            icon: 'bg-blue-100 text-blue-600',
            hover: 'hover:bg-blue-100/50'
        },
        emerald: {
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            borderOpen: 'border-emerald-400',
            icon: 'bg-emerald-100 text-emerald-600',
            hover: 'hover:bg-emerald-100/50'
        }
    }
    const colors = colorClasses[color as keyof typeof colorClasses]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`rounded-2xl border ${isOpen ? colors.borderOpen : colors.border} bg-white shadow-sm overflow-hidden transition-all`}
        >
            {/* Accordion Header */}
            <button
                onClick={onToggle}
                className={`w-full flex items-center justify-between p-5 sm:p-6 ${colors.hover} transition-colors text-left`}
                aria-expanded={isOpen}
                aria-controls={`accordion-content-${id}`}
            >
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${colors.icon} flex items-center justify-center shrink-0`}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="text-[13px] sm:text-base lg:text-lg font-bold text-gray-900 whitespace-nowrap">{title}</h3>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 ml-4"
                >
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                </motion.div>
            </button>

            {/* Accordion Content */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        id={`accordion-content-${id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-gray-100">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default function ServiceDetailsSection() {
    const [openId, setOpenId] = useState<string | null>(null)

    const toggleAccordion = (id: string) => {
        setOpenId(openId === id ? null : id)
    }

    return (
        <section className="py-20 lg:py-28 bg-gray-50">
            <div className="container">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 break-keep">
                        상세 서비스 안내
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto break-keep">
                        각 서비스의 상세 내용을 확인해보세요
                    </p>
                </motion.div>

                {/* Accordion List */}
                <div className="space-y-4">
                    {/* 인쇄물 */}
                    <AccordionItem
                        id="print"
                        icon={Printer}
                        title="신뢰의 첫인상, 인쇄물"
                        color="amber"
                        isOpen={openId === 'print'}
                        onToggle={() => toggleAccordion('print')}
                    >
                        <div className="space-y-6">
                            {/* 포함 품목 */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-amber-500" />
                                    포함 품목
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                        <div className="font-medium text-gray-900 mb-1">명함</div>
                                        <div className="text-sm text-gray-500">아르미 울트라화이트 310g / 200매</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                        <div className="font-medium text-gray-900 mb-1">대봉투</div>
                                        <div className="text-sm text-gray-500">모조지 150g / 500매</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                        <div className="font-medium text-gray-900 mb-1">계약서</div>
                                        <div className="text-sm text-gray-500">A3 모조지 180g / 500매</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                        <div className="font-medium text-gray-900 mb-1">명찰</div>
                                        <div className="text-sm text-gray-500">투명케이스 + 명찰카드 + 목걸이</div>
                                    </div>
                                </div>
                            </div>

                            {/* 중요 안내 */}
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <h4 className="font-semibold text-amber-700 mb-2 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    중요 안내사항
                                </h4>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li>• 로고 AI 파일(일러스트 형식)을 반드시 제공해주셔야 합니다.</li>
                                    <li>• 로고가 없는 경우, 로고 없이 제작이 진행됩니다.</li>
                                    <li>• 최종 승인 후 발주된 인쇄물의 오탈자로 인한 재인쇄는 고객 부담입니다.</li>
                                </ul>
                            </div>

                            {/* 제작 프로세스 */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">제작 프로세스</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['디자인 시안 제작', '고객 검수', '최종 승인', '발주'].map((step, i) => (
                                        <div key={step} className="flex items-center gap-2">
                                            <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-1 rounded">
                                                {i + 1}단계
                                            </span>
                                            <span className="text-gray-700 text-sm">{step}</span>
                                            {i < 3 && <span className="text-gray-300">→</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </AccordionItem>

                    {/* 홈페이지 */}
                    <AccordionItem
                        id="website"
                        icon={Globe}
                        title="24시간 영업사원, 홈페이지"
                        color="blue"
                        isOpen={openId === 'website'}
                        onToggle={() => toggleAccordion('website')}
                    >
                        <div className="space-y-6">
                            {/* 포함 내용 */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                    포함 내용
                                </h4>
                                <ul className="space-y-2 text-gray-700 text-xs sm:text-sm lg:text-base">
                                    <li className="flex items-start gap-2 whitespace-nowrap">
                                        <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                        기본 10페이지 이내 제작
                                    </li>
                                    <li className="flex items-start gap-2 whitespace-nowrap">
                                        <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                        도메인 + 호스팅 1년간 무료 제공
                                    </li>
                                    <li className="flex items-start gap-2 whitespace-nowrap">
                                        <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                        반응형 디자인 (모바일/태블릿/PC 대응)
                                    </li>
                                    <li className="flex items-start gap-2 whitespace-nowrap">
                                        <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                        결제 모듈 탑재 가능 (토스페이먼츠)
                                    </li>
                                    <li className="flex items-start gap-2 whitespace-nowrap">
                                        <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                        기본 DB 자동화 1개 (문의 폼 자동 수집)
                                    </li>
                                </ul>
                            </div>

                            {/* 페이지 정의 */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
                                    <Info className="w-4 h-4" />
                                    페이지 정의 기준
                                </h4>
                                <ul className="space-y-1 text-[11px] sm:text-xs lg:text-sm text-gray-600">
                                    <li className="whitespace-nowrap">• <strong className="text-gray-800">1페이지</strong> = 헤더/푸터 포함 5개 섹션 이하</li>
                                    <li className="whitespace-nowrap">• <strong className="text-gray-800">섹션</strong> = 설명 또는 서비스 안내 항목 1개 영역</li>
                                    <li className="whitespace-nowrap">• 섹션이 5개 초과 시 추가 페이지로 계산</li>
                                </ul>
                            </div>

                            {/* 추가 비용 */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">추가 비용</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="text-gray-700">추가 페이지</span>
                                        <span className="font-semibold text-gray-900">220,000원 / 페이지</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="text-gray-700">기획 변경</span>
                                        <span className="font-semibold text-gray-900">200,000원 (VAT 별도)</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    ※ 기획서 미제출 시 폴라애드 자체 제안 (1회 무료)
                                </p>
                            </div>

                            {/* 2년차 유지비용 */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">2년차 이후 유지 비용 (선택)</h4>
                                <div className="space-y-2">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2 border-b border-gray-200 gap-1">
                                        <span className="text-gray-700">도메인 + 호스팅 연장</span>
                                        <span className="font-semibold text-gray-900">500,000원/년</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2 border-b border-gray-200 gap-1">
                                        <span className="text-gray-700">도메인 + 호스팅 + DB 자동화</span>
                                        <span className="font-semibold text-gray-900">1,000,000원/년</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    * DB 자동화 1개 기준, 추가 자동화 개당 100,000원/년 (VAT 별도)
                                </p>
                            </div>
                        </div>
                    </AccordionItem>

                    {/* 광고 지원 */}
                    <AccordionItem
                        id="ads"
                        icon={Target}
                        title="실시간 잠재고객 발굴, 광고지원"
                        color="emerald"
                        isOpen={openId === 'ads'}
                        onToggle={() => toggleAccordion('ads')}
                    >
                        <div className="space-y-6">
                            {/* 포함 내용 */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    포함 내용
                                </h4>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                        Meta 광고 계정 연동 및 초기 설정
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                        광고 자동화 설정 지원
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                        고객 접수 실시간 전달 시스템 구축
                                    </li>
                                </ul>
                            </div>

                            {/* 주의사항 */}
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <h4 className="font-semibold text-amber-700 mb-2 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    필수 안내사항
                                </h4>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-600">•</span>
                                        <span>광고 소재(이미지/영상)는 <strong className="text-gray-900">직접 준비</strong>해주셔야 합니다.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-600">•</span>
                                        <span>광고비는 별도이며, 고객이 직접 Meta 광고 계정에 충전합니다.</span>
                                    </li>
                                </ul>
                            </div>

                            {/* 안내 */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <p className="text-gray-700 text-sm break-keep">
                                    폴라애드는 광고 세팅과 최적화를 지원합니다.<br />
                                    전달주신 소재로 타겟 설정, 자동화, 리포팅까지 모두 대행해드립니다.
                                </p>
                            </div>
                        </div>
                    </AccordionItem>
                </div>
            </div>
        </section>
    )
}
