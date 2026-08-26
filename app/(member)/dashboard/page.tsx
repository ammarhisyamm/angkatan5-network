"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/lib/store/AppContext";
import { ProfileCard } from "@/components/member/ProfileCard";
import { OpportunityCard } from "@/components/member/OpportunityCard";
import { Button } from "@/components/ui/Button";
import { LayerCard, Grid } from "@/components/ui/Surface";
import { Avatar } from "@/components/ui/Avatar";
import { BriefcaseIcon, PlusCircleIcon, ArrowRightIcon, UsersIcon, HandshakeIcon } from "@phosphor-icons/react";

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
    { href: "/discover", icon: UsersIcon, title: "Find Someone", desc: "Find people by skills, role, or experience." },
    { href: "/opportunities", icon: BriefcaseIcon, title: "Find Opportunities", desc: "Browse jobs, gigs, and collaborations." },
    { href: "/my-profile", icon: HandshakeIcon, title: "Offer Help", desc: "Share what you can help with." },
    { href: "/opportunities/create", icon: PlusCircleIcon, title: "Share Opportunity", desc: "Post an opening for the community." },
  ];

  return (
    <div className="space-y-8 lg:space-y-10">
      <section className="border-b border-stroke-soft-200 pb-6" aria-labelledby="welcome-heading">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar name={currentUser?.name || "Member"} className="size-10 text-sm" />
            <div className="min-w-0">
              <h1 id="welcome-heading" className="text-page-title text-text-strong-950">{getGreeting()}, {firstName}</h1>
              <p className="mt-0.5 text-body text-text-sub-600">Discover people and opportunities within your community.</p>
            </div>
          </div>
          <div className="w-full rounded-xl border border-stroke-soft-200 bg-bg-weak-50 p-4 sm:max-w-[300px]">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-meta text-text-sub-600">Profile completion</span>
              <span className="text-meta font-semibold text-primary-base" data-numeric>{completion}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-stroke-soft-200" role="progressbar" aria-valuenow={completion} aria-valuemin={0} aria-valuemax={100} aria-label="Profile completion">
              <div className="h-full rounded-full bg-primary-base transition-[width] duration-500" style={{ width: `${completion}%` }} />
            </div>
            <Link href="/my-profile" className="mt-3 block">
              <Button variant="secondary" size="sm" className="w-full justify-center">Complete Profile <ArrowRightIcon size={14} weight="regular" /></Button>
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="quick-actions-heading">
        <h2 id="quick-actions-heading" className="mb-3 text-section-title text-text-strong-950">Quick Actions</h2>
        <Grid variant="1-2-4up" gap="base">
          {quickActions.map((a) => {
            const Icon = a.icon;
            return (
              <Link key={a.href} href={a.href} className="group">
                <LayerCard className="h-full w-full rounded-xl border border-stroke-soft-200 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[border-color,transform,box-shadow] hover:-translate-y-px hover:border-primary-base/30 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] sm:p-5">
                  <span className="mb-4 flex size-9 items-center justify-center rounded-lg bg-white ring-1 ring-stroke-soft-200 shadow-sm text-text-strong-950">
                    <Icon className="size-5 sm:size-6" strokeWidth={1.5} />
                  </span>
                  <h3 className="text-card-title text-text-strong-950 group-hover:text-primary-base">{a.title}</h3>
                  <p className="mt-2 text-body text-text-sub-600 leading-relaxed">{a.desc}</p>
                </LayerCard>
              </Link>
            );
          })}
        </Grid>
      </section>

      <section aria-labelledby="featured-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 id="featured-heading" className="text-section-title text-text-strong-950">Featured Community Members</h2>
            <p className="mt-0.5 text-body text-text-sub-600">Connect with talented peers across design, engineering, and business.</p>
          </div>
          <Link href="/discover" className="shrink-0">
            <Button variant="secondary" size="sm">View All <ArrowRightIcon size={14} weight="regular" /></Button>
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
            <h2 id="latest-opps-heading" className="text-section-title text-text-strong-950">Latest Opportunities</h2>
            <p className="mt-0.5 text-body text-text-sub-600">Fresh collaborations, job openings, and project gigs.</p>
          </div>
          <Link href="/opportunities" className="shrink-0">
            <Button variant="secondary" size="sm">View All <ArrowRightIcon size={14} weight="regular" /></Button>
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
