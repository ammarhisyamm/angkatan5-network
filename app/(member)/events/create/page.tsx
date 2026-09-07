"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
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
      <div>
        <Link
          href="/events"
          className="inline-flex items-center gap-1 text-xs font-semibold text-text-sub-600 hover:text-text-strong-950 transition-colors"
        >
          <ArrowLeftIcon size={16} weight="regular" />
          Back to Events
        </Link>
        <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-primary-base">
          <CalendarBlankIcon size={16} weight="regular" />
          <span>New Event</span>
        </div>
        <h1 className="text-page-title text-text-strong-950">Create Event</h1>
        <p className="text-sm text-text-sub-600 mt-1 max-w-2xl">
          Gather the community — sports, webinars, meetups, or hangouts.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-stroke-soft-200 bg-bg-white-0 p-6 sm:p-8 space-y-5">
        {error && <div className="rounded-xl border border-error-light bg-error-lighter p-3 text-xs font-medium text-error-dark">{error}</div>}

        <Input label="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Saturday Morning Futsal" required />

        <div>
          <p className="mb-2 text-xs font-semibold text-text-strong-950">Category</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`inline-flex min-h-8 items-center rounded-full px-3 py-2 text-sm font-medium ring-1 transition-colors ${category === c ? "bg-text-strong-950 text-white ring-text-strong-950" : "bg-bg-white-0 text-text-sub-600 ring-stroke-soft-200 hover:bg-bg-weak-50"}`}
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-strong-950">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full h-10 rounded-xl border border-stroke-soft-200 bg-bg-white-0 px-3 text-sm text-text-strong-950 outline-none focus:border-primary-base focus:ring-2 focus:ring-primary-base/15"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-strong-950">Start</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full h-10 rounded-xl border border-stroke-soft-200 bg-bg-white-0 px-3 text-sm text-text-strong-950 outline-none focus:border-primary-base focus:ring-2 focus:ring-primary-base/15"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-strong-950">End</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full h-10 rounded-xl border border-stroke-soft-200 bg-bg-white-0 px-3 text-sm text-text-strong-950 outline-none focus:border-primary-base focus:ring-2 focus:ring-primary-base/15"
            />
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-text-strong-950">Format</p>
          <div className="flex items-center gap-1 rounded-lg bg-bg-weak-50 p-1 ring-1 ring-stroke-soft-200 sm:w-72">
            <button
              type="button"
              onClick={() => setIsOnline(false)}
              className={`flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md px-2 text-sm font-medium transition-colors ${!isOnline ? "bg-bg-white-0 text-text-strong-950 ring-1 ring-stroke-soft-200 shadow-sm" : "text-text-sub-600 hover:text-text-strong-950"}`}
            >
              <MapPinIcon size={14} weight="regular" /> Offline
            </button>
            <button
              type="button"
              onClick={() => setIsOnline(true)}
              className={`flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md px-2 text-sm font-medium transition-colors ${isOnline ? "bg-bg-white-0 text-text-strong-950 ring-1 ring-stroke-soft-200 shadow-sm" : "text-text-sub-600 hover:text-text-strong-950"}`}
            >
              <VideoCameraIcon size={14} weight="regular" /> Online
            </button>
          </div>
        </div>

        {isOnline ? (
          <Input label="Meeting Link" value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} placeholder="https://meet.google.com/…" />
        ) : (
          <Input label="Venue" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Lapangan Blok S, Jakarta Selatan" />
        )}

        <Input
          label="Capacity (0 = unlimited)"
          type="number"
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
