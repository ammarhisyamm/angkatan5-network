"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store/AppContext";
import { Opportunity, OpportunityStatus } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Table } from "@cloudflare/kumo/components/table";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { CheckCircleIcon, ClockCounterClockwiseIcon, UsersIcon, XCircleIcon, ArrowRightIcon, ArchiveIcon, PlusIcon } from "@phosphor-icons/react";

const TABS = [
  { id: "Pending" as const, label: "Pending Review", icon: ClockCounterClockwiseIcon, count: (o: Opportunity[]) => o.filter(i => i.status === "Pending").length },
  { id: "Approved" as const, label: "Published", icon: CheckCircleIcon, count: (o: Opportunity[]) => o.filter(i => i.status === "Approved").length },
  { id: "Archived" as const, label: "Archived", icon: ArchiveIcon, count: (o: Opportunity[]) => o.filter(i => i.status === "Archived").length },
];

const BADGE_MAP: Record<string, { variant: "warning" | "secondary" | "primary" }> = {
  Pending: { variant: "warning" },
  Approved: { variant: "secondary" },
  Archived: { variant: "primary" },
};

const CATEGORY_MAP: Record<string, string> = { Hiring: "Hired", Mentorship: "Mentorship", Business: "Business", Jobs: "Jobs", Freelance: "Freelance", Collaboration: "Collaboration", Internship: "Internship" };

export default function AdminOpportunitiesPage() {
  const { opportunities, updateOpportunityStatus } = useApp();
  const [activeTab, setActiveTab] = useState<OpportunityStatus>("Pending");
  const [targetOpp, setTargetOpp] = useState<Opportunity | null>(null);
  const [actionType, setActionType] = useState<"approve" | "archive" | null>(null);

  const counts = useMemo(() => ({
    Pending: opportunities.filter(o => o.status === "Pending").length,
    Approved: opportunities.filter(o => o.status === "Approved").length,
    Archived: opportunities.filter(o => o.status === "Archived").length,
  }), [opportunities]);

  const filtered = useMemo(() => opportunities.filter(o => o.status === activeTab).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [opportunities, activeTab]);

  const handleConfirmAction = () => {
    if (!targetOpp || !actionType) return;
    const nextStatus: OpportunityStatus = actionType === "approve" ? "Approved" : "Archived";
    updateOpportunityStatus(targetOpp.id, nextStatus);
    setTargetOpp(null);
    setActionType(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="mb-1.5 flex items-center gap-1.5 text-label text-kumo-inactive">
            <UsersIcon size={14} />
            <span>Moderation Console</span>
          </div>
          <h1 className="text-page-title text-kumo-strong">Opportunities</h1>
          <p className="mt-1 text-body text-kumo-subtle">Review, approve, and manage community opportunity posts.</p>
        </div>
        <Link href="/opportunities/new">
          <Button variant="primary" size="md" icon={<PlusIcon size={16} weight="bold" />} className="w-full sm:w-auto justify-center">New Opportunity</Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="border-b border-kumo-line flex items-center gap-1 px-1 pb-0 -mb-px overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`group relative flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-t-lg transition-colors
                ${isActive ? "text-kumo-brand bg-primary-alpha-10 border border-kumo-line border-b-transparent" : "text-kumo-subtle hover:text-kumo-strong hover:bg-kumo-tint border border-transparent"}`}>
              <Icon size={16} weight={isActive ? "fill" : "regular"} className={isActive ? "text-kumo-brand" : "text-kumo-inactive group-hover:text-kumo-subtle"} />
              <span>{tab.label}</span>
              <Badge variant={tab.id === "Pending" ? "warning" : "neutral"}>{counts[tab.id]}</Badge>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <LayerCard className="p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-sm text-kumo-subtle">No opportunities in this category.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Opportunity</Table.Head>
                  <Table.Head className="hidden md:table-cell">Author</Table.Head>
                  <Table.Head>Category</Table.Head>
                  <Table.Head>Status</Table.Head>
                  <Table.Head className="hidden sm:table-cell">Created</Table.Head>
                  <Table.Head className="text-right">Actions</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filtered.map((opp) => (
                  <Table.Row key={opp.id}>
                    <Table.Cell>
                      <div className="max-w-[300px]">
                        <span className="text-sm font-semibold text-kumo-strong block truncate">{opp.title}</span>
                        <span className="text-xs text-kumo-inactive line-clamp-1 block">{opp.description}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="hidden md:table-cell text-sm text-kumo-strong">{opp.authorName}</Table.Cell>
                    <Table.Cell>
                      <Badge variant="secondary">{CATEGORY_MAP[opp.category] || opp.category}</Badge>
                    </Table.Cell>
                    <Table.Cell><Badge variant={BADGE_MAP[opp.status]?.variant || "secondary"}>{opp.status}</Badge></Table.Cell>
                    <Table.Cell className="hidden sm:table-cell text-xs text-kumo-inactive whitespace-nowrap">{new Date(opp.createdAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {activeTab === "Pending" && (
                          <>
                            <Button variant="primary" size="sm" icon={<CheckCircleIcon size={14} weight="fill" />} onClick={() => { setTargetOpp(opp); setActionType("approve"); }}>Approve</Button>
                            <Button variant="danger" size="sm" icon={<ArchiveIcon size={14} />} onClick={() => { setTargetOpp(opp); setActionType("archive"); }}>Reject</Button>
                          </>
                        )}
                        {activeTab === "Approved" && (
                          <Button variant="secondary" size="sm" icon={<ArchiveIcon size={14} />} onClick={() => { setTargetOpp(opp); setActionType("archive"); }}>Archive</Button>
                        )}
                        <Link href={`/opportunities/${opp.id}`} className="hidden sm:inline-flex">
                          <Button variant="ghost" size="sm" icon={<ArrowRightIcon size={14} />}>View</Button>
                        </Link>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        )}
      </LayerCard>

      {/* Confirmation Modal */}
      <Modal isOpen={!!targetOpp && !!actionType} onClose={() => { setTargetOpp(null); setActionType(null); }} title={`${actionType === "approve" ? "Approve" : "Archive"} Opportunity?`}
        description={`Are you sure you want to ${actionType} "${targetOpp?.title}"? ${actionType === "approve" ? "It will become visible on the public board." : "This can be reversed from the moderation tabs."}`}>
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" size="md" onClick={() => { setTargetOpp(null); setActionType(null); }}>Cancel</Button>
          <Button variant={actionType === "archive" ? "danger" : "primary"} size="md" onClick={handleConfirmAction}>
            {actionType === "approve" ? "Approve" : "Archive"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
