"use client";

import React, { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal, ConfirmModal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";
import { Tag } from "@/components/ui/Tag";
import {
  ArrowLeftIcon,
  ShareNetworkIcon,
  ClockIcon,
  MapPinIcon,
  VideoCameraIcon,
  UsersIcon,
  CheckCircleIcon,
  CalendarBlankIcon,
} from "@phosphor-icons/react";
import { formatEventDate, formatEventRange, eventCountdown } from "@/lib/utils/event";

export default function EventDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { events, users, currentUser, joinEvent, leaveEvent, cancelEvent } = useApp();

  const [showShareModal, setShowShareModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="py-20 text-center flex flex-col items-center">
        <h2 className="text-section-title text-text-strong-950">Event Not Found</h2>
        <p className="text-xs text-text-sub-600 mt-1 mb-4">
          This event may have been removed.
        </p>
        <Link href="/events">
          <Button variant="secondary" size="md">Back to Events</Button>
        </Link>
      </div>
    );
  }

  const isPast = new Date(event.date).getTime() < Date.now();
  const isJoined = !!currentUser && event.attendeeIds.includes(currentUser.id);
  const isOrganizer = !!currentUser && event.organizerId === currentUser.id;
  const isFull = event.capacity > 0 && event.attendeeIds.length >= event.capacity;
  const spotsLeft = event.capacity > 0 ? event.capacity - event.attendeeIds.length : null;
  const progress = event.capacity > 0 ? Math.min(100, Math.round((event.attendeeIds.length / event.capacity) * 100)) : 0;
  const attendees = event.attendeeIds
    .map((aid) => users.find((u) => u.id === aid))
    .filter(Boolean);
  const date = formatEventDate(event.date);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setShowShareModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/events"
          className="inline-flex items-center gap-1 text-xs font-semibold text-text-sub-600 hover:text-text-strong-950 transition-colors"
        >
          <ArrowLeftIcon size={16} weight="regular" />
          Back to Events
        </Link>
        <Button variant="outline" size="sm" onClick={() => setShowShareModal(true)}>
          <ShareNetworkIcon size={12} weight="regular" className="mr-1" />
          Share
        </Button>
      </div>

      <div className="overflow-hidden rounded-20 border border-stroke-soft-200 bg-bg-white-0 shadow-regular-xs">
        <div className="p-6 sm:p-8">
          <div className="flex gap-5">
            <div className="flex size-20 shrink-0 flex-col items-center justify-center rounded-20 bg-bg-weak-50 ring-1 ring-stroke-soft-200">
              <span className="text-2xl font-bold leading-6 text-text-strong-950" data-numeric>{date.day}</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-text-sub-600">{date.month}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Tag tone="primary">{event.category}</Tag>
                {event.status === "Cancelled" ? (
                  <Badge variant="danger">Cancelled</Badge>
                ) : isPast ? (
                  <Badge variant="neutral">Ended</Badge>
                ) : (
                  <span className="text-meta font-semibold text-primary-base">{eventCountdown(event.date)}</span>
                )}
              </div>
              <h1 className="mt-2 text-page-title text-text-strong-950">{event.title}</h1>
              <p className="mt-1 text-sm text-text-sub-600">
                Hosted by <span className="font-medium text-text-strong-950">{event.organizerName}</span>
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-10 bg-bg-weak-50 p-4 ring-1 ring-stroke-soft-200">
              <ClockIcon size={18} weight="regular" className="shrink-0 text-text-soft-400" />
              <div className="min-w-0">
                <p className="text-meta font-medium text-text-sub-600">When</p>
                <p className="truncate text-sm font-semibold text-text-strong-950">{formatEventRange(event.date, event.endDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-10 bg-bg-weak-50 p-4 ring-1 ring-stroke-soft-200">
              {event.isOnline ? (
                <VideoCameraIcon size={18} weight="regular" className="shrink-0 text-text-soft-400" />
              ) : (
                <MapPinIcon size={18} weight="regular" className="shrink-0 text-text-soft-400" />
              )}
              <div className="min-w-0">
                <p className="text-meta font-medium text-text-sub-600">Where</p>
                <p className="truncate text-sm font-semibold text-text-strong-950">{event.isOnline ? "Online" : event.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-10 bg-bg-weak-50 p-4 ring-1 ring-stroke-soft-200">
              <UsersIcon size={18} weight="regular" className="shrink-0 text-text-soft-400" />
              <div className="min-w-0">
                <p className="text-meta font-medium text-text-sub-600">Spots</p>
                <p className="truncate text-sm font-semibold text-text-strong-950">
                  {event.capacity > 0 ? `${event.attendeeIds.length}/${event.capacity} joined` : `${event.attendeeIds.length} joined • Open`}
                </p>
              </div>
            </div>
          </div>

          {event.capacity > 0 && (
            <div className="mt-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-bg-weak-50 ring-1 ring-stroke-soft-200">
                <div className="h-full rounded-full bg-primary-base transition-[width] duration-500" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-1.5 text-xs text-text-sub-600">
                {isFull ? "Event is full" : spotsLeft !== null ? `${spotsLeft} spots left` : ""}
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
            {event.status !== "Cancelled" && !isPast && (
              isJoined ? (
                <Button variant="outline" size="md" onClick={() => leaveEvent(event.id)} className="w-full sm:w-auto justify-center">
                  <CheckCircleIcon size={16} weight="fill" className="mr-1 text-success-base" />
                  Joined. Leave
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => joinEvent(event.id)}
                  disabled={isFull}
                  className="w-full sm:w-auto justify-center"
                >
                  {isFull ? "Event Full" : "Join Event"}
                </Button>
              )
            )}
            {isOrganizer && event.status !== "Cancelled" && (
              <Button variant="ghost" size="md" onClick={() => setShowCancelModal(true)} className="w-full sm:w-auto justify-center text-error-base">
                Cancel Event
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-20 border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs md:col-span-2">
          <h2 className="text-card-title text-text-strong-950">About this event</h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-text-sub-600">{event.description}</p>
          {event.isOnline && event.meetingLink && (
            <a href={event.meetingLink} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-10 bg-bg-weak-50 px-4 py-2.5 text-label-sm font-medium text-primary-base ring-1 ring-stroke-soft-200 transition-colors hover:bg-primary-alpha-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base/40">
              <VideoCameraIcon size={16} weight="regular" />
              Join meeting link
            </a>
          )}
        </div>

        <div className="rounded-20 border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs">
          <h2 className="text-card-title text-text-strong-950">Attendees ({event.attendeeIds.length})</h2>
          {attendees.length > 0 ? (
            <div className="mt-4 space-y-3">
              {attendees.slice(0, 8).map((a: any) => (
                <div key={a.id} className="flex items-center gap-2.5">
                  <Avatar name={a.name} className="size-8 text-xs" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text-strong-950">{a.name}</p>
                    <p className="truncate text-xs text-text-sub-600">{a.role}</p>
                  </div>
                </div>
              ))}
              {attendees.length > 8 && (
                <p className="text-xs text-text-soft-400">+{attendees.length - 8} more</p>
              )}
            </div>
          ) : (
            <p className="mt-3 text-sm text-text-sub-600">No RSVPs yet. Be the first to join.</p>
          )}
        </div>
      </div>

      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Event"
        description="Copy link to invite others"
        centered
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center py-2">
            <div className="flex size-12 items-center justify-center rounded-20 bg-bg-weak-50 ring-1 ring-stroke-soft-200">
              <ShareNetworkIcon size={20} weight="regular" className="text-text-strong-950" aria-hidden="true" />
            </div>
          </div>
          <div className="min-w-0 overflow-hidden rounded-10 bg-bg-weak-50 p-3 ring-1 ring-stroke-soft-200">
            <span className="block min-w-0 break-all text-sm leading-5 text-text-strong-950">
              {typeof window !== "undefined" ? window.location.href : ""}
            </span>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="md" onClick={() => setShowShareModal(false)} className="px-5">
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={handleCopyLink} className="px-5">
              Copy Link
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => {
          cancelEvent(event.id);
          setShowCancelModal(false);
        }}
        title="Cancel Event?"
        description={`"${event.title}" will be marked as cancelled for all attendees.`}
        icon="warning"
        confirmText="Cancel Event"
      />
    </div>
  );
}
