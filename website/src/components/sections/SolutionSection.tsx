"use client";

import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const comparisons = [
  {
    item: "홈페이지 제작",
    old: "300~500만원 초기비용",
    ours: "월 22만원 (도메인만 별도)",
  },
  { item: "광고 대행", old: "월 100만원+", ours: "포함 (Meta 직접 운영)" },
  { item: "문의 수집", old: "수동 (엑셀/카톡)", ours: "자동 저장 + 즉시 알림" },
  { item: "성과 보고", old: "없음 or 형식적", ours: "월간 리포트 자동 발송" },
  { item: "6개월 후", old: "해지하면 끝", ours: "홈페이지 영구 소유" },
];

export default function SolutionSection() {
  return (
    <section className="py-20 lg:py-28 bg-[#222]">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 break-keep">
            기존 방식 vs <span className="text-[#c9a962]">폴라애드 구독</span>
          </h2>
          <p className="text-[#888] text-base lg:text-lg">
            같은 결과, 전혀 다른 비용
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto overflow-hidden rounded-xl border border-white/[0.06]">
          {/* Header */}
          <div className="grid grid-cols-3 bg-[#2a2a2a]">
            <div className="p-4 text-sm font-medium text-[#888]">항목</div>
            <div className="p-4 text-sm font-medium text-[#888] text-center">
              기존 방식
            </div>
            <div className="p-4 text-sm font-medium text-[#c9a962] text-center">
              폴라애드
            </div>
          </div>
          {/* Rows */}
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
              <div className="p-4 text-sm text-[#666] text-center">
                {row.old}
              </div>
              <div className="p-4 text-sm text-[#c9a962] text-center flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {row.ours}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
