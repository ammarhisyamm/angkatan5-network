"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/lib/store/AppContext";
import { SkillCategory } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@cloudflare/kumo/components/input";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { Modal } from "@/components/ui/Modal";
import { StackIcon, PlusIcon, DotsThreeVerticalIcon, PencilSimpleIcon, ArrowsMergeIcon, TrashIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";

const FIELD_CATEGORIES: SkillCategory[] = ["Design", "Technology", "Business", "Marketing", "Finance", "Media & Creative", "Other"];

const CATEGORY_COLORS: Record<string, string> = {
  "Design": "bg-kumo-brand",
  "Technology": "bg-verified-base",
  "Business": "bg-feature-base",
  "Marketing": "bg-purple-600",
  "Finance": "bg-warning-base",
  "Media & Creative": "bg-primary-base",
  "Other": "bg-kumo-subtle",
};

export default function AdminSkillsPage() {
  const { skills, addSkill, renameSkill, mergeSkills, deleteSkill } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>(FIELD_CATEGORIES[0]);
  const [editingSkill, setEditingSkill] = useState<{ id: string; name: string } | null>(null);
  const [mergeTarget, setMergeTarget] = useState<{ id: string; name: string; category: string } | null>(null);
  const [mergeIntoSkill, setMergeIntoSkill] = useState<string>("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    skills.forEach((s) => map.set(s.category, (map.get(s.category) || 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [skills]);

  const skillsByCategory = useMemo(() => {
    const map = new Map<string, typeof skills>();
    skills.forEach((s) => {
      if (!map.has(s.category)) map.set(s.category, []);
      map.get(s.category)!.push(s);
    });
    return map;
  }, [skills]);

  const displayedCategories = useMemo(() => {
    let filtered = categories;
    if (selectedCategory) filtered = filtered.filter(([cat]) => cat === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.map(([cat, count]) => {
        const matchedCount = skillsByCategory.get(cat)!.filter((s) => s.name.toLowerCase().includes(q)).length;
        return [cat, matchedCount] as [string, number];
      }).filter(([, count]) => count > 0);
    }
    return filtered;
  }, [categories, selectedCategory, searchQuery, skillsByCategory]);

  const handleAddSkill = () => {
    const trimmed = newSkillName.trim();
    if (!trimmed || skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) return;
    addSkill(trimmed, newSkillCategory);
    setNewSkillName("");
  };

  const handleRenameSkill = () => {
    if (!editingSkill || !editingSkill.name.trim()) return;
    renameSkill(editingSkill.id, editingSkill.name.trim());
    setEditingSkill(null);
  };

  const handleMergeSkills = () => {
    if (!mergeTarget || !mergeIntoSkill || mergeTarget.id === mergeIntoSkill) return;
    mergeSkills(mergeTarget.id, mergeIntoSkill);
    setMergeTarget(null);
    setMergeIntoSkill("");
  };

  const handleDeleteSkill = () => {
    if (!deleteTarget) return;
    deleteSkill(deleteTarget.id);
    setDeleteTarget(null);
  };

  const totalSkills = skills.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="mb-1.5 flex items-center gap-1.5 text-label text-kumo-inactive">
            <StackIcon size={14} />
            <span>Skill Taxonomy</span>
          </div>
          <h1 className="text-page-title text-kumo-strong">Skill Management</h1>
          <p className="mt-1 text-body text-kumo-subtle">Organize and standardize the skills available to the Angkatan 5 talent pool.</p>
        </div>
      </div>

      {/* Add New Skill */}
      <LayerCard className="p-4 sm:p-5">
        <h3 className="text-card-title text-kumo-strong mb-3">Add New Skill</h3>
        <div className="flex flex-col sm:flex-row items-start gap-3">
          <Input aria-label="New skill name" placeholder="Enter skill name..." value={newSkillName} onChange={(e: any) => setNewSkillName(e.target.value)}
            onKeyDown={(e: any) => { if (e.key === "Enter") handleAddSkill(); }} className="flex-1" />
          <select value={newSkillCategory} onChange={(e) => setNewSkillCategory(e.target.value as SkillCategory)}
            className="w-full sm:w-56 h-10 rounded-xl border border-kumo-line bg-kumo-base px-3 text-sm text-kumo-strong outline-none focus:ring-2 focus:ring-kumo-brand focus:ring-offset-1 appearance-none cursor-pointer">
            {FIELD_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <Button variant="primary" size="md" onClick={handleAddSkill} disabled={!newSkillName.trim()} icon={<PlusIcon size={16} weight="bold" />} className="w-full sm:w-auto justify-center">Add Skill</Button>
        </div>
      </LayerCard>

      {/* Search + Category Filter */}
      <LayerCard className="p-4 flex flex-col sm:flex-row gap-3">
        <Input
          aria-label="Search skills"
          placeholder="Search skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <div className="flex items-center gap-1 overflow-x-auto pb-1 -mb-1">
          <Button variant={selectedCategory === null ? "primary" : "secondary"} size="sm" onClick={() => setSelectedCategory(null)}>All ({totalSkills})</Button>
          {categories.map(([cat, count]) => (
            <Button key={cat} variant={selectedCategory === cat ? "primary" : "secondary"} size="sm" onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}>{cat} ({count})</Button>
          ))}
        </div>
      </LayerCard>

      {/* Skills Grid */}
      {displayedCategories.length === 0 ? (
        <LayerCard className="p-16 text-center text-sm text-kumo-subtle">No skills match your search.</LayerCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {displayedCategories.map(([category, count]) => (
            <LayerCard key={category} className="p-0 overflow-hidden">
              <div className="px-4 sm:px-5 py-3.5 border-b border-kumo-line flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`size-2.5 rounded-full shrink-0 ${CATEGORY_COLORS[category] || "bg-kumo-inactive"}`} />
                  <div>
                    <h3 className="text-card-title text-kumo-strong">{category}</h3>
                    <span className="text-xs text-kumo-inactive">{count} {count === 1 ? "skill" : "skills"}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 flex flex-wrap gap-1.5 min-h-[88px]">
                {skillsByCategory.get(category)!.map((skill) => (
                  <div key={skill.id} className="group relative flex items-center gap-1.5 bg-kumo-tint border border-kumo-line rounded-lg px-2.5 py-1.5 text-sm text-kumo-strong hover:border-kumo-subtle transition-colors">
                    <span>{skill.name}</span>
                    <div className="relative">
                      <button onClick={() => setActiveMenu(activeMenu === skill.id ? null : skill.id)} className="text-kumo-inactive hover:text-kumo-strong transition-colors p-1 -mr-1" aria-label={`Actions for ${skill.name}`}>
                        <DotsThreeVerticalIcon size={14} weight="bold" />
                      </button>
                      {activeMenu === skill.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />
                          <div className="absolute right-0 top-full mt-1 w-44 bg-kumo-base border border-kumo-line rounded-xl shadow-lg z-50 py-1 overflow-hidden">
                            <button onClick={() => { setEditingSkill({ id: skill.id, name: skill.name }); setActiveMenu(null); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-kumo-strong hover:bg-kumo-tint transition-colors">
                              <PencilSimpleIcon size={14} /> Rename
                            </button>
                            <button onClick={() => { setMergeTarget(skill); setActiveMenu(null); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-kumo-strong hover:bg-kumo-tint transition-colors">
                              <ArrowsMergeIcon size={14} /> Merge into...
                            </button>
                            <button onClick={() => { setDeleteTarget(skill); setActiveMenu(null); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-error-base hover:bg-error-lighter transition-colors">
                              <TrashIcon size={14} /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </LayerCard>
          ))}
        </div>
      )}

      {/* Rename Modal */}
      <Modal isOpen={!!editingSkill} onClose={() => setEditingSkill(null)} title="Rename Skill">
        <div className="space-y-4 pt-4">
          <Input aria-label="New skill name" value={editingSkill?.name || ""} onChange={(e: any) => setEditingSkill(editingSkill ? { ...editingSkill, name: e.target.value } : null)}
            onKeyDown={(e: any) => { if (e.key === "Enter") handleRenameSkill(); }} />
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-kumo-line">
            <Button variant="outline" size="md" onClick={() => setEditingSkill(null)}>Cancel</Button>
            <Button variant="primary" size="md" onClick={handleRenameSkill} disabled={!editingSkill?.name.trim()}>Rename</Button>
          </div>
        </div>
      </Modal>

      {/* Merge Modal */}
      <Modal isOpen={!!mergeTarget} onClose={() => { setMergeTarget(null); setMergeIntoSkill(""); }} title="Merge Skill" description={`Merge "${mergeTarget?.name}" into another skill. All users with this skill will be updated.`}>
        <div className="space-y-4 pt-4">
          <select value={mergeIntoSkill} onChange={(e) => setMergeIntoSkill(e.target.value)}
            className="w-full h-10 rounded-xl border border-kumo-line bg-kumo-base px-3 text-sm text-kumo-strong outline-none focus:ring-2 focus:ring-kumo-brand focus:ring-offset-1 appearance-none cursor-pointer">
            <option value="">Select target skill...</option>
            {skills.filter((s) => s.id !== mergeTarget?.id).map((s) => <option key={s.id} value={s.id}>{s.name} ({s.category})</option>)}
          </select>
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-kumo-line">
            <Button variant="outline" size="md" onClick={() => { setMergeTarget(null); setMergeIntoSkill(""); }}>Cancel</Button>
            <Button variant="primary" size="md" onClick={handleMergeSkills} disabled={!mergeIntoSkill || mergeTarget?.id === mergeIntoSkill}>Merge</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Skill?" description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}>
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-kumo-line">
          <Button variant="outline" size="md" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" size="md" onClick={handleDeleteSkill}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
