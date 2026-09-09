"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store/AppContext";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Modal, ConfirmModal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
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
  const [successModal, setSuccessModal] = useState<{ title: string; desc: string } | null>(null);

  const [name, setName] = useState(currentUser?.name || "");
  const [avatar, setAvatar] = useState(currentUser?.avatar || "");
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
    setEditingSection(null);
    setSuccessModal({ title: "Profile updated", desc: "Your profile changes have been saved." });
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
    !currentUser.bio && { label: "Add a bio", action: () => { document.getElementById("profile-about")?.scrollIntoView({ behavior: "smooth", block: "center" }); setEditingSection("personal"); } },
    currentUser.skills.length < 3 && { label: "Add at least 3 skills", action: () => { document.getElementById("profile-skills")?.scrollIntoView({ behavior: "smooth", block: "center" }); setEditingSection("skills"); } },
    !currentUser.linkedin && !currentUser.portfolio && !currentUser.website && { label: "Add a social link", action: () => { document.getElementById("profile-social")?.scrollIntoView({ behavior: "smooth", block: "center" }); setEditingSection("links"); } },
  ].filter(Boolean) as { label: string; action: () => void }[];

  return (
    <div className="mx-auto max-w-[1120px] space-y-6">
      {/* HERO */}
      <div className="overflow-hidden rounded-10 border border-stroke-soft-200 bg-bg-white-0 shadow-regular-xs">
        <div className="h-24 w-full bg-bg-weak-50 sm:h-32" />
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            {/* Left: avatar + identity */}
            <div className="flex gap-5 sm:gap-6">
              <div className="relative shrink-0 -mt-12 sm:-mt-16">
                <div className="flex size-20 items-center justify-center rounded-20 bg-bg-weak-50 text-xl font-semibold text-text-strong-950 ring-4 ring-bg-white-0 shadow-regular-xs sm:size-24 sm:text-2xl">
                  {currentUser.name.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase()}
                </div>
              </div>

              <div className="min-w-0 flex-1 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-page-title text-text-strong-950">{currentUser.name?.split(" ")[0] || "Ammar"}</h1>
                  <StatusBadge status={currentUser.status} />
                </div>
                <p className="mt-1.5 text-base font-medium leading-6 text-text-strong-950">{headline}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-normal leading-5 text-text-sub-600">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPinIcon size={14} weight="regular" className="text-text-soft-400" aria-hidden="true" />
                    {currentUser.location || "Jakarta, Indonesia"}
                  </span>
                  <span className="size-1 rounded-full bg-stroke-soft-200" aria-hidden="true" />
                  <span className="inline-flex items-center gap-1.5">
                    <StackIcon size={14} weight="regular" className="text-text-soft-400" aria-hidden="true" />
                    {currentUser.batch || "Batch 1"}
                  </span>
                  <span className="hidden sm:inline-flex size-1 rounded-full bg-stroke-soft-200" aria-hidden="true" />
                </div>
                <p className="mt-1 hidden sm:inline-flex items-center gap-1.5 text-xs text-text-sub-600">
                  <span className="flex size-4 items-center justify-center rounded-full bg-success-base text-static-white">
                    <CheckIcon size={10} weight="bold" aria-hidden="true" />
                  </span>
                  {currentUser.email}
                </p>
              </div>
            </div>

            {/* Right: completion card */}
            <div className="w-full rounded-10 border border-stroke-soft-200 bg-bg-weak-50 p-5 lg:w-[320px] lg:shrink-0">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold tracking-wide text-text-sub-600">Profile completion</p>
                <span className="text-sm font-semibold text-text-strong-950">{completion}%</span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-bg-white-0 ring-1 ring-stroke-soft-200">
                <div className="h-full rounded-full bg-primary-base transition-[width] duration-500" style={{ width: `${completion}%` }} />
              </div>
              {missingSteps.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {missingSteps.slice(0, 3).map((s) => (
                    <li key={s.label}>
                      <button onClick={s.action} className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-text-sub-600 hover:bg-bg-white-0 hover:text-text-strong-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base">
                        <span className="flex size-4 shrink-0 items-center justify-center rounded-full border border-stroke-soft-200 bg-bg-white-0">
                          <span className="size-1.5 rounded-full bg-stroke-soft-200" />
                        </span>
                        {s.label}
                        <ArrowRightIcon size={12} weight="regular" className="ml-auto text-text-soft-400" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Actions bar */}
          <div className="mt-6 flex flex-row items-stretch gap-3 border-t border-stroke-soft-200 pt-6 sm:items-center">
            <Button variant="primary" size="md" title="Edit profile" aria-label="Edit profile" className="min-w-0 flex-1 justify-center px-3 sm:flex-none sm:px-5" onClick={() => setEditingSection("personal")} icon={<PencilSimpleIcon size={16} weight="regular" />}>
              Edit profile
            </Button>
            <Button variant="outline" size="md" title="Share profile" aria-label="Share profile" className="min-w-0 flex-1 justify-center bg-bg-white-0 px-3 sm:flex-none sm:px-5" onClick={() => setShowShareModal(true)} icon={<ShareNetworkIcon size={16} weight="regular" />}>
              Share profile
            </Button>
            <span className="ml-auto hidden items-center gap-2 text-xs text-text-soft-400 sm:inline-flex">
              <EnvelopeSimpleIcon size={14} aria-hidden="true" /> {currentUser.email}
            </span>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <div id="profile-about" className="rounded-10 border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs sm:p-7">
        <div className="flex items-center justify-between">
          <h2 className="text-section-title text-text-strong-950">About</h2>
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
            <Button variant="outline" size="sm" className="bg-bg-white-0" onClick={() => setEditingSection("personal")}>
              <PencilSimpleIcon size={12} weight="regular" className="mr-1" />
              Edit
            </Button>
          )}
        </div>

        {editingSection === "personal" ? (
          <div className="mt-4 space-y-4">
            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <div className="space-y-2">
              <Input label="Profile Photo URL" value={avatar} onChange={(e) => setAvatar(e.target.value)} />
              <label className="flex items-center gap-2 text-xs font-medium text-primary-base hover:underline cursor-pointer">
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (!["image/jpeg","image/png","image/webp"].includes(file.type)) {
                    addToast("Invalid file", "Only JPG, PNG, WebP allowed", "error");
                    return;
                  }
                  if (file.size > 2 * 1024 * 1024) {
                    addToast("File too large", "Max 2MB", "error");
                    return;
                  }
                  const r = new FileReader();
                  r.onload = () => setAvatar(r.result as string);
                  r.readAsDataURL(file);
                }} />
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-alpha-10 px-2.5 py-1 text-xs font-medium text-primary-base ring-1 ring-primary-base/20">Upload image (max 2MB)</span>
                <span className="text-text-soft-400">or paste URL</span>
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
              <Input label="Batch" value={batch} onChange={(e) => setBatch(e.target.value)} />
            </div>
            <Textarea label="Bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell the community who you are…" />
          </div>
        ) : (
          <div className="mt-3">
            <p className={`text-body text-text-sub-600 ${!showFullBio && isLongBio ? "line-clamp-3" : ""}`}>{displayBio}</p>
            {isLongBio && (
              <button onClick={() => setShowFullBio(!showFullBio)} className="mt-2 text-sm font-medium text-primary-base hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base">
                {showFullBio ? "Show less" : "Read more"}
              </button>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-weak-50 px-3 py-1.5 text-[13px] font-medium leading-5 text-text-strong-950 ring-1 ring-stroke-soft-200">
                <BriefcaseIcon size={12} weight="regular" aria-hidden="true" /> {currentUser.experience || "3+ years"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-weak-50 px-3 py-1.5 text-[13px] font-medium leading-5 text-text-strong-950 ring-1 ring-stroke-soft-200">
                <GlobeIcon size={12} weight="regular" aria-hidden="true" /> {currentUser.industry || "Technology"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-weak-50 px-3 py-1.5 text-[13px] font-medium leading-5 text-text-strong-950 ring-1 ring-stroke-soft-200">
                <CalendarIcon size={12} weight="regular" aria-hidden="true" /> Joined {currentUser.batch || "Batch 1"}
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
          <div className="rounded-10 border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs sm:p-7">
            <div className="flex items-center justify-between">
              <h2 className="inline-flex items-center gap-2 text-section-title text-text-strong-950">
                <BriefcaseIcon size={16} weight="regular" className="text-text-soft-400" aria-hidden="true" />
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
                <Button variant="outline" size="sm" className="bg-bg-white-0" onClick={() => setEditingSection("professional")}>
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
                <div className="rounded-10 bg-bg-weak-50 p-4 ring-1 ring-stroke-soft-200">
                  <p className="text-xs font-medium text-text-sub-600">Role</p>
                  <p className="mt-1 text-sm font-semibold text-text-strong-950">{currentUser.role || "—"}</p>
                  <p className="text-xs text-text-sub-600">{currentUser.company || "—"}</p>
                </div>
                <div className="rounded-10 bg-bg-weak-50 p-4 ring-1 ring-stroke-soft-200">
                  <p className="text-xs font-medium text-text-sub-600">Focus</p>
                  <p className="mt-1 text-sm font-semibold text-text-strong-950">{currentUser.industry}</p>
                  <p className="text-xs text-text-sub-600">{currentUser.experience}</p>
                </div>
              </div>
            )}
          </div>

          {/* Skills */}
          <div id="profile-skills" className="rounded-10 border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs sm:p-7">
            <div className="flex items-center justify-between">
              <h2 className="inline-flex items-center gap-2 text-section-title text-text-strong-950">
                <StackIcon size={16} weight="regular" className="text-text-soft-400" aria-hidden="true" />
                Skills
                <span className="ml-1 rounded-md bg-bg-weak-50 px-1.5 py-0.5 text-xs font-medium text-text-sub-600 ring-1 ring-stroke-soft-200">{skills.length}</span>
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
                <Button variant="outline" size="sm" className="bg-bg-white-0" onClick={() => setEditingSection("skills")}>
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
                          isSelected ? "bg-primary-base text-static-white ring-primary-base" : "bg-bg-white-0 text-text-sub-600 ring-stroke-soft-200 hover:bg-bg-weak-50"
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
                    <span key={sk} className="inline-flex items-center rounded-full bg-bg-white-0 px-3 py-1.5 text-[13px] font-medium leading-5 text-text-strong-950 ring-1 ring-stroke-soft-200">
                      {sk}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-text-sub-600">Add skills to help others find you. Try “Design Systems”, “React”, “Finance”.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right 4 */}
        <div className="space-y-6 lg:col-span-4">
          {/* Availability */}
          <div className="rounded-10 border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs">
            <div className="flex items-center justify-between">
              <h3 className="inline-flex items-center gap-2 text-card-title text-text-strong-950">
                <ShieldIcon size={16} weight="regular" className="text-text-soft-400" aria-hidden="true" />
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
                <Button variant="outline" size="sm" className="bg-bg-white-0" onClick={() => setEditingSection("availability")}>
                  <PencilSimpleIcon size={12} weight="regular" className="mr-1" />
                  Edit
                </Button>
              )}
            </div>

            {editingSection === "availability" ? (
              <div className="mt-4 space-y-4">
                <Select label="Current Status" value={status} onValueChange={(v) => setStatus(v as UserStatus)} items={["Available to Help", "Open to Work", "Open to Collaboration", "Hiring"].map((v) => ({ label: v, value: v }))} />
                <div>
                  <label className="mb-2 block text-xs font-semibold text-text-sub-600">Looking For</label>
                  <div className="flex flex-wrap gap-2">
                    {LOOKING_FOR_OPTIONS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleToggleLooking(item)}
                        className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium ring-1 transition-colors ${
                          lookingFor.includes(item) ? "bg-primary-base text-static-white ring-primary-base" : "bg-bg-white-0 text-text-sub-600 ring-stroke-soft-200"
                        }`}
                      >
                        {lookingFor.includes(item) && <CheckIcon size={12} weight="bold" />}
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold text-text-sub-600">Can Offer</label>
                  <div className="flex flex-wrap gap-2">
                    {CAN_OFFER_OPTIONS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleToggleOffer(item)}
                        className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium ring-1 transition-colors ${
                          canOffer.includes(item) ? "bg-primary-base text-static-white ring-primary-base" : "bg-bg-white-0 text-text-sub-600 ring-stroke-soft-200"
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
                  <p className="text-xs font-medium text-text-sub-600">Status</p>
                  <div className="mt-1.5">
                    <StatusBadge status={currentUser.status} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-text-sub-600">Looking for</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {currentUser.lookingFor?.length ? currentUser.lookingFor.map((l) => <Badge key={l} variant="secondary" className="bg-bg-weak-50">{l}</Badge>) : <span className="text-xs text-text-soft-400">—</span>}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-text-sub-600">Can offer</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {currentUser.canOffer?.length ? currentUser.canOffer.map((c) => <Badge key={c} variant="secondary" className="bg-bg-weak-50">{c}</Badge>) : <span className="text-xs text-text-soft-400">—</span>}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Social */}
          <div id="profile-social" className="rounded-10 border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs">
            <div className="flex items-center justify-between">
              <h3 className="inline-flex items-center gap-2 text-card-title text-text-strong-950">
                <GlobeIcon size={16} weight="regular" className="text-text-soft-400" aria-hidden="true" />
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
                <Button variant="outline" size="sm" className="bg-bg-white-0" onClick={() => setEditingSection("links")}>
                  <PencilSimpleIcon size={12} weight="regular" className="mr-1" />
                  Edit
                </Button>
              )}
            </div>

            {editingSection === "links" ? (
              <div className="mt-4 space-y-4">
                <Input label="LinkedIn URL" type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/your-name…" />
                <Input label="Portfolio URL" type="url" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} placeholder="https://portfolio.example…" />
                <Input label="Website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yourwebsite.example…" />
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                {currentUser.linkedin && (
                  <a href={currentUser.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl bg-bg-weak-50 p-3 ring-1 ring-stroke-soft-200 hover:bg-bg-white-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-text-strong-950">
                      <GlobeIcon size={14} aria-hidden="true" /> LinkedIn
                    </span>
                    <ArrowRightIcon size={14} className="text-text-soft-400" aria-hidden="true" />
                  </a>
                )}
                {currentUser.portfolio && (
                  <a href={currentUser.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl bg-bg-weak-50 p-3 ring-1 ring-stroke-soft-200 hover:bg-bg-white-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-text-strong-950">
                      <GlobeIcon size={14} aria-hidden="true" /> Portfolio
                    </span>
                    <ArrowRightIcon size={14} className="text-text-soft-400" aria-hidden="true" />
                  </a>
                )}
                {currentUser.website && (
                  <a href={currentUser.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl bg-bg-weak-50 p-3 ring-1 ring-stroke-soft-200 hover:bg-bg-white-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-text-strong-950">
                      <GlobeIcon size={14} aria-hidden="true" /> Website
                    </span>
                    <ArrowRightIcon size={14} className="text-text-soft-400" aria-hidden="true" />
                  </a>
                )}
                {!currentUser.linkedin && !currentUser.portfolio && !currentUser.website && <p className="text-sm text-text-sub-600">No links yet. Add LinkedIn or portfolio to get discovered.</p>}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Danger zone — subtle */}
      <div className="flex flex-col gap-4 rounded-20 border border-error-light bg-error-lighter px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
        <div className="min-w-0">
          <p className="text-card-title font-bold text-error-dark">Danger zone</p>
          <p className="max-w-prose text-[13px] leading-5 text-error-base">Export or delete your profile data.</p>
        </div>
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center">
          <Button variant="outline" size="sm" title="Export data" aria-label="Export data" className="w-full bg-bg-white-0 sm:w-auto" onClick={() => addToast("Coming soon", "Data export not yet implemented", "info")} icon={<DownloadSimpleIcon size={16} weight="regular" />}>
            Export Data
          </Button>
          <Button variant="danger" size="sm" title="Delete profile" aria-label="Delete profile" className="w-full sm:w-auto" onClick={() => addToast("Coming soon", "Account deletion not yet implemented", "info")} icon={<TrashSimpleIcon size={16} weight="regular" />}>
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

      <Modal
        isOpen={!!successModal}
        onClose={() => setSuccessModal(null)}
        title={successModal?.title || "Profile updated"}
        description={successModal?.desc || "Your profile changes have been saved."}
        icon="success"
        centered
        maxWidth="sm"
      >
        <div className="flex justify-center">
          <Button variant="primary" size="md" onClick={() => setSuccessModal(null)} className="px-6">
            Done
          </Button>
        </div>
      </Modal>

      {/* Share */}
      <Modal isOpen={showShareModal} onClose={() => setShowShareModal(false)} title="Share profile" description="Copy your profile link" centered maxWidth="sm">
        <div className="space-y-4">
          <div className="flex items-center justify-center py-2">
            <div className="flex size-12 items-center justify-center rounded-20 bg-bg-weak-50 ring-1 ring-stroke-soft-200">
              <ShareNetworkIcon size={20} weight="regular" className="text-text-strong-950" aria-hidden="true" />
            </div>
          </div>
          <div className="min-w-0 overflow-hidden rounded-10 bg-bg-weak-50 p-3 ring-1 ring-stroke-soft-200">
            <span className="block min-w-0 break-all text-sm leading-5 text-text-strong-950">{typeof window !== "undefined" ? window.location.href : ""}</span>
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
