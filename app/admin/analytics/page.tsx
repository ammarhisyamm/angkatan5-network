"use client";

import React from "react";
import { useApp } from "@/lib/store/AppContext";
import { LayerCard } from "@/components/ui/Surface";
import dynamic from "next/dynamic";
const IndustryChart = dynamic(() => import("@/components/charts/IndustryChart"), { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-lg bg-bg-weak-50" /> });
const ExperienceChart = dynamic(() => import("@/components/charts/ExperienceChart"), { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-lg bg-bg-weak-50" /> });
import { PageHeader, SectionHeading } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";



export default function AdminAnalyticsPage() {
  const { users, opportunities, events } = useApp();
  const verifiedCount = users.filter((u) => u.verified).length;
  const hiringCount = opportunities.filter((o) => o.category === "Hiring").length;
  const avgCompletion = users.length
    ? Math.round(users.reduce((sum, u) => sum + (u.profileCompletion || 0), 0) / users.length)
    : 0;

  return (
    <div className="space-y-8">
      <PageHeader title="Community analytics" description="Industry distribution, experience levels, and member engagement." />

      {/* Top Level Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Active Alumni" value={users.length} supporting={`${verifiedCount} verified`} accent="text-text-strong-950" />
        <StatCard label="Event RSVPs" value={events.reduce((sum, e) => sum + e.attendeeIds.length, 0)} supporting="across cohort members" accent="text-primary-base" />
        <StatCard label="Hiring Placements" value={hiringCount} supporting="posted by community" accent="text-success-base" />
        <StatCard label="Avg Profile Completion" value={`${avgCompletion}%`} supporting="across all members" accent="text-feature-base" />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Industry Breakdown */}
        <LayerCard className="p-6">
          <SectionHeading title="Industry Distribution" description="Number of members active by sector" className="mb-6" />

          <div className="h-64 w-full">
            <IndustryChart />
          </div>
        </LayerCard>

        {/* Experience Levels */}
        <LayerCard className="p-6">
          <SectionHeading title="Experience & Seniority Tiers" description="Distribution across years of career experience" className="mb-6" />

          <div className="h-64 w-full">
            <ExperienceChart />
          </div>
        </LayerCard>
      </div>
    </div>
  );
}
