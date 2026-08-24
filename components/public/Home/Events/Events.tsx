"use client";

import { EventCard } from "./EventCard";
import { EventsHeader } from "./EventsHeader";
import { EmptyEvents } from "./EmptyEvents";
import { usePublicEvents } from "@/hooks/use-community-events";
import { useIsRestoring } from "@tanstack/react-query";

export default function Events() {
  const { data: events, isLoading } = usePublicEvents();
  // True during SSR and for the brief window before the persisted cache
  // has been read back from sessionStorage. We treat that the same as
  // "loading" so the server render and the first client render agree —
  // otherwise isLoading can already be false (nothing being fetched yet)
  // while we still don't actually know if there's cached data, and
  // server/client pick different branches, which is exactly what a
  // hydration mismatch is.
  const isRestoring = useIsRestoring();

  // Only show the skeleton while there's genuinely nothing to display yet.
  // A background refetch failing shouldn't kick already-loaded events off
  // the screen — they just keep showing until a new fetch actually
  // succeeds.
  const allEvents = events ?? [];
  const isWaitingForData = isRestoring || (isLoading && allEvents.length === 0);

  return (
    <section id="events" className="relative w-full bg-[#DCEDDA] py-12 lg:py-16 px-4 overflow-hidden border-y border-[#168706]/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <EventsHeader />
          </div>

          <div className="lg:col-span-8">
            {/* LOADING & ERROR FALLBACK STATE */}
            {isWaitingForData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 bg-white/40 animate-pulse rounded-tr-2xl rounded-bl-2xl" />
                ))}
              </div>
            ) : allEvents.length === 0 ? (
              /* EMPTY STATE */
              <EmptyEvents />
            ) : (
              /* DATA STATE */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allEvents.map((event) => (
                  <EventCard
                    key={event._id}
                    event={{
                      id: event._id,
                      title: event.title,
                      description: event.description,
                      date: event.date,
                      location: event.location,
                      category: event.category,
                      imageUrl: event.imageUrl,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}