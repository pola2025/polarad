import { Check, X, HelpCircle, Info, DollarSign, Clock, Smile } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ComparisonSection() {
    return (
        <section className="py-20 md:py-32 bg-neutral-50 border-t border-neutral-200">
            <div className="container">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4 break-keep text-balance">
                        왜 <span className="text-primary-600">PolaAd 올인원 솔루션</span>인가요?
                    </h2>
                    <p className="text-lg text-neutral-600 break-keep text-balance">
                        비용은 줄이고 효율은 극대화하는 가장 확실한 방법입니다.
                    </p>
                </div>

                <div className="overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                    <div className="min-w-[600px] md:min-w-0">
                        <div className="grid grid-cols-3 gap-4 md:gap-0 rounded-2xl overflow-hidden border border-neutral-200 md:border-none">
                            {/* Header */}
                            <div className="col-span-3 grid grid-cols-3 bg-neutral-50 border-b border-neutral-200 md:rounded-t-2xl">
                                <div className="p-4 md:p-6 text-center font-medium text-neutral-500 flex items-center justify-center">
                                    구분
                                </div>
                                <div className="p-4 md:p-6 text-center font-medium text-neutral-500 flex items-center justify-center border-l border-neutral-200">
                                    개별 진행 시
                                </div>
                                <div className="p-4 md:p-6 text-center font-bold text-primary-700 bg-primary-50/50 flex items-center justify-center border-l border-primary-100 relative">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-primary-500"></div>
                                    PolaAd 올인원
                                </div>
                            </div>

                            {/* Row 1: Cost */}
                            <div className="col-span-3 grid grid-cols-3 border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors">
                                <div className="p-4 md:p-6 flex items-center gap-2 text-neutral-900 font-medium">
                                    <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500 flex-shrink-0">
                                        <DollarSign className="w-4 h-4" />
                                    </div>
                                    <span>월 비용</span>
                                </div>
                                <div className="p-4 md:p-6 flex flex-col justify-center border-l border-neutral-100">
                                    <span className="text-neutral-400 line-through text-sm">400만원 + α</span>
                                    <span className="font-bold text-neutral-700">인건비 + 광고비 별도</span>
                                </div>
                                <div className="p-4 md:p-6 flex flex-col justify-center border-l border-primary-100 bg-primary-50/10">
                                    <span className="font-bold text-primary-600 text-lg">330만원</span>
                                    <span className="text-xs text-primary-600/80">모든 비용 포함</span>
                                </div>
                            </div>

                            {/* Row 2: Time */}
                            <div className="col-span-3 grid grid-cols-3 border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors">
                                <div className="p-4 md:p-6 flex items-center gap-2 text-neutral-900 font-medium">
                                    <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500 flex-shrink-0">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <span>소요 시간</span>
                                </div>
                                <div className="p-4 md:p-6 flex items-center border-l border-neutral-100 text-neutral-600">
                                    3~6개월 (제작+세팅)
                                </div>
                                <div className="p-4 md:p-6 flex items-center border-l border-primary-100 bg-primary-50/10 font-bold text-primary-700">
                                    즉시 시작 (세팅 완료)
                                </div>
                            </div>

                            {/* Row 3: Efficiency */}
                            <div className="col-span-3 grid grid-cols-3 border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors">
                                <div className="p-4 md:p-6 flex items-center gap-2 text-neutral-900 font-medium">
                                    <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500 flex-shrink-0">
                                        <span className="text-sm font-bold">E</span>
                                    </div>
                                    <span>영업 효율</span>
                                </div>
                                <div className="p-4 md:p-6 flex items-center border-l border-neutral-100 text-neutral-600">
                                    <X className="w-4 h-4 text-red-400 mr-2" />
                                    단순 반복 업무
                                </div>
                                <div className="p-4 md:p-6 flex items-center border-l border-primary-100 bg-primary-50/10 font-bold text-primary-700">
                                    <Check className="w-4 h-4 mr-2" />
                                    자동 DB 수집
                                </div>
                            </div>

                            {/* Row 4: Management */}
                            <div className="col-span-3 grid grid-cols-3 border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors">
                                <div className="p-4 md:p-6 flex items-center gap-2 text-neutral-900 font-medium">
                                    <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500 flex-shrink-0">
                                        <span className="text-sm font-bold">M</span>
                                    </div>
                                    <span>관리 포인트</span>
                                </div>
                                <div className="p-4 md:p-6 flex items-center border-l border-neutral-100 text-neutral-600">
                                    직원 채용/교육/관리
                                </div>
                                <div className="p-4 md:p-6 flex items-center border-l border-primary-100 bg-primary-50/10 font-bold text-primary-700">
                                    관리 불필요 (자동화)
                                </div>
                            </div>

                            {/* Row 5: Risk */}
                            <div className="col-span-3 grid grid-cols-3 md:rounded-b-2xl hover:bg-neutral-50/50 transition-colors">
                                <div className="p-4 md:p-6 flex items-center gap-2 text-neutral-900 font-medium">
                                    <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500 flex-shrink-0">
                                        <span className="text-sm font-bold">R</span>
                                    </div>
                                    <span>리스크</span>
                                </div>
                                <div className="p-4 md:p-6 flex items-center border-l border-neutral-100 text-neutral-600">
                                    퇴사 시 공백 발생
                                </div>
                                <div className="p-4 md:p-6 flex items-center border-l border-primary-100 bg-primary-50/10 font-bold text-primary-700">
                                    리스크 0% (시스템)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-neutral-500 flex items-center justify-center gap-2">
                        <Info className="w-4 h-4" />
                        초기 세팅비 외 추가 비용은 발생하지 않습니다.
                    </p>
                </div>
            </div>
        </section>
    )
}
