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

export function ProfileCard({ member }: { member: User }) {
  return (
    <>
      <LayerCard className="group flex h-full w-full flex-col overflow-hidden rounded-lg border border-kumo-line p-0 shadow-none transition-[background-color,border-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:border-kumo-brand/30 hover:bg-primary-alpha-10 hover:shadow-sm">
        {/* Content */}
        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-start gap-3">
            <Link href={`/profile/${member.id}`} className="relative shrink-0" aria-label={`View ${member.name}`}>
              <Avatar name={member.name} className="size-12 text-sm" />
              {member.verified && (
                <span className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-kumo-brand text-static-white" title="Verified member" aria-hidden="true">
                  <SealCheckIcon size={12} weight="bold" />
                </span>
              )}
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/profile/${member.id}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand focus-visible:ring-offset-2 rounded-sm">
                <h3 className="truncate text-card-title text-kumo-strong group-hover:text-kumo-brand">{member.name}</h3>
              </Link>
              <p className="truncate text-sm font-medium leading-5 text-kumo-strong">{member.role}</p>
              <p className="mt-0.5 truncate text-meta font-medium text-kumo-subtle">
                {member.company} &middot; {member.experience}
              </p>
            </div>
          </div>

          {member.bio && (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-kumo-subtle">{member.bio}</p>
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
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-kumo-line px-6 py-4">
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
