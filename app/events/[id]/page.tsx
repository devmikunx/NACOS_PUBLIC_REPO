import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin, Tag } from "lucide-react";
import { publicServerFetch } from "@/lib/api/server-fetch";
import { paths } from "@/lib/api/paths";
import { ApiClientError } from "@/lib/api/errors";
import type { CommunityEvent } from "@/lib/api/community-events";
import { formatDate } from "@/lib/utils";
import { ShareEventButton } from "@/components/public/Events/ShareEventButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const event = await publicServerFetch<CommunityEvent>(paths.communityEvents.publicById(id));
    return { title: event.title };
  } catch {
    return { title: "Event" };
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let event: CommunityEvent;
  try {
    event = await publicServerFetch<CommunityEvent>(paths.communityEvents.publicById(id));
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) notFound();
    throw error;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <div className="flex items-center justify-between gap-4 mb-8">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#168706] hover:text-[#0D5104] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>

        <ShareEventButton title={event.title} text={event.description} />
      </div>

      {event.imageUrl ? (
        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-tr-3xl rounded-bl-3xl mb-8">
          <Image src={event.imageUrl} alt={event.title} fill className="object-cover" priority />
        </div>
      ) : (
        <div className="w-full aspect-[16/9] flex items-center justify-center bg-[#168706]/10 rounded-tr-3xl rounded-bl-3xl mb-8">
          <CalendarDays className="w-16 h-16 text-[#168706]/40" />
        </div>
      )}

      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#168706]">
        {event.category}
      </span>

      <h1 className="mt-2 text-3xl sm:text-4xl font-black text-[#082F02] tracking-tight leading-tight">
        {event.title}
      </h1>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#082F02]/70 font-medium">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-[#168706]" />
          {formatDate(event.date)}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#168706]" />
          {event.location}
        </div>
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-[#168706]" />
          {event.category}
        </div>
      </div>

      {event.description && (
        <div className="mt-8 pt-8 border-t border-[#168706]/10">
          <p className="text-base text-[#082F02]/80 leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>
      )}
    </div>
  );
}
