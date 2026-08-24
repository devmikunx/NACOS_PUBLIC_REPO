"use client";

import { ArrowRight, RefreshCw } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MemberCard from "./MemberCard";
import { usePublicExecutives } from "@/hooks/use-executives";
import { cn } from "@/lib/utils";
import { useIsRestoring } from "@tanstack/react-query";

export default function NRAMembers({
  limit,
  showButton = true,
  centered = "auto",
}: {
  limit?: number;
  showButton?: boolean;
  centered?: boolean | "auto";
}) {
  const pathname = usePathname();
  // Fetching NRA (National Representative Assembly) category
  const nraQuery = usePublicExecutives("NRA");
  // See Events.tsx for why: keeps SSR and the first client render in
  // agreement while the persisted cache is being read back, avoiding a
  // hydration mismatch.
  const isRestoring = useIsRestoring();
  
  const allNRAMembers = nraQuery.data ?? [];
  const displayedNRAMembers = limit ? allNRAMembers.slice(0, limit) : allNRAMembers;
  const isAboutPage = pathname.includes("/about-us");

  // Only show the spinner while we have no cached data at all — a
  // background refetch error shouldn't kick already-loaded members off
  // the screen.
  const isWaitingForData =
    isRestoring || (nraQuery.isLoading && displayedNRAMembers.length === 0);
  const shouldCenter = centered === "auto" ? displayedNRAMembers.length < 4 : centered;

  return (
    <section id="nra" className="relative w-full bg-white py-16 lg:py-24 px-4 sm:px-6 border-t border-gray-50">
      <div className="relative max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#082F02] mb-4">
            Meet Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#168706] to-[#0D5104]">
              NRA Members
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#168706] to-[#0D5104] mx-auto mb-6 rounded-full" />
          <p className="text-base lg:text-lg text-[#082F02]/70 max-w-3xl mx-auto">
            The legislative body representing student interests and 
            upholding the democratic values of NACOS FUNAAB.
          </p>
        </div>

        {isWaitingForData ? (
          /* Loading / Graceful Fallback State */
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-[#168706] animate-spin mb-4" />
            <p className="text-[#082F02]/60 font-medium">Syncing Representative Data...</p>
          </div>
        ) : (
          /* Success State */
          <>
            <div className="relative">
              <div className={cn(
                "grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-stretch",
                shouldCenter && "lg:flex lg:flex-wrap lg:justify-center"
              )}>
                {displayedNRAMembers.map((member, index) => (
                  <div 
                    key={member._id} 
                    className={cn(
                      "h-full", 
                      shouldCenter && "lg:w-[calc(25%-1.5rem)] lg:min-w-[240px]"
                    )}
                  >
                    <MemberCard 
                      member={{ 
                        name: member.name, 
                        position: member.position, 
                        image: member.imageUrl, 
                        contacts: member.contacts 
                      }} 
                      index={index} 
                    />
                  </div>
                ))}
              </div>
            </div>

            {showButton && !isAboutPage && (
              <div className="text-center mt-12">
                <Link 
                  href="/about-us#nra" 
                  className="inline-flex items-center gap-3 px-8 py-3 bg-[#082F02]/86 text-white font-bold rounded-full hover:bg-[#168706] transition-all duration-300 shadow-md hover:shadow-lg text-sm uppercase tracking-widest"
                >
                  View ALL Members
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