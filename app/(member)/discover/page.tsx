"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/lib/store/AppContext";
import { ProfileCard } from "@/components/member/ProfileCard";
import { ProfileCardSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  Users,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { UserStatus } from "@/lib/types";

const QUICK_CHIPS = [
  "All",
  "Design",
  "Technology",
  "Business",
  "Marketing",
  "Finance",
];

export default function DiscoverPeoplePage() {
  const { users } = useApp();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChip, setSelectedChip] = useState("All");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedSkill, setSelectedSkill] = useState("All");
  const [selectedExperience, setSelectedExperience] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

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

      // Search query (name, role, company, skills, bio)
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
    setSearchQuery("");
    setSelectedChip("All");
    setSelectedIndustry("All");
    setSelectedSkill("All");
    setSelectedExperience("All");
    setSelectedLocation("All");
    setSelectedStatus("All");
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase leading-4 tracking-widest text-text-soft-400 mb-1">
          <Users className="size-3" />
          <span>Talent Directory</span>
        </div>
        <h1 className="text-2xl font-semibold leading-8 tracking-tight text-text-strong-950">
          Discover People
        </h1>
        <p className="text-sm leading-5 text-text-sub-600 mt-1 max-w-2xl">
          Find someone based on what they do, what they know, or what they can help with.
        </p>
      </div>

      {/* Prominent Search Bar */}
      <div className="relative flex items-center">
        <Search className="absolute left-4 text-text-soft-400 size-5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search people, skills, roles, or companies..."
          className="w-full h-10 pl-11 pr-10 bg-bg-white-0 border border-stroke-soft-200 rounded-xl text-sm leading-5 text-text-strong-950 placeholder:text-text-soft-400 shadow-regular-xs focus:outline-none focus:border-primary-base focus:ring-2 focus:ring-primary-base/10 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 text-text-soft-400 hover:text-text-sub-600 p-1"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Quick Filter Chips */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-2">
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => setSelectedChip(chip)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                selectedChip === chip
                  ? "bg-primary-base text-static-white shadow-regular-xs"
                  : "bg-bg-white-0 text-text-sub-600 ring-1 ring-inset ring-stroke-soft-200 hover:bg-bg-weak-50"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Mobile filter trigger */}
        <Button variant="outline" size="sm" onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
          className="lg:hidden shrink-0 text-xs gap-2"
        >
          <SlidersHorizontal className="size-3" />
          Filters {hasActiveFilters && "•"}
        </Button>
      </div>

      {/* Detailed Filter Bar (Desktop inline / Mobile expandable) */}
      <div
        className={`bg-bg-white-0 border border-stroke-soft-200 rounded-2xl p-4 shadow-regular-xs transition-all ${
          isFilterDrawerOpen ? "block" : "hidden lg:block"
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Skill Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase leading-4 tracking-widest text-text-sub-600">
              Skill
            </label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="h-9 px-2 bg-bg-weak-50 border border-stroke-soft-200 rounded-xl text-xs text-text-strong-950 focus:outline-none focus:border-primary-base focus:ring-2 focus:ring-primary-base/10"
            >
              {allSkills.map((sk) => (
                <option key={sk} value={sk}>
                  {sk === "All" ? "All Skills" : sk}
                </option>
              ))}
            </select>
          </div>

          {/* Industry Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase leading-4 tracking-widest text-text-sub-600">
              Industry
            </label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="h-9 px-2 bg-bg-weak-50 border border-stroke-soft-200 rounded-xl text-xs text-text-strong-950 focus:outline-none focus:border-primary-base focus:ring-2 focus:ring-primary-base/10"
            >
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind === "All" ? "All Industries" : ind}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase leading-4 tracking-widest text-text-sub-600">
              Experience
            </label>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="h-9 px-2 bg-bg-weak-50 border border-stroke-soft-200 rounded-xl text-xs text-text-strong-950 focus:outline-none focus:border-primary-base focus:ring-2 focus:ring-primary-base/10"
            >
              <option value="All">All Experience</option>
              <option value="1">1+ years</option>
              <option value="3">3+ years</option>
              <option value="5">5+ years</option>
            </select>
          </div>

          {/* Location Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase leading-4 tracking-widest text-text-sub-600">
              Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="h-9 px-2 bg-bg-weak-50 border border-stroke-soft-200 rounded-xl text-xs text-text-strong-950 focus:outline-none focus:border-primary-base focus:ring-2 focus:ring-primary-base/10"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === "All" ? "All Locations" : loc}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase leading-4 tracking-widest text-text-sub-600">
              Availability
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-9 px-2 bg-bg-weak-50 border border-stroke-soft-200 rounded-xl text-xs text-text-strong-950 focus:outline-none focus:border-primary-base focus:ring-2 focus:ring-primary-base/10"
            >
              <option value="All">All Statuses</option>
              <option value="Available to Help">Available to Help</option>
              <option value="Open to Work">Open to Work</option>
              <option value="Open to Collaboration">Open to Collab</option>
              <option value="Hiring">Hiring</option>
            </select>
          </div>
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
              <RotateCcw className="size-3" />
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Results Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] leading-4 font-medium text-text-sub-600">
            {filteredUsers.length} {filteredUsers.length === 1 ? "Person" : "People"} Found
          </span>
        </div>

        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((member) => (
              <ProfileCard key={member.id} member={member} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Users}
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
