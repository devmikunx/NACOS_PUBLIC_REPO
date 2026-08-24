"use client";

import Image from "next/image";
import { usePublicHallOfFame } from "@/hooks/use-hall-of-fame";
import { useIsRestoring } from "@tanstack/react-query";

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mx-auto size-24 rounded-full bg-gray-200" />
      <div className="mx-auto mt-4 h-4 w-2/3 rounded bg-gray-200" />
      <div className="mx-auto mt-2 h-3 w-1/2 rounded bg-gray-200" />
    </div>
  );
}

export function HallOfFame() {
  const { data, isLoading } = usePublicHallOfFame();
  // True during SSR and until the persisted cache has been read back from
  // sessionStorage. Treating this the same as "loading" keeps the server
  // render and the first client render in agreement, avoiding a hydration
  // mismatch.
  const isRestoring = useIsRestoring();
  const entries = data ?? [];
  const isWaiting = isRestoring || isLoading;

  // Hide only if we have nothing to show (first load, no cache yet, and
  // either still empty or failed). If we already have cached entries —
  // from this session or restored from storage — keep showing them even
  // if a background refetch errors out.
  if (!isWaiting && entries.length === 0) {
    return null;
  }

  return (
    <section id="hall-of-fame" className="bg-white py-16 lg:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#082F02] mb-4 lg:mb-6">
            Hall of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#168706] to-[#0D5104]">
              Fame
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#168706] to-[#0D5104] mx-auto mb-6 rounded-full" />
          <p className="text-base lg:text-lg text-[#082F02]/70 max-w-3xl mx-auto">
            Honoring the individuals whose contributions shaped NACOS FUNAAB.
          </p>
        </div>

        {isWaiting && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {entries.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {entries.map((entry) => (
              <div
                key={entry._id}
                className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative mx-auto size-24 overflow-hidden rounded-full">
                  <Image 
                    src={entry.imageUrl} 
                    alt={entry.name} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <h3 className="mt-4 font-semibold text-[#082F02]">{entry.name}</h3>
                {entry.post && <p className="text-sm text-[#168706]">{entry.post}</p>}
                <p className="mt-2 text-xs text-[#082F02]/70 line-clamp-3">
                  {entry.contribution}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}