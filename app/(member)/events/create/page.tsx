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
import { FormActions, FormSection } from "@/components/ui/FormSection";
import { ArrowLeftIcon, PlusCircleIcon, MapPinIcon, VideoCameraIcon } from "@phosphor-icons/react";
import { EventCategory } from "@/lib/types";

const CATEGORIES: EventCategory[] = ["Sport", "Webinar", "Meetup", "Workshop", "Social"];

export default function CreateEventPage() {
  const router = useRouter();
  const { createEvent } = useApp();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<EventCategory | "">("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("11:00");
  const [format, setFormat] = useState<"offline" | "online" | "">("");
  const [location, setLocation] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [capacity, setCapacity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !date || !category) {
      setError("Add the event title, category, description, and date.");
      return;
    }
    if (!format) {
      setError("Choose whether this event is online or offline.");
      return;
    }
    if (format === "offline" && !location.trim()) {
      setError("Please add a venue for offline events.");
      return;
    }
    if (format === "online" && !meetingLink.trim()) {
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
        location: format === "online" ? "Online" : location.trim(),
        isOnline: format === "online",
        meetingLink: format === "online" ? meetingLink.trim() : undefined,
        date: start.toISOString(),
        endDate: end > start ? end.toISOString() : undefined,
        capacity: cap,
      });
      setIsSubmitting(false);
      router.push(`/events/${created.id}`);
    }, 400);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="space-y-4">
        <Link href="/events" className="inline-flex items-center gap-1.5 rounded-md text-label-xs text-text-sub-600 transition-colors hover:text-text-strong-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base/40">
          <ArrowLeftIcon size={16} weight="regular" aria-hidden="true" />Back to Events
        </Link>
        <PageHeader title="Create an event" description="Share the essential details so members can decide quickly whether to join." />
      </div>

      <form onSubmit={handleSubmit} className="overflow-visible rounded-10 border border-stroke-soft-200 bg-bg-white-0 shadow-regular-xs">
        {error && <div role="alert" className="m-5 rounded-10 border border-error-light bg-error-lighter p-3 text-paragraph-xs text-error-dark sm:m-6">{error}</div>}

        <FormSection title="Event details" description="Use a clear title and concise description.">
          <Input label="Event title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Saturday morning futsal" required />
          <div>
            <p className="mb-2 text-label-sm text-text-strong-950">Category <span className="text-error-base">*</span></p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((item) => (
                <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} className={`inline-flex h-8 items-center rounded-full px-3 text-label-sm shadow-custom-input transition-[background-color,color,box-shadow,transform] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base/40 ${category === item ? "bg-primary-base text-static-white" : "bg-bg-white-0 text-text-sub-600 hover:bg-bg-weak-25"}`}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <Textarea label="Description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What will happen, who should join, and what should they bring?" required />
        </FormSection>

        <FormSection title="Schedule" description="Set the date and expected duration.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <DatePicker label="Date" name="date" value={date} onChange={setDate} min={new Date().toISOString().slice(0, 10)} required />
            <Input label="Start time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            <Input label="End time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
        </FormSection>

        <FormSection title="Location and access" description="Choose a format, then add the access details.">
          <div>
            <p className="mb-2 text-label-sm text-text-strong-950">Format <span className="text-error-base">*</span></p>
            <SegmentedControl value={format} onValueChange={setFormat} ariaLabel="Event format" items={[{ value: "offline", label: "Offline", icon: MapPinIcon }, { value: "online", label: "Online", icon: VideoCameraIcon }]} variant="solid" size="sm" className="w-full sm:w-fit" />
          </div>

          {format === "online" && <Input label="Meeting link" type="url" value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} placeholder="https://meet.google.com/..." required />}
          {format === "offline" && <Input label="Venue" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Lapangan Blok S, Jakarta Selatan" required />}
          {!format && <p className="rounded-10 bg-bg-weak-50 px-3 py-2.5 text-paragraph-xs text-text-sub-600 ring-1 ring-stroke-soft-200">Select a format to add venue or meeting details.</p>}

          <Input label="Capacity" type="number" inputMode="numeric" min={0} value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="No limit" helperText="Leave empty or enter 0 for unlimited capacity." />
        </FormSection>

        <FormActions>
          <Link href="/events" className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full justify-center">Cancel</Button>
          </Link>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting} className="w-full sm:w-auto justify-center">
            <PlusCircleIcon size={16} weight="regular" className="mr-1" />
            Publish Event
          </Button>
        </FormActions>
      </form>
    </div>
  );
}
