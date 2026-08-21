"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/lib/store/AppContext";
import { ProfileCard } from "@/components/member/ProfileCard";
import { OpportunityCard } from "@/components/member/OpportunityCard";
import { Button } from "@/components/ui/Button";
import { Search, Briefcase, HelpCircle, PlusCircle, ArrowRight } from "lucide-react";

export default function MemberDashboardPage() {
  const { currentUser, users, opportunities } = useApp();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const firstName = currentUser?.name?.split(" ")[0] || "Member";
  const completion = currentUser?.profileCompletion || 82;
  const featuredPeople = users.filter((u) => u.id !== currentUser?.id && u.roleType === "member").slice(0, 4);
  const latestOpportunities = opportunities.filter((o) => o.status === "Published").slice(0, 3);

  const quickActions = [
    { href: "/discover", icon: Search, tone: "bg-primary-alpha-10 text-primary-base", title: "Find Someone", desc: "Search by skills, role, or experience." },
    { href: "/opportunities", icon: Briefcase, tone: "bg-success-lighter text-success-base", title: "Find Opportunities", desc: "Browse jobs, gigs, and collaborations." },
    { href: "/my-profile", icon: HelpCircle, tone: "bg-warning-lighter text-warning-base", title: "Offer Help", desc: "Share what you can help with." },
    { href: "/opportunities/create", icon: PlusCircle, tone: "bg-information-lighter text-information-base", title: "Share Opportunity", desc: "Post an opening for the community." },
  ];

  const metrics = [
    { label: "Total members", value: "182", meta: "+12 this month", metaTone: "text-success-base" },
    { label: "Skills listed", value: "32", meta: "across 7 industries", metaTone: "text-text-soft-400" },
    { label: "Open to work", value: "18", meta: "available now", metaTone: "text-text-soft-400" },
    { label: "Open to collab", value: "24", meta: "seeking partners", metaTone: "text-text-soft-400" },
    { label: "Active opportunities", value: "15", meta: "4 posted this week", metaTone: "text-success-base" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome header + profile completion */}
      <section className="rounded-2xl border border-stroke-soft-200 bg-bg-white-0 p-6 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold leading-8 tracking-tight text-text-strong-950">
              {getGreeting()}, {firstName}
            </h1>
            <p className="mt-1 text-[13px] leading-5 text-text-sub-600">Discover people and opportunities within your community.</p>
          </div>

          <div className="w-full shrink-0 rounded-xl border border-stroke-soft-200 bg-bg-weak-50 p-4 md:w-80">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium leading-[18px] text-text-sub-600">Profile completion</span>
              <span className="text-xs font-semibold leading-[18px] text-primary-base">{completion}%</span>
            </div>
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-stroke-soft-200"
              role="progressbar"
              aria-valuenow={completion}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Profile completion"
            >
              <div className="h-full rounded-full bg-primary-base transition-all duration-500" style={{ width: `${completion}%` }} />
            </div>
            <Link href="/my-profile" className="mt-3 block">
              <Button variant="outline" size="sm" className="w-full">
                Complete Profile <ArrowRight className="size-3.5" strokeWidth={1.5} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Actions — compact action cards */}
      <section aria-labelledby="quick-actions-heading">
        <h2 id="quick-actions-heading" className="mb-4 text-base font-semibold leading-6 text-text-strong-950">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.href}
                href={a.href}
                className="group rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-5 transition-colors hover:border-stroke-sub-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base"
              >
                <span className={`mb-3 flex size-10 items-center justify-center rounded-lg ${a.tone}`}>
                  <Icon className="size-5" strokeWidth={1.5} />
                </span>
                <h3 className="text-sm font-semibold leading-5 text-text-strong-950 group-hover:text-primary-base">{a.title}</h3>
                <p className="mt-1 text-[13px] leading-5 text-text-sub-600">{a.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Community Snapshot — compact metrics panel with dividers */}
      <section aria-labelledby="snapshot-heading" className="rounded-2xl border border-stroke-soft-200 bg-bg-white-0 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="snapshot-heading" className="text-base font-semibold leading-6 text-text-strong-950">Community Snapshot</h2>
          <span className="text-xs leading-[18px] text-text-soft-400">Updated live</span>
        </div>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-stroke-soft-200 bg-stroke-soft-200 sm:grid-cols-3 lg:grid-cols-5">
          {metrics.map((m) => (
            <div key={m.label} className="flex flex-col bg-bg-white-0 p-4">
              <dt className="text-xs font-medium leading-[18px] text-text-sub-600">{m.label}</dt>
              <dd className="mt-1 text-2xl font-semibold leading-8 tracking-tight text-text-strong-950">{m.value}</dd>
              <span className={`mt-0.5 text-xs leading-[18px] ${m.metaTone}`}>{m.meta}</span>
            </div>
          ))}
        </dl>
      </section>

      {/* Featured Community Members */}
      <section aria-labelledby="featured-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 id="featured-heading" className="text-base font-semibold leading-6 text-text-strong-950">Featured Community Members</h2>
            <p className="mt-0.5 text-[13px] leading-5 text-text-sub-600">Connect with talented peers across design, engineering, and business.</p>
          </div>
          <Link href="/discover" className="shrink-0">
            <Button variant="secondary" size="sm">
              View All <ArrowRight className="size-3.5" strokeWidth={1.5} />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {featuredPeople.map((person) => (
            <ProfileCard key={person.id} member={person} />
          ))}
        </div>
      </section>

      {/* Latest Opportunities */}
      <section aria-labelledby="latest-opps-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 id="latest-opps-heading" className="text-base font-semibold leading-6 text-text-strong-950">Latest Opportunities</h2>
            <p className="mt-0.5 text-[13px] leading-5 text-text-sub-600">Fresh collaborations, job openings, and project gigs.</p>
          </div>
          <Link href="/opportunities" className="shrink-0">
            <Button variant="secondary" size="sm">
              View All <ArrowRight className="size-3.5" strokeWidth={1.5} />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {latestOpportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      </section>
    </div>
  );
}
