'use client'

import { motion } from 'framer-motion'
import { Printer, Target, Plus } from 'lucide-react'

const addons = {
    printMaterials: {
        title: '인쇄물 추가',
        icon: Printer,
        color: 'amber',
        items: [
            { name: '명함 200매', price: '2.2만' },
            { name: '대봉투 500매', price: '22만' },
            { name: '자문계약서 500매', price: '33만' },
            { name: '명찰', price: '2.2만' },
        ],
        packages: [
            { name: '4종 세트 (추가 주문)', price: '55만', note: '다른 상품과 함께' },
            { name: '4종 세트 (단독)', price: '110만', note: '인쇄물만 주문' },
        ],
    },
    metaAutomation: {
        title: 'Meta 자동화 월금액',
        icon: Target,
        color: 'emerald',
        description: '소재변경, 자동화관리, 연동관리 포함',
        plans: [
            { duration: '3개월', monthlyPrice: '22만', totalPrice: '66만' },
            { duration: '6개월', monthlyPrice: '16.5만', totalPrice: '99만' },
            { duration: '1년', monthlyPrice: '11만', totalPrice: '132만', best: true },
        ],
        extra: { name: '유지보수 (건당)', price: '10만', note: '단발성 요청 시' },
    },
}

const colorClasses = {
    amber: {
        bg: 'bg-amber-950/20',
        border: 'border-amber-800/40',
        icon: 'text-amber-400',
        iconBg: 'bg-amber-900/50',
    },
    emerald: {
        bg: 'bg-emerald-950/20',
        border: 'border-emerald-800/40',
        icon: 'text-emerald-400',
        iconBg: 'bg-emerald-900/50',
    },
}

export default function ServiceAddonsSection() {
    return (
        <section className="py-20 lg:py-28 bg-gray-950">
            <div className="container">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 break-keep">
                        <span className="text-primary-400">추가 옵션</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto break-keep">
                        필요에 따라 추가할 수 있는 옵션입니다
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Print Materials */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`rounded-2xl border ${colorClasses.amber.border} ${colorClasses.amber.bg} p-6 lg:p-8`}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`w-12 h-12 rounded-xl ${colorClasses.amber.iconBg} flex items-center justify-center`}>
                                <Printer className={`w-6 h-6 ${colorClasses.amber.icon}`} />
                            </div>
                            <h3 className="text-xl font-bold text-white">{addons.printMaterials.title}</h3>
                        </div>

                        {/* Individual Items */}
                        <div className="space-y-3 mb-6">
                            {addons.printMaterials.items.map((item) => (
                                <div key={item.name} className="flex justify-between items-center py-2 border-b border-gray-800">
                                    <span className="text-gray-400">{item.name}</span>
                                    <span className="text-white font-medium">+{item.price}</span>
                                </div>
                            ))}
                        </div>

                        {/* Package Options */}
                        <div className="bg-gray-800/30 rounded-xl p-4">
                            <h4 className="text-sm font-medium text-amber-400 mb-3">세트 할인</h4>
                            {addons.printMaterials.packages.map((pkg) => (
                                <div key={pkg.name} className="flex justify-between items-center py-2">
                                    <div>
                                        <span className="text-white">{pkg.name}</span>
                                        <span className="text-gray-500 text-xs ml-2">({pkg.note})</span>
                                    </div>
                                    <span className="text-amber-400 font-bold">{pkg.price}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Meta Automation */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className={`rounded-2xl border ${colorClasses.emerald.border} ${colorClasses.emerald.bg} p-6 lg:p-8`}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`w-12 h-12 rounded-xl ${colorClasses.emerald.iconBg} flex items-center justify-center`}>
                                <Target className={`w-6 h-6 ${colorClasses.emerald.icon}`} />
                            </div>
                            <h3 className="text-xl font-bold text-white">{addons.metaAutomation.title}</h3>
                        </div>
                        <p className="text-gray-500 text-sm mb-6 ml-15">{addons.metaAutomation.description}</p>

                        {/* Plans */}
                        <div className="space-y-3 mb-6">
                            {addons.metaAutomation.plans.map((plan) => (
                                <div
                                    key={plan.duration}
                                    className={`flex justify-between items-center py-3 px-4 rounded-lg ${
                                        plan.best ? 'bg-emerald-900/30 border border-emerald-700/50' : 'border-b border-gray-800'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-medium">{plan.duration}</span>
                                        {plan.best && (
                                            <span className="text-xs bg-emerald-500 text-gray-900 px-2 py-0.5 rounded font-bold">
                                                추천
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <span className="text-white font-bold">{plan.monthlyPrice}</span>
                                        <span className="text-gray-500">/월</span>
                                        <span className="text-gray-600 text-xs ml-2">(총 {plan.totalPrice})</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Extra */}
                        <div className="bg-gray-800/30 rounded-xl p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="text-white">{addons.metaAutomation.extra.name}</span>
                                    <span className="text-gray-500 text-xs ml-2">({addons.metaAutomation.extra.note})</span>
                                </div>
                                <span className="text-emerald-400 font-bold">{addons.metaAutomation.extra.price}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
