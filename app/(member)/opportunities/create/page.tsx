"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeftIcon, PlusCircleIcon, EyeIcon, PaperPlaneTiltIcon, PlusIcon, XIcon, SparkleIcon, MapPinIcon } from "@phosphor-icons/react";
import { OpportunityCategory, OpportunityType } from "@/lib/types";

const CATEGORIES: OpportunityCategory[] = [
  "Jobs",
  "Freelance",
  "Collaboration",
  "Internship",
  "Hiring",
  "Mentorship",
  "Business",
];

const TYPES: OpportunityType[] = [
  "Full-time",
  "Part-time",
  "Freelance",
  "Internship",
  "Collaboration",
  "Mentorship",
];

const POPULAR_SKILLS = [
  "UI/UX Design",
  "Software Development",
  "React / Next.js",
  "Python & AI / ML",
  "Marketing",
  "Product Management",
  "Brand Strategy",
  "Video Editing & Production",
  "Finance",
  "Sales & Partnerships",
];

export default function CreateOpportunityPage() {
  const router = useRouter();
  const { createOpportunity, currentUser } = useApp();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<OpportunityCategory>("Collaboration");
  const [type, setType] = useState<OpportunityType>("Collaboration");
  const [location, setLocation] = useState("Jakarta / Remote");
  const [description, setDescription] = useState("");
  const [requirementsText, setRequirementsText] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [deadline, setDeadline] = useState("2026-10-31");
  const [contactPreference, setContactPreference] = useState(
    "Direct message via A5 Network"
  );
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleToggleSkill = (sk: string) => {
    if (selectedSkills.includes(sk)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== sk));
    } else {
      setSelectedSkills([...selectedSkills, sk]);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setCustomSkill("");
    }
  };

  const handleRemoveSkill = (sk: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== sk));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Please fill in the title and description.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const requirements = requirementsText
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);

    setTimeout(() => {
      const created = createOpportunity({
        title,
        category,
        type,
        location,
        description,
        requirements,
        requiredSkills: selectedSkills,
        deadline,
        contactPreference,
        status: "Published",
      });

      setIsSubmitting(false);
      router.push(`/opportunities/${created.id}`);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Link
          href="/opportunities"
          className="inline-flex items-center gap-1 text-xs font-semibold text-kumo-subtle hover:text-kumo-strong transition-colors"
        >
          <ArrowLeftIcon size={16} weight="regular" />
          Back to Opportunities
        </Link>

        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className="text-xs font-semibold text-kumo-brand hover:underline flex items-center gap-2"
        >
          <EyeIcon size={16} weight="regular" />
          {isPreview ? "Back to Edit Form" : "Preview Opportunity"}
        </button>
      </div>

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-alpha-10 text-kumo-brand text-xs font-semibold mb-2">
          <SparkleIcon size={12} weight="regular" />
          <span>New Community Post</span>
        </div>
        <h1 className="text-page-title text-kumo-strong">
          Share an Opportunity
        </h1>
        <p className="text-sm text-kumo-subtle mt-1">
          Post jobs, freelance projects, collaborations, or mentorship openings for your fellow alumni.
        </p>
      </div>

      {error && (
        <div className="p-4 text-xs bg-error-lighter border border-error-light text-error-base rounded-xl font-medium">
          {error}
        </div>
      )}

      {isPreview ? (
        /* LIVE PREVIEW CARD */
        <div className="bg-kumo-base border border-kumo-line rounded-xl p-6 sm:p-8 space-y-8">
          <div className="flex items-center justify-between pb-3 border-b border-kumo-line">
            <span className="text-sm font-medium text-kumo-brand">
              Live Preview
            </span>
            <Badge variant="success">
              Ready to Publish
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="primary">
                {category}
              </Badge>
              <Badge variant="neutral">
                <MapPinIcon size={12} weight="regular" className="text-kumo-inactive" />
                {location || "Remote"}
              </Badge>
              <span className="text-xs text-kumo-inactive">{type}</span>
            </div>

            <h2 className="text-base font-semibold leading-6 text-kumo-strong">
              {title || "Untitled Opportunity"}
            </h2>

            <p className="text-sm text-kumo-subtle leading-relaxed whitespace-pre-line">
              {description || "No description provided yet."}
            </p>

            {requirementsText && (
              <div>
                <h4 className="text-xs font-bold text-kumo-strong mb-2">
                  Requirements:
                </h4>
                <ul className="space-y-1 text-xs text-kumo-subtle">
                  {requirementsText.split("\n").filter(Boolean).map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-kumo-brand mt-1 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2">
                {selectedSkills.map((sk) => (
                  <span
                    key={sk}
                    className="px-2 rounded-xl text-xs bg-kumo-tint text-kumo-subtle font-medium"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-6 border-t border-kumo-line">
            <Button variant="outline" size="md" onClick={() => setIsPreview(false)} className="w-full sm:w-auto justify-center">
              Edit Details
            </Button>
            <Button variant="primary" size="md" onClick={handleSubmit} isLoading={isSubmitting} className="w-full sm:w-auto justify-center">
              <PaperPlaneTiltIcon size={12} weight="regular" className="mr-1" />
              Publish Opportunity
            </Button>
          </div>
        </div>
      ) : (
        /* EDIT FORM */
        <form
          onSubmit={handleSubmit}
          className="bg-kumo-base border border-kumo-line rounded-xl p-6 sm:p-8 space-y-8"
        >
          <Input
            label="Opportunity Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Senior Next.js Developer for Fintech Project"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-kumo-subtle">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as OpportunityCategory)}
                className="w-full h-10 px-3 bg-kumo-base text-kumo-strong border border-kumo-line rounded-xl text-sm focus:outline-none focus:border-kumo-brand"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-kumo-subtle">
                Engagement Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as OpportunityType)}
                className="w-full h-10 px-3 bg-kumo-base text-kumo-strong border border-kumo-line rounded-xl text-sm focus:outline-none focus:border-kumo-brand"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Jakarta (Hybrid) or Remote"
              required
            />

            <Input
              label="Application Deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <Textarea
            label="Description & Project Overview"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain what the project is about, expectations, and compensation if applicable..."
            required
          />

          <Textarea
            label="Requirements (one per line)"
            rows={3}
            value={requirementsText}
            onChange={(e) => setRequirementsText(e.target.value)}
            placeholder="3+ years experience with Next.js&#10;Portfolio of published apps&#10;Available 10 hours per week"
          />

          {/* Skill Tagging */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-kumo-subtle">
              Required Skills
            </label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SKILLS.map((sk) => {
                const isSelected = selectedSkills.includes(sk);
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => handleToggleSkill(sk)}
                    className={`px-3 py-1 rounded-xl text-xs font-medium border transition-colors ${
                      isSelected
                        ? "bg-kumo-brand text-static-white border-kumo-brand"
                        : "bg-kumo-tint text-kumo-subtle border-kumo-line"
                    }`}
                  >
                    {isSelected ? "✓ " : "+ "}
                    {sk}
                  </button>
                );
              })}
            </div>

            {/* Custom skill add */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                aria-label="Add other skill tag"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Add other skill tag..."
                className="flex-1 h-9 px-3 bg-kumo-base border border-kumo-line rounded-xl text-xs"
              />
              <Button type="button" variant="secondary" size="sm" onClick={handleAddCustomSkill} >
                <PlusIcon size={12} weight="regular" />
                Add
              </Button>
            </div>
          </div>

          <Input
            label="Contact Preference / Application Instruction"
            value={contactPreference}
            onChange={(e) => setContactPreference(e.target.value)}
            placeholder="e.g. Direct message via A5 Network or email to careers@example.com"
          />

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6 border-t border-kumo-line">
            <Button type="button" variant="outline" size="md" onClick={() => setIsPreview(true)} className="w-full sm:w-auto justify-center">
              <EyeIcon size={16} weight="regular" className="mr-1" />
              Preview First
            </Button>
            <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className="w-full sm:w-auto justify-center">
              <PaperPlaneTiltIcon size={16} weight="regular" className="mr-1" />
              Publish Opportunity
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
