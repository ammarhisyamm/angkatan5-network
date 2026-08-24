"use client";

import React from "react";
import { useApp } from "@/lib/store/AppContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { ChartBarIcon, TrendUpIcon, UsersIcon, MedalIcon, BriefcaseIcon } from "@phosphor-icons/react";

const INDUSTRY_DATA = [
  { name: "Technology", count: 48, fill: "#2563eb" },
  { name: "Design", count: 36, fill: "#3b82f6" },
  { name: "Business", count: 32, fill: "#60a5fa" },
  { name: "Marketing", count: 28, fill: "#93c5fd" },
  { name: "Finance", count: 22, fill: "#38bdf8" },
  { name: "Creative & Media", count: 16, fill: "#a855f7" },
];

const EXPERIENCE_DATA = [
  { level: "1-2 Years", count: 34, fill: "#93c5fd" },
  { level: "3-4 Years", count: 78, fill: "#3b82f6" },
  { level: "5-6 Years", count: 52, fill: "#1d4ed8" },
  { level: "7+ Years", count: 18, fill: "#1e3a8a" },
];

export default function AdminAnalyticsPage() {
  const { users, opportunities, skills } = useApp();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="mb-1 flex items-center gap-1.5 text-sm font-medium leading-5 text-kumo-subtle">
          <ChartBarIcon size={16} weight="regular" />
          <span>Talent Analytics</span>
        </div>
        <h1 className="text-page-title text-kumo-strong">
          Community Analytics & Insights
        </h1>
        <p className="mt-1 text-sm leading-5 text-kumo-subtle">
          In-depth reports on industry distribution, seniority levels, and talent engagement.
        </p>
      </div>

      {/* Top Level Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-lg bg-kumo-base border border-kumo-line">
          <span className="text-xs font-semibold text-kumo-subtle block">Total Active Alumni</span>
          <span className="text-3xl font-bold text-kumo-strong mt-1 block">182</span>
          <span className="text-xs leading-4 text-success-base font-medium">94% response rate</span>
        </div>

        <div className="p-4 sm:p-5 rounded-lg bg-kumo-base border border-kumo-line">
          <span className="text-xs font-semibold text-kumo-subtle block">Connections Initiated</span>
          <span className="text-3xl font-bold text-kumo-brand mt-1 block">348</span>
          <span className="text-xs leading-4 text-kumo-inactive">across cohort members</span>
        </div>

        <div className="p-4 sm:p-5 rounded-lg bg-kumo-base border border-kumo-line">
          <span className="text-xs font-semibold text-kumo-subtle block">Hiring Placements</span>
          <span className="text-3xl font-bold text-success-base mt-1 block">28</span>
          <span className="text-xs leading-4 text-success-base font-medium">facilitated in 2026</span>
        </div>

        <div className="p-4 sm:p-5 rounded-lg bg-kumo-base border border-kumo-line">
          <span className="text-xs font-semibold text-kumo-subtle block">Avg Profile Freshness</span>
          <span className="text-3xl font-bold text-feature-base mt-1 block">12 days</span>
          <span className="text-xs leading-4 text-kumo-inactive">regular updates</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Industry Breakdown */}
        <div className="bg-kumo-base border border-kumo-line rounded-lg p-6">
          <h3 className="text-section-title text-kumo-strong mb-1">
            Industry Distribution
          </h3>
          <p className="text-xs text-kumo-subtle mb-6">Number of members active by sector</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={INDUSTRY_DATA}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Experience Levels */}
        <div className="bg-kumo-base border border-kumo-line rounded-lg p-6">
          <h3 className="text-section-title text-kumo-strong mb-1">
            Experience & Seniority Tiers
          </h3>
          <p className="text-xs text-kumo-subtle mb-6">Distribution across years of career experience</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={EXPERIENCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="level" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {EXPERIENCE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
