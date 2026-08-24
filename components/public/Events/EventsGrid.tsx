"use client";

import { useMemo, useState } from "react";
import { useIsRestoring } from "@tanstack/react-query";
import { usePublicEvents } from "@/hooks/use-community-events";
import { EmptyEvents } from "@/components/public/Home/Events/EmptyEvents";
import type { CommunityEvent } from "@/lib/api/community-events";
import { getEventStatus } from "@/lib/utils";
import { EventCard } from "./EventCard";
import { EventCardSkeleton } from "./EventCardSkeleton";
import { EventsCarousel } from "./EventsCarousel";

type FilterKey = "all" | "upcoming" | "today" | "past";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "today", label: "Today" },
  { key: "past", label: "Past" },
];

// Beyond this many cards, a plain grid gets too tall to comfortably scroll
// through on a phone, so small screens swap to a horizontal carousel
// instead. md and lg always stay on the grid regardless of count.
const CAROUSEL_THRESHOLD = 4;

function EventsList({ events }: { events: CommunityEvent[] }) {
  if (events.length > CAROUSEL_THRESHOLD) {
    return (
      <>
        <div className="md:hidden">
          <EventsCarousel events={events} />
        </div>
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
}

export function EventsGrid() {
  const { data: events, isLoading } = usePublicEvents();
  // Same SSR/hydration guard used by the homepage Events section: treat the
  // restoring window the same as loading so server and client render the
  // same branch on first paint.
  const isRestoring = useIsRestoring();
  const [filter, setFilter] = useState<FilterKey>("all");

  const allEvents = useMemo(() => events ?? [], [events]);
  const isWaitingForData = isRestoring || (isLoading && allEvents.length === 0);

  // Frontend-only split — the API doesn't know about "past" vs "upcoming",
  // so we derive it here from each event's date against today's date.
  const { upcoming, today, past } = useMemo(() => {
    const upcoming: CommunityEvent[] = [];
    const today: CommunityEvent[] = [];
    const past: CommunityEvent[] = [];

    for (const event of allEvents) {
      const status = getEventStatus(event.date);
      if (status === "past") past.push(event);
      else if (status === "today") today.push(event);
      else upcoming.push(event);
    }

    upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    today.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    // Most recently happened first.
    past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { upcoming, today, past };
  }, [allEvents]);

  const upcomingAndToday = useMemo(() => [...today, ...upcoming], [today, upcoming]);

  const emptyMessage: Record<FilterKey, string> = {
    all: "System Idle: No events scheduled",
    upcoming: "System Idle: No upcoming events scheduled",
    today: "System Idle: Nothing happening today",
    past: "System Idle: No past events yet",
  };

  return (
    <section className="w-full bg-white py-12 lg:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-colors ${
                filter === key
                  ? "bg-[#168706] text-white"
                  : "bg-[#168706]/10 text-[#168706] hover:bg-[#168706]/20"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {isWaitingForData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : allEvents.length === 0 ? (
          <EmptyEvents />
        ) : filter === "all" ? (
          <div className="space-y-16">
            {upcomingAndToday.length > 0 && (
              <div>
                <h2 className="text-xl font-black text-[#082F02] tracking-tight mb-6">
                  Upcoming &amp; Today
                </h2>
                <EventsList events={upcomingAndToday} />
              </div>
            )}
            {past.length > 0 && (
              <div>
                <h2 className="text-xl font-black text-[#082F02] tracking-tight mb-6">
                  Past Events
                </h2>
                <EventsList events={past} />
              </div>
            )}
          </div>
        ) : (
          (() => {
            const filtered =
              filter === "upcoming" ? upcoming : filter === "today" ? today : past;
            return filtered.length === 0 ? (
              <EmptyEvents message={emptyMessage[filter]} />
            ) : (
              <EventsList events={filtered} />
            );
          })()
        )}
      </div>
    </section>
  );
}
