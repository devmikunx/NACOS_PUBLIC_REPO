// QuickLinkHeading.tsx
import { motion } from "framer-motion";
import { headingVariants, easing } from "./animations";

export function QuickLinkHeading({ }: { shouldReduceMotion: boolean | null }) {
  return (
    <motion.div
      className="relative max-w-3xl mx-auto text-center space-y-4 mb-16"
      variants={headingVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      transition={{ duration: 1, ease: easing }}
    >
      <span className="inline-block px-4 py-1.5 rounded-md bg-[#168706] text-white font-bold uppercase text-[10px] tracking-[0.3em]">
        Quick Access
      </span>
      <h2 className="text-3xl lg:text-5xl font-black text-[#082F02] tracking-tighter">
        One click away from <br />
        <span className="text-[#168706]">everything you need.</span>
      </h2>
    </motion.div>
  );
}

// QuickLinkCTA.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function QuickLinkCTA() {
  return (
    <div className="mt-16 text-center space-y-4">
      <p className="text-sm text-[#082F02]/60 font-medium italic">
        Can&apos;t find what you&apos;re looking for?
      </p>
      <Link
        href="/contact"
        className="inline-flex items-center gap-2 text-[#168706] font-bold text-sm hover:underline"
      >
        Reach out to our support team
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}