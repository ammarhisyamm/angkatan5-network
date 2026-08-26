"use client";

import React from "react";
import { useApp } from "@/lib/store/AppContext";
import dynamic from "next/dynamic";
const IndustryChart = dynamic(() => import("@/components/charts/IndustryChart"), { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-lg bg-bg-weak-50" /> });
const ExperienceChart = dynamic(() => import("@/components/charts/ExperienceChart"), { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-lg bg-bg-weak-50" /> });
import { ChartBarIcon, TrendUpIcon, UsersIcon, MedalIcon, BriefcaseIcon } from "@phosphor-icons/react";



export default function AdminAnalyticsPage() {
  const { users, opportunities, skills } = useApp();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="mb-1 flex items-center gap-1.5 text-sm font-medium leading-5 text-text-sub-600">
          <ChartBarIcon size={16} weight="regular" />
          <span>Talent Analytics</span>
        </div>
        <h1 className="text-page-title text-text-strong-950">
          Community Analytics & Insights
        </h1>
        <p className="mt-1 text-sm leading-5 text-text-sub-600">
          In-depth reports on industry distribution, seniority levels, and talent engagement.
        </p>
      </div>

      {/* Top Level Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-lg bg-bg-white-0 border border-stroke-soft-200">
          <span className="text-xs font-semibold text-text-sub-600 block">Total Active Alumni</span>
          <span className="text-3xl font-bold text-text-strong-950 mt-1 block">182</span>
          <span className="text-xs leading-4 text-success-base font-medium">94% response rate</span>
        </div>

        <div className="p-4 sm:p-5 rounded-lg bg-bg-white-0 border border-stroke-soft-200">
          <span className="text-xs font-semibold text-text-sub-600 block">Connections Initiated</span>
          <span className="text-3xl font-bold text-primary-base mt-1 block">348</span>
          <span className="text-xs leading-4 text-text-soft-400">across cohort members</span>
        </div>

        <div className="p-4 sm:p-5 rounded-lg bg-bg-white-0 border border-stroke-soft-200">
          <span className="text-xs font-semibold text-text-sub-600 block">Hiring Placements</span>
          <span className="text-3xl font-bold text-success-base mt-1 block">28</span>
          <span className="text-xs leading-4 text-success-base font-medium">facilitated in 2026</span>
        </div>

        <div className="p-4 sm:p-5 rounded-lg bg-bg-white-0 border border-stroke-soft-200">
          <span className="text-xs font-semibold text-text-sub-600 block">Avg Profile Freshness</span>
          <span className="text-3xl font-bold text-feature-base mt-1 block">12 days</span>
          <span className="text-xs leading-4 text-text-soft-400">regular updates</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Industry Breakdown */}
        <div className="bg-bg-white-0 border border-stroke-soft-200 rounded-lg p-6">
          <h3 className="text-section-title text-text-strong-950 mb-1">
            Industry Distribution
          </h3>
          <p className="text-xs text-text-sub-600 mb-6">Number of members active by sector</p>

          <div className="h-64 w-full">
            <IndustryChart />
          </div>
        </div>

        {/* Experience Levels */}
        <div className="bg-bg-white-0 border border-stroke-soft-200 rounded-lg p-6">
          <h3 className="text-section-title text-text-strong-950 mb-1">
            Experience & Seniority Tiers
          </h3>
          <p className="text-xs text-text-sub-600 mb-6">Distribution across years of career experience</p>

          <div className="h-64 w-full">
            <ExperienceChart />
          </div>
        </div>
      </div>
    </div>
  );
}
