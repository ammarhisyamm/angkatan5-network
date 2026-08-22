"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store/AppContext";
import { Opportunity, OpportunityStatus } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Table } from "@cloudflare/kumo/components/table";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { Input } from "@cloudflare/kumo/components/input";
import { BriefcaseIcon, MagnifyingGlassIcon, CheckCircleIcon, XCircleIcon, ArchiveIcon, TrashIcon, EyeIcon, XIcon, WarningCircleIcon, MapPinIcon, ClockIcon } from "@phosphor-icons/react";

export default function AdminOpportunitiesPage() {
  const { opportunities, updateOpportunityStatus, deleteOpportunity } = useApp();

  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [targetOpp, setTargetOpp] = useState<Opportunity | null>(null);
  const [actionType, setActionType] = useState<"delete" | "archive" | null>(null);

  const statuses: ("All" | OpportunityStatus)[] = ["All", "Pending", "Published", "Approved", "Archived"];

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      if (selectedStatus !== "All" && opp.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!opp.title.toLowerCase().includes(q) && !opp.authorName.toLowerCase().includes(q) && !opp.category.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [opportunities, selectedStatus, searchQuery]);

  const handleConfirmAction = () => {
    if (!targetOpp) return;
    if (actionType === "delete") deleteOpportunity(targetOpp.id);
    else if (actionType === "archive") updateOpportunityStatus(targetOpp.id, "Archived");
    setTargetOpp(null);
    setActionType(null);
  };

  const getStatusBadge = (status: OpportunityStatus) => {
    switch (status) {
      case "Published": return <Badge variant="success">Published</Badge>;
      case "Pending": return <Badge variant="warning">Pending Review</Badge>;
      case "Approved": return <Badge variant="info">Approved</Badge>;
      case "Archived": return <Badge variant="neutral">Archived</Badge>;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase leading-4 tracking-widest text-kumo-inactive">
            <BriefcaseIcon size={16} />
            <span>Opportunity Moderation Workflow</span>
          </div>
          <h1 className="text-page-title text-kumo-strong">Moderate Opportunities</h1>
          <p className="mt-1 text-sm leading-5 text-kumo-subtle">Review community submissions, publish approved listings, and archive old roles.</p>
        </div>
        <Link href="/opportunities/create">
          <Button variant="primary" size="md">+ Post Official Opportunity</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1">
          {statuses.map((st) => (
            <Button key={st} variant={selectedStatus === st ? "primary" : "outline"} size="sm" onClick={() => setSelectedStatus(st)}>{st}</Button>
          ))}
        </div>
        <div className="w-full sm:w-72">
          <Input aria-label="Search opportunities" placeholder="Search opportunities..." value={searchQuery} onChange={(e: any) => setSearchQuery(e.target.value)} />
        </div>
      </div>

      <LayerCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Opportunity</Table.Head>
                <Table.Head>Author</Table.Head>
                <Table.Head>Category</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head>Posted Date</Table.Head>
                <Table.Head className="text-right">Moderation Actions</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredOpportunities.map((opp) => (
                <Table.Row key={opp.id}>
                  <Table.Cell className="max-w-sm">
                    <Link href={`/opportunities/${opp.id}`} className="font-semibold text-kumo-strong hover:text-kumo-brand transition-colors line-clamp-1 text-sm block">{opp.title}</Link>
                    <div className="flex items-center gap-2 text-xs leading-4 text-kumo-inactive mt-1"><span>{opp.type}</span><span>•</span><span>{opp.location}</span></div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <img src={opp.authorAvatar} alt={opp.authorName} className="w-7 h-7 rounded-full object-cover bg-kumo-tint ring-1 ring-kumo-line shrink-0" />
                      <div><span className="font-semibold text-kumo-strong block">{opp.authorName}</span><span className="text-xs leading-4 text-kumo-inactive block">{opp.authorCompany}</span></div>
                    </div>
                  </Table.Cell>
                  <Table.Cell><Badge variant="outline">{opp.category}</Badge></Table.Cell>
                  <Table.Cell>{getStatusBadge(opp.status)}</Table.Cell>
                  <Table.Cell className="text-kumo-inactive text-xs leading-4">{new Date(opp.createdAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/opportunities/${opp.id}`}><Button variant="ghost" size="sm" shape="square" icon={<EyeIcon />} aria-label="View" /></Link>
                      {opp.status === "Pending" ? (
                        <>
                          <Button variant="primary" size="sm" icon={<CheckCircleIcon />} onClick={() => updateOpportunityStatus(opp.id, "Published")}>Approve</Button>
                          <Button variant="outline" size="sm" icon={<XCircleIcon />} onClick={() => updateOpportunityStatus(opp.id, "Archived")}>Reject</Button>
                        </>
                      ) : opp.status === "Published" ? (
                        <Button variant="outline" size="sm" icon={<ArchiveIcon />} onClick={() => { setTargetOpp(opp); setActionType("archive"); }}>Archive</Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => updateOpportunityStatus(opp.id, "Published")}>Republish</Button>
                      )}
                      <Button variant="ghost" size="sm" shape="square" icon={<TrashIcon />} onClick={() => { setTargetOpp(opp); setActionType("delete"); }} aria-label="Delete" className="text-kumo-danger hover:bg-kumo-danger-tint" />
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </LayerCard>

      <Modal
        isOpen={!!targetOpp && !!actionType}
        onClose={() => { setTargetOpp(null); setActionType(null); }}
        title={actionType === "delete" ? "Delete Opportunity?" : "Archive Opportunity?"}
        description={actionType === "delete" ? `Permanently delete "${targetOpp?.title}"? This cannot be undone.` : `Archive "${targetOpp?.title}"? Archived opportunities are no longer visible on the member board.`}
      >
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-kumo-line">
          <Button variant="outline" size="md" onClick={() => { setTargetOpp(null); setActionType(null); }}>Cancel</Button>
          <Button variant={actionType === "delete" ? "danger" : "primary"} size="md" onClick={handleConfirmAction}>Confirm</Button>
        </div>
      </Modal>
    </div>
  );
}
