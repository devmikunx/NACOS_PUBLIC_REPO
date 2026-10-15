"use client";

import { motion } from "framer-motion";
import { rightVariant, easing } from "./animations";

export function AboutImage({ shouldReduceMotion }: { shouldReduceMotion: boolean | null }) {
  return (
    <motion.div
      className="relative"
      variants={rightVariant}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ 
        duration: shouldReduceMotion ? 0.3 : 1.2, 
        ease: easing, 
        delay: shouldReduceMotion ? 0 : 0.2 
      }}
    >
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl border-8 border-white/50">
        <picture className="w-full h-full">
          <source srcSet="/images/nacos.avif" type="image/avif" />
          <source srcSet="/images/nacos.webp" type="image/webp" />
          <img
            src="/images/nacos.webp"
            alt="NACOS FUNAAB students collaborating"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </picture>
      </div>

      {/* Subtle UI overlay (Tech frame) */}
      <div className="absolute inset-4 border border-white/20 rounded-xl pointer-events-none" />
      
      {/* Glows */}
      <div className="absolute -top-4 -right-4 w-32 h-32 bg-[#168706]/10 rounded-full blur-2xl -z-10" />
      <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-[#147A05]/10 rounded-full blur-3xl -z-10" />
    </motion.div>
  );
}