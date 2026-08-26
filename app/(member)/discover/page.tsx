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
  const [selectedIndustry, setSelectedIndustry] = useState<string[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"relevance" | "newest" | "connected">("relevance");
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

      // Industry multi
      if (selectedIndustry.length > 0) {
        if (!selectedIndustry.includes(user.industry)) return false;
      }

      // Skill multi
      if (selectedSkill.length > 0) {
        if (!user.skills?.some((s) => selectedSkill.includes(s))) return false;
      }

      // Experience filter
      if (selectedExperience !== "All") {
        const expMin = parseInt(selectedExperience);
        if (user.experienceYears < expMin) return false;
      }

      // Location multi
      if (selectedLocation.length > 0) {
        if (!selectedLocation.some((loc) => user.location.toLowerCase().includes(loc.toLowerCase()))) return false;
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

  const sortedUsers = useMemo(() => {
    const arr = [...filteredUsers];
    if (sortBy === "newest") arr.sort((a, b) => new Date(b.joinedAt || 0).getTime() - new Date(a.joinedAt || 0).getTime());
    if (sortBy === "connected") arr.sort((a, b) => (b.skills?.length || 0) - (a.skills?.length || 0));
    return arr;
  }, [filteredUsers, sortBy]);

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedChip !== "All" ||
    selectedIndustry.length > 0 ||
    selectedSkill.length > 0 ||
    selectedExperience !== "All" ||
    selectedLocation.length > 0 ||
    selectedStatus !== "All";

  const clearAllFilters = () => {
    setSearchInput("");
    setSearchQuery("");
    setSelectedChip("All");
    setSelectedIndustry([]);
    setSelectedSkill([]);
    setSelectedExperience("All");
    setSelectedLocation([]);
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
        <div className="space-y-4">
          {/* Industry multi chips */}
          <div>
            <p className="mb-2 text-xs font-semibold text-text-strong-950">Industry</p>
            <div className="flex flex-wrap gap-2">
              {industries.slice(1).map((ind) => {
                const count = users.filter((u) => u.industry === ind && (selectedChip === "All" || u.industry === selectedChip) && (searchQuery ? [u.name, u.role, u.company, ...(u.skills||[])].join(" ").toLowerCase().includes(searchQuery.toLowerCase()) : true)).length;
                const active = selectedIndustry.includes(ind);
                return (
                  <button
                    key={ind}
                    onClick={() => setSelectedIndustry((prev) => active ? prev.filter((v) => v !== ind) : [...prev, ind])}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition-colors ${active ? "bg-text-strong-950 text-white ring-text-strong-950" : "bg-bg-white-0 text-text-sub-600 ring-stroke-soft-200 hover:bg-bg-weak-50"}`}
                  >
                    {ind} <span className={`rounded-full px-1 text-[10px] ${active ? "bg-white/20 text-white" : "bg-bg-weak-50 text-text-soft-400"}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skill multi chips */}
          <div>
            <p className="mb-2 text-xs font-semibold text-text-strong-950">Skills</p>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
              {allSkills.slice(1, 20).map((sk) => {
                const count = users.filter((u) => u.skills?.includes(sk)).length;
                const active = selectedSkill.includes(sk);
                return (
                  <button
                    key={sk}
                    onClick={() => setSelectedSkill((prev) => active ? prev.filter((v) => v !== sk) : [...prev, sk])}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition-colors ${active ? "bg-text-strong-950 text-white ring-text-strong-950" : "bg-bg-white-0 text-text-sub-600 ring-stroke-soft-200 hover:bg-bg-weak-50"}`}
                  >
                    {sk} <span className={`rounded-full px-1 text-[10px] ${active ? "bg-white/20 text-white" : "bg-bg-weak-50 text-text-soft-400"}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location multi chips */}
          <div>
            <p className="mb-2 text-xs font-semibold text-text-strong-950">Location</p>
            <div className="flex flex-wrap gap-2">
              {locations.slice(1).map((loc) => {
                const count = users.filter((u) => u.location.includes(loc)).length;
                const active = selectedLocation.includes(loc);
                return (
                  <button
                    key={loc}
                    onClick={() => setSelectedLocation((prev) => active ? prev.filter((v) => v !== loc) : [...prev, loc])}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition-colors ${active ? "bg-text-strong-950 text-white ring-text-strong-950" : "bg-bg-white-0 text-text-sub-600 ring-stroke-soft-200 hover:bg-bg-weak-50"}`}
                  >
                    {loc} <span className={`rounded-full px-1 text-[10px] ${active ? "bg-white/20 text-white" : "bg-bg-weak-50 text-text-soft-400"}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Experience"
              value={selectedExperience}
              onValueChange={(v: any) => setSelectedExperience(v)}
              items={[{ label: "All Experience", value: "All" }, { label: "1+ years", value: "1" }, { label: "3+ years", value: "3" }, { label: "5+ years", value: "5" }]}
              className="w-full"
            />
            <Select
              label="Availability"
              value={selectedStatus}
              onValueChange={(v: any) => setSelectedStatus(v)}
              items={["All", "Available to Help", "Open to Work", "Open to Collaboration", "Hiring"].map((s) => ({ label: s === "All" ? "All Statuses" : s, value: s }))}
              className="w-full"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="sticky bottom-0 -mx-4 -mb-4 flex items-center justify-between border-t border-stroke-soft-200 bg-bg-white-0 px-4 py-3 text-xs">
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
        <div className="flex items-center justify-between mb-4 gap-3">
          <span className="text-xs leading-4 font-medium text-text-sub-600">
            {sortedUsers.length} {sortedUsers.length === 1 ? "Person" : "People"} Found
          </span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="h-8 rounded-lg border border-stroke-soft-200 bg-bg-white-0 px-2 text-xs font-medium text-text-strong-950">
            <option value="relevance">Relevance</option>
            <option value="newest">Newest</option>
            <option value="connected">Most connected</option>
          </select>
        </div>

        {sortedUsers.length > 0 ? (
          <Grid variant="3up" gap="base">
            {sortedUsers.map((member) => (
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
