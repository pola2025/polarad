"use client";

export function HeroProcessAnimation() {
  return (
    <>
      <style>{`
        /* ── Hero Process Animation ── */
        .hpa-stage {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          background: linear-gradient(145deg, #1e1e1e 0%, #161616 100%);
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.08);
          overflow: hidden;
          box-shadow: 0 8px 40px rgba(0,0,0,0.4);
        }
        .hpa-stage::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          opacity: 0.6;
        }

        /* Step dots */
        .hpa-step-indicator {
          position: absolute;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 5px;
          z-index: 10;
        }
        .hpa-sd {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
        }
        .hpa-sd-1 { animation: hpaSDPulse 0.3s ease 0.5s forwards, hpaSDOff 0.2s ease 4.2s forwards; }
        .hpa-sd-2 { animation: hpaSDPulse 0.3s ease 4.5s forwards, hpaSDOff 0.2s ease 8.2s forwards; }
        .hpa-sd-3 { animation: hpaSDPulse 0.3s ease 8.5s forwards, hpaSDOff 0.2s ease 12.2s forwards; }
        .hpa-sd-4 { animation: hpaSDPulse 0.3s ease 12.5s forwards, hpaSDOff 0.2s ease 16.2s forwards; }
        .hpa-sd-5 { animation: hpaSDPulse 0.3s ease 16.5s forwards, hpaSDOff 0.2s ease 20.5s forwards; }
        @keyframes hpaSDPulse {
          to { background: #c9a962; box-shadow: 0 0 8px rgba(201,169,98,0.6); width: 18px; border-radius: 3px; }
        }
        @keyframes hpaSDOff {
          to { background: #c9a962; box-shadow: none; width: 6px; border-radius: 50%; opacity: 0.4; }
        }

        /* Captions */
        .hpa-caption {
          position: absolute;
          bottom: 28px;
          left: 0;
          right: 0;
          text-align: center;
          z-index: 10;
        }
        .hpa-cap-line {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          opacity: 0;
          transform: translateY(8px);
        }
        .hpa-cap-sub {
          display: block;
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          opacity: 0;
          margin-top: 3px;
        }
        .hpa-cap-1 .hpa-cap-line { animation: hpaCapIn 0.5s ease 0.8s forwards, hpaCapOut 0.4s ease 3.8s forwards; }
        .hpa-cap-1 .hpa-cap-sub  { animation: hpaCapSubIn 0.4s ease 1.2s forwards, hpaCapOut 0.4s ease 3.6s forwards; }
        .hpa-cap-2 .hpa-cap-line { animation: hpaCapIn 0.5s ease 4.8s forwards, hpaCapOut 0.4s ease 7.8s forwards; }
        .hpa-cap-2 .hpa-cap-sub  { animation: hpaCapSubIn 0.4s ease 5.2s forwards, hpaCapOut 0.4s ease 7.6s forwards; }
        .hpa-cap-3 .hpa-cap-line { animation: hpaCapIn 0.5s ease 8.8s forwards, hpaCapOut 0.4s ease 11.8s forwards; }
        .hpa-cap-3 .hpa-cap-sub  { animation: hpaCapSubIn 0.4s ease 9.2s forwards, hpaCapOut 0.4s ease 11.6s forwards; }
        .hpa-cap-4 .hpa-cap-line { animation: hpaCapIn 0.5s ease 12.8s forwards, hpaCapOut 0.4s ease 15.8s forwards; }
        .hpa-cap-4 .hpa-cap-sub  { animation: hpaCapSubIn 0.4s ease 13.2s forwards, hpaCapOut 0.4s ease 15.6s forwards; }
        .hpa-cap-5 .hpa-cap-line { animation: hpaCapIn 0.5s ease 16.8s forwards, hpaCapOut 0.4s ease 20s forwards; }
        .hpa-cap-5 .hpa-cap-sub  { animation: hpaCapSubIn 0.4s ease 17.2s forwards, hpaCapOut 0.4s ease 19.8s forwards; }
        @keyframes hpaCapIn    { to { opacity: 1; transform: translateY(0); } }
        @keyframes hpaCapSubIn { to { opacity: 0.7; } }
        @keyframes hpaCapOut   { to { opacity: 0; transform: translateY(-6px); } }

        /* Shared */
        @keyframes hpaFadeIn    { to { opacity: 1; } }
        @keyframes hpaFadeOutUp { to { opacity: 0; transform: translateY(-12px); } }

        /* ── P1: Brand Scan ── */
        .hpa-p1-browser {
          position: absolute;
          top: 50px;
          left: 50%;
          transform: translateX(-50%);
          width: 260px;
          height: 160px;
          opacity: 0;
          animation: hpaP1In 0.6s ease 0.2s forwards, hpaP1Out 0.5s ease 3.8s forwards;
        }
        @keyframes hpaP1In {
          from { opacity: 0; transform: translateX(-50%) scale(0.9); }
          to   { opacity: 1; transform: translateX(-50%) scale(1); }
        }
        @keyframes hpaP1Out {
          to { opacity: 0; transform: translateX(-50%) scale(0.95) translateY(-10px); }
        }
        .hpa-p1-beam {
          position: absolute;
          top: 30px;
          left: 10px;
          right: 10px;
          height: 3px;
          background: linear-gradient(90deg, transparent, #c9a962 30%, rgba(201,169,98,0.7) 50%, #c9a962 70%, transparent);
          border-radius: 2px;
          box-shadow: 0 0 12px rgba(201,169,98,0.5);
          opacity: 0;
          animation: hpaP1Beam 2s ease-in-out 0.8s forwards;
        }
        @keyframes hpaP1Beam {
          0%   { opacity: 0; top: 20px; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { opacity: 0; top: 140px; }
        }
        .hpa-p1-check {
          position: absolute;
          left: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0;
        }
        .hpa-p1-check-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #c9a962;
          box-shadow: 0 0 8px rgba(201,169,98,0.5);
          flex-shrink: 0;
        }
        .hpa-p1-check-label { font-size: 11px; font-weight: 600; color: #c9a962; }
        .hpa-p1-c1 { top: 50px; animation: hpaP1Pop 0.3s ease 1.3s forwards, hpaP1Out 0.4s ease 3.8s forwards; }
        .hpa-p1-c2 { top: 76px; animation: hpaP1Pop 0.3s ease 1.8s forwards, hpaP1Out 0.4s ease 3.8s forwards; }
        .hpa-p1-c3 { top: 102px; animation: hpaP1Pop 0.3s ease 2.3s forwards, hpaP1Out 0.4s ease 3.8s forwards; }
        @keyframes hpaP1Pop {
          0%   { opacity: 0; transform: scale(0.5) translateX(-8px); }
          60%  { transform: scale(1.15) translateX(0); }
          100% { opacity: 1; transform: scale(1) translateX(0); }
        }
        .hpa-p1-line {
          position: absolute;
          right: 24px;
          height: 6px;
          border-radius: 3px;
          background: rgba(255,255,255,0.15);
          opacity: 0;
        }
        .hpa-p1-l1 { top: 50px;  width: 80px; animation: hpaP1LineIn 0.3s ease 1.4s forwards, hpaP1Out 0.4s ease 3.8s forwards; }
        .hpa-p1-l2 { top: 66px;  width: 60px; animation: hpaP1LineIn 0.3s ease 1.6s forwards, hpaP1Out 0.4s ease 3.8s forwards; }
        .hpa-p1-l3 { top: 76px;  width: 90px; animation: hpaP1LineIn 0.3s ease 1.9s forwards, hpaP1Out 0.4s ease 3.8s forwards; }
        .hpa-p1-l4 { top: 92px;  width: 70px; animation: hpaP1LineIn 0.3s ease 2.1s forwards, hpaP1Out 0.4s ease 3.8s forwards; }
        .hpa-p1-l5 { top: 102px; width: 85px; animation: hpaP1LineIn 0.3s ease 2.4s forwards, hpaP1Out 0.4s ease 3.8s forwards; }
        @keyframes hpaP1LineIn {
          from { opacity: 0; width: 0; }
          to   { opacity: 0.5; }
        }
        .hpa-p1-report {
          position: absolute;
          bottom: 80px;
          right: 60px;
          width: 100px;
          height: 60px;
          opacity: 0;
          animation: hpaP1Report 0.5s cubic-bezier(0.34,1.56,0.64,1) 2.8s forwards, hpaP1Out 0.4s ease 3.8s forwards;
        }
        @keyframes hpaP1Report {
          from { opacity: 0; transform: translateY(20px) scale(0.8); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── P2: Competition ── */
        .hpa-p2-baseline {
          position: absolute;
          bottom: 90px;
          left: 80px;
          right: 80px;
          height: 2px;
          background: rgba(255,255,255,0.2);
          opacity: 0;
          animation: hpaFadeIn 0.3s ease 4.3s forwards, hpaFadeOutUp 0.4s ease 7.8s forwards;
        }
        .hpa-p2-bar {
          position: absolute;
          bottom: 92px;
          border-radius: 4px 4px 0 0;
          opacity: 0;
          transform-origin: bottom center;
        }
        .hpa-p2-b1 { left: 100px; width: 28px; background: rgba(255,255,255,0.25); animation: hpaP2Grow 0.8s ease 4.6s forwards, hpaFadeOutUp 0.4s ease 7.8s forwards; --h: 60px; }
        .hpa-p2-b2 { left: 140px; width: 28px; background: rgba(255,255,255,0.25); animation: hpaP2Grow 0.8s ease 4.8s forwards, hpaFadeOutUp 0.4s ease 7.8s forwards; --h: 80px; }
        .hpa-p2-b3 { left: 180px; width: 28px; background: rgba(255,255,255,0.25); animation: hpaP2Grow 0.8s ease 5.0s forwards, hpaFadeOutUp 0.4s ease 7.8s forwards; --h: 50px; }
        .hpa-p2-b4 { left: 260px; width: 28px; background: #c9a962; animation: hpaP2Grow 1s cubic-bezier(0.34,1.2,0.64,1) 5.2s forwards, hpaFadeOutUp 0.4s ease 7.8s forwards; --h: 90px; }
        .hpa-p2-b5 { left: 300px; width: 28px; background: #c9a962; animation: hpaP2Grow 1s cubic-bezier(0.34,1.2,0.64,1) 5.4s forwards, hpaFadeOutUp 0.4s ease 7.8s forwards; --h: 120px; }
        .hpa-p2-b6 { left: 340px; width: 28px; background: rgba(201,169,98,0.6); animation: hpaP2Grow 1s cubic-bezier(0.34,1.2,0.64,1) 5.6s forwards, hpaFadeOutUp 0.4s ease 7.8s forwards; --h: 100px; }
        @keyframes hpaP2Grow {
          from { opacity: 0.3; height: 0; }
          to   { opacity: 1; height: var(--h); }
        }
        .hpa-p2-vs {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #c9a962;
          color: #1a1a1a;
          font-size: 11px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          animation: hpaP2Vs 0.4s cubic-bezier(0.34,1.56,0.64,1) 5.0s forwards, hpaFadeOutUp 0.4s ease 7.8s forwards;
        }
        @keyframes hpaP2Vs {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .hpa-p2-label {
          position: absolute;
          bottom: 72px;
          font-size: 10px;
          font-weight: 700;
          opacity: 0;
        }
        .hpa-p2-label-comp { left: 110px; color: rgba(255,255,255,0.45); animation: hpaFadeIn 0.3s ease 5.0s forwards, hpaFadeOutUp 0.3s ease 7.8s forwards; }
        .hpa-p2-label-us   { left: 278px; color: #c9a962; animation: hpaFadeIn 0.3s ease 5.4s forwards, hpaFadeOutUp 0.3s ease 7.8s forwards; }
        .hpa-p2-arrow {
          position: absolute;
          top: 55px;
          right: 110px;
          opacity: 0;
          animation: hpaP2Arrow 0.6s cubic-bezier(0.34,1.56,0.64,1) 6.2s forwards, hpaFadeOutUp 0.4s ease 7.8s forwards;
        }
        @keyframes hpaP2Arrow {
          0%   { opacity: 0; transform: translateY(15px) scale(0.5); }
          60%  { opacity: 1; transform: translateY(-5px) scale(1.1); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .hpa-p2-spark { position: absolute; border-radius: 50%; background: rgba(201,169,98,0.7); opacity: 0; }
        .hpa-p2-sp1 { width: 5px; height: 5px; top: 65px; right: 95px;  animation: hpaSparkPop 0.5s ease 6.4s forwards; }
        .hpa-p2-sp2 { width: 3px; height: 3px; top: 50px; right: 120px; animation: hpaSparkPop 0.5s ease 6.5s forwards; }
        .hpa-p2-sp3 { width: 4px; height: 4px; top: 70px; right: 80px;  animation: hpaSparkPop 0.5s ease 6.6s forwards; }
        @keyframes hpaSparkPop {
          0%   { opacity: 0; transform: scale(0); }
          50%  { opacity: 1; transform: scale(1.8); }
          100% { opacity: 0.6; transform: scale(1); }
        }

        /* ── P3: DB Collection (nodes + connections) ── */
        .hpa-p3-hub {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #c9a962;
          opacity: 0;
          animation: hpaP3Hub 0.5s cubic-bezier(0.34,1.56,0.64,1) 8.3s forwards, hpaFadeOutUp 0.4s ease 11.8s forwards;
          z-index: 3;
        }
        .hpa-p3-hub-inner {
          position: absolute;
          inset: 6px;
          border-radius: 50%;
          background: rgba(201,169,98,0.6);
        }
        @keyframes hpaP3Hub {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .hpa-p3-orbit {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 220px;
          height: 220px;
          border: 1.5px dashed rgba(201,169,98,0.35);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          animation: hpaFadeIn 0.5s ease 8.5s forwards, hpaFadeOutUp 0.4s ease 11.8s forwards;
        }
        .hpa-p3-node {
          position: absolute;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #242424;
          border: 2px solid rgba(201,169,98,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          z-index: 2;
          font-size: 9px;
          font-weight: 700;
          color: #c9a962;
        }
        .hpa-p3-n1 { top: calc(50% - 130px); left: calc(50% - 22px); animation: hpaP3Node 0.5s cubic-bezier(0.34,1.56,0.64,1) 8.8s forwards,  hpaFadeOutUp 0.4s ease 11.8s forwards; }
        .hpa-p3-n2 { top: calc(50% - 22px); right: calc(50% - 132px); animation: hpaP3Node 0.5s cubic-bezier(0.34,1.56,0.64,1) 9.2s forwards,  hpaFadeOutUp 0.4s ease 11.8s forwards; }
        .hpa-p3-n3 { bottom: calc(50% - 130px); left: calc(50% - 22px); animation: hpaP3Node 0.5s cubic-bezier(0.34,1.56,0.64,1) 9.6s forwards, hpaFadeOutUp 0.4s ease 11.8s forwards; }
        .hpa-p3-n4 { top: calc(50% - 22px); left: calc(50% - 132px); animation: hpaP3Node 0.5s cubic-bezier(0.34,1.56,0.64,1) 10.0s forwards, hpaFadeOutUp 0.4s ease 11.8s forwards; }
        @keyframes hpaP3Node {
          0%   { opacity: 0; transform: scale(0); }
          70%  { opacity: 1; transform: scale(1.15); }
          100% { opacity: 1; transform: scale(1); }
        }
        .hpa-p3-lines {
          position: absolute;
          inset: 0;
          z-index: 1;
          opacity: 0;
          animation: hpaFadeIn 0.01s ease 9.0s forwards, hpaFadeOutUp 0.4s ease 11.8s forwards;
        }
        .hpa-p3-conn {
          stroke: #c9a962;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-dasharray: 120;
          stroke-dashoffset: 120;
          fill: none;
        }
        .hpa-p3-conn-1 { animation: hpaLineDraw 0.8s ease 9.0s forwards; }
        .hpa-p3-conn-2 { animation: hpaLineDraw 0.8s ease 9.4s forwards; }
        .hpa-p3-conn-3 { animation: hpaLineDraw 0.8s ease 9.8s forwards; }
        .hpa-p3-conn-4 { animation: hpaLineDraw 0.8s ease 10.2s forwards; }
        @keyframes hpaLineDraw { to { stroke-dashoffset: 0; } }
        .hpa-p3-glow {
          position: absolute;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2px solid #c9a962;
          opacity: 0;
          z-index: 1;
        }
        .hpa-p3-g1 { top: calc(50% - 130px); left: calc(50% - 22px); animation: hpaGlowPulse 1s ease 9.8s forwards; }
        .hpa-p3-g2 { top: calc(50% - 22px); right: calc(50% - 132px); animation: hpaGlowPulse 1s ease 10.2s forwards; }
        .hpa-p3-g3 { bottom: calc(50% - 130px); left: calc(50% - 22px); animation: hpaGlowPulse 1s ease 10.6s forwards; }
        .hpa-p3-g4 { top: calc(50% - 22px); left: calc(50% - 132px); animation: hpaGlowPulse 1s ease 11.0s forwards; }
        @keyframes hpaGlowPulse {
          0%   { opacity: 0; transform: scale(1); }
          30%  { opacity: 0.8; transform: scale(1.4); }
          100% { opacity: 0; transform: scale(1.8); }
        }

        /* ── P4: Automation (ad creative / phone mockup) ── */
        .hpa-p4-phone {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 160px;
          height: 220px;
        }
        .hpa-p4-frame {
          position: absolute;
          inset: 0;
          border: 3px solid rgba(255,255,255,0.15);
          border-radius: 20px;
          opacity: 0;
          animation: hpaP4Frame 0.5s ease 12.3s forwards, hpaFadeOutUp 0.4s ease 15.8s forwards;
          overflow: hidden;
          background: #1e1e1e;
        }
        @keyframes hpaP4Frame {
          from { opacity: 0; transform: translateY(20px) scale(0.9); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .hpa-p4-img {
          position: absolute;
          top: 12px;
          left: 12px;
          right: 12px;
          height: 80px;
          background: linear-gradient(135deg, rgba(201,169,98,0.12), rgba(201,169,98,0.06));
          border-radius: 8px;
          border: 1px solid rgba(201,169,98,0.3);
          opacity: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: hpaP4Img 0.6s cubic-bezier(0.34,1.56,0.64,1) 12.9s forwards, hpaFadeOutUp 0.3s ease 15.8s forwards;
        }
        @keyframes hpaP4Img {
          from { opacity: 0; transform: translateY(-30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hpa-p4-text-line {
          position: absolute;
          left: 12px;
          height: 7px;
          border-radius: 4px;
          background: rgba(255,255,255,0.2);
          opacity: 0;
        }
        .hpa-p4-t1 { top: 104px; width: 90px;  animation: hpaP4Text 0.4s ease 13.4s forwards, hpaFadeOutUp 0.3s ease 15.8s forwards; }
        .hpa-p4-t2 { top: 118px; width: 110px; animation: hpaP4Text 0.4s ease 13.6s forwards, hpaFadeOutUp 0.3s ease 15.8s forwards; }
        .hpa-p4-t3 { top: 132px; width: 70px;  animation: hpaP4Text 0.4s ease 13.8s forwards, hpaFadeOutUp 0.3s ease 15.8s forwards; }
        @keyframes hpaP4Text {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 0.5; transform: translateX(0); }
        }
        .hpa-p4-cta {
          position: absolute;
          bottom: 16px;
          left: 20px;
          right: 20px;
          height: 30px;
          border-radius: 8px;
          background: #c9a962;
          opacity: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: hpaP4Cta 0.5s cubic-bezier(0.34,1.56,0.64,1) 14.2s forwards, hpaFadeOutUp 0.3s ease 15.8s forwards;
        }
        @keyframes hpaP4Cta {
          from { opacity: 0; transform: translateY(15px) scale(0.8); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .hpa-p4-cta-text { font-size: 10px; font-weight: 700; color: #1a1a1a; }
        .hpa-p4-shine {
          position: absolute;
          inset: 0;
          border-radius: 20px;
          overflow: hidden;
          opacity: 0;
          animation: hpaFadeIn 0.01s ease 14.8s forwards, hpaFadeOutUp 0.5s ease 15.8s forwards;
        }
        .hpa-p4-shine::after {
          content: "";
          position: absolute;
          top: -50%;
          left: -60%;
          width: 40%;
          height: 200%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          transform: rotate(15deg);
          animation: hpaShine 0.8s ease 14.8s forwards;
        }
        @keyframes hpaShine {
          from { left: -60%; }
          to   { left: 120%; }
        }

        /* ── P5: Dashboard ── */
        .hpa-p5-dashboard {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 320px;
          height: 200px;
        }
        .hpa-p5-panel {
          position: absolute;
          inset: 0;
          background: #1e1e1e;
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          opacity: 0;
          transform-origin: top center;
          animation: hpaP5Unfold 0.6s cubic-bezier(0.34,1.2,0.64,1) 16.3s forwards, hpaFadeOutUp 0.5s ease 20.2s forwards;
          overflow: hidden;
        }
        @keyframes hpaP5Unfold {
          from { opacity: 0; transform: scaleY(0.3) translateY(-20px); }
          to   { opacity: 1; transform: scaleY(1) translateY(0); }
        }
        .hpa-p5-titlebar {
          height: 28px;
          background: rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          padding: 0 12px;
          gap: 5px;
        }
        .hpa-p5-dot { width: 6px; height: 6px; border-radius: 50%; }
        .hpa-p5-chart {
          position: absolute;
          top: 40px;
          left: 16px;
          right: 16px;
          bottom: 16px;
        }
        .hpa-p5-stat { position: absolute; opacity: 0; }
        .hpa-p5-stat-big   { top: 4px; left: 0; font-size: 22px; font-weight: 800; color: #c9a962; animation: hpaP5Num 0.5s ease 17.2s forwards, hpaFadeOutUp 0.4s ease 20.2s forwards; }
        .hpa-p5-stat-label { top: 30px; left: 0; font-size: 10px; color: rgba(255,255,255,0.4); animation: hpaP5Num 0.4s ease 17.4s forwards, hpaFadeOutUp 0.4s ease 20.2s forwards; }
        .hpa-p5-stat-sub   { top: 4px; left: 100px; font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.75); animation: hpaP5Num 0.5s ease 17.6s forwards, hpaFadeOutUp 0.4s ease 20.2s forwards; }
        .hpa-p5-stat-sub2  { top: 24px; left: 100px; font-size: 10px; color: rgba(255,255,255,0.4); animation: hpaP5Num 0.4s ease 17.8s forwards, hpaFadeOutUp 0.4s ease 20.2s forwards; }
        @keyframes hpaP5Num {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hpa-p5-line-svg {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 80px;
          opacity: 0;
          animation: hpaFadeIn 0.01s ease 17.5s forwards, hpaFadeOutUp 0.4s ease 20.2s forwards;
        }
        .hpa-p5-chart-line {
          stroke: #c9a962;
          stroke-width: 3;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
          stroke-dasharray: 280;
          stroke-dashoffset: 280;
          animation: hpaChartDraw 1.5s ease 17.6s forwards;
        }
        .hpa-p5-chart-fill {
          fill: url(#hpaGoldGrad);
          opacity: 0;
          animation: hpaFadeIn 0.5s ease 18.5s forwards;
        }
        @keyframes hpaChartDraw { to { stroke-dashoffset: 0; } }
        .hpa-p5-up-arrow {
          position: absolute;
          top: 8px;
          right: 0;
          opacity: 0;
          animation: hpaP5Arrow 0.6s cubic-bezier(0.34,1.56,0.64,1) 19.0s forwards, hpaFadeOutUp 0.4s ease 20.2s forwards;
        }
        @keyframes hpaP5Arrow {
          0%   { opacity: 0; transform: translateY(10px) scale(0.5); }
          60%  { opacity: 1; transform: translateY(-4px) scale(1.1); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div className="hpa-stage">
        {/* Step dots */}
        <div className="hpa-step-indicator">
          <div className="hpa-sd hpa-sd-1" />
          <div className="hpa-sd hpa-sd-2" />
          <div className="hpa-sd hpa-sd-3" />
          <div className="hpa-sd hpa-sd-4" />
          <div className="hpa-sd hpa-sd-5" />
        </div>

        {/* ── P1: Brand Scan ── */}
        <div className="hpa-p1-browser">
          <svg
            width="260"
            height="160"
            viewBox="0 0 260 160"
            fill="none"
            style={{ position: "absolute", inset: 0 }}
          >
            <rect
              x="1"
              y="1"
              width="258"
              height="158"
              rx="12"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.5"
              fill="rgba(255,255,255,0.04)"
            />
            <line
              x1="0"
              y1="24"
              x2="260"
              y2="24"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
            <circle cx="16" cy="12" r="3.5" fill="rgba(255,255,255,0.12)" />
            <circle cx="28" cy="12" r="3.5" fill="rgba(255,255,255,0.12)" />
            <circle cx="40" cy="12" r="3.5" fill="rgba(255,255,255,0.12)" />
            <rect
              x="60"
              y="7"
              width="140"
              height="10"
              rx="5"
              fill="rgba(255,255,255,0.06)"
            />
          </svg>
          <div className="hpa-p1-beam" />
          <div className="hpa-p1-check hpa-p1-c1">
            <div className="hpa-p1-check-dot" />
            <span className="hpa-p1-check-label">홈페이지</span>
          </div>
          <div className="hpa-p1-check hpa-p1-c2">
            <div className="hpa-p1-check-dot" />
            <span className="hpa-p1-check-label">SNS 채널</span>
          </div>
          <div className="hpa-p1-check hpa-p1-c3">
            <div className="hpa-p1-check-dot" />
            <span className="hpa-p1-check-label">검색 노출</span>
          </div>
          <div className="hpa-p1-line hpa-p1-l1" />
          <div className="hpa-p1-line hpa-p1-l2" />
          <div className="hpa-p1-line hpa-p1-l3" />
          <div className="hpa-p1-line hpa-p1-l4" />
          <div className="hpa-p1-line hpa-p1-l5" />
          <div className="hpa-p1-report">
            <svg width="100" height="60" viewBox="0 0 100 60" fill="none">
              <rect
                x="1"
                y="1"
                width="98"
                height="58"
                rx="8"
                fill="rgba(255,255,255,0.05)"
                stroke="#c9a962"
                strokeWidth="1.5"
              />
              <rect
                x="10"
                y="10"
                width="50"
                height="5"
                rx="2.5"
                fill="#c9a962"
                opacity=".3"
              />
              <rect
                x="10"
                y="20"
                width="35"
                height="4"
                rx="2"
                fill="rgba(255,255,255,0.2)"
                opacity=".5"
              />
              <rect
                x="10"
                y="28"
                width="60"
                height="4"
                rx="2"
                fill="rgba(255,255,255,0.2)"
                opacity=".3"
              />
              <circle
                cx="80"
                cy="38"
                r="12"
                stroke="#c9a962"
                strokeWidth="2"
                fill="none"
              />
              <text
                x="74"
                y="42"
                fontSize="9"
                fontWeight="700"
                fill="#c9a962"
                fontFamily="inherit"
              >
                B+
              </text>
            </svg>
          </div>
        </div>

        {/* ── P2: Competition ── */}
        <div className="hpa-p2-baseline" />
        <div className="hpa-p2-bar hpa-p2-b1" />
        <div className="hpa-p2-bar hpa-p2-b2" />
        <div className="hpa-p2-bar hpa-p2-b3" />
        <div className="hpa-p2-bar hpa-p2-b4" />
        <div className="hpa-p2-bar hpa-p2-b5" />
        <div className="hpa-p2-bar hpa-p2-b6" />
        <div className="hpa-p2-vs">VS</div>
        <div className="hpa-p2-label hpa-p2-label-comp">경쟁사</div>
        <div className="hpa-p2-label hpa-p2-label-us">우리 업체</div>
        <div className="hpa-p2-arrow">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c9a962"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </div>
        <div className="hpa-p2-spark hpa-p2-sp1" />
        <div className="hpa-p2-spark hpa-p2-sp2" />
        <div className="hpa-p2-spark hpa-p2-sp3" />

        {/* ── P3: DB Collection ── */}
        <div className="hpa-p3-orbit" />
        <div className="hpa-p3-hub">
          <div className="hpa-p3-hub-inner" />
        </div>
        <div className="hpa-p3-node hpa-p3-n1">Meta</div>
        <div className="hpa-p3-node hpa-p3-n2">Naver</div>
        <div className="hpa-p3-node hpa-p3-n3">Google</div>
        <div className="hpa-p3-node hpa-p3-n4">Insta</div>
        <svg
          className="hpa-p3-lines"
          viewBox="0 0 720 450"
          preserveAspectRatio="xMidYMid meet"
        >
          <line
            className="hpa-p3-conn hpa-p3-conn-1"
            x1="360"
            y1="225"
            x2="360"
            y2="95"
          />
          <line
            className="hpa-p3-conn hpa-p3-conn-2"
            x1="360"
            y1="225"
            x2="470"
            y2="225"
          />
          <line
            className="hpa-p3-conn hpa-p3-conn-3"
            x1="360"
            y1="225"
            x2="360"
            y2="355"
          />
          <line
            className="hpa-p3-conn hpa-p3-conn-4"
            x1="360"
            y1="225"
            x2="250"
            y2="225"
          />
        </svg>
        <div className="hpa-p3-glow hpa-p3-g1" />
        <div className="hpa-p3-glow hpa-p3-g2" />
        <div className="hpa-p3-glow hpa-p3-g3" />
        <div className="hpa-p3-glow hpa-p3-g4" />

        {/* ── P4: Automation ── */}
        <div className="hpa-p4-phone">
          <div className="hpa-p4-frame">
            <div className="hpa-p4-img">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#c9a962"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.5}
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div className="hpa-p4-text-line hpa-p4-t1" />
            <div className="hpa-p4-text-line hpa-p4-t2" />
            <div className="hpa-p4-text-line hpa-p4-t3" />
            <div className="hpa-p4-cta">
              <span className="hpa-p4-cta-text">지금 상담받기</span>
            </div>
          </div>
          <div className="hpa-p4-shine" />
        </div>

        {/* ── P5: Dashboard ── */}
        <div className="hpa-p5-dashboard">
          <div className="hpa-p5-panel">
            <div className="hpa-p5-titlebar">
              <div
                className="hpa-p5-dot"
                style={{ background: "#c9a962", opacity: 0.5 }}
              />
              <div
                className="hpa-p5-dot"
                style={{ background: "rgba(255,255,255,0.15)" }}
              />
              <div
                className="hpa-p5-dot"
                style={{ background: "rgba(255,255,255,0.15)" }}
              />
            </div>
            <div className="hpa-p5-chart">
              <div className="hpa-p5-stat hpa-p5-stat-big">DB 47건</div>
              <div className="hpa-p5-stat hpa-p5-stat-label">이번 달 문의</div>
              <div className="hpa-p5-stat hpa-p5-stat-sub">CPR ₩18,200</div>
              <div className="hpa-p5-stat hpa-p5-stat-sub2">건당 단가</div>
              <svg
                className="hpa-p5-line-svg"
                viewBox="0 0 290 80"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="hpaGoldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c9a962" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#c9a962" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <path
                  className="hpa-p5-chart-fill"
                  d="M0,70 L40,60 L90,55 L140,45 L180,30 L230,18 L270,8 L290,5 L290,80 L0,80 Z"
                />
                <polyline
                  className="hpa-p5-chart-line"
                  points="0,70 40,60 90,55 140,45 180,30 230,18 270,8 290,5"
                />
              </svg>
              <div className="hpa-p5-up-arrow">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#c9a962"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ── Captions ── */}
        <div className="hpa-caption hpa-cap-1">
          <span className="hpa-cap-line">브랜드 현황을 꼼꼼히 진단합니다</span>
          <span className="hpa-cap-sub">홈페이지 · SNS · 검색 노출 분석</span>
        </div>
        <div className="hpa-caption hpa-cap-2">
          <span className="hpa-cap-line">경쟁사와 비교 분석합니다</span>
          <span className="hpa-cap-sub">같은 업종 상위 업체 마케팅 데이터</span>
        </div>
        <div className="hpa-caption hpa-cap-3">
          <span className="hpa-cap-line">최적의 채널을 찾아드립니다</span>
          <span className="hpa-cap-sub">Meta · 네이버 · 구글 · 인스타그램</span>
        </div>
        <div className="hpa-caption hpa-cap-4">
          <span className="hpa-cap-line">맞춤 광고 소재를 제작합니다</span>
          <span className="hpa-cap-sub">카피 · 이미지 · 타겟팅 전문 세팅</span>
        </div>
        <div className="hpa-caption hpa-cap-5">
          <span className="hpa-cap-line">매월 성과를 투명하게 보고합니다</span>
          <span className="hpa-cap-sub">DB 건수 · 광고 효율 · 개선 방향</span>
        </div>
      </div>
    </>
  );
}
