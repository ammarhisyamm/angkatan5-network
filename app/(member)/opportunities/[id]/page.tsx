"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";
import { isAdminRole, OpportunityApplicationStatus } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { LayerCard } from "@/components/ui/Surface";
import {
  ArrowLeftIcon,
  BookmarkSimpleIcon,
  BriefcaseIcon,
  CalendarBlankIcon,
  CheckCircleIcon,
  CheckIcon,
  ClockIcon,
  XCircleIcon,
  EnvelopeSimpleIcon,
  MapPinIcon,
  PaperPlaneTiltIcon,
  ShareNetworkIcon,
} from "@phosphor-icons/react";

function formatDate(value?: string, fallback = "Open until filled") {
  if (!value) return fallback;
  const date = new Date(value.includes("T") ? value : `${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export default function OpportunityDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const {
    opportunities,
    opportunityApplications,
    currentUser,
    users,
    isBookmarked,
    toggleBookmark,
    submitOpportunityInterest,
    updateOpportunityApplicationStatus,
  } = useApp();
  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);
  const [interestNote, setInterestNote] = useState(
    "Hi, I saw your opportunity on A5 Network and would like to discuss how I can contribute.",
  );
  const [isSent, setIsSent] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);

  const opportunity = opportunities.find((item) => item.id === id);

  if (!opportunity) {
    return (
      <div className="mx-auto max-w-3xl py-10">
        <EmptyState
          icon={BriefcaseIcon}
          title="Opportunity not found"
          description="This opportunity may have been removed or archived."
          action={<Link href="/opportunities"><Button variant="secondary" size="sm">Back to Opportunities</Button></Link>}
        />
      </div>
    );
  }

  const bookmarked = isBookmarked(opportunity.id);
  const postedDate = formatDate(opportunity.createdAt, "Recently");
  const deadline = formatDate(opportunity.deadline);
  const myApplication = currentUser
    ? opportunityApplications.find(
        (application) =>
          application.opportunityId === opportunity.id &&
          application.applicantId === currentUser.id
      )
    : undefined;
  const opportunityApplicationsForReview = opportunityApplications.filter(
    (application) => application.opportunityId === opportunity.id
  );
  const canManageApplications =
    !!currentUser &&
    (currentUser.id === opportunity.authorId || isAdminRole(currentUser.roleType));

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setShowShareModal(false);
    }
  };

  const handleSendInterest = (event: React.FormEvent) => {
    event.preventDefault();
    if (submitOpportunityInterest(opportunity.id, interestNote)) {
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        setIsInterestModalOpen(false);
      }, 1500);
    }
  };

  const applicationStatus = (status: OpportunityApplicationStatus) => {
    const config = {
      Pending: { label: "Interest pending", icon: ClockIcon, variant: "secondary" as const },
      Accepted: { label: "Interest accepted", icon: CheckCircleIcon, variant: "success" as const },
      Declined: { label: "Interest declined", icon: XCircleIcon, variant: "danger" as const },
    }[status];
    const Icon = config.icon;
    return <Badge variant={config.variant} className="gap-1.5"><Icon size={14} />{config.label}</Badge>;
  };

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/opportunities" className="inline-flex items-center gap-1.5 rounded-md text-label-xs text-text-sub-600 transition-colors hover:text-text-strong-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base/40">
          <ArrowLeftIcon size={16} aria-hidden="true" />
          Back to Opportunities
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<ShareNetworkIcon size={15} />} onClick={() => setShowShareModal(true)}>Share</Button>
          <Button variant={bookmarked ? "subtle" : "outline"} size="sm" icon={<BookmarkSimpleIcon size={15} weight={bookmarked ? "fill" : "regular"} />} aria-pressed={bookmarked} onClick={() => toggleBookmark(opportunity.id)}>
            {bookmarked ? "Saved" : "Save"}
          </Button>
        </div>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <LayerCard className="overflow-hidden">
          <header className="px-5 py-5 sm:px-7 sm:py-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">{opportunity.category}</Badge>
              <Badge variant="outline">{opportunity.type}</Badge>
              <span className="ml-auto text-paragraph-xs text-text-soft-400">Posted {postedDate}</span>
            </div>
            <h1 className="mt-4 max-w-3xl text-title-h5 text-text-strong-950">{opportunity.title}</h1>
            <Link href={`/profile/${opportunity.authorId}`} className="group mt-5 inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base/40">
              <Avatar name={opportunity.authorName} className="size-10 text-label-xs" />
              <span>
                <span className="block text-label-sm text-text-strong-950 transition-colors group-hover:text-primary-base">{opportunity.authorName}</span>
                <span className="block text-paragraph-xs text-text-sub-600">{opportunity.authorRole} at {opportunity.authorCompany}</span>
              </span>
            </Link>
          </header>

          <section className="border-t border-stroke-soft-200 px-5 py-5 sm:px-7 sm:py-6">
            <h2 className="text-label-md text-text-strong-950">Description and scope</h2>
            {opportunity.description?.trim() ? (
              <p className="mt-3 max-w-[70ch] whitespace-pre-line text-paragraph-md leading-7 text-text-sub-600">{opportunity.description}</p>
            ) : (
              <p className="mt-3 rounded-10 bg-bg-weak-50 px-3 py-3 text-paragraph-sm text-text-soft-400 ring-1 ring-stroke-soft-200">No description has been added.</p>
            )}
          </section>

          <section className="border-t border-stroke-soft-200 px-5 py-5 sm:px-7 sm:py-6">
            <h2 className="text-label-md text-text-strong-950">Requirements</h2>
            {opportunity.requirements?.length ? (
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {opportunity.requirements.map((requirement) => (
                  <li key={requirement} className="flex items-start gap-2.5 text-paragraph-sm text-text-sub-600">
                    <CheckCircleIcon size={17} weight="fill" className="mt-0.5 shrink-0 text-success-base" aria-hidden="true" />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-paragraph-sm text-text-soft-400">No specific requirements were listed.</p>
            )}
          </section>
        </LayerCard>

        <aside className="space-y-4 lg:sticky lg:top-6">
          <LayerCard className="overflow-hidden">
            <div className="border-b border-stroke-soft-200 px-5 py-4">
              <h2 className="text-label-sm text-text-strong-950">Opportunity details</h2>
            </div>
            <dl className="divide-y divide-stroke-soft-200 px-5">
              <div className="flex gap-3 py-4">
                <CalendarBlankIcon size={18} className="mt-0.5 shrink-0 text-text-soft-400" aria-hidden="true" />
                <div><dt className="text-label-xs text-text-soft-400">Application deadline</dt><dd className="mt-0.5 text-paragraph-sm font-medium text-text-strong-950">{deadline}</dd></div>
              </div>
              <div className="flex gap-3 py-4">
                <MapPinIcon size={18} className="mt-0.5 shrink-0 text-text-soft-400" aria-hidden="true" />
                <div><dt className="text-label-xs text-text-soft-400">Location</dt><dd className="mt-0.5 text-paragraph-sm font-medium text-text-strong-950">{opportunity.location}</dd></div>
              </div>
              <div className="flex gap-3 py-4">
                <BriefcaseIcon size={18} className="mt-0.5 shrink-0 text-text-soft-400" aria-hidden="true" />
                <div><dt className="text-label-xs text-text-soft-400">Engagement</dt><dd className="mt-0.5 text-paragraph-sm font-medium text-text-strong-950">{opportunity.type}</dd></div>
              </div>
              <div className="flex gap-3 py-4">
                <EnvelopeSimpleIcon size={18} className="mt-0.5 shrink-0 text-text-soft-400" aria-hidden="true" />
                <div><dt className="text-label-xs text-text-soft-400">How to apply</dt><dd className="mt-0.5 break-words text-paragraph-sm font-medium text-text-strong-950">{opportunity.contactPreference || "Direct message via A5 Network"}</dd></div>
              </div>
            </dl>
          </LayerCard>

          <LayerCard className="p-5">
            <h2 className="text-label-sm text-text-strong-950">Required skills</h2>
            {opportunity.requiredSkills?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {opportunity.requiredSkills.map((skill) => <Badge key={skill} variant="neutral">{skill}</Badge>)}
              </div>
            ) : (
              <p className="mt-2 text-paragraph-xs text-text-soft-400">No skills specified.</p>
            )}
          </LayerCard>

          {canManageApplications ? (
            <LayerCard className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-label-sm text-text-strong-950">Interest requests</h2>
                  <p className="mt-1 text-paragraph-xs text-text-sub-600">{opportunityApplicationsForReview.length === 0 ? "No requests yet." : `${opportunityApplicationsForReview.length} request${opportunityApplicationsForReview.length === 1 ? "" : "s"} received.`}</p>
                </div>
                <Badge variant="neutral">{opportunityApplicationsForReview.length}</Badge>
              </div>
              <Button variant="secondary" size="sm" className="mt-4 w-full" onClick={() => setShowRequestsModal(true)}>Review requests</Button>
            </LayerCard>
          ) : myApplication ? (
            <div className="flex min-h-10 items-center justify-center rounded-10 border border-stroke-soft-200 bg-bg-weak-50 px-3">
              {applicationStatus(myApplication.status)}
            </div>
          ) : (
            <Button variant="primary" size="md" onClick={() => setIsInterestModalOpen(true)} className="w-full">Express Interest</Button>
          )}
        </aside>
      </div>

      <Modal isOpen={isInterestModalOpen} onClose={() => setIsInterestModalOpen(false)} title="Express your interest" description={`Send a note to ${opportunity.authorName} about this opportunity.`}>
        {isSent ? (
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-success-lighter text-success-base"><CheckCircleIcon size={24} weight="fill" /></div>
            <div><h3 className="text-label-md text-text-strong-950">Interest sent</h3><p className="mt-1 text-paragraph-xs text-text-sub-600">Your message was sent to {opportunity.authorName}.</p></div>
          </div>
        ) : (
          <form onSubmit={handleSendInterest} className="space-y-4">
            <div className="rounded-10 bg-bg-weak-50 p-3 text-paragraph-xs text-text-sub-600 ring-1 ring-stroke-soft-200">Regarding <strong className="font-medium text-text-strong-950">{opportunity.title}</strong></div>
            <Textarea label="Message" rows={4} value={interestNote} onChange={(event) => setInterestNote(event.target.value)} placeholder="Introduce your relevant experience or share a portfolio link." required />
            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsInterestModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm" icon={<PaperPlaneTiltIcon size={15} />}>Send Interest</Button>
            </div>
          </form>
        )}
      </Modal>

      <Modal isOpen={showRequestsModal} onClose={() => setShowRequestsModal(false)} title="Interest requests" description="Review people who want to discuss this opportunity." maxWidth="lg">
        {opportunityApplicationsForReview.length === 0 ? (
          <div className="rounded-10 bg-bg-weak-50 p-4 text-center text-paragraph-sm text-text-sub-600">Requests will appear here when members express interest.</div>
        ) : (
          <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
            {opportunityApplicationsForReview.map((application) => {
              const applicant = users.find((user) => user.id === application.applicantId);
              return (
                <article key={application.id} className="rounded-10 border border-stroke-soft-200 p-4">
                  <div className="flex items-start gap-3">
                    <Avatar name={applicant?.name || "Member"} className="size-9 text-label-xs" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-label-sm text-text-strong-950">{applicant?.name || "Former member"}</p>
                          {applicant && <p className="text-paragraph-xs text-text-sub-600">{applicant.role} at {applicant.company}</p>}
                        </div>
                        {applicationStatus(application.status)}
                      </div>
                      <p className="mt-3 whitespace-pre-line text-paragraph-sm leading-6 text-text-sub-600">{application.note}</p>
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-stroke-soft-200 pt-3">
                        <span className="text-paragraph-xs text-text-soft-400">Sent {formatDate(application.createdAt)}</span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => updateOpportunityApplicationStatus(application.id, "Declined")} disabled={application.status === "Declined"}>Decline</Button>
                          <Button variant="primary" size="sm" icon={<CheckIcon size={14} />} onClick={() => updateOpportunityApplicationStatus(application.id, "Accepted")} disabled={application.status === "Accepted"}>Accept</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Modal>

      <Modal isOpen={showShareModal} onClose={() => setShowShareModal(false)} title="Share opportunity" description="Copy the link to share this opportunity." centered maxWidth="sm">
        <div className="space-y-4">
          <div className="min-w-0 overflow-hidden rounded-10 bg-bg-weak-50 p-3 ring-1 ring-stroke-soft-200"><span className="block break-all text-paragraph-sm text-text-strong-950">{typeof window !== "undefined" ? window.location.href : ""}</span></div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowShareModal(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleCopyLink}>Copy Link</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
