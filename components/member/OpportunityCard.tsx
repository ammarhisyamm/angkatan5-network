"use client";

import React from "react";
import Link from "next/link";
import { Opportunity } from "@/lib/types";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/lib/store/AppContext";
import { Bookmark, BookmarkCheck, MapPin, ArrowRight } from "lucide-react";

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
    <article className="group flex h-full flex-col rounded-xl border border-stroke-soft-200 bg-bg-white-0 transition-colors duration-200 hover:border-stroke-sub-300">
      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Tag tone={categoryTone[opportunity.category] ?? "neutral"}>{opportunity.category}</Tag>
            <Tag tone="neutral">
              <MapPin className="size-3 shrink-0" strokeWidth={1.5} />
              {opportunity.location}
            </Tag>
            <span className="text-xs leading-[18px] text-text-soft-400">{opportunity.type}</span>
          </div>
          <button
            onClick={() => toggleBookmark(opportunity.id)}
            title={bookmarked ? "Remove bookmark" : "Save opportunity"}
            aria-label={bookmarked ? "Remove bookmark" : "Save opportunity"}
            aria-pressed={bookmarked}
            className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base ${
              bookmarked
                ? "bg-primary-alpha-10 text-primary-base"
                : "text-text-soft-400 hover:bg-bg-weak-50 hover:text-text-sub-600"
            }`}
          >
            {bookmarked ? <BookmarkCheck className="size-4" strokeWidth={1.5} /> : <Bookmark className="size-4" strokeWidth={1.5} />}
          </button>
        </div>

        <Link href={`/opportunities/${opportunity.id}`} className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base">
          <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-text-strong-950 transition-colors group-hover:text-primary-base">{opportunity.title}</h3>
        </Link>

        <p className="mt-1.5 line-clamp-2 text-[13px] leading-5 text-text-sub-600">{opportunity.description}</p>

        {opportunity.requiredSkills && opportunity.requiredSkills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {opportunity.requiredSkills.slice(0, 3).map((sk) => (
              <Tag key={sk}>{sk}</Tag>
            ))}
          </div>
        )}
      </div>

      {/* Footer anchored to bottom */}
      <div className="mt-auto flex items-center justify-between gap-2 border-t border-stroke-soft-200 px-5 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <img src={opportunity.authorAvatar} alt="" className="size-8 shrink-0 rounded-full object-cover bg-bg-weak-50 ring-1 ring-stroke-soft-200" />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium leading-5 text-text-strong-950">{opportunity.authorName}</p>
            <p className="truncate text-xs leading-[18px] text-text-soft-400">Posted {formattedDate}</p>
          </div>
        </div>
        <Link href={`/opportunities/${opportunity.id}`} className="shrink-0">
          <Button variant="secondary" size="sm">
            View <ArrowRight className="size-3.5" strokeWidth={1.5} />
          </Button>
        </Link>
      </div>
    </article>
  );
}
