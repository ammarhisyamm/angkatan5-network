"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store/AppContext";
import { User } from "@/lib/types";
import { StatusBadge } from "@/components/ui/Badge";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Table } from "@cloudflare/kumo/components/table";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { Input } from "@cloudflare/kumo/components/input";
import { Select } from "@cloudflare/kumo/components/select";
import {
  UsersIcon,
  CheckCircleIcon,
  ShieldWarningIcon,
  TrashIcon,
  EyeIcon,
  ShieldCheckIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";

export default function AdminMembersPage() {
  const { users, verifyMember, suspendMember, deleteMember } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [targetMember, setTargetMember] = useState<User | null>(null);
  const [actionType, setActionType] = useState<"delete" | "suspend" | null>(null);

  const filteredMembers = useMemo(() => {
    return users.filter((u) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q) && !u.role?.toLowerCase().includes(q) && !u.company?.toLowerCase().includes(q)) return false;
      }
      if (selectedStatus !== "All" && u.status !== selectedStatus) return false;
      if (selectedIndustry !== "All" && u.industry !== selectedIndustry) return false;
      return true;
    });
  }, [users, searchQuery, selectedStatus, selectedIndustry]);

  const totalPages = Math.ceil(filteredMembers.length / pageSize) || 1;
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleConfirmAction = () => {
    if (!targetMember) return;
    if (actionType === "delete") deleteMember(targetMember.id);
    else if (actionType === "suspend") suspendMember(targetMember.id);
    setTargetMember(null);
    setActionType(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="mb-1.5 flex items-center gap-1.5 text-label text-kumo-inactive">
            <UsersIcon size={14} />
            <span>Member Directory</span>
          </div>
          <h1 className="text-page-title text-kumo-strong">Member Management</h1>
          <p className="mt-1 text-body text-kumo-subtle">Verify credentials, oversee profiles, and manage directory permissions.</p>
        </div>
      </div>

      {/* Search & Filter */}
      <LayerCard className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full">
          <Input aria-label="Search members" placeholder="Search by name, email, company, role..." value={searchQuery} onChange={(e: any) => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
        </div>
        <Select value={selectedStatus} onValueChange={(v: any) => { setSelectedStatus(v); setCurrentPage(1); }} items={["All", "Available to Help", "Open to Work", "Open to Collaboration", "Hiring"].map((v) => ({ label: v, value: v }))} placeholder="All Statuses" className="sm:w-44" />
        <Select value={selectedIndustry} onValueChange={(v: any) => { setSelectedIndustry(v); setCurrentPage(1); }} items={["All", "Technology", "Design", "Marketing", "Business", "Finance", "Media & Creative"].map((v) => ({ label: v, value: v }))} placeholder="All Industries" className="sm:w-44" />
      </LayerCard>

      {/* Table */}
      <LayerCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Member</Table.Head>
                <Table.Head>Role & Company</Table.Head>
                <Table.Head className="hidden md:table-cell">Top Skills</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head className="hidden sm:table-cell text-center">Completion</Table.Head>
                <Table.Head className="hidden lg:table-cell">Joined</Table.Head>
                <Table.Head className="text-right">Actions</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {paginatedMembers.map((member) => (
                <Table.Row key={member.id} className={member.suspended ? "opacity-50" : ""}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <img src={member.avatar} alt="" width={28} height={28} className="size-7 shrink-0 rounded-full bg-kumo-tint object-cover aspect-square ring-1 ring-kumo-line" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-kumo-strong truncate">{member.name}</span>
                          {member.verified && <CheckCircleIcon size={14} weight="fill" className="text-kumo-brand shrink-0" />}
                        </div>
                        <span className="text-xs text-kumo-inactive truncate block">{member.email}</span>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-sm font-medium text-kumo-strong block">{member.role}</span>
                    <span className="text-xs text-kumo-subtle block">{member.company}</span>
                  </Table.Cell>
                  <Table.Cell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {member.skills?.slice(0, 2).map((sk) => <Tag key={sk}>{sk}</Tag>)}
                      {member.skills && member.skills.length > 2 && <span className="text-xs text-kumo-inactive">+{member.skills.length - 2}</span>}
                    </div>
                  </Table.Cell>
                  <Table.Cell><StatusBadge status={member.status} /></Table.Cell>
                  <Table.Cell className="hidden sm:table-cell text-center">
                    <span className="text-sm font-semibold text-kumo-strong">{member.profileCompletion}%</span>
                  </Table.Cell>
                  <Table.Cell className="hidden lg:table-cell text-xs text-kumo-inactive">{member.joinedAt}</Table.Cell>
                  <Table.Cell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/profile/${member.id}`}>
                        <Button variant="ghost" size="sm" shape="square" icon={<EyeIcon />} aria-label="View" />
                      </Link>
                      <Button variant={member.verified ? "secondary" : "outline"} size="sm" onClick={() => verifyMember(member.id)} icon={<ShieldCheckIcon size={14} />}>
                        {member.verified ? "Verified" : "Verify"}
                      </Button>
                      <Button variant="ghost" size="sm" shape="square" icon={<ShieldWarningIcon />} onClick={() => { setTargetMember(member); setActionType("suspend"); }} aria-label={member.suspended ? "Unsuspend" : "Suspend"} />
                      <Button variant="ghost" size="sm" shape="square" icon={<TrashIcon />} onClick={() => { setTargetMember(member); setActionType("delete"); }} aria-label="Delete" className="text-error-base hover:bg-error-lighter" />
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <div className="px-4 sm:px-5 py-3 border-t border-kumo-line flex items-center justify-between text-xs text-kumo-subtle">
          <span>Showing <strong>{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredMembers.length)}</strong> of <strong>{filteredMembers.length}</strong></span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" shape="square" icon={<CaretLeftIcon />} disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} aria-label="Previous" />
            <span className="font-medium text-kumo-strong">{currentPage}/{totalPages}</span>
            <Button variant="outline" size="sm" shape="square" icon={<CaretRightIcon />} disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} aria-label="Next" />
          </div>
        </div>
      </LayerCard>

      <Modal
        isOpen={!!targetMember && !!actionType}
        onClose={() => { setTargetMember(null); setActionType(null); }}
        title={actionType === "delete" ? "Delete Member?" : "Suspend Member?"}
        description={actionType === "delete" ? `Are you sure you want to delete ${targetMember?.name}? This action cannot be undone.` : `Toggle suspension for ${targetMember?.name}. Suspended members cannot be discovered.`}
      >
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-kumo-line">
          <Button variant="outline" size="md" onClick={() => { setTargetMember(null); setActionType(null); }}>Cancel</Button>
          <Button variant={actionType === "delete" ? "danger" : "primary"} size="md" onClick={handleConfirmAction}>Confirm</Button>
        </div>
      </Modal>
    </div>
  );
}
