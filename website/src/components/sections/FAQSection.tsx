"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const faqs = [
  {
    q: "정확히 무엇이 포함되나요?",
    a: "반응형 홈페이지 제작, Meta 광고 운영, DB 자동 수집(문의 폼 + 텔레그램 알림), GA4 설치, Google/Naver 검색 등록, 월간 성과 리포트가 모두 포함됩니다.",
  },
  {
    q: "6개월 약정 후에는 어떻게 되나요?",
    a: "홈페이지는 영구 소유입니다. 광고 운영만 중단되며, 재구독 시 월 15만원에 광고 운영만 이어갈 수 있습니다.",
  },
  {
    q: "환불 정책은 어떻게 되나요?",
    a: "1개월차 30%, 2~3개월차 20%, 4개월차 15% 환불. 5개월차부터는 환불 불가합니다.",
  },
  {
    q: "우리 업종에도 맞나요?",
    a: "인테리어, 건축, 학원, 컨설팅, 법률, 웨딩, 부동산, 이사, 생활전문 등 서비스업 전반에 적용 가능합니다. 데모 페이지에서 업종별 진행 예시를 확인해보세요.",
  },
  {
    q: "제작 기간은 얼마나 걸리나요?",
    a: "기획 내용 확정 후 영업일 기준 5~7일 내에 홈페이지 제작, 광고 세팅, 자동화 연동까지 모두 완료됩니다.",
  },
  {
    q: "카드 결제가 가능한가요?",
    a: "네, 카드 결제 가능합니다. 6개월분 일시불 결제이며, 카드 할부는 결제 시 선택하실 수 있습니다.",
  },
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="py-8 lg:py-24 bg-[#222]">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-5 sm:mb-8"
        >
          <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4">
            자주 묻는 질문
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-2 sm:space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#2a2a2a] border border-white/[0.06] rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                aria-expanded={openIdx === i}
                className="w-full flex items-center justify-between px-4 py-3.5 sm:p-5 text-left"
              >
                <span className="text-white font-medium text-sm lg:text-base">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#888] transition-transform ${openIdx === i ? "rotate-180" : ""}`}
                />
              </button>
              {openIdx === i && (
                <div className="px-4 pb-3.5 sm:px-5 sm:pb-5 text-sm text-[#999] leading-relaxed">
                  {faq.a}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
