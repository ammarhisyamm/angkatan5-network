"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeftIcon, EyeIcon, PaperPlaneTiltIcon, PlusIcon, SparkleIcon, MapPinIcon } from "@phosphor-icons/react";
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/opportunities"
          className="inline-flex items-center gap-1 text-xs font-semibold text-text-sub-600 hover:text-text-strong-950 transition-colors"
        >
          <ArrowLeftIcon size={16} weight="regular" />
          Back to Opportunities
        </Link>

        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className="text-xs font-semibold text-primary-base hover:underline flex items-center gap-2"
        >
          <EyeIcon size={16} weight="regular" />
          {isPreview ? "Back to Edit Form" : "Preview Opportunity"}
        </button>
      </div>

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-alpha-10 text-primary-base text-xs font-semibold mb-2">
          <SparkleIcon size={12} weight="regular" aria-hidden="true" />
          <span>New Community Post</span>
        </div>
        <h1 className="text-page-title text-text-strong-950">
          Share an Opportunity
        </h1>
        <p className="text-sm text-text-sub-600 mt-1">
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
        <div className="bg-bg-white-0 border border-stroke-soft-200 rounded-xl p-6 sm:p-8 space-y-8">
          <div className="flex items-center justify-between pb-3 border-b border-stroke-soft-200">
            <span className="text-sm font-medium text-primary-base">
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
                <MapPinIcon size={12} weight="regular" className="text-text-soft-400" aria-hidden="true" />
                {location || "Remote"}
              </Badge>
              <span className="text-xs text-text-soft-400">{type}</span>
            </div>

            <h2 className="text-base font-semibold leading-6 text-text-strong-950">
              {title || "Untitled Opportunity"}
            </h2>

            <p className="text-sm text-text-sub-600 leading-relaxed whitespace-pre-line">
              {description || "No description provided yet."}
            </p>

            {requirementsText && (
              <div>
                <h4 className="text-xs font-bold text-text-strong-950 mb-2">
                  Requirements:
                </h4>
                <ul className="space-y-1 text-xs text-text-sub-600">
                  {requirementsText.split("\n").filter(Boolean).map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-primary-base mt-1 shrink-0" />
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
                    className="px-2 rounded-xl text-xs bg-bg-weak-50 text-text-sub-600 font-medium"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-6 border-t border-stroke-soft-200">
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
          className="rounded-2xl border border-stroke-soft-200 bg-bg-white-0 p-5 sm:p-8"
        >
          <div className="space-y-6">
          <Input
            label="Opportunity Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Senior Next.js Developer for Fintech Project"
            required
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Select label="Category" value={category} onValueChange={(value) => setCategory(value as OpportunityCategory)} items={CATEGORIES.map((cat) => ({ label: cat, value: cat }))} />
            <Select label="Engagement Type" value={type} onValueChange={(value) => setType(value as OpportunityType)} items={TYPES.map((item) => ({ label: item, value: item }))} />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Jakarta (Hybrid) or Remote"
              required
            />

            <DatePicker label="Application Deadline" name="deadline" value={deadline} onChange={setDeadline} min={new Date().toISOString().slice(0, 10)} />
          </div>

          <Textarea
            label="Description & Project Overview"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain what the project is about, expectations, and compensation if applicable…"
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
            <label className="text-sm font-medium text-text-strong-950">
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
                    className={`inline-flex min-h-9 items-center rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base ${
                      isSelected
                        ? "bg-primary-base text-static-white border-primary-base"
                        : "bg-bg-weak-50 text-text-sub-600 ring-stroke-soft-200"
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
              <Input aria-label="Add other skill tag" value={customSkill} onChange={(e) => setCustomSkill(e.target.value)} placeholder="Add another skill…" className="flex-1" />
              <Button type="button" variant="secondary" size="md" onClick={handleAddCustomSkill}>
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

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6 border-t border-stroke-soft-200">
            <Button type="button" variant="outline" size="md" onClick={() => setIsPreview(true)} className="w-full sm:w-auto justify-center">
              <EyeIcon size={16} weight="regular" className="mr-1" />
              Preview First
            </Button>
            <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className="w-full sm:w-auto justify-center">
              <PaperPlaneTiltIcon size={16} weight="regular" className="mr-1" />
              Publish Opportunity
            </Button>
          </div>
          </div>
        </form>
      )}
    </div>
  );
}
