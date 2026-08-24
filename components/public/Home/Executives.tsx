"use client";

import { ArrowRight, RefreshCw } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MemberCard from "./MemberCard";
import { usePublicExecutives } from "@/hooks/use-executives";
import { cn } from "@/lib/utils";
import { useIsRestoring } from "@tanstack/react-query";

export default function Executives({
  limit,
  showButton = true,
  centered = "auto",
}: {
  limit?: number;
  showButton?: boolean;
  centered?: boolean | "auto";
}) {
  const pathname = usePathname();
  const executivesQuery = usePublicExecutives("LEADERSHIP");
  // See Events.tsx for why: keeps SSR and the first client render in
  // agreement while the persisted cache is being read back, avoiding a
  // hydration mismatch.
  const isRestoring = useIsRestoring();

  const allExecutives = executivesQuery.data ?? [];
  const displayedExecutives = limit
    ? allExecutives.slice(0, limit)
    : allExecutives;
  const isAboutPage = pathname.includes("/about-us");

  const isWaitingForData =
    isRestoring || (executivesQuery.isLoading && displayedExecutives.length === 0);
  const shouldCenter =
    centered === "auto" ? displayedExecutives.length < 4 : centered;

  return (
    <section className="relative w-full bg-white py-12 lg:py-20 px-4 sm:px-6">
      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-16">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-[#082F02] mb-3">
            Meet Our <span className="text-[#168706]">Leadership</span>
          </h2>
          <div className="w-16 h-1 bg-[#168706] mx-auto mb-4 rounded-full" />
          <p className="text-sm sm:text-lg text-[#082F02]/70 max-w-2xl mx-auto">
            The dedicated team driving innovation in NACOS FUNAAB.
          </p>
        </div>

        {isWaitingForData ? (
          <div className="flex flex-col items-center py-20">
            <RefreshCw className="animate-spin text-[#168706]" />
            <p className="text-[#082F02]/60 font-medium">
              Syncing Executive Data...
            </p>
          </div>
        ) : (
          <>
            {/* 
               MOBILE & DESKTOP GRID 
               Using grid-cols-2 on mobile fixes the "too large" issue
            */}
            <div
              className={cn(
                "grid gap-4 sm:gap-6",
                "grid-cols-2 md:grid-cols-3 lg:grid-cols-4", // 2 columns on mobile
                shouldCenter && "lg:flex lg:justify-center",
              )}
            >
              {displayedExecutives.map((executive, index) => (
                <div
                  key={executive._id}
                  className={cn("h-full", shouldCenter && "lg:w-[250px]")}
                >
                  <MemberCard
                    member={{
                      name: executive.name,
                      position: executive.position,
                      image: executive.imageUrl,
                      contacts: executive.contacts,
                    }}
                    index={index}
                    titlePrefix="Comr."
                  />
                </div>
              ))}
            </div>

            {showButton && !isAboutPage && (
              <div className="text-center mt-10">
                <Link
                  href="/about-us#executive"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#168706] text-white text-sm font-semibold rounded-lg hover:bg-[#0D5104] transition-all"
                >
                  View All Executives
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
