"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/lib/store/AppContext";
import { Skill, SkillCategory } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  GitMerge,
  Search,
  Check,
  X,
  Sparkles,
} from "lucide-react";

const CATEGORIES: SkillCategory[] = [
  "Design",
  "Technology",
  "Business",
  "Marketing",
  "Finance",
  "Media & Creative",
  "Other",
];

export default function AdminSkillsPage() {
  const { skills, addSkill, renameSkill, mergeSkills, deleteSkill } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCat, setNewSkillCat] = useState<SkillCategory>("Technology");

  const [renameTarget, setRenameTarget] = useState<Skill | null>(null);
  const [renamedName, setRenamedName] = useState("");

  const [mergeTarget, setMergeTarget] = useState<Skill | null>(null);
  const [mergeDestinationId, setMergeDestinationId] = useState("");

  const filteredSkills = useMemo(() => {
    return skills.filter((s) => {
      if (selectedCategory !== "All" && s.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!s.name.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [skills, selectedCategory, searchQuery]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkillName.trim()) {
      addSkill(newSkillName.trim(), newSkillCat);
      setNewSkillName("");
      setIsAddModalOpen(false);
    }
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (renameTarget && renamedName.trim()) {
      renameSkill(renameTarget.id, renamedName.trim());
      setRenameTarget(null);
      setRenamedName("");
    }
  };

  const handleMergeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mergeTarget && mergeDestinationId) {
      mergeSkills(mergeTarget.id, mergeDestinationId);
      setMergeTarget(null);
      setMergeDestinationId("");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1 mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase leading-4 tracking-widest text-text-soft-400">
            <Layers className="size-4" />
            <span>Taxonomy Control</span>
          </div>
          <h1 className="text-2xl font-semibold leading-8 tracking-tight text-text-strong-950">
            Skills Management
          </h1>
          <p className="mt-1 text-sm leading-5 text-text-sub-600">
            Curate standardized community skill tags, merge duplicates, and analyze member adoption.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => setIsAddModalOpen(true)}
          className="gap-2"
        >
          <Plus className="size-4" />
          Add New Skill
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-bg-white-0 border border-stroke-soft-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === "All"
                ? "bg-bg-strong-950 text-text-white-0"
                : "bg-bg-weak-50 text-text-sub-600"
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-bg-strong-950 text-text-white-0"
                  : "bg-bg-weak-50 text-text-sub-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft-400 size-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills..."
            className="w-full h-9 pl-9 pr-8 bg-bg-weak-50 border border-stroke-soft-200 rounded-xl text-xs text-text-strong-950 focus:outline-none"
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

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="bg-bg-white-0 border border-stroke-soft-200 rounded-xl p-4 flex items-center justify-between gap-3 hover:border-stroke-sub-300 transition-colors"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-text-strong-950 text-sm truncate">
                  {skill.name}
                </h3>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] leading-4 text-text-soft-400">{skill.category}</span>
                <span>•</span>
                <span className="text-[11px] leading-4 font-semibold text-primary-base">
                  {skill.memberCount} members
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Button variant="ghost" size="sm" onClick={() => {
                  setRenameTarget(skill);
                  setRenamedName(skill.name);
                }}
                className="h-7 w-7 p-0 text-text-soft-400 hover:text-primary-base"
                title="Rename Skill"
              >
                <Edit2 className="size-3" />
              </Button>

              <Button variant="ghost" size="sm" onClick={() => {
                  setMergeTarget(skill);
                  setMergeDestinationId("");
                }}
                className="h-7 w-7 p-0 text-text-soft-400 hover:text-feature-base"
                title="Merge Duplicate"
              >
                <GitMerge className="size-3" />
              </Button>

              <Button variant="ghost" size="sm" onClick={() => deleteSkill(skill.id)}
                className="h-7 w-7 p-0 text-text-soft-400 hover:text-error-base"
                title="Delete Skill"
              >
                <Trash2 className="size-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Skill Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Standardized Skill"
        description="Add a skill to make it discoverable for all community profiles."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Skill Name"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            placeholder="e.g. Distributed Systems"
            required
          />

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-sub-600">
              Category
            </label>
            <select
              value={newSkillCat}
              onChange={(e) => setNewSkillCat(e.target.value as SkillCategory)}
              className="w-full h-10 px-3 bg-bg-white-0 border border-stroke-soft-200 rounded-xl text-sm focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-stroke-soft-200">
            <Button type="button" variant="outline" size="md" onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Add Skill
            </Button>
          </div>
        </form>
      </Modal>

      {/* Rename Skill Modal */}
      <Modal
        isOpen={!!renameTarget}
        onClose={() => setRenameTarget(null)}
        title={`Rename "${renameTarget?.name}"`}
        description="This will automatically update all member profiles tagged with this skill."
      >
        <form onSubmit={handleRenameSubmit} className="space-y-4">
          <Input
            label="Updated Skill Name"
            value={renamedName}
            onChange={(e) => setRenamedName(e.target.value)}
            required
          />

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-stroke-soft-200">
            <Button type="button" variant="outline" size="md" onClick={() => setRenameTarget(null)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Save New Name
            </Button>
          </div>
        </form>
      </Modal>

      {/* Merge Skills Modal */}
      <Modal
        isOpen={!!mergeTarget}
        onClose={() => setMergeTarget(null)}
        title={`Merge "${mergeTarget?.name}" into Another Skill`}
        description="All member profiles with this skill will be migrated to the target skill, and the old tag will be removed."
      >
        <form onSubmit={handleMergeSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-sub-600">
              Select Destination Target Skill
            </label>
            <select
              value={mergeDestinationId}
              onChange={(e) => setMergeDestinationId(e.target.value)}
              className="w-full h-10 px-3 bg-bg-white-0 border border-stroke-soft-200 rounded-xl text-sm focus:outline-none"
              required
            >
              <option value="">-- Choose Target Skill --</option>
              {skills
                .filter((s) => s.id !== mergeTarget?.id)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category} - {s.memberCount} members)
                  </option>
                ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-stroke-soft-200">
            <Button type="button" variant="outline" size="md" onClick={() => setMergeTarget(null)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={!mergeDestinationId} >
              Confirm Merge
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
