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

  return (
    <LayerCard className="group flex h-full w-full flex-col overflow-hidden rounded-lg border border-kumo-line p-0 shadow-none transition-[background-color,border-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:border-kumo-brand/30 hover:bg-primary-alpha-10 hover:shadow-sm">
      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Tag tone={categoryTone[opportunity.category] ?? "neutral"}>{opportunity.category}</Tag>
            <Tag tone="neutral">
              <MapPinIcon size={12} weight="regular" className="shrink-0" />
              {opportunity.location}
            </Tag>
            <span className="text-meta font-medium text-kumo-subtle">{opportunity.type}</span>
          </div>
          <button
            onClick={() => toggleBookmark(opportunity.id)}
            title={bookmarked ? "Remove bookmark" : "Save opportunity"}
            aria-label={bookmarked ? "Remove bookmark" : "Save opportunity"}
            aria-pressed={bookmarked}
            className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand ${
              bookmarked
                ? "bg-primary-alpha-10 text-kumo-brand"
                : "text-kumo-inactive hover:bg-primary-alpha-10 hover:text-kumo-brand"
            }`}
          >
            {bookmarked ? <BookmarkSimpleIcon size={16} weight="regular" /> : <BookmarkSimpleIcon size={16} weight="regular" />}
          </button>
        </div>

        <Link href={`/opportunities/${opportunity.id}`} className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand">
          <h3 className="line-clamp-2 text-card-title text-kumo-strong transition-colors group-hover:text-kumo-brand">{opportunity.title}</h3>
        </Link>

        <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-kumo-subtle">{opportunity.description}</p>

        {opportunity.requiredSkills && opportunity.requiredSkills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2.5">
            {opportunity.requiredSkills.slice(0, 3).map((sk) => (
              <Tag key={sk}>{sk}</Tag>
            ))}
          </div>
        )}
      </div>

      {/* Footer anchored to bottom */}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-kumo-line px-6 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={opportunity.authorName} className="size-7 text-[10px]" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium leading-5 text-kumo-strong">{opportunity.authorName}</p>
            <p className="truncate text-meta font-medium text-kumo-subtle">Posted {formattedDate}</p>
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
