"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";
import { Input, Textarea } from "@/components/ui/Input";
import { DatePicker } from "@/components/ui/DatePicker";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ArrowLeftIcon, PlusCircleIcon, CalendarBlankIcon, MapPinIcon, VideoCameraIcon } from "@phosphor-icons/react";
import { EventCategory } from "@/lib/types";

const CATEGORIES: EventCategory[] = ["Sport", "Webinar", "Meetup", "Workshop", "Social"];

export default function CreateEventPage() {
  const router = useRouter();
  const { createEvent } = useApp();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<EventCategory>("Meetup");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("11:00");
  const [isOnline, setIsOnline] = useState(false);
  const [location, setLocation] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [capacity, setCapacity] = useState("30");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !date) {
      setError("Please fill in the title, description, and date.");
      return;
    }
    if (!isOnline && !location.trim()) {
      setError("Please add a venue for offline events.");
      return;
    }
    if (isOnline && !meetingLink.trim()) {
      setError("Please add a meeting link for online events.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const start = new Date(`${date}T${startTime || "09:00"}:00`);
    const end = new Date(`${date}T${endTime || startTime || "09:00"}:00`);
    const cap = Math.max(0, parseInt(capacity) || 0);

    setTimeout(() => {
      const created = createEvent({
        title: title.trim(),
        category,
        description: description.trim(),
        location: isOnline ? "Online" : location.trim(),
        isOnline,
        meetingLink: isOnline ? meetingLink.trim() : undefined,
        date: start.toISOString(),
        endDate: end > start ? end.toISOString() : undefined,
        capacity: cap,
      });
      setIsSubmitting(false);
      router.push(`/events/${created.id}`);
    }, 400);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Link href="/events" className="inline-flex items-center gap-1 rounded-sm text-label-xs text-text-sub-600 transition-colors hover:text-text-strong-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base/40">
          <ArrowLeftIcon size={16} weight="regular" aria-hidden="true" />Back to Events
        </Link>
        <PageHeader eyebrow="New Event" icon={CalendarBlankIcon} title="Create Event" description="Gather the community — sports, webinars, meetups, or hangouts." />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-20 border border-stroke-soft-200 bg-bg-white-0 p-5 shadow-regular-xs sm:p-8">
        {error && <div role="alert" className="rounded-10 border border-error-light bg-error-lighter p-3 text-paragraph-xs text-error-dark">{error}</div>}

        <Input label="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Saturday Morning Futsal" required />

          <div>
          <p className="mb-2 text-sm font-medium text-text-strong-950">Category</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`inline-flex min-h-9 items-center rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base ${category === c ? "bg-primary-base text-static-white ring-primary-base" : "bg-bg-white-0 text-text-sub-600 ring-stroke-soft-200 hover:bg-bg-weak-50"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <Textarea
          label="Description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What will happen, who should join, what to bring…"
          required
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <DatePicker label="Date" name="date" value={date} onChange={setDate} min={new Date().toISOString().slice(0, 10)} required />
          <Input label="Start" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          <Input label="End" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-text-strong-950">Format</p>
          <SegmentedControl value={isOnline ? "online" : "offline"} onValueChange={(value) => setIsOnline(value === "online")} ariaLabel="Event format" items={[{ value: "offline", label: "Offline", icon: MapPinIcon }, { value: "online", label: "Online", icon: VideoCameraIcon }]} className="w-full sm:w-72" />
        </div>

        {isOnline ? (
          <Input label="Meeting Link" value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} placeholder="https://meet.google.com/…" />
        ) : (
          <Input label="Venue" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Lapangan Blok S, Jakarta Selatan" />
        )}

        <Input
          label="Capacity (0 = unlimited)"
          type="number"
          inputMode="numeric"
          min={0}
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-6 border-t border-stroke-soft-200">
          <Link href="/events" className="w-full sm:w-auto">
            <Button variant="outline" size="md" className="w-full justify-center">Cancel</Button>
          </Link>
          <Button type="submit" variant="primary" size="md" isLoading={isSubmitting} className="w-full sm:w-auto justify-center">
            <PlusCircleIcon size={16} weight="regular" className="mr-1" />
            Publish Event
          </Button>
        </div>
      </form>
    </div>
  );
}
