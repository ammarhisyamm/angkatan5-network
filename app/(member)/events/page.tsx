"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store/AppContext";
import { EventCard } from "@/components/member/EventCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Grid } from "@/components/ui/Surface";
import { Input } from "@/components/ui/Input";
import { CalendarBlankIcon, PlusCircleIcon } from "@phosphor-icons/react";
import { EventCategory } from "@/lib/types";

const CATEGORIES: ("All" | EventCategory)[] = [
  "All",
  "Sport",
  "Webinar",
  "Meetup",
  "Workshop",
  "Social",
];

type TimeFilter = "Upcoming" | "Past";

export default function EventsPage() {
  const { events } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | EventCategory>("All");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("Upcoming");

  const filteredEvents = useMemo(() => {
    const now = Date.now();
    return events
      .filter((ev) => {
        if (ev.status === "Cancelled") return false;
        const isPast = new Date(ev.date).getTime() < now;
        if (timeFilter === "Upcoming" && isPast) return false;
        if (timeFilter === "Past" && !isPast) return false;
        if (selectedCategory !== "All" && ev.category !== selectedCategory) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const haystack = `${ev.title} ${ev.description} ${ev.location} ${ev.organizerName}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) =>
        timeFilter === "Upcoming"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  }, [events, searchQuery, selectedCategory, timeFilter]);

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-base mb-1">
            <CalendarBlankIcon size={16} weight="regular" />
            <span>Community Events</span>
          </div>
          <h1 className="text-page-title text-text-strong-950">Events</h1>
          <p className="text-sm text-text-sub-600 mt-1 max-w-2xl">
            Join sports, webinars, meetups, and hangouts with the community.
          </p>
        </div>

        <Link href="/events/create" className="shrink-0">
          <Button variant="primary" size="md" className="w-full sm:w-auto justify-center">
            <PlusCircleIcon size={16} weight="regular" />
            Create Event
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input aria-label="Search events" placeholder="Search events, places, organizers…" value={searchQuery} onChange={(e: any) => setSearchQuery(e.target.value)} />
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-bg-weak-50 p-1 ring-1 ring-stroke-soft-200 sm:w-auto">
          {(["Upcoming", "Past"] as TimeFilter[]).map((t) => (
            <button
              key={t}
              onClick={() => setTimeFilter(t)}
              className={`h-8 flex-1 rounded-md px-3 text-sm font-medium transition-colors sm:flex-none ${timeFilter === t ? "bg-bg-white-0 text-text-strong-950 ring-1 ring-stroke-soft-200 shadow-sm" : "text-text-sub-600 hover:text-text-strong-950"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "primary" : "secondary"}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-text-sub-600">
            {filteredEvents.length}{" "}
            {filteredEvents.length === 1 ? "Event" : "Events"} {timeFilter === "Upcoming" ? "Coming Up" : "Ended"}
          </span>
        </div>

        {filteredEvents.length > 0 ? (
          <Grid variant="3up" gap="base">
            {filteredEvents.map((ev) => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </Grid>
        ) : (
          <EmptyState
            icon={CalendarBlankIcon}
            title={timeFilter === "Upcoming" ? "No upcoming events" : "No past events"}
            description="Be the first to gather the community — sports, webinars, or just coffee."
            action={
              <Link href="/events/create">
                <Button variant="primary" size="sm">
                  <PlusCircleIcon size={14} weight="regular" />
                  Create Event
                </Button>
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
