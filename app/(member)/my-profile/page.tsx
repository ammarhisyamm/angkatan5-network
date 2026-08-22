"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store/AppContext";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { UserIcon, BriefcaseIcon, StackIcon, MapPinIcon, GlobeIcon, ShieldIcon, PencilSimpleIcon, CheckIcon, XIcon, SparkleIcon, LockSimpleIcon, EyeIcon, PlusIcon } from "@phosphor-icons/react";
import { UserStatus, LookingForOption, CanOfferOption, UserVisibility } from "@/lib/types";

const ALL_SKILLS = [
  "UI/UX Design",
  "Design Systems",
  "UserIcon Research",
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

  // Active edit section trackers
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Form states initialized with currentUser
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
    setEditingSection(null);
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="bg-kumo-base border border-kumo-line rounded-lg p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-kumo-line shadow-xs"
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
              <span className="text-kumo-brand">
                {currentUser.profileCompletion}%
              </span>
            </div>
            <div className="w-full h-2 bg-stroke-soft-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-kumo-brand rounded-full transition-colors duration-500"
                style={{ width: `${currentUser.profileCompletion}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 1. PERSONAL INFORMATION */}
      <div className="bg-kumo-base border border-kumo-line rounded-lg p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserIcon size={16} weight="regular" className="text-kumo-brand" />
            <h2 className="text-section-title text-kumo-strong">
              Personal Information
            </h2>
          </div>
          {editingSection === "personal" ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditingSection(null)}
              >
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={() => handleSaveSection("personal")}
              >
                <CheckIcon size={12} weight="regular" className="mr-1" />
                Save
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setEditingSection("personal")}
            >
              <PencilSimpleIcon size={12} weight="regular" className="mr-1" />
              Edit
            </Button>
          )}
        </div>

        {editingSection === "personal" ? (
          <div className="space-y-4 pt-2">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Profile Photo URL"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Current City / Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <Input
                label="Batch"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
            <div>
              <span className="text-kumo-inactive block font-medium">Full Name</span>
              <span className="font-semibold text-kumo-strong">
                {currentUser.name}
              </span>
            </div>
            <div>
              <span className="text-kumo-inactive block font-medium">Location</span>
              <span className="font-semibold text-kumo-strong">
                {currentUser.location}
              </span>
            </div>
            <div>
              <span className="text-kumo-inactive block font-medium">Batch</span>
              <span className="font-semibold text-kumo-strong">
                {currentUser.batch}
              </span>
            </div>
            <div>
              <span className="text-kumo-inactive block font-medium">Email</span>
              <span className="font-semibold text-kumo-strong font-mono text-xs leading-4">
                {currentUser.email}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. PROFESSIONAL INFORMATION */}
      <div className="bg-kumo-base border border-kumo-line rounded-lg p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BriefcaseIcon size={16} weight="regular" className="text-kumo-brand" />
            <h2 className="text-section-title text-kumo-strong">
              Professional Details
            </h2>
          </div>
          {editingSection === "professional" ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditingSection(null)}
              >
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={() => handleSaveSection("professional")}
              >
                <CheckIcon size={12} weight="regular" className="mr-1" />
                Save
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setEditingSection("professional")}
            >
              <PencilSimpleIcon size={12} weight="regular" className="mr-1" />
              Edit
            </Button>
          )}
        </div>

        {editingSection === "professional" ? (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Current Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
              <Input
                label="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
              <Input
                label="Years of Experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>
            <Textarea
              label="Bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-kumo-inactive block font-medium">Role</span>
                <span className="font-semibold text-kumo-strong">
                  {currentUser.role}
                </span>
              </div>
              <div>
                <span className="text-kumo-inactive block font-medium">Company</span>
                <span className="font-semibold text-kumo-strong">
                  {currentUser.company}
                </span>
              </div>
              <div>
                <span className="text-kumo-inactive block font-medium">Experience</span>
                <span className="font-semibold text-kumo-strong">
                  {currentUser.experience}
                </span>
              </div>
            </div>
            <div>
              <span className="text-kumo-inactive block font-medium text-xs">Bio</span>
              <p className="mt-1 leading-relaxed text-sm leading-5 text-kumo-subtle">
                {currentUser.bio}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. SKILLS */}
      <div className="bg-kumo-base border border-kumo-line rounded-lg p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StackIcon size={16} weight="regular" className="text-kumo-brand" />
            <h2 className="text-section-title text-kumo-strong">
              Skills & Expertise
            </h2>
          </div>
          {editingSection === "skills" ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditingSection(null)}
              >
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={() => handleSaveSection("skills")}
              >
                <CheckIcon size={12} weight="regular" className="mr-1" />
                Save
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setEditingSection("skills")}
            >
              <PencilSimpleIcon size={12} weight="regular" className="mr-1" />
              Edit
            </Button>
          )}
        </div>

        {editingSection === "skills" ? (
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap gap-1 max-h-48 overflow-y-auto p-2 border border-kumo-line rounded-xl">
              {ALL_SKILLS.map((sk) => {
                const isSelected = skills.includes(sk);
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

            <form onSubmit={handleAddCustomSkill} className="flex gap-2">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Add other custom skill..."
                className="flex-1 h-9 px-3 bg-kumo-base border border-kumo-line rounded-xl text-xs"
              />
              <Button type="submit" variant="secondary" size="sm">
                <PlusIcon size={12} weight="regular" className="mr-1" />
                Add
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex flex-wrap gap-1 pt-2">
            {currentUser.skills?.map((sk) => (
              <span
                key={sk}
                className="px-3 py-1 rounded-xl text-xs font-medium bg-kumo-tint text-kumo-subtle border border-kumo-line"
              >
                {sk}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 4. AVAILABILITY & STATUS */}
      <div className="bg-kumo-base border border-kumo-line rounded-lg p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SparkleIcon size={16} weight="regular" className="text-success-base" />
            <h2 className="text-section-title text-kumo-strong">
              Availability & Collaborations
            </h2>
          </div>
          {editingSection === "availability" ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditingSection(null)}
              >
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={() => handleSaveSection("availability")}
              >
                <CheckIcon size={12} weight="regular" className="mr-1" />
                Save
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setEditingSection("availability")}
            >
              <PencilSimpleIcon size={12} weight="regular" className="mr-1" />
              Edit
            </Button>
          )}
        </div>

        {editingSection === "availability" ? (
          <div className="space-y-4 pt-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-kumo-subtle">
                Primary Status Badge
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as UserStatus)}
                className="h-10 px-3 bg-kumo-base border border-kumo-line rounded-xl text-xs text-kumo-strong"
              >
                <option value="Available to Help">Available to Help</option>
                <option value="Open to Work">Open to Work</option>
                <option value="Open to Collaboration">Open to Collaboration</option>
                <option value="Hiring">Hiring</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-kumo-subtle">
                What are you looking for?
              </label>
              <div className="flex flex-wrap gap-2">
                {LOOKING_FOR_OPTIONS.map((item) => {
                  const isChecked = lookingFor.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleToggleLooking(item)}
                      className={`px-3 py-1 rounded-xl text-xs font-medium border transition-colors ${
                        isChecked
                          ? "bg-kumo-brand text-static-white border-kumo-brand"
                          : "bg-kumo-tint text-kumo-subtle border-kumo-line"
                      }`}
                    >
                      {isChecked ? "✓ " : "+ "}
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-kumo-subtle">
                What can you offer?
              </label>
              <div className="flex flex-wrap gap-2">
                {CAN_OFFER_OPTIONS.map((item) => {
                  const isChecked = canOffer.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleToggleOffer(item)}
                      className={`px-3 py-1 rounded-xl text-xs font-medium border transition-colors ${
                        isChecked
                          ? "bg-success-base text-static-white border-success-base"
                          : "bg-kumo-tint text-kumo-subtle border-kumo-line"
                      }`}
                    >
                      {isChecked ? "✓ " : "+ "}
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-2 text-xs">
            <div>
              <span className="text-kumo-inactive block font-medium mb-1">Status</span>
              <StatusBadge status={currentUser.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-kumo-inactive block font-medium mb-1">
                  Looking For
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentUser.lookingFor?.map((item) => (
                    <Badge key={item} variant="primary">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-kumo-inactive block font-medium mb-1">
                  Can Offer
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentUser.canOffer?.map((item) => (
                    <Badge key={item} variant="success">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. LINKS & SOCIALS */}
      <div className="bg-kumo-base border border-kumo-line rounded-lg p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GlobeIcon size={16} weight="regular" className="text-kumo-brand" />
            <h2 className="text-section-title text-kumo-strong">
              Links & Portfolio
            </h2>
          </div>
          {editingSection === "links" ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditingSection(null)}
              >
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={() => handleSaveSection("links")}
              >
                <CheckIcon size={12} weight="regular" className="mr-1" />
                Save
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setEditingSection("links")}
            >
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
              placeholder="https://linkedin.com/in/..."
            />
            <Input
              label="Portfolio URL"
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              placeholder="https://..."
            />
            <Input
              label="Personal Website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://..."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div>
              <span className="text-kumo-inactive block font-medium">LinkedIn</span>
              <span className="font-semibold text-kumo-strong truncate block">
                {currentUser.linkedin || "Not provided"}
              </span>
            </div>
            <div>
              <span className="text-kumo-inactive block font-medium">Portfolio</span>
              <span className="font-semibold text-kumo-strong truncate block">
                {currentUser.portfolio || "Not provided"}
              </span>
            </div>
            <div>
              <span className="text-kumo-inactive block font-medium">Website</span>
              <span className="font-semibold text-kumo-strong truncate block">
                {currentUser.website || "Not provided"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 6. PRIVACY & DIRECTORY CONTROLS */}
      <div className="bg-kumo-base border border-kumo-line rounded-lg p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <ShieldIcon size={16} weight="regular" className="text-feature-base" />
          <h2 className="text-section-title text-kumo-strong">
            Privacy & Directory Visibility
          </h2>
        </div>

        <p className="text-xs text-kumo-subtle">
          Control how your profile appears in the Angkatan 5 network. Personal phone numbers and emails are never exposed publicly.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div
            onClick={() => {
              setVisibility("community");
              updateProfile(currentUser.id, { visibility: "community" });
            }}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-colors flex items-start gap-3 ${
              currentUser.visibility === "community"
                ? "border-kumo-brand bg-primary-alpha-10/40"
                : "border-kumo-line hover:border-kumo-line"
            }`}
          >
            <EyeIcon size={20} weight="regular" className="text-kumo-brand shrink-0 mt-0" />
            <div>
              <h4 className="text-xs font-semibold text-kumo-strong">
                Community Members Only
              </h4>
              <p className="text-xs leading-4 text-kumo-subtle mt-0">
                Visible to verified Angkatan 5 members in directory searches.
              </p>
            </div>
          </div>

          <div
            onClick={() => {
              setVisibility("hidden");
              updateProfile(currentUser.id, { visibility: "hidden" });
            }}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-colors flex items-start gap-3 ${
              currentUser.visibility === "hidden"
                ? "border-warning-base bg-warning-lighter/40"
                : "border-kumo-line hover:border-kumo-line"
            }`}
          >
            <LockSimpleIcon size={20} weight="regular" className="text-warning-base shrink-0 mt-0" />
            <div>
              <h4 className="text-xs font-semibold text-kumo-strong">
                Hidden from Directory
              </h4>
              <p className="text-xs leading-4 text-kumo-subtle mt-0">
                Your profile will not appear in search results or suggestions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
