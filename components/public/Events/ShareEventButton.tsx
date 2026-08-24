"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

interface ShareEventButtonProps {
  title: string;
  text?: string;
}

export function ShareEventButton({ title, text }: ShareEventButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    // Native share sheet — works on most mobile browsers and lets the
    // person pick any app (WhatsApp, Twitter/X, Mail, etc).
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // Person closed the share sheet without picking anything — no error needed.
      }
      return;
    }

    // Desktop / unsupported browsers: copy the link instead.
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied — nothing more we can do here.
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#168706]/20 text-[#168706] text-xs font-bold uppercase tracking-widest hover:bg-[#168706]/10 transition-colors flex-shrink-0"
    >
      {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
      {copied ? "Link Copied" : "Share"}
    </button>
  );
}
