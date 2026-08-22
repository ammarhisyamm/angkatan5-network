"use client";

import React, { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Input";
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

  const opportunity = opportunities.find((o) => o.id === id);

  if (!opportunity) {
    return (
      <div className="py-20 text-center flex flex-col items-center">
        <h2 className="text-section-title text-kumo-strong">
          Opportunity Not Found
        </h2>
        <p className="text-xs text-kumo-subtle mt-1 mb-4">
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
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      addToast(
        "Link copied to clipboard!",
        "Share this opportunity with your friends or classmates.",
        "success"
      );
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Link
          href="/opportunities"
          className="inline-flex items-center gap-1 text-xs font-semibold text-kumo-subtle hover:text-kumo-strong transition-colors"
        >
          <ArrowLeftIcon size={16} weight="regular" />
          Back to Opportunities
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleShare} className="" >
            <ShareNetworkIcon size={12} weight="regular" className="mr-1" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={() => toggleBookmark(opportunity.id)}
            className={`text-xs ${bookmarked ? "text-kumo-brand bg-primary-alpha-10" : ""}`}
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
      <div className="bg-kumo-base border border-kumo-line rounded-lg p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="primary">
            {opportunity.category}
          </Badge>
          <Badge variant="neutral">
            <MapPinIcon size={12} weight="regular" className="text-kumo-inactive" />
            {opportunity.location}
          </Badge>
          <Badge variant="outline">
            {opportunity.type}
          </Badge>
          <span className="text-xs text-kumo-inactive font-medium ml-auto">
            Posted {formattedDate}
          </span>
        </div>

        <h1 className="text-page-title text-kumo-strong">
          {opportunity.title}
        </h1>

        {/* Author Ribbon */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-kumo-line flex-wrap gap-4">
          <Link
            href={`/profile/${opportunity.authorId}`}
            className="flex items-center gap-3 group"
          >
            <img
              src={opportunity.authorAvatar}
              alt={opportunity.authorName}
              width={48}
              height={48}
              loading="lazy"
              className="w-12 h-12 rounded-full object-cover border border-kumo-line group-hover:ring-2 group-hover:ring-kumo-brand/20 transition-colors bg-kumo-tint"
            />
            <div>
              <p className="text-sm font-semibold text-kumo-strong group-hover:text-kumo-brand transition-colors">
                {opportunity.authorName}
              </p>
              <p className="text-xs text-kumo-subtle">
                {opportunity.authorRole} at {opportunity.authorCompany}
              </p>
            </div>
          </Link>

          <Button variant="primary" size="lg" onClick={() => setIsInterestModalOpen(true)}
            className="w-full sm:w-auto shadow-xs"
          >
            I&apos;m Interested
            <ArrowRightIcon size={16} weight="regular" className="ml-1" />
          </Button>
        </div>
      </div>

      {/* Detail Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Description & Requirements */}
        <div className="md:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-kumo-base border border-kumo-line rounded-lg p-6 sm:p-8 shadow-xs">
            <h2 className="text-section-title text-kumo-strong mb-3">
              Description & Scope
            </h2>
            <p className="text-sm text-kumo-subtle leading-relaxed whitespace-pre-line">
              {opportunity.description}
            </p>
          </div>

          {/* Requirements */}
          {opportunity.requirements && opportunity.requirements.length > 0 && (
            <div className="bg-kumo-base border border-kumo-line rounded-lg p-6 sm:p-8 shadow-xs">
              <h2 className="text-section-title text-kumo-strong mb-4">
                Key Requirements & Expectations
              </h2>
              <ul className="space-y-2">
                {opportunity.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-kumo-subtle">
                    <span className="w-1 h-1 rounded-full bg-kumo-brand shrink-0 mt-2" />
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
          <div className="bg-kumo-base border border-kumo-line rounded-lg p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-semibold uppercase leading-4 tracking-widest text-kumo-inactive">
              Details
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-kumo-inactive block font-medium">Application Deadline</span>
                <span className="text-kumo-strong font-semibold text-sm">
                  {opportunity.deadline || "Open until filled"}
                </span>
              </div>

              <div>
                <span className="text-kumo-inactive block font-medium">Contact Preference</span>
                <span className="text-kumo-strong font-semibold">
                  {opportunity.contactPreference || "Direct Message on A5 Network"}
                </span>
              </div>

              <div>
                <span className="text-kumo-inactive block font-medium">Location Type</span>
                <span className="text-kumo-strong font-semibold">
                  {opportunity.location} ({opportunity.type})
                </span>
              </div>
            </div>
          </div>

          {/* Required Skills */}
          {opportunity.requiredSkills && opportunity.requiredSkills.length > 0 && (
            <div className="bg-kumo-base border border-kumo-line rounded-lg p-6 shadow-xs">
              <h3 className="text-xs font-semibold uppercase leading-4 tracking-widest text-kumo-inactive mb-3">
                Skills Required
              </h3>
              <div className="flex flex-wrap gap-2">
                {opportunity.requiredSkills.map((sk) => (
                  <span
                    key={sk}
                    className="px-3 py-1 rounded-xl text-xs font-medium bg-primary-alpha-10 text-kumo-brand border border-kumo-brand/20"
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
              <h4 className="font-bold text-kumo-strong text-base">
                Interest Registered!
              </h4>
              <p className="text-xs text-kumo-subtle mt-1">
                Your message was sent to {opportunity.authorName}.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendInterest} className="space-y-4">
            <div className="p-3 bg-kumo-tint rounded-xl text-xs text-kumo-subtle font-medium">
              Opportunity: <strong className="text-kumo-strong">{opportunity.title}</strong>
            </div>

            <Textarea
              label="Introduction Note"
              rows={4}
              value={interestNote}
              onChange={(e) => setInterestNote(e.target.value)}
              placeholder="Introduce your relevant experience or attach a portfolio link..."
              required
            />

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-kumo-line">
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
    </div>
  );
}
