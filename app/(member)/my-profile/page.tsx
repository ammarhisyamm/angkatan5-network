"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store/AppContext";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
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
  XIcon,
  SparkleIcon,
  LockSimpleIcon,
  EyeIcon,
  PlusIcon,
  TrashSimpleIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react";
import { UserStatus, LookingForOption, CanOfferOption, UserVisibility } from "@/lib/types";

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

const LOOKING_FOR_OPTIONS: LookingForOption[] = [
  "Open to Work",
  "Freelance",
  "Collaboration",
  "Mentorship",
  "Networking",
];

const CAN_OFFER_OPTIONS: CanOfferOption[] = [
  "Consultation",
  "Mentoring",
  "Collaboration",
  "Hiring",
  "Professional Help",
];

export default function MyProfilePage() {
  const { currentUser, updateProfile, addToast } = useApp();

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [saveModal, setSaveModal] = useState<{ open: boolean; section: string } | null>(null);

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

  const [visibility, setVisibility] = useState<UserVisibility>(currentUser?.visibility || "community");

  if (!currentUser) return null;

  const handleSaveSection = (sectionName: string) => {
    updateProfile(currentUser.id, {
      name,
      avatar,
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
      visibility,
    });
    addToast("Saved", `${sectionName} updated successfully`, "success");
    setEditingSection(null);
  };

  const handleRequestSave = (sectionName: string) => {
    setSaveModal({ open: true, section: sectionName });
  };

  const handleConfirmSave = () => {
    if (saveModal) {
      handleSaveSection(saveModal.section);
    }
    setSaveModal(null);
  };

  const handleToggleSkill = (sk: string) => {
    if (skills.includes(sk)) {
      setSkills(skills.filter((s) => s !== sk));
    } else {
      setSkills([...skills, sk]);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkill.trim() && !skills.includes(customSkill.trim())) {
      setSkills([...skills, customSkill.trim()]);
      setCustomSkill("");
    }
  };

  const handleToggleLooking = (item: LookingForOption) => {
    if (lookingFor.includes(item)) {
      setLookingFor(lookingFor.filter((i) => i !== item));
    } else {
      setLookingFor([...lookingFor, item]);
    }
  };

  const handleToggleOffer = (item: CanOfferOption) => {
    if (canOffer.includes(item)) {
      setCanOffer(canOffer.filter((i) => i !== item));
    } else {
      setCanOffer([...canOffer, item]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-kumo-base border border-kumo-line rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-kumo-line"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h1 className="text-page-title text-kumo-strong break-words min-w-0">
                  {currentUser.name}
                </h1>
                <StatusBadge status={currentUser.status} />
              </div>
              <p className="text-xs sm:text-sm text-kumo-subtle mt-0">
                {currentUser.role} at {currentUser.company}
              </p>
              <p className="text-xs leading-4 text-kumo-inactive mt-1">{currentUser.email}</p>
            </div>
          </div>

          <div className="bg-kumo-tint p-4 rounded-xl border border-kumo-line w-full sm:w-64 shrink-0">
            <div className="flex items-center justify-between text-xs mb-1 font-semibold">
              <span className="text-kumo-subtle">Profile Completion</span>
              <span className="text-kumo-brand">{currentUser.profileCompletion}%</span>
            </div>
            <div className="w-full h-2 bg-kumo-line rounded-full overflow-hidden">
              <div
                className="h-full bg-kumo-brand rounded-full transition-colors duration-500"
                style={{ width: `${currentUser.profileCompletion}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
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

      {/* 1. PERSONAL INFORMATION */}
      <div className="bg-kumo-base border border-kumo-line rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserIcon size={16} weight="regular" className="text-kumo-brand" />
            <h2 className="text-section-title text-kumo-strong">Personal Information</h2>
          </div>
          {editingSection === "personal" ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditingSection(null)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={() => handleRequestSave("personal")}>
                <CheckCircleIcon size={12} weight="fill" className="mr-1" />
                Save
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setEditingSection("personal")}>
              <PencilSimpleIcon size={12} weight="regular" className="mr-1" />
              Edit
            </Button>
          )}
        </div>

        {editingSection === "personal" ? (
          <div className="space-y-4 pt-2">
            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Profile Photo URL" value={avatar} onChange={(e) => setAvatar(e.target.value)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Current City / Location" value={location} onChange={(e) => setLocation(e.target.value)} />
              <Input label="Batch" value={batch} onChange={(e) => setBatch(e.target.value)} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
            <div>
              <p className="text-kumo-subtle mb-1">Name</p>
              <p className="text-kumo-strong">{currentUser.name}</p>
            </div>
            <div>
              <p className="text-kumo-subtle mb-1">Location</p>
              <p className="text-kumo-strong">{currentUser.location || "—"}</p>
            </div>
            <div>
              <p className="text-kumo-subtle mb-1">Batch</p>
              <p className="text-kumo-strong">{currentUser.batch || "—"}</p>
            </div>
            <div>
              <p className="text-kumo-subtle mb-1">Email</p>
              <p className="text-kumo-strong truncate">{currentUser.email}</p>
            </div>
          </div>
        )}

        <div className="border-t border-kumo-line pt-4">
          <div className="flex items-center gap-2">
            <MapPinIcon size={14} weight="regular" className="text-kumo-brand" />
            <h3 className="text-card-title text-kumo-strong">Address Details</h3>
          </div>
          <p className="mt-2 text-sm text-kumo-subtle text-center py-4 bg-kumo-tint rounded-xl">
            {currentUser.location || "No address provided"}
          </p>
        </div>
      </div>

      {/* 2. PROFESSIONAL INFORMATION */}
      <div className="bg-kumo-base border border-kumo-line rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BriefcaseIcon size={16} weight="regular" className="text-kumo-brand" />
            <h2 className="text-section-title text-kumo-strong">Professional Information</h2>
          </div>
          {editingSection === "professional" ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditingSection(null)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={() => handleRequestSave("professional")}>
                <CheckCircleIcon size={12} weight="fill" className="mr-1" />
                Save
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setEditingSection("professional")}>
              <PencilSimpleIcon size={12} weight="regular" className="mr-1" />
              Edit
            </Button>
          )}
        </div>

        {editingSection === "professional" ? (
          <div className="space-y-4 pt-2">
            <Input label="Current Role / Title" value={role} onChange={(e) => setRole(e.target.value)} />
            <Input label="Company / Organization" value={company} onChange={(e) => setCompany(e.target.value)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Industry"
                value={industry}
                onValueChange={(v) => setIndustry(v)}
                items={[
                  "Technology",
                  "Design",
                  "Marketing",
                  "Business",
                  "Finance",
                  "Media & Creative",
                  "Education",
                  "Healthcare",
                  "Other",
                ].map((v) => ({ label: v, value: v }))}
              />
              <Select
                label="Experience Level"
                value={experience}
                onValueChange={(v) => setExperience(v)}
                items={[
                  "0-1 years",
                  "1-3 years",
                  "3-5 years",
                  "5-10 years",
                  "10+ years",
                ].map((v) => ({ label: v, value: v }))}
              />
            </div>
            <Textarea
              label="Bio / About Me"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself, your background, and what you're passionate about..."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <p className="text-kumo-subtle mb-1">Role</p>
              <p className="text-kumo-strong">{currentUser.role || "—"}</p>
            </div>
            <div>
              <p className="text-kumo-subtle mb-1">Company</p>
              <p className="text-kumo-strong">{currentUser.company || "—"}</p>
            </div>
            <div>
              <p className="text-kumo-subtle mb-1">Industry</p>
              <p className="text-kumo-strong">{currentUser.industry || "—"}</p>
            </div>
            <div>
              <p className="text-kumo-subtle mb-1">Experience</p>
              <p className="text-kumo-strong">{currentUser.experience || "—"}</p>
            </div>
          </div>
        )}

        {currentUser.bio && (
          <div className="border-t border-kumo-line pt-4">
            <p className="text-xs text-kumo-subtle mb-2">Bio</p>
            <p className="text-sm text-kumo-strong">{currentUser.bio}</p>
          </div>
        )}
      </div>

      {/* 3. SKILLS */}
      <div className="bg-kumo-base border border-kumo-line rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StackIcon size={16} weight="regular" className="text-kumo-brand" />
            <h2 className="text-section-title text-kumo-strong">Skills</h2>
          </div>
          {editingSection === "skills" ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditingSection(null)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={() => handleRequestSave("skills")}>
                <CheckCircleIcon size={12} weight="fill" className="mr-1" />
                Save
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setEditingSection("skills")}>
              <PencilSimpleIcon size={12} weight="regular" className="mr-1" />
              Edit
            </Button>
          )}
        </div>

        {editingSection === "skills" ? (
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap gap-2">
              {ALL_SKILLS.map((sk) => {
                const isSelected = skills.includes(sk);
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => handleToggleSkill(sk)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                      isSelected
                        ? "bg-kumo-brand text-white border-kumo-brand"
                        : "bg-kumo-tint text-kumo-subtle border-kumo-line"
                    }`}
                  >
                    {isSelected ? <CheckIcon size={10} weight="fill" className="mr-1" /> : <PlusIcon size={10} weight="regular" className="mr-1" />}
                    {sk}
                  </button>
                );
              })}
            </div>
            <form onSubmit={handleAddCustomSkill} className="flex gap-2">
              <Input
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Add custom skill..."
                className="flex-1"
              />
              <Button type="submit" variant="secondary" size="sm" disabled={!customSkill.trim()}>
                <PlusIcon size={12} weight="regular" className="mr-1" />
                Add
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.length > 0 ? (
              skills.map((sk) => <Badge key={sk} variant="secondary">{sk}</Badge>)
            ) : (
              <span className="text-sm text-kumo-inactive">No skills added yet</span>
            )}
          </div>
        )}
      </div>

      {/* 4. AVAILABILITY & STATUS */}
      <div className="bg-kumo-base border border-kumo-line rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldIcon size={16} weight="regular" className="text-kumo-brand" />
            <h2 className="text-section-title text-kumo-strong">Availability & Status</h2>
          </div>
          {editingSection === "availability" ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditingSection(null)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={() => handleRequestSave("availability")}>
                <CheckCircleIcon size={12} weight="fill" className="mr-1" />
                Save
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setEditingSection("availability")}>
              <PencilSimpleIcon size={12} weight="regular" className="mr-1" />
              Edit
            </Button>
          )}
        </div>

        {editingSection === "availability" ? (
          <div className="space-y-4 pt-2">
            <Select
              label="Current Status"
              value={status}
              onValueChange={(v) => setStatus(v as UserStatus)}
              items={["Available to Help", "Open to Work", "Open to Collaboration", "Hiring"].map((v) => ({ label: v, value: v }))}
            />
            <div>
              <label className="text-xs font-semibold text-kumo-subtle mb-2 block">Looking For</label>
              <div className="flex flex-wrap gap-2">
                {LOOKING_FOR_OPTIONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleToggleLooking(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                      lookingFor.includes(item)
                        ? "bg-kumo-brand text-white border-kumo-brand"
                        : "bg-kumo-tint text-kumo-subtle border-kumo-line"
                    }`}
                  >
                    {lookingFor.includes(item) && <CheckIcon size={10} weight="fill" className="mr-1" />}
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-kumo-subtle mb-2 block">Can Offer</label>
              <div className="flex flex-wrap gap-2">
                {CAN_OFFER_OPTIONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleToggleOffer(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                      canOffer.includes(item)
                        ? "bg-kumo-brand text-white border-kumo-brand"
                        : "bg-kumo-tint text-kumo-subtle border-kumo-line"
                    }`}
                  >
                    {canOffer.includes(item) && <CheckIcon size={10} weight="fill" className="mr-1" />}
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <Select
              label="Profile Visibility"
              value={visibility}
              onValueChange={(v) => setVisibility(v as UserVisibility)}
              items={[
                { label: "Community Only", value: "community" },
                { label: "Public", value: "public" },
                { label: "Private", value: "private" },
              ]}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs pt-2">
            <div>
              <p className="text-kumo-subtle mb-1">Status</p>
              <StatusBadge status={currentUser.status} />
            </div>
            <div>
              <p className="text-kumo-subtle mb-1">Looking For</p>
              <div className="flex flex-wrap gap-1.5">
                {lookingFor.length > 0 ? (
                  lookingFor.map((l) => <Badge key={l} variant="secondary" className="text-xs">{l}</Badge>)
                ) : (
                  <span className="text-kumo-inactive">—</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-kumo-subtle mb-1">Can Offer</p>
              <div className="flex flex-wrap gap-1.5">
                {canOffer.length > 0 ? (
                  canOffer.map((c) => <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>)
                ) : (
                  <span className="text-kumo-inactive">—</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-kumo-subtle mb-1">Visibility</p>
              <p className="text-kumo-strong capitalize">{currentUser.visibility}</p>
            </div>
          </div>
        )}
      </div>

      {/* 5. SOCIAL LINKS */}
      <div className="bg-kumo-base border border-kumo-line rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GlobeIcon size={16} weight="regular" className="text-kumo-brand" />
            <h2 className="text-section-title text-kumo-strong">Social Links</h2>
          </div>
          {editingSection === "links" ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditingSection(null)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={() => handleRequestSave("links")}>
                <CheckCircleIcon size={12} weight="fill" className="mr-1" />
                Save
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setEditingSection("links")}>
              <PencilSimpleIcon size={12} weight="regular" className="mr-1" />
              Edit
            </Button>
          )}
        </div>

        {editingSection === "links" ? (
          <div className="space-y-4 pt-2">
            <Input
              label="LinkedIn URL"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/yourname"
            />
            <Input
              label="Portfolio / Website URL"
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              placeholder="https://yourportfolio.com"
            />
            <Input
              label="Personal Website URL"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourwebsite.com"
            />
          </div>
        ) : (
          <div className="space-y-3">
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-kumo-brand hover:underline">
                <GlobeIcon size={14} weight="regular" /> LinkedIn
              </a>
            )}
            {portfolio && (
              <a href={portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-kumo-brand hover:underline">
                <GlobeIcon size={14} weight="regular" /> Portfolio
              </a>
            )}
            {website && (
              <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-kumo-brand hover:underline">
                <GlobeIcon size={14} weight="regular" /> Website
              </a>
            )}
            {!linkedin && !portfolio && !website && <p className="text-sm text-kumo-inactive">No social links added yet</p>}
          </div>
        )}
      </div>

      {/* 6. DANGER ZONE */}
      <div className="bg-error-lighter border border-error-light rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <TrashSimpleIcon size={16} weight="fill" className="text-error-base" />
          <h2 className="text-section-title text-error-dark">Danger Zone</h2>
        </div>
        <p className="text-sm text-error-dark">Irreversible actions. Proceed with caution.</p>
        <div className="flex items-center gap-3">
          <Button variant="danger" size="sm" onClick={() => addToast("Coming soon", "Account deletion not yet implemented", "info")}>
            Delete Account
          </Button>
          <Button variant="outline" size="sm" onClick={() => addToast("Coming soon", "Data export not yet implemented", "info")}>
            Export Data
          </Button>
        </div>
      </div>
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
      <label className="text-xs font-semibold text-kumo-subtle">{label}</label>
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="w-full h-9 px-3 bg-kumo-base border border-kumo-line rounded-xl text-sm text-kumo-strong outline-none focus:ring-2 focus:ring-kumo-brand focus:ring-offset-1 appearance-none cursor-pointer"
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