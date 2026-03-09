"use client";

import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";
import { motion } from "framer-motion";

const fears = [
  {
    q: "효과 없으면 어쩌지?",
    a: "87개 광고 계정 운영 노하우. 업종별 검증된 전략을 적용합니다",
  },
  {
    q: "6개월 약정이 부담돼요",
    a: "6개월 후엔 홈페이지가 내 것. 광고만 멈추면 돼요",
  },
  {
    q: "배워야 하나요?",
    a: "설정은 저희가 다 합니다. 문의 전화만 받으시면 돼요",
  },
  {
    q: "우리 업종에 맞나?",
    a: "데모 페이지에서 업종별 진행 예시를 직접 확인해보세요",
  },
  {
    q: "나중에 연락 안 되면?",
    a: "평일 응대 + 월간 리포트 자동 발송. 방치하지 않습니다",
  },
  {
    q: "홈페이지만 만들면 끝 아닌가요?",
    a: "SEO 최적화, GA4 설치, 검색 등록까지 기본 포함. 만들고 방치되는 홈페이지와는 다릅니다",
  },
];

export default function UrgencyCTASection() {
  return (
    <section className="py-20 lg:py-28 bg-[#1a1a1a]">
      <div className="container px-4">
        {/* Risk removal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a962]/10 border border-[#c9a962]/20 text-[#c9a962] text-sm font-semibold mb-6">
            <Shield className="w-4 h-4" />
            리스크 제거 보증
          </div>
          <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 break-keep">
            망설이는 이유, <span className="text-[#c9a962]">전부 해결</span>
            해드립니다
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-16">
          {fears.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-[#2a2a2a] border border-white/[0.06] rounded-xl p-5"
            >
              <div className="text-sm text-[#888] mb-2">
                &ldquo;{item.q}&rdquo;
              </div>
              <div className="text-white font-medium">{item.a}</div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">
            우리 가게, 온라인에서 보이고 있나요?
          </h3>
          <p className="text-[#888] mb-8">
            30초 간편 진단으로 놓치고 있는 고객 수를 확인하세요
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-br from-[#c9a962] to-[#b08d3e] text-[#1a1a1a] font-bold text-lg hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,169,98,0.4)] transition-all"
          >
            무료 간편 진단 받기
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
