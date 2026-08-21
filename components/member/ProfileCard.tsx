"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User } from "@/lib/types";
import { StatusBadge } from "@/components/ui/Badge";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { BadgeCheck, ArrowRight } from "lucide-react";

export function ProfileCard({ member }: { member: User }) {
  return (
    <>
      <article className="group flex h-full flex-col rounded-xl border border-stroke-soft-200 bg-bg-white-0 transition-colors duration-200 hover:border-stroke-sub-300">
        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start gap-3">
            <Link href={`/profile/${member.id}`} className="relative shrink-0" aria-label={`View ${member.name}`}>
              <img
                src={member.avatar}
                alt=""
                className="size-12 rounded-full object-cover bg-bg-weak-50 ring-1 ring-stroke-soft-200"
              />
              {member.verified && (
                <span className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary-base text-static-white" title="Verified member">
                  <BadgeCheck className="size-3" strokeWidth={2} />
                </span>
              )}
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/profile/${member.id}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-2 rounded-sm">
                <h3 className="truncate text-sm font-semibold leading-5 text-text-strong-950 group-hover:text-primary-base">{member.name}</h3>
              </Link>
              <p className="truncate text-[13px] leading-5 text-text-sub-600">{member.role}</p>
              <p className="mt-0.5 truncate text-xs leading-[18px] text-text-soft-400">
                {member.company} · {member.experience}
              </p>
            </div>
          </div>

          {member.bio && (
            <p className="mt-3 line-clamp-2 text-[13px] leading-5 text-text-sub-600">{member.bio}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {member.skills?.slice(0, 3).map((sk) => (
              <Tag key={sk}>{sk}</Tag>
            ))}
            {member.skills?.length > 3 && (
              <Tag>+{member.skills.length - 3}</Tag>
            )}
          </div>
        </div>

        {/* Footer anchored to bottom */}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-stroke-soft-200 px-5 py-3">
          <StatusBadge status={member.status} />
          <Link href={`/profile/${member.id}`}>
            <Button variant="secondary" size="sm">
              View Profile <ArrowRight className="size-3.5" strokeWidth={1.5} />
            </Button>
          </Link>
        </div>
      </article>
    </>
  );
}
