"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { FormActions, FormSection } from "@/components/ui/FormSection";
import {
  ArrowLeftIcon,
  CheckIcon,
  EyeIcon,
  MapPinIcon,
  PaperPlaneTiltIcon,
  PlusIcon,
} from "@phosphor-icons/react";
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
  const { createOpportunity } = useApp();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<OpportunityCategory | "">("");
  const [type, setType] = useState<OpportunityType | "">("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [requirementsText, setRequirementsText] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [deadline, setDeadline] = useState("");
  const [contactPreference, setContactPreference] = useState("Direct message via A5 Network");
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleToggleSkill = (skill: string) => {
    setSelectedSkills((current) =>
      current.includes(skill)
        ? current.filter((item) => item !== skill)
        : [...current, skill],
    );
  };

  const handleAddCustomSkill = () => {
    const nextSkill = customSkill.trim();
    if (nextSkill && !selectedSkills.includes(nextSkill)) {
      setSelectedSkills((current) => [...current, nextSkill]);
      setCustomSkill("");
    }
  };

  const publishOpportunity = () => {
    if (!title.trim() || !description.trim() || !category || !type || !location.trim()) {
      setError("Add a title, category, engagement type, location, and description.");
      return;
    }

    const selectedCategory = category;
    const selectedType = type;
    const requirements = requirementsText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    setIsSubmitting(true);
    setError("");

    setTimeout(() => {
      const created = createOpportunity({
        title: title.trim(),
        category: selectedCategory,
        type: selectedType,
        location: location.trim(),
        description: description.trim(),
        requirements,
        requiredSkills: selectedSkills,
        deadline,
        contactPreference: contactPreference.trim(),
        status: "Published",
      });

      setIsSubmitting(false);
      router.push(`/opportunities/${created.id}`);
    }, 400);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    publishOpportunity();
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/opportunities" className="inline-flex items-center gap-1.5 rounded-md text-label-xs text-text-sub-600 transition-colors hover:text-text-strong-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base/40">
          <ArrowLeftIcon size={16} weight="regular" aria-hidden="true" />
          Back to Opportunities
        </Link>
        <Button type="button" variant="ghost" size="sm" icon={<EyeIcon size={16} />} onClick={() => setIsPreview((current) => !current)}>
          {isPreview ? "Edit details" : "Preview"}
        </Button>
      </div>

      <PageHeader title="Share an opportunity" description="Add the information members need to understand the role and take action." />

      {error && <div role="alert" className="rounded-10 border border-error-light bg-error-lighter p-3 text-paragraph-xs font-medium text-error-dark">{error}</div>}

      {isPreview ? (
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <article className="overflow-hidden rounded-10 border border-stroke-soft-200 bg-bg-white-0 shadow-regular-xs">
            <div className="border-b border-stroke-soft-200 px-5 py-5 sm:px-6">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="primary">{category || "Category"}</Badge>
                <Badge variant="neutral"><MapPinIcon size={12} aria-hidden="true" />{location || "Location"}</Badge>
                <Badge variant="outline">{type || "Engagement type"}</Badge>
              </div>
              <h2 className="text-title-h6 text-text-strong-950">{title || "Untitled opportunity"}</h2>
            </div>
            <div className="space-y-5 px-5 py-5 sm:px-6">
              <section>
                <h3 className="text-label-sm text-text-strong-950">Description</h3>
                <p className="mt-2 whitespace-pre-line text-paragraph-sm leading-6 text-text-sub-600">{description || "No description has been added."}</p>
              </section>
              <section className="border-t border-stroke-soft-200 pt-5">
                <h3 className="text-label-sm text-text-strong-950">Requirements</h3>
                {requirementsText.trim() ? (
                  <ul className="mt-2 space-y-2 text-paragraph-sm text-text-sub-600">
                    {requirementsText.split("\n").filter(Boolean).map((requirement) => <li key={requirement}>{requirement}</li>)}
                  </ul>
                ) : (
                  <p className="mt-2 text-paragraph-sm text-text-soft-400">No requirements listed.</p>
                )}
              </section>
            </div>
          </article>

          <aside className="rounded-10 border border-stroke-soft-200 bg-bg-white-0 p-5 shadow-regular-xs">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-label-sm text-text-strong-950">Preview status</h3>
              <Badge variant={title && description && category && type && location ? "success" : "neutral"}>{title && description && category && type && location ? "Ready" : "Incomplete"}</Badge>
            </div>
            <dl className="mt-4 space-y-3 text-paragraph-xs">
              <div><dt className="text-text-soft-400">Deadline</dt><dd className="mt-0.5 font-medium text-text-strong-950">{deadline || "Open until filled"}</dd></div>
              <div><dt className="text-text-soft-400">Skills</dt><dd className="mt-0.5 font-medium text-text-strong-950">{selectedSkills.length ? `${selectedSkills.length} selected` : "None selected"}</dd></div>
              <div><dt className="text-text-soft-400">How to apply</dt><dd className="mt-0.5 font-medium text-text-strong-950">{contactPreference || "Not specified"}</dd></div>
            </dl>
            <Button variant="primary" size="sm" onClick={publishOpportunity} isLoading={isSubmitting} className="mt-5 w-full">
              <PaperPlaneTiltIcon size={15} aria-hidden="true" />Publish Opportunity
            </Button>
          </aside>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="overflow-visible rounded-10 border border-stroke-soft-200 bg-bg-white-0 shadow-regular-xs">
          <FormSection title="Basic information" description="Keep the title specific and easy to scan.">
            <Input label="Opportunity title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Senior Next.js developer for fintech project" required />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select label="Category" value={category} onValueChange={(value) => setCategory(value as OpportunityCategory)} items={CATEGORIES.map((item) => ({ label: item, value: item }))} placeholder="Select category" required />
              <Select label="Engagement type" value={type} onValueChange={(value) => setType(value as OpportunityType)} items={TYPES.map((item) => ({ label: item, value: item }))} placeholder="Select engagement" required />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Location" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Jakarta, hybrid, or remote" required />
              <DatePicker label="Application deadline" name="deadline" value={deadline} onChange={setDeadline} min={new Date().toISOString().slice(0, 10)} helperText="Optional" />
            </div>
          </FormSection>

          <FormSection title="Role details" description="Explain the scope before listing requirements.">
            <Textarea label="Description and scope" rows={5} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the project, responsibilities, timeline, and compensation." required />
            <Textarea label="Requirements" rows={4} value={requirementsText} onChange={(event) => setRequirementsText(event.target.value)} placeholder="Add one requirement per line" helperText="Optional. Use one requirement per line." />
          </FormSection>

          <FormSection title="Required skills" description="Select only the skills essential to this opportunity.">
            <div className="flex flex-wrap gap-2">
              {POPULAR_SKILLS.map((skill) => {
                const selected = selectedSkills.includes(skill);
                return (
                  <button key={skill} type="button" aria-pressed={selected} onClick={() => handleToggleSkill(skill)} className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-label-sm shadow-custom-input transition-[background-color,color,box-shadow,transform] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base/40 ${selected ? "bg-primary-base text-static-white" : "bg-bg-white-0 text-text-sub-600 hover:bg-bg-weak-25"}`}>
                    {selected && <CheckIcon size={14} weight="bold" aria-hidden="true" />}
                    {skill}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input aria-label="Add another skill" value={customSkill} onChange={(event) => setCustomSkill(event.target.value)} placeholder="Add another skill" className="flex-1" />
              <Button type="button" variant="secondary" size="md" icon={<PlusIcon size={15} />} onClick={handleAddCustomSkill}>Add skill</Button>
            </div>
            <p className="text-paragraph-xs text-text-sub-600">{selectedSkills.length ? `${selectedSkills.length} skill${selectedSkills.length === 1 ? "" : "s"} selected` : "No skills selected yet."}</p>
          </FormSection>

          <FormSection title="Application" description="Tell members how they should contact you.">
            <Input label="How to apply" value={contactPreference} onChange={(event) => setContactPreference(event.target.value)} placeholder="Direct message, email, or application link" helperText="Include the preferred channel or a complete URL." />
          </FormSection>

          <FormActions className="justify-between">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsPreview(true)} icon={<EyeIcon size={15} />}>Preview</Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting} icon={<PaperPlaneTiltIcon size={15} />}>Publish Opportunity</Button>
          </FormActions>
        </form>
      )}
    </div>
  );
}
