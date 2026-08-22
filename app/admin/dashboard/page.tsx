"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/lib/store/AppContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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
  PieChart,
  Pie,
} from "recharts";
import {
  Users,
  Briefcase,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

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
  { name: "UI/UX Design", count: 32, fill: "#2563eb" },
  { name: "BizDev", count: 27, fill: "#3b82f6" },
  { name: "Marketing", count: 21, fill: "#60a5fa" },
  { name: "Software Eng", count: 19, fill: "#93c5fd" },
  { name: "Finance", count: 16, fill: "#bfdbfe" },
];

const STATUS_DATA = [
  { name: "Available to Help", value: 122, color: "#10b981" },
  { name: "Open to Collab", value: 24, color: "#0ea5e9" },
  { name: "Open to Work", value: 18, color: "#f59e0b" },
  { name: "Hiring", value: 18, color: "#8b5cf6" },
];

export default function AdminDashboardPage() {
  const { users, opportunities, skills } = useApp();

  const pendingOpportunities = opportunities.filter(
    (o) => o.status === "Pending"
  );
  const unverifiedMembers = users.filter((u) => !u.verified);

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1 mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase leading-4 tracking-widest text-kumo-inactive">
            <ShieldCheck className="size-4" />
            <span>Angkatan 5 Secretariat Administration</span>
          </div>
          <h1 className="text-page-title text-kumo-strong">
            Community Overview
          </h1>
          <p className="mt-1 text-sm leading-5 text-kumo-subtle">
            Manage members, review community opportunities, and track skill growth.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/members">
            <Button variant="outline" size="sm">
              <Users className="size-3 mr-1" />
              Manage Members
            </Button>
          </Link>
          <Link href="/admin/opportunities">
            <Button variant="primary" size="sm">
              <Briefcase className="size-3 mr-1" />
              Moderate Board
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-kumo-base border border-kumo-line">
          <span className="text-xs leading-4 font-semibold text-kumo-subtle block">
            Total Members
          </span>
          <span className="mt-1 block text-page-title text-kumo-strong">
            182
          </span>
          <span className="text-xs leading-4 text-success-base font-medium">
            +18 this month
          </span>
        </div>

        <div className="p-4 rounded-xl bg-kumo-base border border-kumo-line">
          <span className="text-xs leading-4 font-semibold text-kumo-subtle block">
            Profile Completion
          </span>
          <span className="mt-1 block text-page-title text-kumo-strong">
            81%
          </span>
          <span className="text-xs leading-4 text-kumo-brand font-medium">
            Average across pool
          </span>
        </div>

        <div className="p-4 rounded-xl bg-kumo-base border border-kumo-line">
          <span className="text-xs leading-4 font-semibold text-warning-base block">
            Open to Work
          </span>
          <span className="mt-1 block text-page-title text-kumo-strong">
            18
          </span>
          <span className="text-xs leading-4 text-kumo-inactive">Available now</span>
        </div>

        <div className="p-4 rounded-xl bg-kumo-base border border-kumo-line">
          <span className="text-xs leading-4 font-semibold text-verified-base block">
            Collaboration
          </span>
          <span className="mt-1 block text-page-title text-kumo-strong">
            24
          </span>
          <span className="text-xs leading-4 text-kumo-inactive">Ready to partner</span>
        </div>

        <div className="p-4 rounded-xl bg-kumo-base border border-kumo-line">
          <span className="text-xs leading-4 font-semibold text-kumo-brand block">
            Active Opps
          </span>
          <span className="mt-1 block text-page-title text-kumo-strong">
            15
          </span>
          <span className="text-xs leading-4 text-success-base font-medium">
            {pendingOpportunities.length} pending approval
          </span>
        </div>

        <div className="p-4 rounded-xl bg-kumo-base border border-kumo-line">
          <span className="text-xs leading-4 font-semibold text-feature-base block">
            Skills Indexed
          </span>
          <span className="mt-1 block text-page-title text-kumo-strong">
            32
          </span>
          <span className="text-xs leading-4 text-kumo-inactive">across 7 fields</span>
        </div>
      </div>

      {/* Moderation Alert Banner if pending items */}
      {pendingOpportunities.length > 0 && (
        <div className="bg-warning-lighter border border-warning-light rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-5 text-warning-base shrink-0" />
            <div>
              <h4 className="text-xs font-semibold text-warning-dark">
                {pendingOpportunities.length} Opportunity Pending Moderation
              </h4>
              <p className="text-xs leading-4 text-warning-dark mt-0">
                Community posts require admin approval before becoming visible to all members.
              </p>
            </div>
          </div>
          <Link href="/admin/opportunities">
            <Button variant="outline" size="sm" className="">
              Review Queue
            </Button>
          </Link>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart: Member Growth */}
        <div className="bg-kumo-base border border-kumo-line rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-section-title text-kumo-strong">
                Member Growth
              </h3>
              <p className="text-xs text-kumo-subtle">
                Community cohort expansion over the last 7 months
              </p>
            </div>
            <span className="text-xs font-semibold text-kumo-brand bg-primary-alpha-10 px-2 py-1 rounded-lg">
              +304% total
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={GROWTH_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="members"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#2563eb", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Top Skills */}
        <div className="bg-kumo-base border border-kumo-line rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-section-title text-kumo-strong">
                Top Indexed Skills
              </h3>
              <p className="text-xs text-kumo-subtle">
                Most common skills tagged across member profiles
              </p>
            </div>
            <Link href="/admin/skills">
              <Button variant="ghost" size="sm" className="">
                Manage Skills
              </Button>
            </Link>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TOP_SKILLS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
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
                  {TOP_SKILLS_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Member Status Breakdown Row */}
      <div className="bg-kumo-base border border-kumo-line rounded-2xl p-6">
        <h3 className="text-section-title text-kumo-strong mb-4">
          Member Status Breakdown
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATUS_DATA.map((st) => (
            <div
              key={st.name}
              className="p-4 rounded-xl bg-kumo-tint border border-kumo-line flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-kumo-subtle block">
                  {st.name}
                </span>
                <span className="mt-1 block text-page-title text-kumo-strong">
                  {st.value} members
                </span>
              </div>
              <div
                className="size-3 rounded-full shrink-0"
                style={{ backgroundColor: st.color }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
