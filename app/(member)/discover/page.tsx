"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/lib/store/AppContext";
import { ProfileCard } from "@/components/member/ProfileCard";
import { ProfileCardSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Grid } from "@cloudflare/kumo/components/grid";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { Input } from "@cloudflare/kumo/components/input";
import { Select } from "@cloudflare/kumo/components/select";
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

export default function DiscoverPeoplePage() {
  const { users } = useApp();

  // MagnifyingGlassIcon & Filter state
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

      // MagnifyingGlassIcon query (name, role, company, skills, bio)
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
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase leading-4 tracking-widest text-kumo-inactive mb-1">
          <UsersIcon size={12} weight="regular" />
          <span>Talent Directory</span>
        </div>
        <h1 className="text-page-title text-kumo-strong">
          Discover People
        </h1>
        <p className="text-sm leading-5 text-kumo-subtle mt-1 max-w-2xl">
          Find someone based on what they do, what they know, or what they can help with.
        </p>
      </div>

      {/* Prominent MagnifyingGlassIcon Bar — Kumo Input */}
      <Input aria-label="MagnifyingGlassIcon people" placeholder="MagnifyingGlassIcon people, skills, roles, or companies..." value={searchQuery} onChange={(e: any) => setSearchQuery(e.target.value)} />

      {/* Quick Filter Chips */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-2">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Skill Filter — Kumo Select */}
          <Select label="Skill" value={selectedSkill} onValueChange={(v: any) => setSelectedSkill(v)} items={allSkills.map((sk) => ({ label: sk === "All" ? "All Skills" : sk, value: sk }))} />

          {/* Industry Filter — Kumo Select */}
          <Select label="Industry" value={selectedIndustry} onValueChange={(v: any) => setSelectedIndustry(v)} items={industries.map((ind) => ({ label: ind === "All" ? "All Industries" : ind, value: ind }))} />

          {/* Experience Filter — Kumo Select */}
          <Select label="Experience" value={selectedExperience} onValueChange={(v: any) => setSelectedExperience(v)} items={[{ label: "All Experience", value: "All" }, { label: "1+ years", value: "1" }, { label: "3+ years", value: "3" }, { label: "5+ years", value: "5" }]} />

          {/* Location Filter — Kumo Select */}
          <Select label="Location" value={selectedLocation} onValueChange={(v: any) => setSelectedLocation(v)} items={locations.map((loc) => ({ label: loc === "All" ? "All Locations" : loc, value: loc }))} />

          {/* Status Filter — Kumo Select */}
          <Select label="Availability" value={selectedStatus} onValueChange={(v: any) => setSelectedStatus(v)} items={["All", "Available to Help", "Open to Work", "Open to Collaboration", "Hiring"].map((s) => ({ label: s === "All" ? "All Statuses" : s, value: s }))} />
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-kumo-line text-xs">
            <span className="text-kumo-subtle">
              Showing{" "}
              <strong className="text-kumo-strong">
                {filteredUsers.length}
              </strong>{" "}
              members matching criteria
            </span>
            <button
              onClick={clearAllFilters}
              className="text-kumo-brand font-semibold hover:underline flex items-center gap-2"
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
          <span className="text-xs leading-4 font-medium text-kumo-subtle">
            {filteredUsers.length} {filteredUsers.length === 1 ? "Person" : "People"} Found
          </span>
        </div>

        {filteredUsers.length > 0 ? (
          <Grid variant="3up" gap="base">
            {filteredUsers.map((member) => (
              <ProfileCard key={member.id} member={member} />
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
