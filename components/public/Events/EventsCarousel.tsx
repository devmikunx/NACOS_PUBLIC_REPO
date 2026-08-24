"use client";

import { useRef, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CommunityEvent } from "@/lib/api/community-events";
import { EventCard } from "./EventCard";

const SLIDE_GAP = 16;

export function EventsCarousel({ events }: { events: CommunityEvent[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollTo = (index: number) => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.children[0]?.clientWidth ?? 0;
    sliderRef.current.scrollTo({
      left: index * (cardWidth + SLIDE_GAP),
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const handleScroll = () => {
      const cardWidth = slider.children[0]?.clientWidth ?? 0;
      const idx = Math.round(slider.scrollLeft / (cardWidth + SLIDE_GAP));
      setCurrentIndex(Math.max(0, Math.min(idx, events.length - 1)));
    };
    slider.addEventListener("scroll", handleScroll);
    return () => slider.removeEventListener("scroll", handleScroll);
  }, [events.length]);

  return (
    <div className="relative">
      <AnimatePresence>
        {currentIndex > 0 && (
          <button
            type="button"
            onClick={() => scrollTo(currentIndex - 1)}
            aria-label="Previous event"
            className="absolute -left-2 top-1/3 -translate-y-1/2 z-20 w-9 h-9 bg-white rounded-full shadow-xl flex items-center justify-center text-[#168706]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {currentIndex < events.length - 1 && (
          <button
            type="button"
            onClick={() => scrollTo(currentIndex + 1)}
            aria-label="Next event"
            className="absolute -right-2 top-1/3 -translate-y-1/2 z-20 w-9 h-9 bg-white rounded-full shadow-xl flex items-center justify-center text-[#168706]"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </AnimatePresence>

      <div
        ref={sliderRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-2"
      >
        {events.map((event) => (
          <div key={event._id} className="flex-shrink-0 w-[85vw] snap-center">
            <EventCard event={event} />
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {events.map((_, i) => (
          <button
            type="button"
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Go to event ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex ? "bg-[#168706] w-8" : "bg-[#168706]/20 w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
