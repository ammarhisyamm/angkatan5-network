"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/lib/store/AppContext";
import { Button } from "@/components/ui/Button";
import { LayerCard } from "@/components/ui/Surface";
import dynamic from "next/dynamic";
const MemberGrowthChart = dynamic(() => import("@/components/charts/MemberGrowthChart"), { ssr: false, loading: () => <div className="h-56 animate-pulse rounded-lg bg-bg-weak-50" /> });
const TopSkillsChart = dynamic(() => import("@/components/charts/TopSkillsChart"), { ssr: false, loading: () => <div className="h-56 animate-pulse rounded-lg bg-bg-weak-50" /> });
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

const STATUS_META = [
  { status: "Available to Help", name: "Available to Help", color: "#2FA36B" },
  { status: "Open to Collaboration", name: "Open to Collaborate", color: "#111827" },
  { status: "Open to Work", name: "Open to Work", color: "#E99A24" },
  { status: "Hiring", name: "Hiring", color: "#8B5CF6" },
];

export default function AdminDashboardPage() {
  const { users, opportunities, skills } = useApp();
  const pendingOpportunities = opportunities.filter((o) => o.status === "Pending");
  const activeOpportunities = opportunities.filter((o) => o.status === "Published" || o.status === "Approved");
  const verifiedCount = users.filter((u) => u.verified).length;
  const avgCompletion = users.length
    ? Math.round(users.reduce((sum, u) => sum + (u.profileCompletion || 0), 0) / users.length)
    : 0;
  const fieldCount = new Set(skills.map((s) => s.category)).size;
  const statusData = STATUS_META.map((s) => ({
    ...s,
    value: users.filter((u) => u.status === s.status).length,
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="mb-1.5 flex items-center gap-1.5 text-label text-text-soft-400">
            <ShieldCheckIcon size={14} />
            <span>Community Overview</span>
          </div>
          <h1 className="text-page-title text-text-strong-950">Dashboard</h1>
          <p className="mt-1 text-body text-text-sub-600">
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
          { label: "Total Members", value: String(users.length), accent: null, supporting: `${verifiedCount} verified`, supportColor: "text-success-base" },
          { label: "Profile Completion", value: `${avgCompletion}%`, accent: null, supporting: "Average across pool", supportColor: "text-primary-base" },
          { label: "Open to Work", value: String(users.filter((u) => u.status === "Open to Work").length), accent: "text-warning-base", supporting: "Available now", supportColor: "text-text-soft-400" },
          { label: "Collaboration", value: String(users.filter((u) => u.status === "Open to Collaboration").length), accent: "text-verified-base", supporting: "Ready to partner", supportColor: "text-text-soft-400" },
          { label: "Active Opps", value: String(activeOpportunities.length), accent: "text-primary-base", supporting: `${pendingOpportunities.length} pending`, supportColor: "text-text-soft-400" },
          { label: "Skills Indexed", value: String(skills.length), accent: "text-feature-base", supporting: `Across ${fieldCount} fields`, supportColor: "text-text-soft-400" },
        ].map((kpi) => (
          <LayerCard key={kpi.label} className="p-4">
            <span className={`text-meta font-semibold block ${kpi.accent || "text-text-sub-600"}`}>{kpi.label}</span>
            <span className="mt-1 block text-kpi text-text-strong-950">{kpi.value}</span>
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
              <h3 className="text-card-title text-text-strong-950">Member Growth</h3>
              <p className="text-xs text-text-sub-600 mt-0.5">Cohort expansion over 7 months</p>
            </div>
            <span className="text-xs font-semibold text-primary-base bg-primary-alpha-10 px-2 py-1 rounded-lg">Live data</span>
          </div>
          <div className="h-56 w-full">
            <MemberGrowthChart />
          </div>
        </LayerCard>

        <LayerCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-card-title text-text-strong-950">Top Indexed Skills</h3>
              <p className="text-xs text-text-sub-600 mt-0.5">Most common skills across profiles</p>
            </div>
            <Link href="/admin/skills">
              <Button variant="ghost" size="sm">Manage Skills</Button>
            </Link>
          </div>
          <div className="h-56 w-full">
            <TopSkillsChart />
          </div>
        </LayerCard>
      </div>

      {/* Status Breakdown */}
      <LayerCard className="p-6">
        <h3 className="text-card-title text-text-strong-950 mb-4">Member Status Breakdown</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {statusData.map((st) => (
            <div key={st.name} className="p-3 sm:p-4 rounded-xl bg-bg-weak-50 border border-stroke-soft-200 flex items-center gap-3">
              <div className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: st.color }} />
              <div>
                <span className="text-xs text-text-sub-600 block">{st.name}</span>
                <span className="text-kpi text-text-strong-950">{st.value}</span>
                <span className="text-xs text-text-soft-400 ml-1">members</span>
              </div>
            </div>
          ))}
        </div>
      </LayerCard>
    </div>
  );
}
