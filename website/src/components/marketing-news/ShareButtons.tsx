"use client";

import { useState } from "react";
import { Share2, Link as LinkIcon, Check } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}${url}` : url;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("링크 복사 실패:", err);
    }
  };

  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "width=600,height=400",
    );
  };

  const handleTwitterShare = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "width=600,height=400",
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-[#ccc] flex items-center gap-2">
        <Share2 size={16} className="text-[#aaa]" />
        공유하기
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleFacebookShare}
          className="p-2 bg-[#1877F2] text-white rounded-lg hover:opacity-80 transition-opacity"
          aria-label="페이스북 공유"
          title="페이스북 공유"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>
        <button
          onClick={handleTwitterShare}
          className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          aria-label="X(트위터) 공유"
          title="X(트위터) 공유"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>
        <button
          onClick={handleCopyLink}
          className={`p-2 rounded-lg transition-all ${
            copied
              ? "bg-green-500 text-white"
              : "bg-white/10 text-[#ccc] hover:bg-white/20"
          }`}
          aria-label="링크 복사"
          title="링크 복사"
        >
          {copied ? <Check size={20} /> : <LinkIcon size={20} />}
        </button>
      </div>
    </div>
  );
}
