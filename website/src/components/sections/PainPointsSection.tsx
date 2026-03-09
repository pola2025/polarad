"use client";

import { XCircle } from "lucide-react";
import { motion } from "framer-motion";

const painPoints = [
  {
    problem: "홈페이지 제작 300~500만원",
    reality: "만들어놓고 관리 안 되면 그냥 명함 한 장",
  },
  {
    problem: "광고 대행사 월 100만원+",
    reality: "리포트만 받고 실제 문의는 0건",
  },
  {
    problem: "문의 수동 수집",
    reality: "누가 언제 어디서 왔는지 모름. 빠른 응대 불가",
  },
  {
    problem: "성과 보고 없음",
    reality: "광고비는 나가는데 효과가 있는지 모름",
  },
];

export default function PainPointsSection() {
  return (
    <section className="py-12 lg:py-24 bg-[#1a1a1a]">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-4 break-keep">
            <span className="sm:hidden">
              지금 이렇게 하고 계시다면,{" "}
              <span className="text-[#c9a962]">돈을 버리고 계신 겁니다</span>
            </span>
            <span className="hidden sm:inline">
              지금 이렇게 하고 계시다면,
              <br />
              <span className="text-[#c9a962]">돈을 버리고 계신 겁니다</span>
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 max-w-3xl mx-auto sm:gap-4">
          {painPoints.map((pain, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#2a2a2a] border border-white/[0.06] rounded-lg p-3 sm:rounded-xl sm:p-5"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
                <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                <div>
                  <div className="text-white font-medium mb-1">
                    {pain.problem}
                  </div>
                  <div className="text-sm text-[#999]">{pain.reality}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
