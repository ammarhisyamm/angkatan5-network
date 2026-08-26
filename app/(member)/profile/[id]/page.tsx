"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";
import { MapPinIcon, SealCheckIcon, BriefcaseIcon, CalendarIcon, ShareNetworkIcon, UserPlusIcon, GlobeIcon, ArrowSquareOutIcon, CheckCircleIcon, ArrowLeftIcon, SparkleIcon, QuestionIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";

export default function MemberProfilePage() {
  const params = useParams();
  const profileId = params.id as string;
  const { users, currentUser, addToast } = useApp();
  const [showShareModal, setShowShareModal] = useState(false);

  const member = users.find((u) => u.id === profileId);

  if (!member) {
    return (
      <div className="py-20 text-center flex flex-col items-center">
        <h2 className="text-section-title text-text-strong-950">
          Member Not Found
        </h2>
        <p className="mt-1 mb-4 text-sm leading-5 text-text-sub-600">
          The requested member profile could not be located.
        </p>
        <Link href="/discover">
          <Button variant="secondary" size="md">
            Back to Directory
          </Button>
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setShowShareModal(false);
    }
  };

  const isSelf = currentUser?.id === member.id;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/discover"
          className="inline-flex items-center gap-1 text-xs font-semibold text-text-sub-600 hover:text-text-strong-950 transition-colors"
        >
          <ArrowLeftIcon size={16} weight="regular" />
          Back to Discover
        </Link>

        {isSelf && (
          <Link href="/my-profile">
            <Button variant="outline" size="sm">
              Edit My Profile
            </Button>
          </Link>
        )}
      </div>

      {/* Header Profile Card */}
      <div className="bg-bg-white-0 border border-stroke-soft-200 rounded-xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative">
              <Avatar name={member.name} src={member.avatar} className="size-20 text-xl sm:size-24" />
              {member.verified && (
                <div
                  className="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-primary-base text-static-white ring-2 ring-bg-white-0"
                  title="Verified member"
                >
                  <SealCheckIcon size={14} weight="bold" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-page-title text-text-strong-950">
                  {member.name}
                </h1>
                <StatusBadge status={member.status} />
              </div>

              <p className="text-sm font-semibold text-text-sub-600 mt-1">
                {member.role}{" "}
                <span className="text-text-soft-400 font-normal">at</span>{" "}
                <span className="text-primary-base font-semibold">
                  {member.company}
                </span>
              </p>

              <div className="flex items-center gap-3 text-xs text-text-sub-600 mt-2 flex-wrap">
                <span className="flex items-center gap-2">
                  <MapPinIcon size={12} weight="regular" className="text-text-soft-400" />
                  {member.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-2">
                  <BriefcaseIcon size={12} weight="regular" className="text-text-soft-400" />
                  {member.experience}
                </span>
                <span>•</span>
                <span className="px-2 rounded-md bg-bg-weak-50 text-xs leading-4 font-semibold text-text-sub-600">
                  {member.batch}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="md" onClick={handleShare} className="w-full justify-center sm:w-auto" >
              <ShareNetworkIcon size={16} weight="regular" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Columns: Main Details */}
        <div className="md:col-span-2 space-y-8">
          {/* About Section */}
          <div className="bg-bg-white-0 border border-stroke-soft-200 rounded-xl p-6">
            <h2 className="text-section-title text-text-strong-950 mb-3">
              About
            </h2>
            <p className="text-sm text-text-sub-600 leading-relaxed whitespace-pre-line">
              {member.bio || "No bio added yet."}
            </p>
          </div>

          {/* Experience Timeline */}
          <div className="bg-bg-white-0 border border-stroke-soft-200 rounded-xl p-6">
            <h2 className="text-section-title text-text-strong-950 mb-4">
              Professional Experience
            </h2>

            {member.experiences && member.experiences.length > 0 ? (
              <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0 before:bg-bg-weak-50">
                {member.experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-8">
                    <div className="absolute left-1 top-1 size-3 rounded-full bg-primary-base ring-4 ring-white" />
                    <h3 className="text-sm font-semibold text-text-strong-950">
                      {exp.title}
                    </h3>
                    <p className="text-xs font-semibold text-primary-base">
                      {exp.company}
                    </p>
                    <span className="text-xs leading-4 text-text-soft-400 font-medium block mt-0">
                      {exp.period}
                    </span>
                    <p className="mt-2 leading-relaxed text-sm leading-5 text-text-sub-600">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-bg-weak-50 border border-stroke-soft-200 flex items-start gap-3">
                <BriefcaseIcon size={20} weight="regular" className="text-text-soft-400 shrink-0 mt-0" />
                <div>
                  <h4 className="text-sm font-semibold text-text-strong-950">
                    {member.role} at {member.company}
                  </h4>
                  <p className="mt-0 text-sm leading-5 text-text-sub-600">
                    {member.experience} of dedicated industry experience.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Capabilities & What I Can Offer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-bg-white-0 border border-stroke-soft-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <SparkleIcon size={16} weight="regular" className="text-success-base" />
                <h3 className="text-sm font-semibold text-text-strong-950">
                  What I Can Help With
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {member.canOffer && member.canOffer.length > 0 ? (
                  member.canOffer.map((offer) => (
                    <Badge key={offer} variant="success">
                      {offer}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-text-soft-400">
                    Open to consultation and general support.
                  </span>
                )}
              </div>
            </div>

            <div className="bg-bg-white-0 border border-stroke-soft-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <MagnifyingGlassIcon size={16} weight="regular" className="text-primary-base" />
                <h3 className="text-sm font-semibold text-text-strong-950">
                  What I&apos;m Looking For
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {member.lookingFor && member.lookingFor.length > 0 ? (
                  member.lookingFor.map((item) => (
                    <Badge key={item} variant="primary">
                      {item}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-text-soft-400">
                    Open to connecting and networking.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Skills, Links & Privacy */}
        <div className="space-y-8">
          {/* Skills Tag Cloud */}
          <div className="bg-bg-white-0 border border-stroke-soft-200 rounded-xl p-6">
            <h2 className="mb-3 text-sm font-medium leading-5 text-text-sub-600">
              Skills & Expertise
            </h2>
            <div className="flex flex-wrap gap-2">
              {member.skills?.map((sk) => (
                <span
                  key={sk}
                  className="px-3 py-1 rounded-xl text-xs font-medium bg-bg-weak-50 text-text-strong-950 border border-stroke-soft-200"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Social / Portfolio Links */}
          <div className="bg-bg-white-0 border border-stroke-soft-200 rounded-xl p-6">
            <h2 className="mb-3 text-sm font-medium leading-5 text-text-sub-600">
              Links & Portfolio
            </h2>
            <div className="space-y-2">
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-xl bg-bg-weak-50 hover:bg-primary-alpha-10 text-xs font-medium text-text-sub-600 hover:text-primary-base transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <svg className="size-4 text-primary-base fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m- 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 0 0-1.6 1.6 1.6 1.6 0 0 0 1.6 1.6 1.6 1.6 0 0 0 1.6-1.6 1.6 1.6 0 0 0-1.6-1.6Z"/>
                    </svg>
                    LinkedIn Profile
                  </span>
                  <ArrowSquareOutIcon size={12} weight="regular" className="text-text-soft-400" />
                </a>
              )}

              {member.portfolio && (
                <a
                  href={member.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-xl bg-bg-weak-50 hover:bg-primary-alpha-10 text-xs font-medium text-text-sub-600 hover:text-primary-base transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <GlobeIcon size={16} weight="regular" className="text-success-base" />
                    Design Portfolio
                  </span>
                  <ArrowSquareOutIcon size={12} weight="regular" className="text-text-soft-400" />
                </a>
              )}

              {member.website && (
                <a
                  href={member.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-xl bg-bg-weak-50 hover:bg-primary-alpha-10 text-xs font-medium text-text-sub-600 hover:text-primary-base transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <GlobeIcon size={16} weight="regular" className="text-feature-base" />
                    Personal Website
                  </span>
                  <ArrowSquareOutIcon size={12} weight="regular" className="text-text-soft-400" />
                </a>
              )}

              {!member.linkedin && !member.portfolio && !member.website && (
                <p className="text-xs text-text-soft-400 italic">No external links attached.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Profile"
        description="Copy link to share this profile"
        centered
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center py-2">
            <div className="size-12 rounded-full bg-bg-weak-50 flex items-center justify-center">
              <ShareNetworkIcon size={24} weight="regular" className="text-primary-base" />
            </div>
          </div>
          <div className="bg-bg-weak-50 rounded-xl p-3 flex items-center gap-2">
            <span className="flex-1 truncate text-sm text-text-strong-950">
              {typeof window !== "undefined" ? window.location.href : ""}
            </span>
          </div>
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setShowShareModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCopyLink}>
              Copy Link
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
