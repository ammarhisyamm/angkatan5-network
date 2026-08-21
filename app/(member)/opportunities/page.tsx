"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store/AppContext";
import { OpportunityCard } from "@/components/member/OpportunityCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Briefcase,
  PlusCircle,
  Search,
  X,
  Bookmark,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { OpportunityCategory, OpportunityType } from "@/lib/types";

const CATEGORIES: ("All" | OpportunityCategory)[] = [
  "All",
  "Jobs",
  "Freelance",
  "Collaboration",
  "Internship",
  "Hiring",
  "Mentorship",
  "Business",
];

export default function OpportunitiesPage() {
  const { opportunities, bookmarkedOpportunityIds } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | OpportunityCategory>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [onlySaved, setOnlySaved] = useState(false);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      // Must be published
      if (opp.status !== "Published") return false;

      // Saved only toggle
      if (onlySaved && !bookmarkedOpportunityIds.includes(opp.id)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = opp.title.toLowerCase().includes(q);
        const matchesDesc = opp.description.toLowerCase().includes(q);
        const matchesAuthor = opp.authorName.toLowerCase().includes(q);
        const matchesSkill = opp.requiredSkills?.some((s) =>
          s.toLowerCase().includes(q)
        );
        if (!matchesTitle && !matchesDesc && !matchesAuthor && !matchesSkill) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== "All") {
        if (opp.category !== selectedCategory) return false;
      }

      // Type filter
      if (selectedType !== "All") {
        if (opp.type !== selectedType) return false;
      }

      return true;
    });
  }, [
    opportunities,
    searchQuery,
    selectedCategory,
    selectedType,
    onlySaved,
    bookmarkedOpportunityIds,
  ]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-base mb-1">
            <Briefcase className="size-4" />
            <span>Community Board</span>
          </div>
          <h1 className="text-2xl font-semibold leading-8 tracking-tight text-text-strong-950">
            Opportunities
          </h1>
          <p className="text-sm text-text-sub-600 mt-1 max-w-2xl">
            Discover jobs, collaborations, freelance projects, and other opportunities shared by the community.
          </p>
        </div>

        <Link href="/opportunities/create" className="shrink-0">
          <Button variant="primary" size="md" className="">
            <PlusCircle className="size-4" />
            Share Opportunity
          </Button>
        </Link>
      </div>

      {/* Search and Saved Toggle Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft-400 size-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search opportunities, roles, keywords..."
            className="w-full h-10 pl-10 pr-10 bg-bg-white-0 border border-stroke-soft-200 rounded-xl text-sm text-text-strong-950 placeholder:text-text-soft-400 shadow-regular-xs focus:outline-none focus:border-primary-base focus:ring-2 focus:ring-primary-base/10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-soft-400 hover:text-text-sub-600"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => setOnlySaved(!onlySaved)}
          className={`h-10 px-4 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
            onlySaved
              ? "bg-primary-alpha-10 text-primary-base border-primary-base/20"
              : "bg-bg-white-0 text-text-sub-600 border-stroke-soft-200 hover:bg-bg-weak-50"
          }`}
        >
          <Bookmark className={`size-4 ${onlySaved ? "fill-current" : ""}`} />
          Saved ({bookmarkedOpportunityIds.length})
        </button>
      </div>

      {/* Categories Horizontal Scrolling Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-primary-base text-static-white shadow-regular-xs"
                : "bg-bg-white-0 text-text-sub-600 border border-stroke-soft-200 hover:border-stroke-sub-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Opportunities List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-text-sub-600">
            {filteredOpportunities.length}{" "}
            {filteredOpportunities.length === 1 ? "Opportunity" : "Opportunities"} Available
          </span>
        </div>

        {filteredOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOpportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Briefcase}
            title="No opportunities yet"
            description="Be the first person to share an opportunity with the community."
            action={
              <Link href="/opportunities/create">
                <Button variant="primary" size="sm">
                  <PlusCircle className="size-3.5" strokeWidth={1.5} />
                  Share Opportunity
                </Button>
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
