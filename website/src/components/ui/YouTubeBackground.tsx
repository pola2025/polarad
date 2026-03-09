"use client";

import { useEffect, useRef, useState } from "react";

interface YouTubeBackgroundProps {
  videoId: string;
  overlayOpacity?: number;
}

export function YouTubeBackground({
  videoId,
  overlayOpacity = 75,
}: YouTubeBackgroundProps) {
  const playerRef = useRef<{ destroy?: () => void } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!(window as any).YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }

    const playerId = `yt-bg-${videoId}`;

    const initPlayer = () => {
      const el = document.getElementById(playerId);
      if (!el) return;
      playerRef.current = new (window as any).YT.Player(playerId, {
        videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          showinfo: 0,
          rel: 0,
          loop: 1,
          playlist: videoId,
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
      const existing = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        existing?.();
        initPlayer();
      };
    }

    return () => {
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div
        ref={containerRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "max(100vw, 177.78vh)",
          height: "max(100vh, 56.25vw)",
        }}
      >
        <div id={`yt-bg-${videoId}`} className="w-full h-full" />
      </div>
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity / 100 }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
    </div>
  );
}
