"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store/AppContext";
import { User, UserStatus } from "@/lib/types";
import { StatusBadge } from "@/components/ui/Badge";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Table } from "@cloudflare/kumo/components/table";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { Input } from "@cloudflare/kumo/components/input";
import { Select } from "@cloudflare/kumo/components/select";
import {
  Users,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ShieldWarningIcon,
  TrashIcon,
  EyeIcon,
  DotsThreeVerticalIcon,
  XIcon,
  CaretLeftIcon,
  CaretRightIcon,
  ShieldCheckIcon,
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
        const matchesName = u.name.toLowerCase().includes(q);
        const matchesEmail = u.email.toLowerCase().includes(q);
        const matchesRole = u.role?.toLowerCase().includes(q);
        const matchesCompany = u.company?.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesRole && !matchesCompany) return false;
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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase leading-4 tracking-widest text-kumo-inactive">
            <Users size={14} weight="regular" />
            <span>Member Directory Control</span>
          </div>
          <h1 className="text-page-title text-kumo-strong">Member Management</h1>
          <p className="mt-1 text-sm leading-5 text-kumo-subtle">Verify credentials, oversee profiles, and manage directory permissions.</p>
        </div>
      </div>

      {/* Search & Filter — Kumo Input + Select */}
      <LayerCard className="p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full">
          <Input
            aria-label="Search members"
            placeholder="Search by name, email, company, role..."
            value={searchQuery}
            onChange={(e: any) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <Select
          value={selectedStatus}
          onValueChange={(v: any) => { setSelectedStatus(v); setCurrentPage(1); }}
          items={["All", "Available to Help", "Open to Work", "Open to Collaboration", "Hiring"].map((v) => ({ label: v, value: v }))}
          placeholder="All Statuses"
          className="sm:w-44"
        />
        <Select
          value={selectedIndustry}
          onValueChange={(v: any) => { setSelectedIndustry(v); setCurrentPage(1); }}
          items={["All", "Technology", "Design", "Marketing", "Business", "Finance", "Media & Creative"].map((v) => ({ label: v, value: v }))}
          placeholder="All Industries"
          className="sm:w-44"
        />
      </LayerCard>

      {/* Members Data Table — Kumo Table */}
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
                <Table.Row key={member.id} className={member.suspended ? "opacity-50 bg-kumo-warning-tint/20" : ""}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <img src={member.avatar} alt={member.name} className="size-9 shrink-0 rounded-full bg-kumo-tint object-cover ring-1 ring-kumo-line" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-kumo-strong truncate block">{member.name}</span>
                          {member.verified && <CheckCircleIcon size={12} weight="fill" className="text-kumo-brand shrink-0" />}
                        </div>
                        <span className="text-xs leading-4 text-kumo-inactive truncate block font-mono">{member.email}</span>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-semibold text-kumo-strong block">{member.role}</span>
                    <span className="text-xs leading-4 text-kumo-subtle block">{member.company}</span>
                  </Table.Cell>
                  <Table.Cell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {member.skills?.slice(0, 2).map((sk) => <Tag key={sk}>{sk}</Tag>)}
                      {member.skills?.length > 2 && <span className="text-xs leading-4 text-kumo-inactive px-1">+{member.skills.length - 2}</span>}
                    </div>
                  </Table.Cell>
                  <Table.Cell><StatusBadge status={member.status} /></Table.Cell>
                  <Table.Cell className="hidden sm:table-cell text-center"><span className="font-bold text-kumo-strong">{member.profileCompletion}%</span></Table.Cell>
                  <Table.Cell className="hidden lg:table-cell text-kumo-inactive text-xs leading-4">{member.joinedAt}</Table.Cell>
                  <Table.Cell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/profile/${member.id}`}>
                        <Button variant="ghost" size="sm" aria-label="View Profile" icon={<EyeIcon /> } shape="square" />
                      </Link>
                      <Button variant={member.verified ? "secondary" : "outline"} size="sm" onClick={() => verifyMember(member.id)} icon={<ShieldCheckIcon />}>
                        {member.verified ? "Verified" : "Verify"}
                      </Button>
                      <Button variant="ghost" size="sm" shape="square" icon={<ShieldWarningIcon />} onClick={() => { setTargetMember(member); setActionType("suspend"); }} aria-label={member.suspended ? "Unsuspend" : "Suspend"} />
                      <Button variant="ghost" size="sm" shape="square" icon={<TrashIcon />} onClick={() => { setTargetMember(member); setActionType("delete"); }} aria-label="Delete Member" className="text-kumo-danger hover:bg-kumo-danger-tint" />
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <div className="p-4 border-t border-kumo-line flex items-center justify-between text-xs text-kumo-subtle">
          <span>Showing <strong>{(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredMembers.length)}</strong> of <strong>{filteredMembers.length}</strong> members</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" shape="square" icon={<CaretLeftIcon />} disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} aria-label="Previous page" />
            <span className="font-semibold text-kumo-strong">{currentPage} / {totalPages}</span>
            <Button variant="outline" size="sm" shape="square" icon={<CaretRightIcon />} disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} aria-label="Next page" />
          </div>
        </div>
      </LayerCard>

      <Modal
        isOpen={!!targetMember && !!actionType}
        onClose={() => { setTargetMember(null); setActionType(null); }}
        title={actionType === "delete" ? "Delete Member Account?" : "Suspend Member?"}
        description={actionType === "delete" ? `Are you sure you want to delete ${targetMember?.name} from the Angkatan 5 network? This action cannot be undone.` : `Toggle suspension status for ${targetMember?.name}. Suspended members cannot be discovered in the directory.`}
      />
    </div>
  );
}
