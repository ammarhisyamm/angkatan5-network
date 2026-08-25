"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/lib/store/AppContext";
import { ProfileCard } from "@/components/member/ProfileCard";
import { ProfileCardSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Grid, LayerCard } from "@/components/ui/Surface";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { MagnifyingGlassIcon, FunnelIcon, XIcon, SlidersHorizontalIcon, UsersIcon, SparkleIcon, ArrowCounterClockwiseIcon } from "@phosphor-icons/react";
import { UserStatus } from "@/lib/types";

const QUICK_CHIPS = [
  "All",
  "Design",
  "Technology",
  "Business",
  "Marketing",
  "Finance",
];

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const q = query.toLowerCase();
  const idx = text.toLowerCase().indexOf(q);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded-sm bg-primary-alpha-10 px-0.5 font-medium text-primary-base">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

export default function DiscoverPeoplePage() {
  const { users } = useApp();

  // Search and filter state
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("a5_recent_searches") || "[]"); } catch { return []; }
  });
  const [selectedChip, setSelectedChip] = useState("All");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedSkill, setSelectedSkill] = useState("All");
  const [selectedExperience, setSelectedExperience] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Debounce search input (300ms)
  React.useEffect(() => {
    const t = setTimeout(() => setSearchQuery(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Track recent searches
  React.useEffect(() => {
    if (searchQuery.trim() && filteredUsers.length > 0) {
      setRecentSearches((prev) => {
        const next = [searchQuery, ...prev.filter((s) => s !== searchQuery)].slice(0, 5);
        try { localStorage.setItem("a5_recent_searches", JSON.stringify(next)); } catch {}
        return next;
      });
    }
  }, [searchQuery]);

  // Extract unique filter options from data
  const industries = useMemo(() => {
    const list = Array.from(new Set(users.map((u) => u.industry))).filter(
      Boolean
    );
    return ["All", ...list];
  }, [users]);

  const allSkills = useMemo(() => {
    const set = new Set<string>();
    users.forEach((u) => u.skills?.forEach((s) => set.add(s)));
    return ["All", ...Array.from(set).sort()];
  }, [users]);

  const locations = useMemo(() => {
    const set = new Set<string>();
    users.forEach((u) => {
      const city = u.location.split(",")[0].trim();
      if (city) set.add(city);
    });
    return ["All", ...Array.from(set).sort()];
  }, [users]);

  // Filter logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Must be visible in directory and not suspended
      if (user.visibility === "hidden" || user.suspended) return false;

      // Search across name, role, company, skills, and bio
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = user.name.toLowerCase().includes(q);
        const matchesRole = user.role?.toLowerCase().includes(q);
        const matchesCompany = user.company?.toLowerCase().includes(q);
        const matchesBio = user.bio?.toLowerCase().includes(q);
        const matchesSkill = user.skills?.some((s) =>
          s.toLowerCase().includes(q)
        );
        if (
          !matchesName &&
          !matchesRole &&
          !matchesCompany &&
          !matchesBio &&
          !matchesSkill
        ) {
          return false;
        }
      }

      // Quick chip category
      if (selectedChip !== "All") {
        if (user.industry !== selectedChip) return false;
      }

      // Industry dropdown
      if (selectedIndustry !== "All") {
        if (user.industry !== selectedIndustry) return false;
      }

      // Skill dropdown
      if (selectedSkill !== "All") {
        if (!user.skills?.includes(selectedSkill)) return false;
      }

      // Experience filter
      if (selectedExperience !== "All") {
        const expMin = parseInt(selectedExperience);
        if (user.experienceYears < expMin) return false;
      }

      // Location filter
      if (selectedLocation !== "All") {
        if (!user.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus !== "All") {
        if (user.status !== selectedStatus) return false;
      }

      return true;
    });
  }, [
    users,
    searchQuery,
    selectedChip,
    selectedIndustry,
    selectedSkill,
    selectedExperience,
    selectedLocation,
    selectedStatus,
  ]);

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedChip !== "All" ||
    selectedIndustry !== "All" ||
    selectedSkill !== "All" ||
    selectedExperience !== "All" ||
    selectedLocation !== "All" ||
    selectedStatus !== "All";

  const clearAllFilters = () => {
    setSearchInput("");
    setSearchQuery("");
    setSelectedChip("All");
    setSelectedIndustry("All");
    setSelectedSkill("All");
    setSelectedExperience("All");
    setSelectedLocation("All");
    setSelectedStatus("All");
  };

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      {/* Page Header */}
      <div>
        <div className="mb-1 flex items-center gap-2 text-sm font-medium leading-5 text-text-sub-600">
          <UsersIcon size={12} weight="regular" />
          <span>Talent directory</span>
        </div>
        <h1 className="text-page-title text-text-strong-950">
          Discover People
        </h1>
        <p className="text-sm leading-5 text-text-sub-600 mt-1 max-w-2xl">
          Find someone based on what they do, what they know, or what they can help with.
        </p>
      </div>

      {/* Prominent search bar — Kumo Input */}
      <Input name="people-search" type="search" aria-label="Search people" placeholder="Search people, skills, roles, or companies…" value={searchInput} onChange={(e: any) => setSearchInput(e.target.value)} />
      {recentSearches.length > 0 && !searchQuery && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-text-soft-400">Recent:</span>
          {recentSearches.map((s) => (
            <button key={s} onClick={() => { setSearchInput(s); setSearchQuery(s); }} className="rounded-full border border-stroke-soft-200 bg-bg-white-0 px-2.5 py-1 text-xs text-text-sub-600 hover:bg-bg-weak-50">
              {s}
            </button>
          ))}
          <button onClick={() => { setRecentSearches([]); try { localStorage.removeItem("a5_recent_searches"); } catch {} }} className="text-xs text-text-soft-400 hover:text-text-sub-600">Clear</button>
        </div>
      )}

      {/* Quick Filter Chips */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {QUICK_CHIPS.map((chip) => (
            <Button
              key={chip}
              variant={selectedChip === chip ? "primary" : "secondary"}
              size="sm"
              onClick={() => setSelectedChip(chip)}
            >
              {chip}
            </Button>
          ))}
        </div>

        {/* Mobile filter trigger */}
        <Button variant="outline" size="sm" onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
          className="lg:hidden shrink-0 text-xs gap-2"
        >
          <SlidersHorizontalIcon size={12} weight="regular" />
          Filters {hasActiveFilters && "•"}
        </Button>
      </div>

      {/* Detailed Filter Bar (Desktop inline / Mobile expandable) */}
      <LayerCard
        className={`p-4 transition-colors ${isFilterDrawerOpen ? "block" : "hidden lg:block"}`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Skill Filter — Kumo Select */}
          <Select
            label="Skill"
            value={selectedSkill}
            onValueChange={(v: any) => setSelectedSkill(v)}
            items={allSkills.map((sk) => ({ label: sk === "All" ? "All Skills" : sk, value: sk }))}
            className="w-full"
          />

          {/* Industry Filter — Kumo Select */}
          <Select
            label="Industry"
            value={selectedIndustry}
            onValueChange={(v: any) => setSelectedIndustry(v)}
            items={industries.map((ind) => ({ label: ind === "All" ? "All Industries" : ind, value: ind }))}
            className="w-full"
          />

          {/* Experience Filter — Kumo Select */}
          <Select
            label="Experience"
            value={selectedExperience}
            onValueChange={(v: any) => setSelectedExperience(v)}
            items={[{ label: "All Experience", value: "All" }, { label: "1+ years", value: "1" }, { label: "3+ years", value: "3" }, { label: "5+ years", value: "5" }]}
            className="w-full"
          />

          {/* Location Filter — Kumo Select */}
          <Select
            label="Location"
            value={selectedLocation}
            onValueChange={(v: any) => setSelectedLocation(v)}
            items={locations.map((loc) => ({ label: loc === "All" ? "All Locations" : loc, value: loc }))}
            className="w-full"
          />

          {/* Status Filter — Kumo Select */}
          <Select
            label="Availability"
            value={selectedStatus}
            onValueChange={(v: any) => setSelectedStatus(v)}
            items={["All", "Available to Help", "Open to Work", "Open to Collaboration", "Hiring"].map((s) => ({ label: s === "All" ? "All Statuses" : s, value: s }))}
            className="w-full"
          />
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-stroke-soft-200 text-xs">
            <span className="text-text-sub-600">
              Showing{" "}
              <strong className="text-text-strong-950">
                {filteredUsers.length}
              </strong>{" "}
              members matching criteria
            </span>
            <button
              onClick={clearAllFilters}
              className="text-primary-base font-semibold hover:underline flex items-center gap-2"
            >
              <ArrowCounterClockwiseIcon size={12} weight="regular" />
              Reset All Filters
            </button>
          </div>
        )}
      </LayerCard>

      {/* Results Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs leading-4 font-medium text-text-sub-600">
            {filteredUsers.length} {filteredUsers.length === 1 ? "Person" : "People"} Found
          </span>
        </div>

        {filteredUsers.length > 0 ? (
          <Grid variant="3up" gap="base">
            {filteredUsers.map((member) => (
              <div key={member.id} className="[content-visibility:auto] [contain-intrinsic-size:0_340px]">
                <ProfileCard member={member} highlight={searchQuery} />
              </div>
            ))}
          </Grid>
        ) : (
          <EmptyState
            icon={UsersIcon}
            title="No people found"
            description="Try adjusting your search keywords or clearing active filters to see more members."
            action={
              <Button variant="secondary" size="sm" onClick={clearAllFilters}>
                Clear Filters
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
