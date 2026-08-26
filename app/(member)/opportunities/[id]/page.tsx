"use client";

import React, { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { ArrowLeftIcon, CalendarIcon, MapPinIcon, ClockIcon, ShareNetworkIcon, BookmarkSimpleIcon, EnvelopeSimpleIcon, PaperPlaneTiltIcon, CheckCircleIcon, BriefcaseIcon, UserIcon, ArrowRightIcon } from "@phosphor-icons/react";

export default function OpportunityDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { opportunities, isBookmarked, toggleBookmark, addToast, sendConnection, currentUser } =
    useApp();

  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);
  const [interestNote, setInterestNote] = useState(
    "Hi, I saw your opportunity posted on the A5 Talent Network and would love to connect and discuss how I can contribute."
  );
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const opportunity = opportunities.find((o) => o.id === id);

  if (!opportunity) {
    return (
      <div className="py-20 text-center flex flex-col items-center">
        <h2 className="text-section-title text-text-strong-950">
          Opportunity Not Found
        </h2>
        <p className="text-xs text-text-sub-600 mt-1 mb-4">
          The requested opportunity could not be located or has been archived.
        </p>
        <Link href="/opportunities">
          <Button variant="secondary" size="md">
            Back to Opportunities
          </Button>
        </Link>
      </div>
    );
  }

  const bookmarked = isBookmarked(opportunity.id);

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setShowShareModal(false);
    }
  };

  const handleSendInterest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    setTimeout(() => {
      sendConnection(opportunity.authorId, interestNote);
      setIsSending(false);
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        setIsInterestModalOpen(false);
      }, 1500);
    }, 400);
  };

  const formattedDate = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(opportunity.createdAt));

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/opportunities"
          className="inline-flex items-center gap-1 text-xs font-semibold text-text-sub-600 hover:text-text-strong-950 transition-colors"
        >
          <ArrowLeftIcon size={16} weight="regular" />
          Back to Opportunities
        </Link>

        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleShare} className="" >
            <ShareNetworkIcon size={12} weight="regular" className="mr-1" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={() => toggleBookmark(opportunity.id)}
            className={`text-xs ${bookmarked ? "text-primary-base bg-primary-alpha-10" : ""}`}
          >
            {bookmarked ? (
              <BookmarkSimpleIcon size={12} weight="regular" className="mr-1 fill-current" />
            ) : (
              <BookmarkSimpleIcon size={16} weight="regular" className="mr-1" />
            )}
            {bookmarked ? "Saved" : "Save"}
          </Button>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="bg-bg-white-0 border border-stroke-soft-200 rounded-xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="primary">
            {opportunity.category}
          </Badge>
          <Badge variant="neutral">
            <MapPinIcon size={12} weight="regular" className="text-text-soft-400" />
            {opportunity.location}
          </Badge>
          <Badge variant="outline">
            {opportunity.type}
          </Badge>
          <span className="text-xs text-text-soft-400 font-medium ml-auto">
            Posted {formattedDate}
          </span>
        </div>

        <h1 className="text-page-title text-text-strong-950">
          {opportunity.title}
        </h1>

        {/* Author Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-stroke-soft-200 pt-6 mt-6">
          <Link
            href={`/profile/${opportunity.authorId}`}
            className="flex items-center gap-3 group"
          >
            <Avatar name={opportunity.authorName} className="size-12 text-sm" />
            <div>
              <p className="text-sm font-semibold text-text-strong-950 group-hover:text-primary-base transition-colors">
                {opportunity.authorName}
              </p>
              <p className="text-xs text-text-sub-600">
                {opportunity.authorRole} at {opportunity.authorCompany}
              </p>
            </div>
          </Link>

          <Button variant="primary" size="lg" onClick={() => setIsInterestModalOpen(true)} className="w-full justify-center sm:w-auto">
            I&apos;m Interested
            <ArrowRightIcon size={16} weight="regular" className="ml-1" />
          </Button>
        </div>
      </div>

      {/* Detail Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left 2 Cols: Description & Requirements */}
        <div className="md:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-bg-white-0 border border-stroke-soft-200 rounded-xl p-6 sm:p-8">
            <h2 className="text-section-title text-text-strong-950 mb-3">
              Description & Scope
            </h2>
            <p className="text-sm text-text-sub-600 leading-relaxed whitespace-pre-line">
              {opportunity.description}
            </p>
          </div>

          {/* Requirements */}
          {opportunity.requirements && opportunity.requirements.length > 0 && (
            <div className="bg-bg-white-0 border border-stroke-soft-200 rounded-xl p-6 sm:p-8">
              <h2 className="text-section-title text-text-strong-950 mb-4">
                Key Requirements & Expectations
              </h2>
              <ul className="space-y-2">
                {opportunity.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-text-sub-600">
                    <span className="w-1 h-1 rounded-full bg-primary-base shrink-0 mt-2" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Col: Metadata, Skills & Contact */}
        <div className="space-y-8">
          {/* Metadata Card */}
          <div className="bg-bg-white-0 border border-stroke-soft-200 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-medium leading-5 text-text-sub-600">
              Details
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-text-soft-400 block font-medium">Application Deadline</span>
                <span className="text-text-strong-950 font-semibold text-sm">
                  {opportunity.deadline || "Open until filled"}
                </span>
              </div>

              <div>
                <span className="text-text-soft-400 block font-medium">Contact Preference</span>
                <span className="text-text-strong-950 font-semibold">
                  {opportunity.contactPreference || "Direct Message on A5 Network"}
                </span>
              </div>

              <div>
                <span className="text-text-soft-400 block font-medium">Location Type</span>
                <span className="text-text-strong-950 font-semibold">
                  {opportunity.location} ({opportunity.type})
                </span>
              </div>
            </div>
          </div>

          {/* Required Skills */}
          {opportunity.requiredSkills && opportunity.requiredSkills.length > 0 && (
            <div className="bg-bg-white-0 border border-stroke-soft-200 rounded-xl p-6">
              <h3 className="mb-3 text-sm font-medium leading-5 text-text-sub-600">
                Skills Required
              </h3>
              <div className="flex flex-wrap gap-2">
                {opportunity.requiredSkills.map((sk) => (
                  <span
                    key={sk}
                    className="px-3 py-1 rounded-xl text-xs font-medium bg-primary-alpha-10 text-primary-base border border-primary-base/20"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interest Submission Modal */}
      <Modal
        isOpen={isInterestModalOpen}
        onClose={() => setIsInterestModalOpen(false)}
        title="Express Your Interest"
        description={`PaperPlaneTiltIcon a direct note to ${opportunity.authorName} regarding this opportunity.`}
      >
        {isSent ? (
          <div className="py-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-success-lighter text-success-base flex items-center justify-center">
              <CheckCircleIcon size={24} weight="regular" />
            </div>
            <div>
              <h4 className="font-bold text-text-strong-950 text-base">
                Interest Registered!
              </h4>
              <p className="text-xs text-text-sub-600 mt-1">
                Your message was sent to {opportunity.authorName}.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendInterest} className="space-y-4">
            <div className="p-3 bg-bg-weak-50 rounded-xl text-xs text-text-sub-600 font-medium">
              Opportunity: <strong className="text-text-strong-950">{opportunity.title}</strong>
            </div>

            <Textarea
              label="Introduction Note"
              rows={4}
              value={interestNote}
              onChange={(e) => setInterestNote(e.target.value)}
              placeholder="Introduce your relevant experience or attach a portfolio link..."
              required
            />

            <div className="flex items-center justify-end gap-3">
              <Button type="button" variant="outline" size="md" onClick={() => setIsInterestModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" isLoading={isSending}>
                <PaperPlaneTiltIcon size={12} weight="regular" className="mr-1" />
                Submit Interest
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Opportunity"
        description="Copy link to share this opportunity"
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
