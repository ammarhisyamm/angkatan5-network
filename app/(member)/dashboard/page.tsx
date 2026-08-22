"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/lib/store/AppContext";
import { ProfileCard } from "@/components/member/ProfileCard";
import { OpportunityCard } from "@/components/member/OpportunityCard";
import { Button } from "@/components/ui/Button";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { Grid } from "@cloudflare/kumo/components/grid";
import { Search, Briefcase, PlusCircle, ArrowRight, Users, Handshake } from "lucide-react";

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
    { label: "Total members", value: "182", meta: "+12 this month", metaTone: "text-kumo-success" },
    { label: "Skills listed", value: "32", meta: "across 7 industries", metaTone: "text-kumo-inactive" },
    { label: "Open to work", value: "18", meta: "available now", metaTone: "text-kumo-inactive" },
    { label: "Open to collab", value: "24", meta: "seeking partners", metaTone: "text-kumo-inactive" },
    { label: "Active opportunities", value: "15", meta: "4 posted this week", metaTone: "text-kumo-success" },
  ];

  return (
    <div className="space-y-8">
      <LayerCard className="p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-page-title text-kumo-strong">
              {getGreeting()}, {firstName}
            </h1>
            <p className="mt-1 text-body text-kumo-subtle">Discover people and opportunities within your community.</p>
          </div>
          <div className="w-full shrink-0 rounded-lg border border-kumo-line bg-kumo-tint p-4 md:w-[320px]">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-meta text-kumo-subtle">Profile completion</span>
              <span className="text-meta font-semibold text-kumo-brand" data-numeric>{completion}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-kumo-line" role="progressbar" aria-valuenow={completion} aria-valuemin={0} aria-valuemax={100} aria-label="Profile completion">
              <div className="h-full rounded-full bg-kumo-brand transition-all duration-500" style={{ width: `${completion}%` }} />
            </div>
            <Link href="/my-profile" className="mt-3 block">
              <Button variant="secondary" size="sm" className="w-full">
                Complete Profile <ArrowRight className="size-3.5" strokeWidth={1.5} />
              </Button>
            </Link>
          </div>
        </div>
      </LayerCard>

      <section aria-labelledby="quick-actions-heading">
        <h2 id="quick-actions-heading" className="mb-4 text-section-title text-kumo-strong">Quick Actions</h2>
        <Grid variant="1-2-4up" gap="base">
          {quickActions.map((a) => {
            const Icon = a.icon;
            return (
              <Link key={a.href} href={a.href} className="group">
                <LayerCard className="p-6 h-full hover:border-kumo-brand/30 transition-colors">
                  <span className="mb-3 flex size-10 items-center justify-center rounded-lg bg-kumo-brand/10 text-kumo-brand">
                    <Icon className="size-5" strokeWidth={1.5} />
                  </span>
                  <h3 className="text-card-title text-kumo-strong group-hover:text-kumo-brand">{a.title}</h3>
                  <p className="mt-1 text-body text-kumo-subtle">{a.desc}</p>
                </LayerCard>
              </Link>
            );
          })}
        </Grid>
      </section>

      <LayerCard className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="snapshot-heading" className="text-section-title text-kumo-strong">Community Snapshot</h2>
          <span className="text-meta text-kumo-inactive">Updated live</span>
        </div>
        <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-3 lg:grid-cols-5 lg:gap-y-0 lg:divide-x lg:divide-kumo-line">
          {metrics.map((m) => (
            <div key={m.label} className="flex flex-col px-5 py-1 first:pl-0">
              <dt className="text-meta text-kumo-subtle">{m.label}</dt>
              <dd className="mt-1 text-[28px] font-semibold leading-8 tracking-tight text-kumo-strong" data-numeric style={{ fontVariantNumeric: 'tabular-nums' }}>{m.value}</dd>
              <span className={`mt-0.5 text-meta ${m.metaTone}`}>{m.meta}</span>
            </div>
          ))}
        </div>
      </LayerCard>

      <section aria-labelledby="featured-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 id="featured-heading" className="text-section-title text-kumo-strong">Featured Community Members</h2>
            <p className="mt-0.5 text-body text-kumo-subtle">Connect with talented peers across design, engineering, and business.</p>
          </div>
          <Link href="/discover" className="shrink-0">
            <Button variant="secondary" size="sm">View All <ArrowRight className="size-3.5" strokeWidth={1.5} /></Button>
          </Link>
        </div>
        <Grid variant="2up" gap="base">
          {featuredPeople.map((person) => (
            <ProfileCard key={person.id} member={person} />
          ))}
        </Grid>
      </section>

      <section aria-labelledby="latest-opps-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 id="latest-opps-heading" className="text-section-title text-kumo-strong">Latest Opportunities</h2>
            <p className="mt-0.5 text-body text-kumo-subtle">Fresh collaborations, job openings, and project gigs.</p>
          </div>
          <Link href="/opportunities" className="shrink-0">
            <Button variant="secondary" size="sm">View All <ArrowRight className="size-3.5" strokeWidth={1.5} /></Button>
          </Link>
        </div>
        <Grid variant="3up" gap="base">
          {latestOpportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </Grid>
      </section>
    </div>
  );
}
