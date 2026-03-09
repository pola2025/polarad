"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import { HeroProcessAnimation } from "@/components/ui/HeroProcessAnimation";

export default function HeroSection() {
  const playerRef = useRef<{ destroy?: () => void } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  // Replay animation every 21s
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimKey((k) => k + 1);
    }, 21500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!(window as any).YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }

    const initPlayer = () => {
      playerRef.current = new (window as any).YT.Player("hero-yt-player", {
        videoId: "2vpiuiedbXk",
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          showinfo: 0,
          rel: 0,
          loop: 1,
          playlist: "2vpiuiedbXk",
          playsinline: 1,
          modestbranding: 1,
          iv_load_policy: 3,
          disablekb: 1,
          fs: 0,
          cc_load_policy: 0,
        },
        events: {
          onReady: (e: any) => {
            e.target.playVideo();
            setIsReady(true);
          },
          onStateChange: (e: any) => {
            if (e.data === (window as any).YT.PlayerState.ENDED) {
              e.target.playVideo();
            }
          },
        },
      });
    };

    if ((window as any).YT && (window as any).YT.Player) {
      initPlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }
    };
  }, []);

  return (
    <section className="relative min-h-[100vh] overflow-hidden bg-[#0a0a0a] text-white -mt-[60px] md:-mt-[60px] lg:-mt-[64px] pt-[60px] md:pt-[60px] lg:pt-[64px]">
      {/* YouTube Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          ref={containerRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "max(100vw, 177.78vh)",
            height: "max(100vh, 56.25vw)",
          }}
        >
          <div id="hero-yt-player" className="w-full h-full" />
        </div>
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      </div>

      {/* Gold radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(201,169,98,0.08)_0%,transparent_70%)] pointer-events-none z-[1]" />

      {/* 2-Column Hero Grid */}
      <div className="container relative z-10 min-h-[calc(100vh-64px)] flex items-center px-4 lg:px-8 py-16 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full">
          {/* Left: Text Content */}
          <div
            className="text-left"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a962]/10 border border-[#c9a962]/20 text-[#c9a962] text-sm font-semibold mb-6"
            >
              구독형 영업 인프라
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-[clamp(36px,5vw,56px)] font-bold text-white mb-4 leading-[1.5] tracking-[-1px] break-keep"
            >
              <span className="block">본업에만 집중하세요.</span>
              <span className="block mt-6">
                고객은{" "}
                <span className="text-[#c9a962]">저희가 데려옵니다.</span>
              </span>
            </motion.h1>

            {/* Gold line divider */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-[2px] bg-[#c9a962] mb-5"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base lg:text-[17px] text-[#ccc] mb-8 leading-[1.85] max-w-[560px] break-keep"
            >
              홈페이지 따로, 광고 따로, DB 따로? 이제 그만하세요.
              <br />세 업체에 나눠 맡기던 걸,{" "}
              <span className="text-white font-semibold">
                하나로 끝내드립니다.
              </span>
            </motion.p>

            {/* Value Props - 3 cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-3 gap-3 mb-8"
            >
              {[
                {
                  icon: "M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6",
                  title: "홈페이지 제작",
                  desc: "맞춤 디자인",
                },
                {
                  icon: "M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z",
                  title: "광고 세팅",
                  desc: "Meta 광고 소재까지",
                },
                {
                  icon: "M18 20V10M12 20V4M6 20v-6",
                  title: "DB 관리",
                  desc: "실시간 알림",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white/[0.04] border border-white/[0.08] rounded-md p-4 text-center hover:border-[#c9a962]/30 hover:-translate-y-0.5 transition-all"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#c9a962"
                    strokeWidth="1.5"
                    className="mx-auto mb-2"
                  >
                    <path d={item.icon} />
                  </svg>
                  <div className="text-[15px] font-bold text-white mb-1">
                    {item.title}
                  </div>
                  <div className="text-[13px] text-[#999]">{item.desc}</div>
                  <span className="inline-block mt-2 px-2 py-0.5 text-[11px] font-semibold text-[#c9a962] bg-[#c9a962]/[0.08] border border-[#c9a962]/20 rounded-full">
                    ✓ 구독 포함
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 items-start"
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-br from-[#c9a962] to-[#b08d3e] text-[#1a1a1a] font-bold text-base hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,169,98,0.4)] transition-all"
              >
                간편 진단 받기
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-all"
              >
                업종별 데모 보기
              </Link>
            </motion.div>
          </div>

          {/* Right: Process Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="max-w-[560px] ml-auto">
              <HeroProcessAnimation key={animKey} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
