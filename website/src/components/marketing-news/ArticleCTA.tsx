"use client";

import { useState } from "react";
import { MessageCircle, ArrowRight } from "lucide-react";
import { ConsultModal } from "./ConsultModal";

interface ArticleCTAProps {
  source?: string;
}

export function ArticleCTA({ source }: ArticleCTAProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-[#2a2a2a] rounded-2xl p-8 border-2 border-[#c9a962]/20">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-[#c9a962]/10 rounded-full flex items-center justify-center">
              <MessageCircle size={32} className="text-[#c9a962]" />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-2">
              광고 성과가 고민이신가요?
            </h3>
            <p className="text-[#aaa]">
              폴라애드 전문가와 무료로 상담하고,
              <br />
              맞춤형 마케팅 전략을 받아보세요.
            </p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-[#c9a962] to-[#b08d3e] text-[#1a1a1a] font-bold text-sm hover:shadow-[0_4px_20px_rgba(201,169,98,0.3)] transition-all"
            >
              무료 상담 신청
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <ConsultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        source={source}
      />
    </>
  );
}
