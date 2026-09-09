"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store/AppContext";
import { EventCard } from "@/components/member/EventCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Grid } from "@/components/ui/Surface";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
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
      <PageHeader
        title="Events"
        description="Join sports, webinars, meetups, and hangouts with the community."
        actions={<Link href="/events/create" className="w-full sm:w-auto"><Button variant="primary" size="sm" className="w-full justify-center"><PlusCircleIcon size={15} weight="regular" />Create Event</Button></Link>}
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input aria-label="Search events" placeholder="Search events, places, organizers…" value={searchQuery} onChange={(e: any) => setSearchQuery(e.target.value)} />
        </div>
        <SegmentedControl value={timeFilter} onValueChange={setTimeFilter} ariaLabel="Event timeframe" items={[{ value: "Upcoming", label: "Upcoming" }, { value: "Past", label: "Past" }]} className="w-full sm:w-fit" />
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
            description="Be the first to gather the community for sports, webinars, or coffee."
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
