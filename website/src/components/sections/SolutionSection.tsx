"use client";

import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const comparisons = [
  {
    item: "홈페이지 제작",
    old: "300~500만원 초기비용",
    ours: "월 22만원",
    oursSub: "도메인만 별도",
  },
  {
    item: "광고 대행",
    old: "월 100만원+",
    ours: "포함",
    oursSub: "Meta 직접 운영",
  },
  { item: "문의 수집", old: "수동 (엑셀/카톡)", ours: "자동 저장 + 즉시 알림" },
  { item: "성과 보고", old: "없음 or 형식적", ours: "월간 리포트 자동 발송" },
  { item: "6개월 후", old: "해지하면 끝", ours: "홈페이지 영구 소유" },
];

export default function SolutionSection() {
  return (
    <section className="py-8 lg:py-24 bg-[#222]">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 break-keep">
            기존 방식 vs <span className="text-[#c9a962]">폴라애드 구독</span>
          </h2>
          <p className="text-[#888] text-base lg:text-lg">
            같은 결과, 전혀 다른 비용
          </p>
        </motion.div>

        {/* Comparison table – mobile: stacked cards, sm+: 3-col table */}
        <div className="max-w-3xl mx-auto">
          {/* Mobile: stacked cards */}
          <div className="flex flex-col gap-3 sm:hidden">
            {comparisons.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="bg-[#2a2a2a] rounded-lg border border-white/[0.06] p-4"
              >
                <div className="text-sm font-semibold text-white mb-2.5">
                  {row.item}
                </div>
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <div className="text-[11px] text-[#666] mb-1">기존</div>
                    <div className="text-[13px] text-[#888] line-through decoration-[#555]">
                      {row.old}
                    </div>
                  </div>
                  <div className="flex-1 text-right">
                    <div className="text-[11px] text-[#c9a962]/60 mb-1">
                      폴라애드
                    </div>
                    <div className="text-[13px] text-[#c9a962] font-medium flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      {row.ours}
                    </div>
                    {row.oursSub && (
                      <div className="text-[10px] text-[#888] mt-0.5 text-right">
                        ({row.oursSub})
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop: 3-col table */}
          <div className="hidden sm:block rounded-xl border border-white/[0.06] overflow-hidden">
            <div className="grid grid-cols-3 bg-[#2a2a2a]">
              <div className="p-4 text-sm font-medium text-[#888]">항목</div>
              <div className="p-4 text-sm font-medium text-[#888] text-center">
                기존 방식
              </div>
              <div className="p-4 text-sm font-medium text-[#c9a962] text-center">
                폴라애드
              </div>
            </div>
            {comparisons.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-3 border-t border-white/[0.04]"
              >
                <div className="p-4 text-sm text-white font-medium">
                  {row.item}
                </div>
                <div className="p-4 text-sm text-[#888] text-center">
                  {row.old}
                </div>
                <div className="p-4 text-sm text-[#c9a962] text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    {row.ours}
                    {row.oursSub && (
                      <span className="text-xs text-[#888] ml-1">
                        ({row.oursSub})
                      </span>
                    )}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
