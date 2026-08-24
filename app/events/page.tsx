import type { Metadata } from "next";
import { EventsHero } from "@/components/public/Events/EventsHero";
import { EventsGrid } from "@/components/public/Events/EventsGrid";

export const metadata: Metadata = {
  title: "Events",
};

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-white">
      <EventsHero />
      <main>
        <EventsGrid />
      </main>
    </div>
  );
}
