"use client";

import ScrollToTop from "@/components/public/Home/scroll";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const topRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // 1. Check if we are on the full-page success screen
  const isSuccessPage = pathname === "/pay/success" || pathname.startsWith("/pay/success");

  // 2. Define transactional routes (excluding the success page)
  const transactionalRoutes = ["/pay", "/receipts", "/apply", "/verify"];
  const isTransactional = !isSuccessPage && transactionalRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [pathname]); 

  return (
    <>
      <main
        ref={topRef}
        className="min-h-screen flex flex-col justify-between relative bg-gradient-to-b from-[#F7FFF9] via-white to-[#E8F5E8]"
      >
        <Header />
        <ScrollToTop />

        {/* 
            LOGIC:
            - If it's Success Page: pt-0 (Fills screen without extra gap)
            - If it's Transactional (Pay form, Receipts list): pt-24 lg:pt-32
            - If it's Hero Page (Home, About): pt-0
        */}
        <div className={cn(
          "flex-1", 
          isTransactional ? "pt-24 lg:pt-32" : "pt-0"
        )}>
          {/*
            Crossfade between routes instead of an instant swap. App
            Router keeps this layout mounted across navigations, so
            without this the old page's content is simply replaced by
            the new one the instant it's ready — which reads as a jarring
            flash, especially when the two pages differ in background,
            height, or content. `mode="wait"` lets the outgoing page fade
            out before the incoming one fades in, so nothing pops.
            `initial={false}` skips animating in on the very first load
            (the splash screen already owns that moment).
          */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* If you want to hide the footer on the success page, you can do: {!isSuccessPage && <Footer />} */}
        {!isSuccessPage && <Footer />}
      </main>
    </>
  );
}