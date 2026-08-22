"use client";

import Link from "next/link";
import { useApp } from "@/lib/store/AppContext";
import { Button } from "@/components/ui/Button";
import { ArrowRight, BarChart3, Briefcase, CheckCircle2, ChevronRight, Clock3, Layers, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const GROWTH_DATA = [
  { month: "Sep", members: 45 }, { month: "Oct", members: 68 }, { month: "Nov", members: 92 }, { month: "Dec", members: 115 },
  { month: "Jan", members: 140 }, { month: "Feb", members: 165 }, { month: "Mar", members: 182 },
];
const TOP_SKILLS_DATA = [
  { name: "UI/UX", count: 32, fill: "#335cff" }, { name: "BizDev", count: 27, fill: "#6281ff" }, { name: "Marketing", count: 21, fill: "#91a7ff" },
  { name: "Engineering", count: 19, fill: "#b9c8ff" }, { name: "Finance", count: 16, fill: "#d9e1ff" },
];
const STATUS_DATA = [
  { name: "Available to help", value: 122, color: "#16804b" }, { name: "Open to collaborate", value: 24, color: "#335cff" },
  { name: "Open to work", value: 18, color: "#a15c00" }, { name: "Hiring", value: 18, color: "#7d52f4" },
];

function Metric({ label, value, trend, note, icon: Icon }: { label: string; value: string; trend?: string; note: string; icon: typeof Users }) {
  return <div className="group relative min-w-0 border-l border-stroke-soft-200 px-4 first:border-l-0 first:pl-0 sm:px-5">
    <div className="mb-3 flex items-center justify-between gap-3"><p className="text-xs font-medium text-text-sub-600">{label}</p><span className="flex size-7 items-center justify-center rounded-lg bg-bg-weak-50 text-text-soft-400 transition-colors group-hover:bg-primary-alpha-10 group-hover:text-primary-base"><Icon className="size-3.5" strokeWidth={1.7} /></span></div>
    <div className="flex items-end gap-2"><p className="text-[28px] font-semibold leading-8 tracking-[-0.04em] text-text-strong-950">{value}</p>{trend && <span className="mb-1 inline-flex items-center gap-0.5 text-[11px] font-semibold text-success-base"><TrendingUp className="size-3" />{trend}</span>}</div>
    <p className="mt-1.5 text-[11px] leading-4 text-text-soft-400">{note}</p>
  </div>;
}

export default function AdminDashboardPage() {
  const { users, opportunities, skills } = useApp();
  const pendingOpportunities = opportunities.filter((opportunity) => opportunity.status === "Pending");
  const unverifiedMembers = users.filter((user) => !user.verified);

  return <div className="space-y-5 lg:space-y-6">
    <section className="relative overflow-hidden rounded-2xl border border-stroke-soft-200 bg-bg-white-0 shadow-regular-xs">
      <div className="absolute -right-28 -top-28 size-72 rounded-full bg-primary-alpha-10 blur-3xl" />
      <div className="relative flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-end lg:justify-between">
        <div><div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-base"><span className="flex size-5 items-center justify-center rounded-md bg-primary-alpha-10"><ShieldCheck className="size-3" /></span>Angkatan 5 Secretariat</div><h1 className="text-2xl font-semibold tracking-[-0.035em] text-text-strong-950 sm:text-[28px]">Community overview</h1><p className="mt-1.5 max-w-xl text-[13px] leading-5 text-text-sub-600">A clear pulse on your cohort, opportunities, and the skills shaping the network.</p></div>
        <div className="flex flex-wrap items-center gap-2"><span className="rounded-lg border border-stroke-soft-200 bg-bg-white-0 px-3 py-2 text-xs font-medium text-text-sub-600 shadow-regular-xs">Updated just now</span><Link href="/admin/members"><Button variant="outline" size="sm"><Users className="size-3.5" />Manage members</Button></Link><Link href="/admin/opportunities"><Button variant="primary" size="sm"><Briefcase className="size-3.5" />Moderate board</Button></Link></div>
      </div>
      <div className="relative grid grid-cols-2 gap-y-6 border-t border-stroke-soft-200 px-5 py-5 sm:grid-cols-3 sm:px-6 lg:grid-cols-6">
        <Metric label="Total members" value="182" trend="10%" note="18 joined this month" icon={Users} /><Metric label="Profile completion" value="81%" trend="3%" note="Average across pool" icon={CheckCircle2} /><Metric label="Open to work" value="18" note="Available now" icon={Clock3} /><Metric label="Collaboration" value="24" trend="8%" note="Ready to partner" icon={Users} /><Metric label="Active opportunities" value="15" note={`${pendingOpportunities.length} awaiting review`} icon={Briefcase} /><Metric label="Skills indexed" value={String(skills.length || 32)} note="Across 7 fields" icon={Layers} />
      </div>
    </section>

    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.75fr)]">
      <div className="space-y-5">
        <section className="rounded-2xl border border-stroke-soft-200 bg-bg-white-0 p-5 shadow-regular-xs sm:p-6"><div className="mb-5 flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-text-strong-950">Member growth</p><p className="mt-1 text-xs text-text-sub-600">Cohort expansion over the last seven months</p></div><span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-success-lighter px-2.5 py-1.5 text-[11px] font-semibold text-success-dark"><TrendingUp className="size-3" />304% total</span></div><div className="h-[240px] sm:h-[276px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={GROWTH_DATA} margin={{ top: 8, right: 4, left: -22, bottom: 0 }}><CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#eaecf0" /><XAxis dataKey="month" tick={{ fontSize: 11, fill: "#98a2b3" }} tickLine={false} axisLine={false} dy={10} /><YAxis tick={{ fontSize: 11, fill: "#98a2b3" }} tickLine={false} axisLine={false} /><Tooltip contentStyle={{ backgroundColor: "#20232d", border: "none", borderRadius: "10px", color: "#fff", fontSize: "12px" }} cursor={{ stroke: "#d0d5dd", strokeDasharray: "3 3" }} /><Line type="monotone" dataKey="members" stroke="#335cff" strokeWidth={2.5} dot={{ r: 3, fill: "#fff", strokeWidth: 2, stroke: "#335cff" }} activeDot={{ r: 5 }} /></LineChart></ResponsiveContainer></div></section>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border border-stroke-soft-200 bg-bg-white-0 p-5 shadow-regular-xs sm:p-6"><div className="mb-5 flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-text-strong-950">Top indexed skills</p><p className="mt-1 text-xs text-text-sub-600">Most common profile tags</p></div><Link href="/admin/skills" className="text-xs font-semibold text-primary-base hover:text-primary-darker">Manage</Link></div><div className="h-48"><ResponsiveContainer width="100%" height="100%"><BarChart data={TOP_SKILLS_DATA} margin={{ top: 2, right: 0, left: -24, bottom: 0 }}><CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#eaecf0" /><XAxis dataKey="name" tick={{ fontSize: 10, fill: "#98a2b3" }} tickLine={false} axisLine={false} /><YAxis tick={{ fontSize: 10, fill: "#98a2b3" }} tickLine={false} axisLine={false} /><Tooltip contentStyle={{ border: "1px solid #eaecf0", borderRadius: "10px", fontSize: "12px" }} cursor={{ fill: "#f8f9fb" }} /><Bar dataKey="count" radius={[5, 5, 0, 0]}>{TOP_SKILLS_DATA.map((skill) => <Cell key={skill.name} fill={skill.fill} />)}</Bar></BarChart></ResponsiveContainer></div></section>
          <section className="rounded-2xl border border-stroke-soft-200 bg-bg-white-0 p-5 shadow-regular-xs sm:p-6"><div className="mb-4"><p className="text-sm font-semibold text-text-strong-950">Availability mix</p><p className="mt-1 text-xs text-text-sub-600">How members are showing up</p></div><div className="space-y-3.5">{STATUS_DATA.map((status) => <div key={status.name}><div className="mb-1.5 flex items-center justify-between gap-3 text-xs"><span className="flex items-center gap-2 font-medium text-text-sub-600"><i className="size-2 rounded-full" style={{ backgroundColor: status.color }} />{status.name}</span><span className="font-semibold text-text-strong-950">{status.value}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-bg-weak-50"><div className="h-full rounded-full" style={{ width: `${Math.round(status.value / 182 * 100)}%`, backgroundColor: status.color }} /></div></div>)}</div></section>
        </div>
      </div>
      <aside className="rounded-2xl border border-stroke-soft-200 bg-bg-white-0 p-5 shadow-regular-xs sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-text-strong-950">Operations inbox</p><p className="mt-1 text-xs text-text-sub-600">Items that need a closer look</p></div><span className="flex size-8 items-center justify-center rounded-lg bg-primary-alpha-10 text-primary-base"><BarChart3 className="size-4" /></span></div><div className="my-5 rounded-xl border border-amber-200 bg-amber-50 p-4"><div className="flex items-start gap-3"><span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-white text-warning-base shadow-regular-xs"><Clock3 className="size-3.5" /></span><div><p className="text-xs font-semibold text-amber-900">{pendingOpportunities.length} pending opportunities</p><p className="mt-1 text-[11px] leading-4 text-amber-800">Review community posts before they are published.</p><Link href="/admin/opportunities" className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900 hover:underline">Review queue <ArrowRight className="size-3" /></Link></div></div></div><div className="divide-y divide-stroke-soft-200"><div className="flex items-center gap-3 py-4"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-success-lighter text-success-base"><CheckCircle2 className="size-4" /></span><div className="min-w-0 flex-1"><p className="text-xs font-semibold text-text-strong-950">{users.length || 182} members in the directory</p><p className="mt-1 text-[11px] text-text-sub-600">Cohort data is up to date</p></div><ChevronRight className="size-4 text-text-soft-400" /></div><div className="flex items-center gap-3 py-4"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-error-lighter text-error-base"><Users className="size-4" /></span><div className="min-w-0 flex-1"><p className="text-xs font-semibold text-text-strong-950">{unverifiedMembers.length} profiles need verification</p><p className="mt-1 text-[11px] text-text-sub-600">Invite members to complete their profile</p></div><ChevronRight className="size-4 text-text-soft-400" /></div><div className="flex items-center gap-3 py-4"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-information-lighter text-primary-base"><Layers className="size-4" /></span><div className="min-w-0 flex-1"><p className="text-xs font-semibold text-text-strong-950">Skills taxonomy is healthy</p><p className="mt-1 text-[11px] text-text-sub-600">32 tags across 7 specialist fields</p></div><ChevronRight className="size-4 text-text-soft-400" /></div></div><Link href="/admin/analytics" className="mt-4 flex h-10 items-center justify-center gap-2 rounded-lg border border-stroke-soft-200 text-xs font-semibold text-text-sub-600 transition-colors hover:border-stroke-sub-300 hover:bg-bg-weak-50 hover:text-text-strong-950">View full analytics <ArrowRight className="size-3.5" /></Link></aside>
    </div>
  </div>;
}
