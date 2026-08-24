"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store/AppContext";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Modal, ConfirmModal } from "@/components/ui/Modal";
import {
  UserIcon,
  BriefcaseIcon,
  StackIcon,
  MapPinIcon,
  GlobeIcon,
  ShieldIcon,
  PencilSimpleIcon,
  CheckIcon,
  SparkleIcon,
  LockSimpleIcon,
  PlusIcon,
  TrashSimpleIcon,
  DownloadSimpleIcon,
  CheckCircleIcon,
  ShareNetworkIcon,
  CalendarIcon,
  EnvelopeSimpleIcon,
  ArrowRightIcon,
  InfoIcon,
} from "@phosphor-icons/react";
import { UserStatus, LookingForOption, CanOfferOption } from "@/lib/types";

const ALL_SKILLS = [
  "UI/UX Design",
  "Design Systems",
  "User Research",
  "Product Design",
  "Software Development",
  "React / Next.js",
  "Node.js & Backend",
  "Python & AI / ML",
  "Mobile App (Flutter / React Native)",
  "Cloud & DevOps",
  "Business Development",
  "Product Management",
  "Entrepreneurship",
  "Marketing",
  "Brand Strategy",
  "Social Media Management",
  "Finance",
  "Accounting & Tax",
  "Venture Capital & Investment",
  "Photography",
  "Video Editing & Production",
  "Content Creation",
  "Teaching & Coaching",
];

const LOOKING_FOR_OPTIONS: LookingForOption[] = ["Open to Work", "Freelance", "Collaboration", "Mentorship", "Networking"];
const CAN_OFFER_OPTIONS: CanOfferOption[] = ["Consultation", "Mentoring", "Collaboration", "Hiring", "Professional Help"];

export default function MyProfilePage() {
  const { currentUser, updateProfile, addToast } = useApp();

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [saveModal, setSaveModal] = useState<{ open: boolean; section: string } | null>(null);
  const [showFullBio, setShowFullBio] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const [name, setName] = useState(currentUser?.name || "");
  const [location, setLocation] = useState(currentUser?.location || "");
  const [batch, setBatch] = useState(currentUser?.batch || "");
  const [role, setRole] = useState(currentUser?.role || "");
  const [company, setCompany] = useState(currentUser?.company || "");
  const [industry, setIndustry] = useState(currentUser?.industry || "Technology");
  const [experience, setExperience] = useState(currentUser?.experience || "3+ years");
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [skills, setSkills] = useState<string[]>(currentUser?.skills || []);
  const [customSkill, setCustomSkill] = useState("");
  const [status, setStatus] = useState<UserStatus>(currentUser?.status || "Available to Help");
  const [lookingFor, setLookingFor] = useState<LookingForOption[]>(currentUser?.lookingFor || []);
  const [canOffer, setCanOffer] = useState<CanOfferOption[]>(currentUser?.canOffer || []);
  const [linkedin, setLinkedin] = useState(currentUser?.linkedin || "");
  const [portfolio, setPortfolio] = useState(currentUser?.portfolio || "");
  const [website, setWebsite] = useState(currentUser?.website || "");

  if (!currentUser) return null;

  const handleSaveSection = (sectionName: string) => {
    updateProfile(currentUser.id, {
      name,
      location,
      batch,
      role,
      company,
      industry,
      experience,
      bio,
      skills,
      status,
      lookingFor,
      canOffer,
      linkedin,
      portfolio,
      website,
    });
    addToast("Saved", `${sectionName} updated successfully`, "success");
    setEditingSection(null);
  };

  const handleRequestSave = (sectionName: string) => setSaveModal({ open: true, section: sectionName });
  const handleConfirmSave = () => {
    if (saveModal) handleSaveSection(saveModal.section);
    setSaveModal(null);
  };

  const handleToggleSkill = (sk: string) => setSkills(skills.includes(sk) ? skills.filter((s) => s !== sk) : [...skills, sk]);
  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkill.trim() && !skills.includes(customSkill.trim())) {
      setSkills([...skills, customSkill.trim()]);
      setCustomSkill("");
    }
  };
  const handleToggleLooking = (item: LookingForOption) => setLookingFor(lookingFor.includes(item) ? lookingFor.filter((i) => i !== item) : [...lookingFor, item]);
  const handleToggleOffer = (item: CanOfferOption) => setCanOffer(canOffer.includes(item) ? canOffer.filter((i) => i !== item) : [...canOffer, item]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      addToast("Link copied", "Profile link ready to share", "success");
      setShowShareModal(false);
    }
  };

  const headline = currentUser.role && currentUser.company ? `${currentUser.role} · ${currentUser.industry}` : currentUser.role || "Product Designer · Fintech & SaaS";
  const displayBio =
    currentUser.bio ||
    "Product designer with 5+ years building fintech and SaaS products. Passionate about design systems, user research, and helping early-stage teams ship faster. Open to collaboration and mentoring.";
  const isLongBio = displayBio.length > 180;

  const completion = currentUser.profileCompletion || 42;
  const missingSteps = [
    !currentUser.bio && "Add a bio",
    currentUser.skills.length < 3 && "Add at least 3 skills",
    !currentUser.linkedin && !currentUser.portfolio && "Add a social link",
  ].filter(Boolean) as string[];

  return (
    <div className="mx-auto max-w-[1120px] space-y-6">
      {/* HERO */}
      <div className="overflow-hidden rounded-xl border border-kumo-line bg-white shadow-none">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            {/* Left: avatar + identity */}
            <div className="flex gap-5 sm:gap-6">
              <div className="relative shrink-0">
                <Avatar name={currentUser.name} className="size-20 rounded-2xl text-xl sm:size-24" />
              </div>

              <div className="min-w-0 flex-1 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[30px] font-bold leading-9 tracking-tight text-[#111827]">{currentUser.name?.split(" ")[0] || "Ammar"}</h1>
                </div>
                <p className="mt-1.5 text-base font-medium leading-6 text-zinc-700">{headline}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-normal leading-5 text-zinc-600">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPinIcon size={14} weight="regular" className="text-zinc-400" />
                    {currentUser.location || "Jakarta, Indonesia"}
                  </span>
                  <span className="size-1 rounded-full bg-zinc-300" />
                  <span className="inline-flex items-center gap-1.5">
                    <StackIcon size={14} weight="regular" className="text-zinc-400" />
                    {currentUser.batch || "Batch 1"}
                  </span>
                  <span className="hidden sm:inline-flex size-1 rounded-full bg-zinc-300" />
                </div>
                <p className="mt-1 hidden sm:block text-xs text-zinc-400">{currentUser.email}</p>
              </div>
            </div>

            {/* Right: completion card */}
            <div className="w-full rounded-xl border border-kumo-line bg-kumo-tint p-5 lg:w-[320px] lg:shrink-0">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold tracking-wide text-zinc-500">Profile completion</p>
                <span className="text-sm font-semibold text-[#111827]">{completion}%</span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white ring-1 ring-zinc-200">
                <div className="h-full rounded-full bg-[#2563EB] transition-[width] duration-500" style={{ width: `${completion}%` }} />
              </div>
              {missingSteps.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {missingSteps.slice(0, 3).map((s) => (
                    <li key={s} className="flex items-center gap-2 text-xs text-zinc-600">
                      <span className="flex size-4 items-center justify-center rounded-full border border-zinc-200 bg-white">
                        <span className="size-1.5 rounded-full bg-zinc-300" />
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Actions bar */}
          <div className="mt-6 flex flex-row items-stretch gap-3 border-t border-zinc-100 pt-6 sm:items-center">
            <Button variant="primary" size="md" mobileIconOnly title="Edit profile" aria-label="Edit profile" className="min-w-0 flex-1 justify-center px-3 sm:flex-none sm:px-5" onClick={() => setEditingSection("personal")} icon={<PencilSimpleIcon size={16} weight="regular" />}>
              Edit profile
            </Button>
            <Button variant="outline" size="md" mobileIconOnly title="Share profile" aria-label="Share profile" className="min-w-0 flex-1 justify-center bg-white px-3 sm:flex-none sm:px-5" onClick={() => setShowShareModal(true)} icon={<ShareNetworkIcon size={16} weight="regular" />}>
              Share profile
            </Button>
            <span className="ml-auto hidden items-center gap-2 text-xs text-zinc-400 sm:inline-flex">
              <EnvelopeSimpleIcon size={14} /> {currentUser.email}
            </span>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <div className="rounded-xl border border-kumo-line bg-white p-6 shadow-none sm:p-7">
        <div className="flex items-center justify-between">
          <h2 className="text-[19px] font-bold leading-7 tracking-tight text-[#111827]">About</h2>
          {editingSection === "personal" ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditingSection(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={() => handleRequestSave("personal")}>
                <CheckCircleIcon size={12} weight="fill" className="mr-1" />
                Save
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="bg-white" onClick={() => setEditingSection("personal")}>
              <PencilSimpleIcon size={12} weight="regular" className="mr-1" />
              Edit
            </Button>
          )}
        </div>

        {editingSection === "personal" ? (
          <div className="mt-4 space-y-4">
            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
              <Input label="Batch" value={batch} onChange={(e) => setBatch(e.target.value)} />
            </div>
            <Textarea label="Bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell the community who you are…" />
          </div>
        ) : (
          <div className="mt-3">
            <p className={`text-[14px] leading-6 text-zinc-600 ${!showFullBio && isLongBio ? "line-clamp-3" : ""}`}>{displayBio}</p>
            {isLongBio && (
              <button onClick={() => setShowFullBio(!showFullBio)} className="mt-2 text-sm font-medium text-[#2563EB] hover:underline">
                {showFullBio ? "Show less" : "Read more"}
              </button>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-3 py-1.5 text-[13px] font-medium leading-5 text-zinc-700 ring-1 ring-zinc-200">
                <BriefcaseIcon size={12} weight="regular" /> {currentUser.experience || "3+ years"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-3 py-1.5 text-[13px] font-medium leading-5 text-zinc-700 ring-1 ring-zinc-200">
                <GlobeIcon size={12} weight="regular" /> {currentUser.industry || "Technology"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-3 py-1.5 text-[13px] font-medium leading-5 text-zinc-700 ring-1 ring-zinc-200">
                <CalendarIcon size={12} weight="regular" /> Joined {currentUser.batch || "Batch 1"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* TWO COLUMN */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left 8 */}
        <div className="space-y-6 lg:col-span-8">
          {/* Professional */}
          <div className="rounded-xl border border-kumo-line bg-white p-6 shadow-none sm:p-7">
            <div className="flex items-center justify-between">
              <h2 className="inline-flex items-center gap-2 text-[19px] font-bold leading-7 text-[#111827]">
                <BriefcaseIcon size={16} weight="regular" className="text-zinc-400" />
                Professional
              </h2>
              {editingSection === "professional" ? (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setEditingSection(null)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => handleRequestSave("professional")}>
                    <CheckCircleIcon size={12} weight="fill" className="mr-1" />
                    Save
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" className="bg-white" onClick={() => setEditingSection("professional")}>
                  <PencilSimpleIcon size={12} weight="regular" className="mr-1" />
                  Edit
                </Button>
              )}
            </div>

            {editingSection === "professional" ? (
              <div className="mt-4 space-y-4">
                <Input label="Role" value={role} onChange={(e) => setRole(e.target.value)} />
                <Input label="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select label="Industry" value={industry} onValueChange={(v) => setIndustry(v)} items={["Technology", "Design", "Marketing", "Business", "Finance", "Media & Creative", "Education", "Healthcare", "Other"].map((v) => ({ label: v, value: v }))} />
                  <Select label="Experience" value={experience} onValueChange={(v) => setExperience(v)} items={["0-1 years", "1-3 years", "3-5 years", "5-10 years", "10+ years"].map((v) => ({ label: v, value: v }))} />
                </div>
                <Textarea label="Bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
                  <p className="text-xs font-medium text-zinc-500">Role</p>
                  <p className="mt-1 text-sm font-semibold text-[#111827]">{currentUser.role || "—"}</p>
                  <p className="text-xs text-zinc-500">{currentUser.company || "—"}</p>
                </div>
                <div className="rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
                  <p className="text-xs font-medium text-zinc-500">Focus</p>
                  <p className="mt-1 text-sm font-semibold text-[#111827]">{currentUser.industry}</p>
                  <p className="text-xs text-zinc-500">{currentUser.experience}</p>
                </div>
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="rounded-xl border border-kumo-line bg-white p-6 shadow-none sm:p-7">
            <div className="flex items-center justify-between">
              <h2 className="inline-flex items-center gap-2 text-[19px] font-bold leading-7 text-[#111827]">
                <StackIcon size={16} weight="regular" className="text-zinc-400" />
                Skills
                <span className="ml-1 rounded-md bg-zinc-100 px-1.5 py-0.5 text-xs font-medium text-zinc-600">{skills.length}</span>
              </h2>
              {editingSection === "skills" ? (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setEditingSection(null)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => handleRequestSave("skills")}>
                    <CheckCircleIcon size={12} weight="fill" className="mr-1" />
                    Save
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" className="bg-white" onClick={() => setEditingSection("skills")}>
                  <PencilSimpleIcon size={12} weight="regular" className="mr-1" />
                  Edit
                </Button>
              )}
            </div>

            {editingSection === "skills" ? (
              <div className="mt-4 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {ALL_SKILLS.map((sk) => {
                    const isSelected = skills.includes(sk);
                    return (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => handleToggleSkill(sk)}
                        className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium ring-1 transition-colors ${
                          isSelected ? "bg-[#111827] text-white ring-[#111827]" : "bg-white text-zinc-600 ring-zinc-200 hover:bg-zinc-50"
                        }`}
                      >
                        {isSelected ? <CheckIcon size={12} weight="bold" /> : <PlusIcon size={10} weight="regular" />}
                        {sk}
                      </button>
                    );
                  })}
                </div>
                <form onSubmit={handleAddCustomSkill} className="flex gap-2">
                  <Input name="custom-skill" aria-label="Add custom skill" value={customSkill} onChange={(e) => setCustomSkill(e.target.value)} placeholder="Add custom skill…" className="flex-1" />
                  <Button type="submit" variant="secondary" size="sm" disabled={!customSkill.trim()}>
                    Add
                  </Button>
                </form>
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2">
                {skills.length ? (
                  skills.map((sk) => (
                    <span key={sk} className="inline-flex items-center rounded-full bg-white px-3 py-1.5 text-[13px] font-medium leading-5 text-zinc-700 ring-1 ring-zinc-200">
                      {sk}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500">Add skills to help others find you. Try “Design Systems”, “React”, “Finance”.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right 4 */}
        <div className="space-y-6 lg:col-span-4">
          {/* Availability */}
          <div className="rounded-xl border border-kumo-line bg-white p-6 shadow-none">
            <div className="flex items-center justify-between">
              <h3 className="inline-flex items-center gap-2 text-[19px] font-bold leading-7 text-[#111827]">
                <ShieldIcon size={16} weight="regular" className="text-zinc-400" />
                Availability
              </h3>
              {editingSection === "availability" ? (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setEditingSection(null)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => handleRequestSave("availability")}>
                    Save
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" className="bg-white" onClick={() => setEditingSection("availability")}>
                  <PencilSimpleIcon size={12} weight="regular" className="mr-1" />
                  Edit
                </Button>
              )}
            </div>

            {editingSection === "availability" ? (
              <div className="mt-4 space-y-4">
                <Select label="Current Status" value={status} onValueChange={(v) => setStatus(v as UserStatus)} items={["Available to Help", "Open to Work", "Open to Collaboration", "Hiring"].map((v) => ({ label: v, value: v }))} />
                <div>
                  <label className="mb-2 block text-xs font-semibold text-zinc-500">Looking For</label>
                  <div className="flex flex-wrap gap-2">
                    {LOOKING_FOR_OPTIONS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleToggleLooking(item)}
                        className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium ring-1 transition-colors ${
                          lookingFor.includes(item) ? "bg-[#111827] text-white ring-[#111827]" : "bg-white text-zinc-600 ring-zinc-200"
                        }`}
                      >
                        {lookingFor.includes(item) && <CheckIcon size={12} weight="bold" />}
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold text-zinc-500">Can Offer</label>
                  <div className="flex flex-wrap gap-2">
                    {CAN_OFFER_OPTIONS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleToggleOffer(item)}
                        className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium ring-1 transition-colors ${
                          canOffer.includes(item) ? "bg-[#111827] text-white ring-[#111827]" : "bg-white text-zinc-600 ring-zinc-200"
                        }`}
                      >
                        {canOffer.includes(item) && <CheckIcon size={12} weight="bold" />}
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs font-medium text-zinc-500">Status</p>
                  <div className="mt-1.5">
                    <StatusBadge status={currentUser.status} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-500">Looking for</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {currentUser.lookingFor?.length ? currentUser.lookingFor.map((l) => <Badge key={l} variant="secondary" className="bg-zinc-50">{l}</Badge>) : <span className="text-xs text-zinc-400">—</span>}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-500">Can offer</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {currentUser.canOffer?.length ? currentUser.canOffer.map((c) => <Badge key={c} variant="secondary" className="bg-zinc-50">{c}</Badge>) : <span className="text-xs text-zinc-400">—</span>}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Social */}
          <div className="rounded-xl border border-kumo-line bg-white p-6 shadow-none">
            <div className="flex items-center justify-between">
              <h3 className="inline-flex items-center gap-2 text-[19px] font-bold leading-7 text-[#111827]">
                <GlobeIcon size={16} weight="regular" className="text-zinc-400" />
                Social
              </h3>
              {editingSection === "links" ? (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setEditingSection(null)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => handleRequestSave("links")}>
                    Save
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" className="bg-white" onClick={() => setEditingSection("links")}>
                  <PencilSimpleIcon size={12} weight="regular" className="mr-1" />
                  Edit
                </Button>
              )}
            </div>

            {editingSection === "links" ? (
              <div className="mt-4 space-y-4">
                <Input label="LinkedIn URL" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." />
                <Input label="Portfolio URL" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} placeholder="https://..." />
                <Input label="Website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                {currentUser.linkedin && (
                  <a href={currentUser.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl bg-zinc-50 p-3 ring-1 ring-zinc-200 hover:bg-white transition-colors">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700">
                      <GlobeIcon size={14} /> LinkedIn
                    </span>
                    <ArrowRightIcon size={14} className="text-zinc-400" />
                  </a>
                )}
                {currentUser.portfolio && (
                  <a href={currentUser.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl bg-zinc-50 p-3 ring-1 ring-zinc-200 hover:bg-white transition-colors">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700">
                      <GlobeIcon size={14} /> Portfolio
                    </span>
                    <ArrowRightIcon size={14} className="text-zinc-400" />
                  </a>
                )}
                {currentUser.website && (
                  <a href={currentUser.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl bg-zinc-50 p-3 ring-1 ring-zinc-200 hover:bg-white transition-colors">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700">
                      <GlobeIcon size={14} /> Website
                    </span>
                    <ArrowRightIcon size={14} className="text-zinc-400" />
                  </a>
                )}
                {!currentUser.linkedin && !currentUser.portfolio && !currentUser.website && <p className="text-sm text-zinc-500">No links yet. Add LinkedIn or portfolio to get discovered.</p>}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Danger zone — subtle */}
      <div className="flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
        <div className="min-w-0">
          <p className="text-[19px] font-bold leading-7 text-red-700">Danger zone</p>
          <p className="max-w-prose text-[13px] leading-5 text-red-600">Export or delete your profile data.</p>
        </div>
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center">
          <Button variant="outline" size="sm" mobileIconOnly title="Export data" aria-label="Export data" className="w-full bg-white sm:w-auto" onClick={() => addToast("Coming soon", "Data export not yet implemented", "info")} icon={<DownloadSimpleIcon size={16} weight="regular" />}>
            Export Data
          </Button>
          <Button variant="danger" size="sm" mobileIconOnly title="Delete profile" aria-label="Delete profile" className="w-full sm:w-auto" onClick={() => addToast("Coming soon", "Account deletion not yet implemented", "info")} icon={<TrashSimpleIcon size={16} weight="regular" />}>
            Delete
          </Button>
        </div>
      </div>

      {/* Confirm save */}
      <ConfirmModal
        isOpen={!!saveModal}
        onClose={() => setSaveModal(null)}
        onConfirm={handleConfirmSave}
        title="Save Changes?"
        description="Your changes will be saved and visible to the community."
        icon="question"
        confirmText="Save Changes"
        cancelText="Cancel"
        variant="primary"
      />

      {/* Share */}
      <Modal isOpen={showShareModal} onClose={() => setShowShareModal(false)} title="Share profile" description="Copy your profile link" icon="info" maxWidth="sm">
        <div className="space-y-4">
          <div className="flex items-center justify-center py-2">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-zinc-50 ring-1 ring-zinc-200">
              <ShareNetworkIcon size={20} weight="regular" className="text-zinc-700" />
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-zinc-50 p-3 ring-1 ring-zinc-200">
            <span className="min-w-0 flex-1 truncate text-sm text-zinc-700">{typeof window !== "undefined" ? window.location.href : ""}</span>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="md" onClick={() => setShowShareModal(false)} className="px-5">
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={handleCopyLink} className="px-5">
              Copy Link
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Select({
  label,
  value,
  onValueChange,
  items,
}: {
  label: string;
  value: string;
  onValueChange: (v: string) => void;
  items: { label: string; value: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-zinc-500">{label}</label>
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="w-full h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-[#111827] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
      >
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
