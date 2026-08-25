"use client";

import React from "react";
import Link from "next/link";
import { User } from "@/lib/types";
import { StatusBadge } from "@/components/ui/Badge";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { LayerCard } from "@/components/ui/Surface";
import { Avatar } from "@/components/ui/Avatar";
import { SealCheckIcon, ArrowRightIcon } from "@phosphor-icons/react";

function HighlightText({ text, query }: { text: string; query?: string }) {
  if (!query?.trim()) return <>{text}</>;
  const q = query.toLowerCase();
  const idx = text.toLowerCase().indexOf(q);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded-sm bg-primary-alpha-10 px-0.5 font-semibold text-primary-base">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

export function ProfileCard({ member, highlight }: { member: User; highlight?: string }) {
  return (
    <>
      <LayerCard className="group flex h-full w-full flex-col overflow-hidden rounded-lg border border-stroke-soft-200 p-0 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[background-color,border-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:border-primary-base/30 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
        {/* Content */}
        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-start gap-3">
            <Link href={`/profile/${member.id}`} className="relative shrink-0" aria-label={`View ${member.name}`}>
              <Avatar name={member.name} className="size-12 text-sm" />
              {member.verified && (
                <span className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary-base text-static-white" title="Verified member" aria-hidden="true">
                  <SealCheckIcon size={12} weight="bold" />
                </span>
              )}
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/profile/${member.id}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-2 rounded-sm">
                <h3 className="truncate text-card-title text-text-strong-950 group-hover:text-primary-base"><HighlightText text={member.name} query={highlight} /></h3>
              </Link>
              <p className="truncate text-sm font-medium leading-5 text-text-strong-950"><HighlightText text={member.role} query={highlight} /></p>
              <p className="mt-0.5 truncate text-meta font-medium text-text-sub-600">
                <HighlightText text={member.company} query={highlight} /> &middot; {member.experience}
              </p>
            </div>
          </div>

          {member.bio && (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-text-sub-600"><HighlightText text={member.bio} query={highlight} /></p>
          )}

          <div className="mt-4 flex flex-wrap gap-2.5">
            {member.skills?.slice(0, 3).map((sk) => (
              <Tag key={sk}><HighlightText text={sk} query={highlight} /></Tag>
            ))}
            {member.skills?.length > 3 && (
              <Tag>+{member.skills.length - 3}</Tag>
            )}
          </div>
        </div>

        {/* Footer anchored to bottom */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-stroke-soft-200 px-6 py-4">
          <StatusBadge status={member.status} />
          <Link href={`/profile/${member.id}`}>
            <Button variant="secondary" size="sm">
              View Profile <ArrowRightIcon size={14} weight="regular" />
            </Button>
          </Link>
        </div>
      </LayerCard>
    </>
  );
}
