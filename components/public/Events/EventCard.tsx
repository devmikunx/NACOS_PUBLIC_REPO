import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import type { CommunityEvent } from "@/lib/api/community-events";
import { formatDate, getEventStatus } from "@/lib/utils";

export function EventCard({ event }: { event: CommunityEvent }) {
  const status = getEventStatus(event.date);
  const isPast = status === "past";

  return (
    <Link
      href={`/events/${event._id}`}
      className={`group flex flex-col overflow-hidden rounded-tr-[2.5rem] rounded-bl-[2.5rem] bg-white border border-[#168706]/10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ${
        isPast ? "opacity-75 saturate-[0.6] hover:opacity-100 hover:saturate-100" : ""
      }`}
    >
      {/* Image */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#168706]/10">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CalendarDays className="w-12 h-12 text-[#168706]/40" />
          </div>
        )}
        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[9px] font-black uppercase tracking-[0.25em] text-[#168706]">
          {event.category}
        </span>
        {status === "today" && (
          <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#168706] text-white text-[9px] font-black uppercase tracking-[0.25em]">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Today
          </span>
        )}
        {isPast && (
          <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-[0.25em]">
            Past
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-6">
        <h3 className="text-lg font-black text-[#082F02] tracking-tight leading-snug group-hover:text-[#168706] transition-colors line-clamp-2">
          {event.title}
        </h3>

        {event.description && (
          <p className="mt-2 text-sm text-[#082F02]/60 leading-relaxed line-clamp-2">
            {event.description}
          </p>
        )}

        <div className="mt-4 pt-4 border-t border-[#168706]/10 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-[#082F02]/60">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5 text-[#168706]" />
            {formatDate(event.date)}
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-[#168706] flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#168706]">
          View Event
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
}
