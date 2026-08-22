"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store/AppContext";
import { User, UserStatus } from "@/lib/types";
import { StatusBadge } from "@/components/ui/Badge";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  Users,
  Search,
  CheckCircle2,
  ShieldAlert,
  Trash2,
  Eye,
  MoreVertical,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export default function AdminMembersPage() {
  const { users, verifyMember, suspendMember, deleteMember } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Selected member for delete/suspend confirmation modal
  const [targetMember, setTargetMember] = useState<User | null>(null);
  const [actionType, setActionType] = useState<"delete" | "suspend" | null>(
    null
  );

  const filteredMembers = useMemo(() => {
    return users.filter((u) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = u.name.toLowerCase().includes(q);
        const matchesEmail = u.email.toLowerCase().includes(q);
        const matchesRole = u.role?.toLowerCase().includes(q);
        const matchesCompany = u.company?.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesRole && !matchesCompany) {
          return false;
        }
      }

      if (selectedStatus !== "All" && u.status !== selectedStatus) {
        return false;
      }

      if (selectedIndustry !== "All" && u.industry !== selectedIndustry) {
        return false;
      }

      return true;
    });
  }, [users, searchQuery, selectedStatus, selectedIndustry]);

  const totalPages = Math.ceil(filteredMembers.length / pageSize) || 1;
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleConfirmAction = () => {
    if (!targetMember) return;
    if (actionType === "delete") {
      deleteMember(targetMember.id);
    } else if (actionType === "suspend") {
      suspendMember(targetMember.id);
    }
    setTargetMember(null);
    setActionType(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase leading-4 tracking-widest text-text-soft-400">
            <Users className="size-3.5" strokeWidth={1.5} />
            <span>Member Directory Control</span>
          </div>
          <h1 className="text-2xl font-semibold leading-8 tracking-tight text-text-strong-950">
            Member Management
          </h1>
          <p className="mt-1 text-sm leading-5 text-text-sub-600">
            Verify credentials, oversee profiles, and manage directory permissions.
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="rounded-2xl border border-stroke-soft-200 bg-bg-white-0 p-4 shadow-regular-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft-400 size-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, email, company, role..."
            className="w-full h-10 w-full rounded-lg border border-stroke-soft-200 bg-bg-white-0 pl-10 pr-10 text-[13px] text-text-strong-950 placeholder:text-text-soft-400 focus:outline-none focus:border-primary-base"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-soft-400 hover:text-text-sub-600"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="h-10 rounded-lg border border-stroke-soft-200 bg-bg-white-0 px-3 text-[13px] text-text-strong-950 focus:outline-none focus:border-primary-base sm:w-44"
        >
          <option value="All">All Statuses</option>
          <option value="Available to Help">Available to Help</option>
          <option value="Open to Work">Open to Work</option>
          <option value="Open to Collaboration">Open to Collab</option>
          <option value="Hiring">Hiring</option>
        </select>

        <select
          value={selectedIndustry}
          onChange={(e) => {
            setSelectedIndustry(e.target.value);
            setCurrentPage(1);
          }}
          className="h-10 rounded-lg border border-stroke-soft-200 bg-bg-white-0 px-3 text-[13px] text-text-strong-950 focus:outline-none focus:border-primary-base sm:w-44"
        >
          <option value="All">All Industries</option>
          <option value="Technology">Technology</option>
          <option value="Design">Design</option>
          <option value="Marketing">Marketing</option>
          <option value="Business">Business</option>
          <option value="Finance">Finance</option>
          <option value="Media & Creative">Media & Creative</option>
        </select>
      </div>

      {/* Members Data Table */}
      <div className="overflow-hidden rounded-2xl border border-stroke-soft-200 bg-bg-white-0 shadow-regular-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-bg-weak-50 border-b border-stroke-soft-200 text-[11px] font-semibold uppercase leading-4 tracking-wide text-text-sub-600">
              <tr>
                <th className="py-3 px-5">Member</th>
                <th className="py-3 px-4">Role & Company</th>
                <th className="py-3 px-4 hidden md:table-cell">Top Skills</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center hidden sm:table-cell">
                  Completion
                </th>
                <th className="py-3 px-4 hidden lg:table-cell">Joined</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke-soft-200">
              {paginatedMembers.map((member) => (
                <tr
                  key={member.id}
                  className={`hover:bg-bg-weak-50/70 transition-colors ${
                    member.suspended ? "opacity-50 bg-error-lighter/20" : ""
                  }`}
                >
                  {/* Member Column */}
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="size-9 shrink-0 rounded-full bg-bg-weak-50 object-cover ring-1 ring-stroke-soft-200"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-text-strong-950 truncate block">
                            {member.name}
                          </span>
                          {member.verified && (
                            <span title="Verified">
                              <CheckCircle2
                                className="size-3 text-primary-base shrink-0"
                              />
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] leading-4 text-text-soft-400 truncate block font-mono">
                          {member.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Role Column */}
                  <td className="py-3 px-4">
                    <span className="font-semibold text-text-strong-950 block">
                      {member.role}
                    </span>
                    <span className="text-[11px] leading-4 text-text-sub-600 block">
                      {member.company}
                    </span>
                  </td>

                  {/* Skills Column */}
                  <td className="py-3 px-4 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {member.skills?.slice(0, 2).map((sk) => (
                        <Tag key={sk}>{sk}</Tag>
                      ))}
                      {member.skills?.length > 2 && (
                        <span className="text-[11px] leading-4 text-text-soft-400 px-1">
                          +{member.skills.length - 2}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status Column */}
                  <td className="py-3 px-4">
                    <StatusBadge status={member.status} />
                  </td>

                  {/* Completion Column */}
                  <td className="py-3 px-4 text-center hidden sm:table-cell">
                    <span className="font-bold text-text-strong-950">
                      {member.profileCompletion}%
                    </span>
                  </td>

                  {/* Joined Column */}
                  <td className="py-3 px-4 text-text-soft-400 text-[11px] leading-4 hidden lg:table-cell">
                    {member.joinedAt}
                  </td>

                  {/* Actions Column */}
                  <td className="py-3 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/profile/${member.id}`}>
                        <Button variant="ghost" size="sm" title="View Profile" >
                          <Eye className="size-3.5" strokeWidth={1.5} />
                        </Button>
                      </Link>

                      <Button variant={member.verified ? "subtle" : "outline"} size="sm" onClick={() => verifyMember(member.id)}
                        title={member.verified ? "Unverify Member" : "Verify Member"}
                      >
                        <ShieldCheck
                          className={`size-3.5 ${
                            member.verified ? "text-primary-base" : "text-text-soft-400"
                          }`}
                        />
                        {member.verified ? "Verified" : "Verify"}
                      </Button>

                      <Button variant="ghost" size="sm" onClick={() => {
                          setTargetMember(member);
                          setActionType("suspend");
                        }}
                        title={member.suspended ? "Unsuspend" : "Suspend"} className={member.suspended ? "text-warning-base" : ""}
                      >
                        <ShieldAlert className="size-3.5" strokeWidth={1.5} />
                      </Button>

                      <Button variant="ghost" size="sm" onClick={() => {
                          setTargetMember(member);
                          setActionType("delete");
                        }}
                        title="Delete Member" className="text-error-base hover:bg-error-lighter"
                      >
                        <Trash2 className="size-3.5" strokeWidth={1.5} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="p-4 border-t border-stroke-soft-200 flex items-center justify-between text-xs text-text-sub-600">
          <span>
            Showing{" "}
            <strong>
              {(currentPage - 1) * pageSize + 1} -{" "}
              {Math.min(currentPage * pageSize, filteredMembers.length)}
            </strong>{" "}
            of <strong>{filteredMembers.length}</strong> members
          </span>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} aria-label="Previous page">
              <ChevronLeft className="size-3" />
            </Button>
            <span className="font-semibold text-text-strong-950">
              {currentPage} / {totalPages}
            </span>
            <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} aria-label="Next page">
              <ChevronRight className="size-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={!!targetMember && !!actionType}
        onClose={() => {
          setTargetMember(null);
          setActionType(null);
        }}
        title={
          actionType === "delete" ? "Delete Member Account?" : "Suspend Member?"
        }
        description={
          actionType === "delete"
            ? `Are you sure you want to delete ${targetMember?.name} from the Angkatan 5 network? This action cannot be undone.`
            : `Toggle suspension status for ${targetMember?.name}. Suspended members cannot be discovered in the directory.`
        }
      >
      </Modal>
    </div>
  );
}
