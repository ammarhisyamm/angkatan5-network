"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/lib/store/AppContext";
import { ProfileCard } from "@/components/member/ProfileCard";
import { OpportunityCard } from "@/components/member/OpportunityCard";
import { Button } from "@/components/ui/Button";
import { Search, Briefcase, HelpCircle, PlusCircle, ArrowRight, Users, TrendingUp, Target, Handshake } from "lucide-react";

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
    { href: "/discover", icon: Users, title: "Find Someone", desc: "Search by skills, role, or experience." },
    { href: "/opportunities", icon: Briefcase, title: "Find Opportunities", desc: "Browse jobs, gigs, and collaborations." },
    { href: "/my-profile", icon: Handshake, title: "Offer Help", desc: "Share what you can help with." },
    { href: "/opportunities/create", icon: PlusCircle, title: "Share Opportunity", desc: "Post an opening for the community." },
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
      <section className="rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-[28px] font-semibold leading-9 tracking-tight text-text-strong-950">
              {getGreeting()}, {firstName}
            </h1>
            <p className="mt-1 text-sm leading-5 text-text-sub-600">Discover people and opportunities within your community.</p>
          </div>

          <div className="w-full shrink-0 rounded-lg border border-stroke-soft-200 bg-bg-weak-25 p-4 md:w-[320px]">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium leading-[18px] text-text-sub-600">Profile completion</span>
              <span className="text-xs font-semibold leading-[18px] text-primary-base">{completion}%</span>
            </div>
            <div
              className="h-1.5 w-full overflow-hidden rounded-full bg-stroke-soft-200"
              role="progressbar"
              aria-valuenow={completion}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Profile completion"
            >
              <div className="h-full rounded-full bg-primary-base transition-all duration-500" style={{ width: `${completion}%` }} />
            </div>
            <Link href="/my-profile" className="mt-3 block">
              <Button variant="subtle" size="sm" className="w-full">
                Complete Profile <ArrowRight className="size-3.5" strokeWidth={1.5} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section aria-labelledby="quick-actions-heading">
        <h2 id="quick-actions-heading" className="mb-4 text-xl font-semibold leading-6 text-text-strong-950">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.href}
                href={a.href}
                className="group rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6 transition-colors hover:border-primary-alpha-24 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base"
              >
                <span className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary-alpha-10 text-primary-base">
                  <Icon className="size-5" strokeWidth={1.5} />
                </span>
                <h3 className="text-base font-semibold leading-5 text-text-strong-950 group-hover:text-primary-base">{a.title}</h3>
                <p className="mt-1 text-sm leading-5 text-text-sub-600">{a.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Community Snapshot — unified panel with vertical dividers */}
      <section aria-labelledby="snapshot-heading" className="rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="snapshot-heading" className="text-xl font-semibold leading-6 text-text-strong-950">Community Snapshot</h2>
          <span className="text-xs leading-[18px] text-text-soft-400">Updated live</span>
        </div>
        <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-3 lg:grid-cols-5 lg:gap-y-0 lg:divide-x lg:divide-stroke-soft-200">
          {metrics.map((m) => (
            <div key={m.label} className="flex flex-col px-5 py-1 first:pl-0">
              <dt className="text-[13px] font-medium leading-[18px] text-text-sub-600">{m.label}</dt>
              <dd className="mt-1 text-[28px] font-semibold leading-8 tracking-tight text-text-strong-950">{m.value}</dd>
              <span className={`mt-0.5 text-xs leading-[18px] ${m.metaTone}`}>{m.meta}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Community Members */}
      <section aria-labelledby="featured-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 id="featured-heading" className="text-xl font-semibold leading-6 text-text-strong-950">Featured Community Members</h2>
            <p className="mt-0.5 text-sm leading-5 text-text-sub-600">Connect with talented peers across design, engineering, and business.</p>
          </div>
          <Link href="/discover" className="shrink-0">
            <Button variant="secondary" size="sm">
              View All <ArrowRight className="size-3.5" strokeWidth={1.5} />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {featuredPeople.map((person) => (
            <ProfileCard key={person.id} member={person} />
          ))}
        </div>
      </section>

      {/* Latest Opportunities */}
      <section aria-labelledby="latest-opps-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 id="latest-opps-heading" className="text-xl font-semibold leading-6 text-text-strong-950">Latest Opportunities</h2>
            <p className="mt-0.5 text-sm leading-5 text-text-sub-600">Fresh collaborations, job openings, and project gigs.</p>
          </div>
          <Link href="/opportunities" className="shrink-0">
            <Button variant="secondary" size="sm">
              View All <ArrowRight className="size-3.5" strokeWidth={1.5} />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {latestOpportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      </section>
    </div>
  );
}