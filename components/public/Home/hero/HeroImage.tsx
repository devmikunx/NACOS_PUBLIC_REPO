"use client";

import { motion } from "framer-motion";

export function HeroImage() {
  return (
    <motion.div
      className="flex-1 flex justify-center lg:justify-end w-full max-w-lg lg:max-w-2xl xl:max-w-4xl"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.3,
      }}
    >
      <motion.div
        className="relative group/img w-full"
        whileHover={{ scale: 1.02, rotate: 1, transition: { duration: 0.5 } }}
      >
        <div className="relative z-10 w-full">
          {/* Picture tag handles AVIF with WebP fallback */}
          <picture>
            <source srcSet="/images/orientation.avif" type="image/avif" />
            <source srcSet="/images/orientation.webp" type="image/webp" />
            <img
              src="/images/orientation.webp"
              alt="NACOS FUNAAB students collaborating"
              width={1200}
              height={800}
              loading="eager"
              fetchPriority="high"
              className="w-full h-auto max-h-[450px] lg:max-h-[600px] xl:max-h-[700px] object-cover rounded-2xl lg:rounded-[2.5rem] border-4 border-white/20 shadow-2xl"
            />
          </picture>

          {/* Floating dots */}
          <div
            className="absolute -top-4 -right-4 w-8 h-8 bg-[#168706] rounded-full opacity-80 shadow-lg motion-reduce:!animate-none"
            style={{ animation: "floatDot 3s ease-in-out infinite alternate" }}
          />
          <div
            className="absolute -bottom-3 -left-3 w-6 h-6 bg-[#E8F3E6] rounded-full opacity-60 shadow-lg motion-reduce:!animate-none"
            style={{ animation: "floatDot 4s ease-in-out 0.5s infinite alternate" }}
          />
        </div>

        {/* Decorative Glows */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#168706] to-[#147A05] rounded-2xl blur-2xl opacity-25 -z-10 scale-110 group-hover/img:opacity-40 transition-opacity duration-500" />
      </motion.div>
    </motion.div>
  );
}