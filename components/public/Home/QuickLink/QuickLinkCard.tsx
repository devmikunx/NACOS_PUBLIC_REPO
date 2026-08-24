"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { QuickLinkItem } from "./types";
import { cardVariants, easing } from "./animations";

interface CardProps {
  link: QuickLinkItem;
  index?: number;
  total?: number;
  shouldReduceMotion: boolean | null;
}

export function QuickLinkCard({
  link,
  index = 0,
  total = 3,
  shouldReduceMotion,
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = link.icon;

  // Track scroll position specifically as it approaches the sticky docking point.
  // Starting later (closer to when the card is actually near its resting spot)
  // keeps the card at full size for longer, instead of shrinking/stacking
  // while it's still well below the nav.
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 90%", "start 45%"],
  });

  // Scale down smoothly as subsequent cards stack over
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 1 - (total - index) * 0.035]
  );

  // Docking point sits well clear of the fixed nav so the stuck card rests
  // nearer the middle of the viewport instead of pinned right under it.
  const stickyTop = `calc(16vh + ${index * 1.25}rem)`;

  return (
    <div
      ref={cardRef}
      style={{ top: stickyTop }}
      className="sticky md:static w-full z-10"
    >
      <motion.div
        variants={
          shouldReduceMotion
            ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
            : cardVariants
        }
        transition={{ duration: 0.9, ease: easing }}
        whileHover={shouldReduceMotion ? {} : { y: -8 }}
        style={{
          scale: shouldReduceMotion ? 1 : scale,
          transformOrigin: "top center",
        }}
        className={`${link.color} relative overflow-hidden p-8 flex flex-col justify-between 
                   min-h-[320px] rounded-tr-3xl rounded-bl-3xl shadow-xl group`}
      >
        {/* Decorative Background Image */}
        {link.image && (
          <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none">
            <Image
              src={link.image}
              alt={link.title}
              fill
              sizes="128px"
              className="object-contain translate-x-4 translate-y-4"
            />
          </div>
        )}

        <div className="relative z-10">
          <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-6 border border-white/20">
            <Icon className="w-6 h-6 text-white" />
          </div>

          <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
            {link.title}
          </h3>
          <p className="text-white/70 text-sm leading-relaxed max-w-[240px]">
            {link.description}
          </p>
        </div>

        <Link
          href={link.path}
          className="relative z-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-full 
                   bg-white text-[#168706] font-bold text-xs uppercase tracking-wider
                   hover:bg-[#E8F3E6] transition-colors w-fit group/btn"
        >
          {link.buttonText}
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </div>
  );
}