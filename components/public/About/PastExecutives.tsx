"use client";

import { useState, useMemo, useRef } from "react";
import Image from "next/image";
import { EmptyState } from "@/components/shared/state";
import { HistoryIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePublicExecutiveSessions } from "@/hooks/use-executive-sessions";
import { useIsRestoring } from "@tanstack/react-query";

// --- Types ---

interface PastExecutiveMember {
  _id: string;
  name: string;
  post: string;
  imageUrl: string;
}

interface ExecutiveSession {
  _id: string;
  label: string;
  pastExecutives: PastExecutiveMember[];
}

// --- Sub-components ---

function SectionHeader() {
  return (
    <div className="text-center mb-12 lg:mb-16">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#082F02] mb-4">
        Past{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#168706] to-[#0D5104]">
          Executives
        </span>
      </h2>
      <div className="w-24 h-1 bg-gradient-to-r from-[#168706] to-[#0D5104] mx-auto mb-6 rounded-full" />
      <p className="text-base lg:text-lg text-[#082F02]/70 max-w-3xl mx-auto">
        Honoring the individuals whose leadership shaped NACOS FUNAAB.
      </p>
    </div>
  );
}

function ExecutiveCard({ pe }: { pe: PastExecutiveMember }) {
  return (
    <div className="group relative flex-shrink-0 w-[260px] sm:w-auto bg-white snap-center">
      {/* Image Container - Portrait Ratio */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-gray-100">
        <Image
          src={pe.imageUrl}
          alt={pe.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 260px, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      
      {/* Floating Info Box */}
      <div className="absolute -bottom-2 left-3 right-3 bg-white p-4 shadow-lg border-t-2 border-[#168706] transition-transform duration-300 group-hover:-translate-y-2">
        <h3 className="font-bold text-[#082F02] text-base line-clamp-1">{pe.name}</h3>
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#168706] mt-1">
          {pe.post}
        </p>
      </div>
    </div>
  );
}


// --- Main Component ---

export function PastExecutives() {
  const { data, isLoading } = usePublicExecutiveSessions();
  // See Events.tsx / HallOfFame.tsx for why: keeps SSR and the first
  // client render in agreement while the persisted cache is being read
  // back, avoiding a hydration mismatch.
  const isRestoring = useIsRestoring();
  const isWaiting = isRestoring || isLoading;
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const sessions = useMemo<ExecutiveSession[]>(() => data ?? [], [data]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const activeSession = useMemo<ExecutiveSession | null>(() => {
    if (sessions.length === 0) return null;
    return sessions.find((s) => s._id === activeSessionId) ?? sessions[0];
  }, [sessions, activeSessionId]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300; 
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Same as elsewhere: only hide when there's nothing cached to show at
  // all, never just because a background refetch errored.
  if (!isWaiting && sessions.length === 0) return null;

  return (
    <section id="past-executives" className="bg-gray-50 py-16 lg:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader />

        {!isWaiting && sessions.length > 0 && activeSession && (
          <>
            {/* Session Navigation */}
            <div className="mb-10 flex flex-wrap justify-center gap-2">
              {sessions.map((session) => (
                <button
                  key={session._id}
                  onClick={() => setActiveSessionId(session._id)}
                  className={cn(
                    "rounded-md px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all",
                    activeSession._id === session._id
                      ? "bg-[#082F02] text-white shadow-md"
                      : "bg-white text-[#082F02] border border-gray-200 hover:border-[#168706]"
                  )}
                >
                  {session.label}
                </button>
              ))}
            </div>

            {activeSession.pastExecutives.length === 0 ? (
              <EmptyState icon={HistoryIcon} title="Records for this session are coming soon." />
            ) : (
              <div className="group/container relative">
                {/* Scrollable Area */}
                <div 
                  ref={scrollRef}
                  className={cn(
                    "flex overflow-x-auto gap-6 pb-12 snap-x snap-mandatory scrollbar-hide", // Mobile carousel
                    "md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-visible md:pb-0" // Desktop grid
                  )}
                >
                  {activeSession.pastExecutives.map((pe) => (
                    <ExecutiveCard key={pe._id} pe={pe} />
                  ))}
                </div>

                {/* Carousel Controls (Visible on mobile) */}
                <div className="flex justify-center gap-4 mt-8 md:hidden">
                  <button 
                    onClick={() => handleScroll('left')}
                    className="size-11 flex items-center justify-center bg-white border border-gray-200 text-[#082F02] rounded-full shadow-sm hover:bg-[#168706] hover:text-white transition-all"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button 
                    onClick={() => handleScroll('right')}
                    className="size-11 flex items-center justify-center bg-white border border-gray-200 text-[#082F02] rounded-full shadow-sm hover:bg-[#168706] hover:text-white transition-all"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}