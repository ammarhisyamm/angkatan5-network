"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store/AppContext";
import { Opportunity, OpportunityStatus } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  Briefcase,
  Search,
  CheckCircle2,
  XCircle,
  Archive,
  Trash2,
  Eye,
  X,
  AlertCircle,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function AdminOpportunitiesPage() {
  const { opportunities, updateOpportunityStatus, deleteOpportunity } = useApp();

  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [targetOpp, setTargetOpp] = useState<Opportunity | null>(null);
  const [actionType, setActionType] = useState<"delete" | "archive" | null>(null);

  const statuses: ("All" | OpportunityStatus)[] = [
    "All",
    "Pending",
    "Published",
    "Approved",
    "Archived",
  ];

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      if (selectedStatus !== "All" && opp.status !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = opp.title.toLowerCase().includes(q);
        const matchesAuthor = opp.authorName.toLowerCase().includes(q);
        const matchesCat = opp.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesAuthor && !matchesCat) return false;
      }
      return true;
    });
  }, [opportunities, selectedStatus, searchQuery]);

  const handleConfirmAction = () => {
    if (!targetOpp) return;
    if (actionType === "delete") {
      deleteOpportunity(targetOpp.id);
    } else if (actionType === "archive") {
      updateOpportunityStatus(targetOpp.id, "Archived");
    }
    setTargetOpp(null);
    setActionType(null);
  };

  const getStatusBadge = (status: OpportunityStatus) => {
    switch (status) {
      case "Published":
        return <Badge variant="success">Published</Badge>;
      case "Pending":
        return <Badge variant="warning">Pending Review</Badge>;
      case "Approved":
        return <Badge variant="info">Approved</Badge>;
      case "Archived":
        return <Badge variant="neutral">Archived</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1 mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase leading-4 tracking-widest text-text-soft-400">
            <Briefcase className="size-4" />
            <span>Opportunity Moderation Workflow</span>
          </div>
          <h1 className="text-2xl font-semibold leading-8 tracking-tight text-text-strong-950">
            Moderate Opportunities
          </h1>
          <p className="mt-1 text-sm leading-5 text-text-sub-600">
            Review community submissions, publish approved listings, and archive old roles.
          </p>
        </div>

        <Link href="/opportunities/create">
          <Button variant="primary" size="md">
            + Post Official Opportunity
          </Button>
        </Link>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
            className={`h-9 px-4 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedStatus === st
                  ? "bg-primary-alpha-10 text-primary-base"
                  : "text-text-sub-600 hover:bg-bg-weak-50"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft-400 size-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search opportunities..."
            className="w-full h-10 pl-9 pr-8 bg-bg-white-0 border border-stroke-soft-200 rounded-lg text-xs text-text-strong-950 placeholder:text-text-soft-400 shadow-regular-xs focus:outline-none focus:ring-2 focus:ring-primary-alpha-16"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-soft-400"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
      </div>

      {/* Moderation Items Table */}
      <div className="overflow-hidden rounded-2xl border border-stroke-soft-200 bg-bg-white-0 shadow-regular-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-bg-weak-50 border-b border-stroke-soft-200 text-[11px] font-semibold uppercase leading-4 tracking-wide text-text-sub-600">
              <tr>
                <th className="py-3 px-5">Opportunity</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Posted Date</th>
                <th className="py-3 px-5 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke-soft-200">
              {filteredOpportunities.map((opp) => (
                <tr
                  key={opp.id}
                  className="hover:bg-bg-weak-50/70 transition-colors"
                >
                  {/* Opportunity */}
                  <td className="py-4 px-5 max-w-sm">
                    <Link
                      href={`/opportunities/${opp.id}`}
                      className="font-semibold text-text-strong-950 hover:text-primary-base transition-colors line-clamp-1 text-sm block"
                    >
                      {opp.title}
                    </Link>
                    <div className="flex items-center gap-2 text-[11px] leading-4 text-text-soft-400 mt-1">
                      <span>{opp.type}</span>
                      <span>•</span>
                      <span>{opp.location}</span>
                    </div>
                  </td>

                  {/* Author */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={opp.authorAvatar}
                        alt={opp.authorName}
                        className="w-7 h-7 rounded-full object-cover bg-bg-weak-50 ring-1 ring-stroke-soft-200 shrink-0"
                      />
                      <div>
                        <span className="font-semibold text-text-strong-950 block">
                          {opp.authorName}
                        </span>
                        <span className="text-[11px] leading-4 text-text-soft-400 block">
                          {opp.authorCompany}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4">
                    <Badge variant="outline">
                      {opp.category}
                    </Badge>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">{getStatusBadge(opp.status)}</td>

                  {/* Date */}
                  <td className="py-4 px-4 text-text-soft-400 text-[11px] leading-4">
                    {new Date(opp.createdAt).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/opportunities/${opp.id}`}>
                        <Button variant="ghost" size="sm" title="View" className="w-7 p-0" >
                          <Eye className="size-3" />
                        </Button>
                      </Link>

                      {opp.status === "Pending" ? (
                        <>
                          <Button variant="primary" size="sm" onClick={() =>
                              updateOpportunityStatus(opp.id, "Published")
                            }
                            className="h-8 bg-emerald-600 hover:bg-emerald-700"
                          >
                            <CheckCircle2 className="size-3 mr-1" />
                            Approve
                          </Button>
                          <Button variant="outline" size="sm" onClick={() =>
                              updateOpportunityStatus(opp.id, "Archived")
                            }
                            className="h-8 text-rose-600 hover:bg-error-lighter"
                          >
                            <XCircle className="size-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      ) : opp.status === "Published" ? (
                        <Button variant="outline" size="sm" onClick={() => {
                            setTargetOpp(opp);
                            setActionType("archive");
                          }}
                          className="h-8"
                          title="Archive Opportunity"
                        >
                          <Archive className="size-3 mr-1 text-text-soft-400" />
                          Archive
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() =>
                            updateOpportunityStatus(opp.id, "Published")
                          }
                          className="h-8 text-primary-base"
                        >
                          Republish
                        </Button>
                      )}

                      <Button variant="ghost" size="sm" onClick={() => {
                          setTargetOpp(opp);
                          setActionType("delete");
                        }}
                        className="h-7 w-7 p-0 text-text-soft-400 hover:text-error-base"
                        title="Delete"
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Modal
        isOpen={!!targetOpp && !!actionType}
        onClose={() => {
          setTargetOpp(null);
          setActionType(null);
        }}
        title={actionType === "delete" ? "Delete Opportunity?" : "Archive Opportunity?"}
        description={
          actionType === "delete"
            ? `Permanently delete "${targetOpp?.title}"? This cannot be undone.`
            : `Archive "${targetOpp?.title}"? Archived opportunities are no longer visible on the member board.`
        }
      >
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-stroke-soft-200">
          <Button variant="outline" size="md" onClick={() => {
              setTargetOpp(null);
              setActionType(null);
            }}
          >
            Cancel
          </Button>
          <Button variant={actionType === "delete" ? "danger" : "primary"} size="md" onClick={handleConfirmAction} >
            Confirm
          </Button>
        </div>
      </Modal>
    </div>
  );
}
