"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/lib/store/AppContext";
import { Button } from "@/components/ui/Button";
import { LayerCard } from "@/components/ui/Surface";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  ShieldCheckIcon,
  UsersIcon,
  BriefcaseIcon,
  TrendUpIcon,
  ChartBarIcon,
  StackIcon,
  UserIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";

const GROWTH_DATA = [
  { month: "Sep 25", members: 45 },
  { month: "Oct 25", members: 68 },
  { month: "Nov 25", members: 92 },
  { month: "Dec 25", members: 115 },
  { month: "Jan 26", members: 140 },
  { month: "Feb 26", members: 165 },
  { month: "Mar 26", members: 182 },
];

const TOP_SKILLS_DATA = [
  { name: "UI/UX Design", count: 32, fill: "#4169D8" },
  { name: "BizDev", count: 27, fill: "#5A7FE8" },
  { name: "Marketing", count: 21, fill: "#7B9BF0" },
  { name: "Software Eng", count: 19, fill: "#9DB5F5" },
  { name: "Finance", count: 16, fill: "#BFCFFA" },
];

const STATUS_DATA = [
  { name: "Available to Help", value: 122, color: "#2FA36B" },
  { name: "Open to Collaborate", value: 24, color: "#4169D8" },
  { name: "Open to Work", value: 18, color: "#E99A24" },
  { name: "Hiring", value: 18, color: "#8B5CF6" },
];

export default function AdminDashboardPage() {
  const { users, opportunities } = useApp();
  const pendingOpportunities = opportunities.filter((o) => o.status === "Pending");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="mb-1.5 flex items-center gap-1.5 text-label text-kumo-inactive">
            <ShieldCheckIcon size={14} />
            <span>Community Overview</span>
          </div>
          <h1 className="text-page-title text-kumo-strong">Dashboard</h1>
          <p className="mt-1 text-body text-kumo-subtle">
            Manage members, review opportunities, and track skill growth.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/members">
            <Button variant="secondary" size="sm" icon={<UsersIcon size={14} />}>Members</Button>
          </Link>
          <Link href="/admin/opportunities">
            <Button variant="primary" size="sm" icon={<BriefcaseIcon size={14} />}>Moderate</Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "Total Members", value: "182", accent: null, supporting: "+18 this month", supportColor: "text-success-base" },
          { label: "Profile Completion", value: "81%", accent: null, supporting: "Average across pool", supportColor: "text-kumo-brand" },
          { label: "Open to Work", value: "18", accent: "text-warning-base", supporting: "Available now", supportColor: "text-kumo-inactive" },
          { label: "Collaboration", value: "24", accent: "text-verified-base", supporting: "Ready to partner", supportColor: "text-kumo-inactive" },
          { label: "Active Opps", value: "15", accent: "text-kumo-brand", supporting: `${pendingOpportunities.length} pending`, supportColor: "text-kumo-inactive" },
          { label: "Skills Indexed", value: "32", accent: "text-feature-base", supporting: "Across 7 fields", supportColor: "text-kumo-inactive" },
        ].map((kpi) => (
          <LayerCard key={kpi.label} className="p-4">
            <span className={`text-meta font-semibold block ${kpi.accent || "text-kumo-subtle"}`}>{kpi.label}</span>
            <span className="mt-1 block text-kpi text-kumo-strong">{kpi.value}</span>
            <span className={`text-xs leading-4 block mt-0.5 ${kpi.supportColor}`}>{kpi.supporting}</span>
          </LayerCard>
        ))}
      </div>

      {/* Moderation Alert */}
      {pendingOpportunities.length > 0 && (
        <div className="bg-warning-lighter border border-warning-light rounded-xl p-3 sm:p-4 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <WarningCircleIcon size={20} weight="fill" className="text-warning-base shrink-0" />
            <div>
              <p className="text-sm font-semibold text-warning-dark">{pendingOpportunities.length} Opportunity Pending Moderation</p>
              <p className="text-xs text-warning-dark mt-0.5">Community posts require admin approval before becoming visible.</p>
            </div>
          </div>
          <Link href="/admin/opportunities" className="w-full sm:w-auto">
            <Button variant="secondary" size="sm" className="w-full sm:w-auto">Review Queue</Button>
          </Link>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LayerCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-card-title text-kumo-strong">Member Growth</h3>
              <p className="text-xs text-kumo-subtle mt-0.5">Cohort expansion over 7 months</p>
            </div>
            <span className="text-xs font-semibold text-kumo-brand bg-primary-alpha-10 px-2 py-1 rounded-lg">+304%</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={GROWTH_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#98A2B3" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#98A2B3" }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#fff", fontSize: "12px" }} />
                <Line type="monotone" dataKey="members" stroke="#4169D8" strokeWidth={2.5} dot={{ r: 3, fill: "#4169D8", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </LayerCard>

        <LayerCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-card-title text-kumo-strong">Top Indexed Skills</h3>
              <p className="text-xs text-kumo-subtle mt-0.5">Most common skills across profiles</p>
            </div>
            <Link href="/admin/skills">
              <Button variant="ghost" size="sm">Manage Skills</Button>
            </Link>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TOP_SKILLS_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#98A2B3" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#98A2B3" }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#fff", fontSize: "12px" }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {TOP_SKILLS_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
            </BarChart>
          </ResponsiveContainer>
          </div>
        </LayerCard>
      </div>

      {/* Status Breakdown */}
      <LayerCard className="p-6">
        <h3 className="text-card-title text-kumo-strong mb-4">Member Status Breakdown</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STATUS_DATA.map((st) => (
            <div key={st.name} className="p-3 sm:p-4 rounded-xl bg-kumo-tint border border-kumo-line flex items-center gap-3">
              <div className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: st.color }} />
              <div>
                <span className="text-xs text-kumo-subtle block">{st.name}</span>
                <span className="text-kpi text-kumo-strong">{st.value}</span>
                <span className="text-xs text-kumo-inactive ml-1">members</span>
              </div>
            </div>
          ))}
        </div>
      </LayerCard>
    </div>
  );
}
