'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Globe, Target, MessageSquare, Bell, BarChart3, Brain, ArrowDown, ArrowRight, CheckCircle2, Smartphone, Mail, Send, ChevronLeft, ChevronRight } from 'lucide-react'

export default function ServiceFlowMockupSection() {
    const notificationScrollRef = useRef<HTMLDivElement>(null)

    const scrollNotifications = (direction: 'left' | 'right') => {
        if (notificationScrollRef.current) {
            const scrollAmount = 200
            notificationScrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    return (
        <section className="py-16 lg:py-28 bg-gray-900 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:60px_60px]"></div>
            </div>

            <div className="container relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10 lg:mb-16"
                >
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 lg:mb-4 break-keep">
                        이렇게 <span className="text-primary-400">자동화</span>됩니다
                    </h2>
                    <p className="text-gray-400 text-base lg:text-lg max-w-2xl mx-auto break-keep">
                        홈페이지부터 고객 알림까지, 원스톱 자동화
                    </p>
                </motion.div>

                {/* Flow Mockup Container */}
                <div className="max-w-5xl mx-auto">
                    {/* Step 1: 홈페이지 제작 */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mb-6 lg:mb-8"
                    >
                        <div className="flex items-start gap-3 lg:gap-6">
                            {/* Step Number */}
                            <div className="flex flex-col items-center shrink-0">
                                <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-blue-500 flex items-center justify-center text-white font-bold text-base lg:text-lg shadow-lg shadow-blue-500/30">
                                    1
                                </div>
                                <div className="w-0.5 h-16 lg:h-20 bg-gradient-to-b from-blue-500 to-emerald-500 mt-2"></div>
                            </div>

                            {/* Content Card */}
                            <div className="flex-1 min-w-0 bg-gray-800/50 border border-gray-700/50 rounded-xl lg:rounded-2xl p-4 lg:p-6 backdrop-blur-sm">
                                <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
                                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                                        <Globe className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
                                    </div>
                                    <h3 className="text-base lg:text-xl font-bold text-white">홈페이지 제작</h3>
                                </div>

                                {/* Browser Mockup - 모바일 간소화 */}
                                <div className="bg-gray-900 rounded-lg lg:rounded-xl overflow-hidden border border-gray-700">
                                    {/* Browser Header */}
                                    <div className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-gray-800 border-b border-gray-700">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-red-500/60"></div>
                                            <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-yellow-500/60"></div>
                                            <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-green-500/60"></div>
                                        </div>
                                        <div className="flex-1 mx-2 lg:mx-4">
                                            <div className="bg-gray-700 rounded px-2 py-0.5 lg:py-1 text-[10px] lg:text-xs text-gray-400 truncate">
                                                your-company.co.kr
                                            </div>
                                        </div>
                                    </div>
                                    {/* Browser Content - 모바일 간소화 */}
                                    <div className="p-3 lg:p-6">
                                        <div className="flex flex-col lg:flex-row gap-3 lg:gap-6">
                                            <div className="flex-1 space-y-2 lg:space-y-3">
                                                <div className="h-4 lg:h-6 bg-gradient-to-r from-blue-500/30 to-transparent rounded w-2/3"></div>
                                                <div className="h-2 lg:h-3 bg-gray-700 rounded w-full"></div>
                                                <div className="h-2 lg:h-3 bg-gray-700 rounded w-4/5"></div>
                                                <div className="hidden lg:block h-3 bg-gray-700 rounded w-3/5"></div>
                                                <div className="mt-3 lg:mt-4 flex gap-2">
                                                    <div className="h-6 lg:h-8 bg-blue-500 rounded-lg w-16 lg:w-24"></div>
                                                    <div className="h-6 lg:h-8 bg-gray-700 rounded-lg w-14 lg:w-20"></div>
                                                </div>
                                            </div>
                                            <div className="hidden lg:flex w-40 h-auto bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg items-center justify-center">
                                                <div className="text-xs text-gray-500">Hero Image</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 lg:mt-4 flex flex-wrap gap-1.5 lg:gap-2">
                                    <span className="px-2 lg:px-3 py-0.5 lg:py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-[10px] lg:text-xs text-blue-400">반응형</span>
                                    <span className="px-2 lg:px-3 py-0.5 lg:py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-[10px] lg:text-xs text-blue-400">10페이지</span>
                                    <span className="px-2 lg:px-3 py-0.5 lg:py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-[10px] lg:text-xs text-blue-400">문의 폼</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Step 2: Meta 광고 노출 → DB 접수 */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mb-6 lg:mb-8"
                    >
                        <div className="flex items-start gap-3 lg:gap-6">
                            {/* Step Number */}
                            <div className="flex flex-col items-center shrink-0">
                                <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-emerald-500 flex items-center justify-center text-white font-bold text-base lg:text-lg shadow-lg shadow-emerald-500/30">
                                    2
                                </div>
                                <div className="w-0.5 h-24 lg:h-32 bg-gradient-to-b from-emerald-500 to-amber-500 mt-2"></div>
                            </div>

                            {/* Content Card */}
                            <div className="flex-1 min-w-0 bg-gray-800/50 border border-gray-700/50 rounded-xl lg:rounded-2xl p-4 lg:p-6 backdrop-blur-sm">
                                <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
                                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                                        <Target className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-400" />
                                    </div>
                                    <h3 className="text-sm lg:text-xl font-bold text-white">광고 노출 → DB 접수</h3>
                                </div>

                                {/* Flow Diagram - 모바일 최적화 */}
                                <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
                                    {/* Meta Ads - 모바일 간소화 */}
                                    <div className="flex-1 bg-gray-900 rounded-lg lg:rounded-xl p-3 lg:p-4 border border-gray-700">
                                        <div className="flex items-center gap-2 mb-2 lg:mb-3">
                                            <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                                                <span className="text-white text-[10px] lg:text-xs font-bold">M</span>
                                            </div>
                                            <span className="text-xs lg:text-sm font-medium text-white">Meta 광고</span>
                                            <span className="ml-auto text-[10px] lg:text-xs text-emerald-400 flex items-center">
                                                <CheckCircle2 className="w-3 h-3 mr-0.5" />
                                                노출 중
                                            </span>
                                        </div>
                                        <div className="h-12 lg:h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                                            <span className="text-[10px] lg:text-xs text-gray-400">광고 소재</span>
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <div className="flex justify-center lg:hidden">
                                        <ArrowDown className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div className="hidden lg:flex items-center justify-center shrink-0">
                                        <ArrowRight className="w-6 h-6 text-emerald-400" />
                                    </div>

                                    {/* DB 접수 */}
                                    <div className="flex-1 bg-gray-900 rounded-lg lg:rounded-xl p-3 lg:p-4 border border-emerald-500/30">
                                        <div className="flex items-center gap-2 mb-2 lg:mb-3">
                                            <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                                <MessageSquare className="w-3 h-3 lg:w-4 lg:h-4 text-emerald-400" />
                                            </div>
                                            <span className="text-xs lg:text-sm font-medium text-white">DB 자동 접수</span>
                                        </div>
                                        <div className="space-y-1.5 lg:space-y-2 text-[11px] lg:text-xs">
                                            <div className="flex justify-between py-1 border-b border-gray-700">
                                                <span className="text-gray-400">이름</span>
                                                <span className="text-white">김영업</span>
                                            </div>
                                            <div className="flex justify-between py-1 border-b border-gray-700">
                                                <span className="text-gray-400">연락처</span>
                                                <span className="text-white">010-****-1234</span>
                                            </div>
                                            <div className="flex justify-between py-1">
                                                <span className="text-gray-400">문의</span>
                                                <span className="text-white">상담 요청</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Step 3: 실시간 알림 */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="mb-6 lg:mb-8"
                    >
                        <div className="flex items-start gap-3 lg:gap-6">
                            {/* Step Number */}
                            <div className="flex flex-col items-center shrink-0">
                                <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-amber-500 flex items-center justify-center text-white font-bold text-base lg:text-lg shadow-lg shadow-amber-500/30">
                                    3
                                </div>
                                <div className="w-0.5 h-16 lg:h-20 bg-gradient-to-b from-amber-500 to-purple-500 mt-2"></div>
                            </div>

                            {/* Content Card */}
                            <div className="flex-1 min-w-0 bg-gray-800/50 border border-gray-700/50 rounded-xl lg:rounded-2xl p-4 lg:p-6 backdrop-blur-sm">
                                <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
                                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                                        <Bell className="w-4 h-4 lg:w-5 lg:h-5 text-amber-400" />
                                    </div>
                                    <h3 className="text-base lg:text-xl font-bold text-white">실시간 알림</h3>
                                </div>

                                {/* Mobile: Horizontal Scroll */}
                                <div className="sm:hidden relative">
                                    <button
                                        onClick={() => scrollNotifications('left')}
                                        className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-gray-800/90 border border-gray-600 rounded-full flex items-center justify-center text-white"
                                        aria-label="이전"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => scrollNotifications('right')}
                                        className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-gray-800/90 border border-gray-600 rounded-full flex items-center justify-center text-white"
                                        aria-label="다음"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                    <div
                                        ref={notificationScrollRef}
                                        className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1"
                                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                    >
                                        {/* SMS */}
                                        <div className="bg-gray-900 rounded-lg p-3 border border-gray-700 flex-shrink-0 w-[160px] snap-center">
                                            <div className="flex items-center gap-1.5 mb-2">
                                                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                                                <span className="text-[10px] font-medium text-gray-400">문자 발송</span>
                                            </div>
                                            <div className="bg-gray-800 rounded-lg p-2">
                                                <div className="text-[10px] text-gray-300 leading-relaxed">
                                                    <span className="text-amber-400">[폴라애드]</span><br />
                                                    상담 신청이<br />
                                                    접수되었습니다.
                                                </div>
                                            </div>
                                        </div>

                                        {/* Telegram */}
                                        <div className="bg-gray-900 rounded-lg p-3 border border-gray-700 flex-shrink-0 w-[160px] snap-center">
                                            <div className="flex items-center gap-1.5 mb-2">
                                                <Send className="w-3.5 h-3.5 text-blue-400" />
                                                <span className="text-[10px] font-medium text-gray-400">텔레그램</span>
                                            </div>
                                            <div className="bg-[#1c2833] rounded-lg p-2">
                                                <div className="text-[10px] text-gray-300 leading-relaxed">
                                                    <span className="text-blue-400">🔔 새 문의!</span><br />
                                                    김영업<br />
                                                    010-****-1234
                                                </div>
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="bg-gray-900 rounded-lg p-3 border border-gray-700 flex-shrink-0 w-[160px] snap-center">
                                            <div className="flex items-center gap-1.5 mb-2">
                                                <Mail className="w-3.5 h-3.5 text-red-400" />
                                                <span className="text-[10px] font-medium text-gray-400">이메일</span>
                                            </div>
                                            <div className="bg-white rounded-lg p-2">
                                                <div className="text-[10px] text-gray-800 leading-relaxed">
                                                    <div className="font-semibold text-gray-900">새 상담 신청</div>
                                                    <div className="text-gray-600">김영업님이 신청</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop: Grid */}
                                <div className="hidden sm:grid sm:grid-cols-3 gap-4">
                                    {/* SMS */}
                                    <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Smartphone className="w-4 h-4 text-amber-400" />
                                            <span className="text-xs font-medium text-gray-400">고객 문자 발송</span>
                                        </div>
                                        <div className="bg-gray-800 rounded-lg p-3">
                                            <div className="text-xs text-gray-300 leading-relaxed">
                                                <span className="text-amber-400">[폴라애드]</span><br />
                                                김영업님, 상담 신청이<br />
                                                접수되었습니다.<br />
                                                <span className="text-gray-500">빠른 시일 내 연락드리겠습니다.</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Telegram */}
                                    <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Send className="w-4 h-4 text-blue-400" />
                                            <span className="text-xs font-medium text-gray-400">텔레그램 알림</span>
                                        </div>
                                        <div className="bg-[#1c2833] rounded-lg p-3">
                                            <div className="text-xs text-gray-300 leading-relaxed">
                                                <span className="text-blue-400">🔔 새 문의 접수!</span><br />
                                                <span className="text-gray-400">이름:</span> 김영업<br />
                                                <span className="text-gray-400">연락처:</span> 010-****-1234<br />
                                                <span className="text-gray-500 text-[10px]">방금 전</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Mail className="w-4 h-4 text-red-400" />
                                            <span className="text-xs font-medium text-gray-400">이메일 알림</span>
                                        </div>
                                        <div className="bg-white rounded-lg p-3">
                                            <div className="text-xs text-gray-800 leading-relaxed">
                                                <div className="font-semibold text-gray-900 mb-1">새 상담 신청</div>
                                                <div className="text-gray-600">
                                                    김영업님이 상담을<br />
                                                    신청했습니다.
                                                </div>
                                                <div className="mt-2 text-[10px] text-blue-600">자세히 보기 →</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Step 4: 리포트 & AI 인사이트 */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="flex items-start gap-3 lg:gap-6">
                            {/* Step Number */}
                            <div className="flex flex-col items-center shrink-0">
                                <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-purple-500 flex items-center justify-center text-white font-bold text-base lg:text-lg shadow-lg shadow-purple-500/30">
                                    4
                                </div>
                            </div>

                            {/* Content Card */}
                            <div className="flex-1 min-w-0 bg-gray-800/50 border border-gray-700/50 rounded-xl lg:rounded-2xl p-4 lg:p-6 backdrop-blur-sm">
                                <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
                                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                                        <BarChart3 className="w-4 h-4 lg:w-5 lg:h-5 text-purple-400" />
                                    </div>
                                    <h3 className="text-sm lg:text-xl font-bold text-white">리포트 & AI 분석</h3>
                                </div>

                                {/* Report Mockup - 모바일 탭 스타일 */}
                                <div className="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-4">
                                    {/* Auto Report */}
                                    <div className="bg-gray-900 rounded-lg lg:rounded-xl p-3 lg:p-4 border border-gray-700">
                                        <div className="flex items-center justify-between mb-3 lg:mb-4">
                                            <span className="text-xs lg:text-sm font-medium text-white">자동 리포트</span>
                                            <span className="px-1.5 lg:px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] lg:text-xs rounded">실시간</span>
                                        </div>

                                        {/* 모바일: 2x2 그리드 / 데스크탑: 리스트 */}
                                        <div className="grid grid-cols-2 gap-2 lg:hidden">
                                            <div className="bg-gray-800 rounded-lg p-2 text-center">
                                                <div className="text-[10px] text-gray-400">노출수</div>
                                                <div className="text-sm font-bold text-white">12,458</div>
                                            </div>
                                            <div className="bg-gray-800 rounded-lg p-2 text-center">
                                                <div className="text-[10px] text-gray-400">클릭수</div>
                                                <div className="text-sm font-bold text-white">847</div>
                                            </div>
                                            <div className="bg-gray-800 rounded-lg p-2 text-center">
                                                <div className="text-[10px] text-gray-400">전환수</div>
                                                <div className="text-sm font-bold text-emerald-400">23</div>
                                            </div>
                                            <div className="bg-gray-800 rounded-lg p-2 text-center">
                                                <div className="text-[10px] text-gray-400">CPA</div>
                                                <div className="text-sm font-bold text-white">₩4,350</div>
                                            </div>
                                        </div>

                                        {/* 데스크탑 리스트 */}
                                        <div className="hidden lg:block space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-400">노출수</span>
                                                <span className="text-sm font-semibold text-white">12,458</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-400">클릭수</span>
                                                <span className="text-sm font-semibold text-white">847</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-400">전환수</span>
                                                <span className="text-sm font-semibold text-emerald-400">23</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-400">CPA</span>
                                                <span className="text-sm font-semibold text-white">₩4,350</span>
                                            </div>
                                        </div>

                                        {/* Mini Chart */}
                                        <div className="mt-3 lg:mt-4 h-10 lg:h-16 flex items-end gap-0.5 lg:gap-1">
                                            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                                <div
                                                    key={i}
                                                    className="flex-1 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t"
                                                    style={{ height: `${h}%` }}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* AI Insight */}
                                    <div className="bg-gray-900 rounded-lg lg:rounded-xl p-3 lg:p-4 border border-purple-500/30">
                                        <div className="flex items-center gap-2 mb-3 lg:mb-4">
                                            <Brain className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-purple-400" />
                                            <span className="text-xs lg:text-sm font-medium text-white">AI 인사이트</span>
                                            <span className="px-1.5 lg:px-2 py-0.5 bg-purple-500/20 text-purple-400 text-[10px] lg:text-xs rounded">주간</span>
                                        </div>
                                        <div className="space-y-2 lg:space-y-3">
                                            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-2 lg:p-3">
                                                <div className="flex items-start gap-1.5 lg:gap-2">
                                                    <span className="text-purple-400 text-sm lg:text-lg">💡</span>
                                                    <div className="text-[10px] lg:text-xs text-gray-300 leading-relaxed">
                                                        <strong className="text-white">전환율 상승</strong><br />
                                                        <span className="hidden lg:inline">오후 6-9시 </span>전환율 <span className="text-emerald-400">23% ↑</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-2 lg:p-3">
                                                <div className="flex items-start gap-1.5 lg:gap-2">
                                                    <span className="text-purple-400 text-sm lg:text-lg">📊</span>
                                                    <div className="text-[10px] lg:text-xs text-gray-300 leading-relaxed">
                                                        <strong className="text-white">소재 성과</strong><br />
                                                        이미지 A CTR <span className="text-emerald-400">1.8배 ↑</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 lg:mt-4 text-center">
                                            <span className="text-[9px] lg:text-[10px] text-gray-500">매주 월요일 자동 발송</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-10 lg:mt-12 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 bg-primary-500/10 border border-primary-500/30 rounded-full">
                        <CheckCircle2 className="w-4 h-4 lg:w-5 lg:h-5 text-primary-400" />
                        <span className="text-primary-400 font-medium text-sm lg:text-base">모든 과정이 자동 연결</span>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
