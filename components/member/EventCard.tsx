"use client";

import React from "react";
import Link from "next/link";
import { CommunityEvent } from "@/lib/types";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { LayerCard } from "@/components/ui/Surface";
import { Avatar } from "@/components/ui/Avatar";
import { ArrowRightIcon, ClockIcon, MapPinIcon, VideoCameraIcon } from "@phosphor-icons/react";
import { formatEventDate, formatEventRange, eventCountdown } from "@/lib/utils/event";

const categoryTone: Record<string, "primary" | "warning" | "information" | "success" | "neutral"> = {
  Sport: "success",
  Webinar: "primary",
  Meetup: "information",
  Workshop: "warning",
  Social: "neutral",
};

export function EventCard({ event }: { event: CommunityEvent }) {
  const date = formatEventDate(event.date);
  const spotsLeft = event.capacity > 0 ? event.capacity - event.attendeeIds.length : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;

  return (
    <LayerCard className="group flex h-full w-full flex-col overflow-hidden p-0 transition-[border-color,box-shadow] duration-200 hover:border-primary-base/40 hover:shadow-regular-sm focus-within:border-primary-base/40">
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-4">
          <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl bg-bg-weak-50 ring-1 ring-stroke-soft-200">
            <span className="text-lg font-bold leading-5 text-text-strong-950" data-numeric>{date.day}</span>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-text-sub-600">{date.month}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Tag tone={categoryTone[event.category] ?? "neutral"}>{event.category}</Tag>
              <span className="text-meta font-medium text-primary-base">{eventCountdown(event.date)}</span>
            </div>
            <Link href={`/events/${event.id}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-2 rounded-sm">
              <h3 className="mt-1.5 line-clamp-2 text-card-title text-text-strong-950 transition-colors group-hover:text-primary-base">{event.title}</h3>
            </Link>
          </div>
        </div>

        <div className="mt-3 space-y-1.5">
          <p className="flex items-center gap-2 text-sm text-text-sub-600">
            <ClockIcon size={14} weight="regular" className="shrink-0 text-text-soft-400" />
            {formatEventRange(event.date, event.endDate)}
          </p>
          <p className="flex items-center gap-2 text-sm text-text-sub-600">
            {event.isOnline ? (
              <VideoCameraIcon size={14} weight="regular" className="shrink-0 text-text-soft-400" />
            ) : (
              <MapPinIcon size={14} weight="regular" className="shrink-0 text-text-soft-400" />
            )}
            <span className="truncate">{event.isOnline ? "Online" : event.location}</span>
          </p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-stroke-soft-200 px-5 py-3.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-sm font-medium text-text-strong-950" data-numeric>
            {event.attendeeIds.length}{event.capacity > 0 ? `/${event.capacity}` : ""}
          </span>
          <span className="truncate text-meta font-medium text-text-sub-600">
            {isFull ? "Full" : spotsLeft !== null && spotsLeft <= 5 ? `${spotsLeft} spots left` : "joined"}
          </span>
        </div>
        <Link href={`/events/${event.id}`} className="shrink-0">
          <Button variant="secondary" size="sm">
            View <ArrowRightIcon size={14} weight="regular" />
          </Button>
        </Link>
      </div>
    </LayerCard>
  );
}
