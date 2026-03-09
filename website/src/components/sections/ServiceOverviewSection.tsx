"use client";

import { Globe, Megaphone, Database, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    icon: Globe,
    layer: "Layer 0",
    title: "디지털 존재감",
    desc: "반응형 홈페이지 제작, Google/Naver 검색 등록, GA4 설치. 도메인 비용 외 인프라 추가비용 ZERO.",
  },
  {
    icon: Megaphone,
    layer: "Layer 1",
    title: "DB 수집 인프라",
    desc: "홈페이지 문의 폼 자동 저장, Meta 광고 연동. 87개 광고 계정을 직접 운영한 노하우를 이식합니다.",
  },
  {
    icon: Database,
    layer: "Layer 2",
    title: "알림 자동화",
    desc: "DB 접수 즉시 텔레그램 실시간 알림. 놓치는 고객 없이 즉시 응대할 수 있습니다.",
  },
  {
    icon: BarChart3,
    layer: "Layer 3",
    title: "성과 분석",
    desc: "GA4 채널별 유입 분석, Meta 광고 CPL 트래킹. 월간 성과 리포트가 자동 발송됩니다.",
  },
];

export default function ServiceOverviewSection() {
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
            월 22만원에 <span className="text-[#c9a962]">전부 포함</span>입니다
          </h2>
          <p className="text-[#999] text-base lg:text-lg max-w-xl mx-auto">
            홈페이지 + 광고 + DB수집 + 분석. 도메인 비용만 내면 끝.
          </p>
        </motion.div>

        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:overflow-visible sm:mx-auto sm:px-0 sm:pb-0 max-w-5xl">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="min-w-[260px] snap-start bg-[#2a2a2a] border border-white/[0.06] rounded-xl p-5 hover:border-[rgba(201,169,98,0.3)] transition-all sm:min-w-0 sm:p-6"
              >
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[#c9a962]/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#c9a962]" />
                  </div>
                  <span className="text-xs font-mono text-[#c9a962]/60">
                    {svc.layer}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {svc.title}
                </h3>
                <p className="text-sm text-[#999] leading-relaxed">
                  {svc.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
