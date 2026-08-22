"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/lib/store/AppContext";
import { Skill, SkillCategory } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@cloudflare/kumo/components/input";
import { Select } from "@cloudflare/kumo/components/select";
import { Modal } from "@/components/ui/Modal";
import { Grid } from "@cloudflare/kumo/components/grid";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { StackIcon, PlusIcon, PencilSimpleIcon, TrashIcon, GitMergeIcon, MagnifyingGlassIcon, XIcon, SparkleIcon } from "@phosphor-icons/react";

const CATEGORIES: SkillCategory[] = ["Design", "Technology", "Business", "Marketing", "Finance", "Media & Creative", "Other"];

export default function AdminSkillsPage() {
  const { skills, addSkill, renameSkill, mergeSkills, deleteSkill } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCat, setNewSkillCat] = useState<SkillCategory>("Technology");
  const [renameTarget, setRenameTarget] = useState<Skill | null>(null);
  const [renamedName, setRenamedName] = useState("");
  const [mergeTarget, setMergeTarget] = useState<Skill | null>(null);
  const [mergeDestinationId, setMergeDestinationId] = useState("");

  const filteredSkills = useMemo(() => {
    return skills.filter((s) => {
      if (selectedCategory !== "All" && s.category !== selectedCategory) return false;
      if (searchQuery.trim() && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [skills, selectedCategory, searchQuery]);

  const handleAddSubmit = (e: React.FormEvent) => { e.preventDefault(); if (newSkillName.trim()) { addSkill(newSkillName.trim(), newSkillCat); setNewSkillName(""); setIsAddModalOpen(false); } };
  const handleRenameSubmit = (e: React.FormEvent) => { e.preventDefault(); if (renameTarget && renamedName.trim()) { renameSkill(renameTarget.id, renamedName.trim()); setRenameTarget(null); setRenamedName(""); } };
  const handleMergeSubmit = (e: React.FormEvent) => { e.preventDefault(); if (mergeTarget && mergeDestinationId) { mergeSkills(mergeTarget.id, mergeDestinationId); setMergeTarget(null); setMergeDestinationId(""); } };

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase leading-4 tracking-widest text-kumo-inactive">
            <StackIcon size={16} /><span>Taxonomy Control</span>
          </div>
          <h1 className="text-page-title text-kumo-strong">Skills Management</h1>
          <p className="mt-1 text-sm leading-5 text-kumo-subtle">Curate standardized community skill tags, merge duplicates, and analyze member adoption.</p>
        </div>
        <Button variant="primary" size="md" icon={<PlusIcon />} onClick={() => setIsAddModalOpen(true)}>Add New Skill</Button>
      </div>

      <LayerCard className="p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1">
          <Button variant={selectedCategory === "All" ? "primary" : "secondary"} size="sm" onClick={() => setSelectedCategory("All")}>All Categories</Button>
          {CATEGORIES.map((cat) => (
            <Button key={cat} variant={selectedCategory === cat ? "primary" : "secondary"} size="sm" onClick={() => setSelectedCategory(cat)}>{cat}</Button>
          ))}
        </div>
        <div className="w-full sm:w-64">
          <Input aria-label="Search skills" placeholder="Search skills..." value={searchQuery} onChange={(e: any) => setSearchQuery(e.target.value)} />
        </div>
      </LayerCard>

      <Grid variant="3up" gap="base">
        {filteredSkills.map((skill) => (
          <LayerCard key={skill.id} className="p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-bold text-kumo-strong text-sm truncate">{skill.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs leading-4 text-kumo-inactive">{skill.category}</span>
                <span className="text-kumo-inactive">•</span>
                <span className="text-xs leading-4 font-semibold text-kumo-brand">{skill.memberCount} members</span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button variant="ghost" size="sm" shape="square" icon={<PencilSimpleIcon />} onClick={() => { setRenameTarget(skill); setRenamedName(skill.name); }} aria-label="Rename Skill" />
              <Button variant="ghost" size="sm" shape="square" icon={<GitMergeIcon />} onClick={() => { setMergeTarget(skill); setMergeDestinationId(""); }} aria-label="Merge Duplicate" />
              <Button variant="ghost" size="sm" shape="square" icon={<TrashIcon />} onClick={() => deleteSkill(skill.id)} aria-label="Delete Skill" className="text-kumo-danger" />
            </div>
          </LayerCard>
        ))}
      </Grid>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Standardized Skill" description="Add a skill to make it discoverable for all community profiles.">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input label="Skill Name" value={newSkillName} onChange={(e: any) => setNewSkillName(e.target.value)} placeholder="e.g. Distributed Systems" required />
          <Select label="Category" value={newSkillCat} onValueChange={(v: any) => setNewSkillCat(v as SkillCategory)} items={CATEGORIES.map((cat) => ({ label: cat, value: cat }))} />
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-kumo-line">
            <Button type="button" variant="outline" size="md" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="md">Add Skill</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!renameTarget} onClose={() => setRenameTarget(null)} title={`Rename "${renameTarget?.name}"`} description="This will automatically update all member profiles tagged with this skill.">
        <form onSubmit={handleRenameSubmit} className="space-y-4">
          <Input label="Updated Skill Name" value={renamedName} onChange={(e: any) => setRenamedName(e.target.value)} required />
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-kumo-line">
            <Button type="button" variant="outline" size="md" onClick={() => setRenameTarget(null)}>Cancel</Button>
            <Button type="submit" variant="primary" size="md">Save New Name</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!mergeTarget} onClose={() => setMergeTarget(null)} title={`Merge "${mergeTarget?.name}" into Another Skill`} description="All member profiles with this skill will be migrated to the target skill, and the old tag will be removed.">
        <form onSubmit={handleMergeSubmit} className="space-y-4">
          <Select label="Select Destination Target Skill" value={mergeDestinationId} onValueChange={(v: any) => setMergeDestinationId(v)} items={skills.filter((s) => s.id !== mergeTarget?.id).map((s) => ({ label: `${s.name} (${s.category} - ${s.memberCount} members)`, value: s.id }))} placeholder="-- Choose Target Skill --" required />
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-kumo-line">
            <Button type="button" variant="outline" size="md" onClick={() => setMergeTarget(null)}>Cancel</Button>
            <Button type="submit" variant="primary" size="md" disabled={!mergeDestinationId}>Confirm Merge</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
