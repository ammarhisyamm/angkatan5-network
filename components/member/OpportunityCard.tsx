"use client";

import React from "react";
import Link from "next/link";
import { Opportunity } from "@/lib/types";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { LayerCard } from "@/components/ui/Surface";
import { Avatar } from "@/components/ui/Avatar";
import { useApp } from "@/lib/store/AppContext";
import { BookmarkSimpleIcon, MapPinIcon, ArrowRightIcon } from "@phosphor-icons/react";

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const { toggleBookmark, isBookmarked } = useApp();
  const bookmarked = isBookmarked(opportunity.id);
  const formattedDate = new Date(opportunity.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const categoryTone: Record<string, "primary" | "warning" | "information" | "success" | "neutral"> = {
    Jobs: "primary",
    Hiring: "primary",
    Freelance: "warning",
    Collaboration: "information",
    Internship: "success",
    Mentorship: "neutral",
    Business: "neutral",
  };

  const isRemote = opportunity.location.toLowerCase().includes("remote");
  const daysLeft = Math.ceil((new Date(opportunity.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = daysLeft <= 7 && daysLeft >= 0;
  const isExpired = daysLeft < 0;

  return (
    <LayerCard className="group flex h-full w-full flex-col overflow-hidden rounded-lg border border-stroke-soft-200 p-0 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[background-color,border-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:border-primary-base/30 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Tag tone={categoryTone[opportunity.category] ?? "neutral"}>{opportunity.category}</Tag>
            <Tag tone="neutral">
              <MapPinIcon size={12} weight="regular" className="shrink-0" />
              {opportunity.location}
            </Tag>
            <span className="text-meta font-medium text-text-sub-600">{opportunity.type}</span>
            {isRemote && <span className="inline-flex items-center rounded-full bg-success-lighter px-2 py-0.5 text-xs font-medium text-success-dark ring-1 ring-success-base/20">Remote</span>}
            {isExpiringSoon && <span className="inline-flex items-center rounded-full bg-warning-lighter px-2 py-0.5 text-xs font-medium text-warning-dark ring-1 ring-warning-base/20">{daysLeft}d left</span>}
            {isExpired && <span className="inline-flex items-center rounded-full bg-error-lighter px-2 py-0.5 text-xs font-medium text-error-dark ring-1 ring-error-base/20">Expired</span>}
          </div>
          <button
            onClick={() => toggleBookmark(opportunity.id)}
            title={bookmarked ? "Remove bookmark" : "Save opportunity"}
            aria-label={bookmarked ? "Remove bookmark" : "Save opportunity"}
            aria-pressed={bookmarked}
            className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base ${
              bookmarked
                ? "bg-primary-alpha-10 text-primary-base"
                : "text-text-soft-400 hover:text-primary-base"
            }`}
          >
            {bookmarked ? <BookmarkSimpleIcon size={16} weight="regular" /> : <BookmarkSimpleIcon size={16} weight="regular" />}
          </button>
        </div>

        <Link href={`/opportunities/${opportunity.id}`} className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base">
          <h3 className="line-clamp-2 text-card-title text-text-strong-950 transition-colors group-hover:text-primary-base">{opportunity.title}</h3>
        </Link>

        <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-text-sub-600">{opportunity.description}</p>

        {opportunity.requiredSkills && opportunity.requiredSkills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2.5">
            {opportunity.requiredSkills.slice(0, 3).map((sk) => (
              <Tag key={sk}>{sk}</Tag>
            ))}
          </div>
        )}
      </div>

      {/* Footer anchored to bottom */}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-stroke-soft-200 px-6 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={opportunity.authorName} src={opportunity.authorAvatar} className="size-7 text-[10px]" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium leading-5 text-text-strong-950">{opportunity.authorName}</p>
            <p className="truncate text-meta font-medium text-text-sub-600">Posted {formattedDate}</p>
          </div>
        </div>
        <Link href={`/opportunities/${opportunity.id}`} className="shrink-0">
          <Button variant="secondary" size="sm">
            View <ArrowRightIcon size={14} weight="regular" />
          </Button>
        </Link>
      </div>
    </LayerCard>
  );
}
