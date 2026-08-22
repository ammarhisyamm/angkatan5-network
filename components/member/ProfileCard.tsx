"use client";

import React from "react";
import Link from "next/link";
import { User } from "@/lib/types";
import { StatusBadge } from "@/components/ui/Badge";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { BadgeCheck, ArrowRight } from "lucide-react";

export function ProfileCard({ member }: { member: User }) {
  return (
    <>
      <LayerCard className="group flex h-full w-full flex-col p-0 overflow-hidden transition-colors duration-200 hover:shadow-sm">
        {/* Content */}
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <Link href={`/profile/${member.id}`} className="relative shrink-0" aria-label={`View ${member.name}`}>
              <img
                src={member.avatar}
                alt={`${member.name} avatar`}
                width={48}
                height={48}
                loading="lazy"
                className="size-12 rounded-full object-cover bg-kumo-tint ring-1 ring-kumo-line"
              />
              {member.verified && (
                <span className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-kumo-brand text-static-white" title="Verified member" aria-hidden="true">
                  <BadgeCheck className="size-3" strokeWidth={2} aria-hidden="true" />
                </span>
              )}
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/profile/${member.id}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand focus-visible:ring-offset-2 rounded-sm">
                <h3 className="truncate text-card-title text-kumo-strong group-hover:text-kumo-brand">{member.name}</h3>
              </Link>
              <p className="truncate text-sm leading-5 text-kumo-subtle">{member.role}</p>
              <p className="mt-0.5 truncate text-xs leading-[18px] text-kumo-inactive">
                {member.company} &middot; {member.experience}
              </p>
            </div>
          </div>

          {member.bio && (
            <p className="mt-3 line-clamp-2 text-sm leading-5 text-kumo-subtle">{member.bio}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-2.5">
            {member.skills?.slice(0, 3).map((sk) => (
              <Tag key={sk}>{sk}</Tag>
            ))}
            {member.skills?.length > 3 && (
              <Tag>+{member.skills.length - 3}</Tag>
            )}
          </div>
        </div>

        {/* Footer anchored to bottom */}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-kumo-line px-5 py-4 sm:px-6 sm:px-6">
          <StatusBadge status={member.status} />
          <Link href={`/profile/${member.id}`}>
            <Button variant="secondary" size="sm">
              View Profile <ArrowRight className="size-3.5" strokeWidth={1.5} />
            </Button>
          </Link>
        </div>
      </LayerCard>
    </>
  );
}
