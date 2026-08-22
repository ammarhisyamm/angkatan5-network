"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store/AppContext";
import { OpportunityCard } from "@/components/member/OpportunityCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Grid } from "@cloudflare/kumo/components/grid";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { Input } from "@cloudflare/kumo/components/input";
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
          <div className="flex items-center gap-2 text-xs font-semibold text-kumo-brand mb-1">
            <Briefcase className="size-4" />
            <span>Community Board</span>
          </div>
          <h1 className="text-page-title text-kumo-strong">
            Opportunities
          </h1>
          <p className="text-sm text-kumo-subtle mt-1 max-w-2xl">
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

      {/* Search and Saved Toggle Bar — Kumo Input */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input aria-label="Search opportunities" placeholder="Search opportunities, roles, keywords..." value={searchQuery} onChange={(e: any) => setSearchQuery(e.target.value)} />
        </div>

        <Button
          variant={onlySaved ? "primary" : "secondary"}
          size="sm"
          onClick={() => setOnlySaved(!onlySaved)}
          icon={<Bookmark className={onlySaved ? "fill-current" : ""} />}
        >
          Saved ({bookmarkedOpportunityIds.length})
        </Button>
      </div>

      {/* Categories Horizontal Scrolling Filter */}
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

      {/* Opportunities List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-kumo-subtle">
            {filteredOpportunities.length}{" "}
            {filteredOpportunities.length === 1 ? "Opportunity" : "Opportunities"} Available
          </span>
        </div>

        {filteredOpportunities.length > 0 ? (
          <Grid variant="3up" gap="base">
            {filteredOpportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </Grid>
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
