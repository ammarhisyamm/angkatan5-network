"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/lib/store/AppContext";
import { Button } from "@/components/ui/Button";
import { LayerCard } from "@/components/ui/Surface";
import { PageHeader, SectionHeading } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import dynamic from "next/dynamic";
const MemberGrowthChart = dynamic(() => import("@/components/charts/MemberGrowthChart"), { ssr: false, loading: () => <div className="h-56 animate-pulse rounded-lg bg-bg-weak-50" /> });
const TopSkillsChart = dynamic(() => import("@/components/charts/TopSkillsChart"), { ssr: false, loading: () => <div className="h-56 animate-pulse rounded-lg bg-bg-weak-50" /> });
import {
  UsersIcon,
  BriefcaseIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";

const STATUS_META = [
  { status: "Available to Help", name: "Available to Help", color: "var(--color-success-base)" },
  { status: "Open to Collaboration", name: "Open to Collaborate", color: "var(--color-primary-base)" },
  { status: "Open to Work", name: "Open to Work", color: "var(--color-warning-base)" },
  { status: "Hiring", name: "Hiring", color: "var(--color-feature-base)" },
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
      <PageHeader
        title="Dashboard"
        description="Manage members, review opportunities, and track skill growth."
        actions={<><Link href="/admin/members"><Button variant="secondary" size="sm" icon={<UsersIcon size={14} />}>Members</Button></Link><Link href="/admin/opportunities"><Button variant="primary" size="sm" icon={<BriefcaseIcon size={14} />}>Moderate</Button></Link></>}
      />

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
          <StatCard key={kpi.label} label={kpi.label} value={kpi.value} supporting={kpi.supporting} accent={kpi.accent || "text-text-strong-950"} />
        ))}
      </div>

      {/* Moderation Alert */}
      {pendingOpportunities.length > 0 && (
        <div className="flex flex-col items-stretch gap-4 rounded-10 border border-warning-light bg-warning-lighter p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
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
          <div className="mb-4 flex items-start justify-between gap-3">
            <SectionHeading title="Member Growth" description="Cohort expansion over 7 months" />
            <span className="text-xs font-semibold text-primary-base bg-primary-alpha-10 px-2 py-1 rounded-lg">Live data</span>
          </div>
          <div className="h-56 w-full">
            <MemberGrowthChart />
          </div>
        </LayerCard>

        <LayerCard className="p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <SectionHeading title="Top Indexed Skills" description="Most common skills across profiles" />
            <Link href="/admin/skills"><Button variant="ghost" size="sm">Manage Skills</Button></Link>
          </div>
          <div className="h-56 w-full">
            <TopSkillsChart />
          </div>
        </LayerCard>
      </div>

      {/* Status Breakdown */}
      <LayerCard className="p-6">
        <SectionHeading title="Member Status Breakdown" className="mb-4" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {statusData.map((st) => (
            <div key={st.name} className="flex items-center gap-3 rounded-10 border border-stroke-soft-200 bg-bg-weak-50 p-3 sm:p-4">
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
