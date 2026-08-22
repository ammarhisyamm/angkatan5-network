"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store/AppContext";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import {
  User,
  Briefcase,
  Layers,
  MapPin,
  Globe,
  Shield,
  Edit2,
  Check,
  X,
  Sparkles,
  Lock,
  Eye,
  Plus,
} from "lucide-react";
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
      <div className="bg-bg-white-0 border border-stroke-soft-200 rounded-2xl p-6 sm:p-8 shadow-regular-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-stroke-soft-200 shadow-regular-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-title-h5 font-medium text-text-strong-950">
                  {currentUser.name}
                </h1>
                <StatusBadge status={currentUser.status} />
              </div>
              <p className="text-xs sm:text-sm text-text-sub-600 mt-0">
                {currentUser.role} at {currentUser.company}
              </p>
              <p className="text-[11px] leading-4 text-text-soft-400 mt-1">{currentUser.email}</p>
            </div>
          </div>

          <div className="bg-bg-weak-50 p-4 rounded-xl border border-stroke-soft-200 w-full sm:w-64 shrink-0">
            <div className="flex items-center justify-between text-xs mb-1 font-semibold">
              <span className="text-text-sub-600">Profile Completion</span>
              <span className="text-primary-base">
                {currentUser.profileCompletion}%
              </span>
            </div>
            <div className="w-full h-2 bg-stroke-soft-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-base rounded-full transition-all duration-500"
                style={{ width: `${currentUser.profileCompletion}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 1. PERSONAL INFORMATION */}
      <div className="bg-bg-white-0 border border-stroke-soft-200 rounded-2xl p-6 shadow-regular-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="size-4 text-primary-base" />
            <h2 className="text-base font-semibold leading-6 text-text-strong-950">
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
                <Check className="size-3 mr-1" />
                Save
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setEditingSection("personal")}
            >
              <Edit2 className="size-3 mr-1" />
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
              <span className="text-text-soft-400 block font-medium">Full Name</span>
              <span className="font-semibold text-text-strong-950">
                {currentUser.name}
              </span>
            </div>
            <div>
              <span className="text-text-soft-400 block font-medium">Location</span>
              <span className="font-semibold text-text-strong-950">
                {currentUser.location}
              </span>
            </div>
            <div>
              <span className="text-text-soft-400 block font-medium">Batch</span>
              <span className="font-semibold text-text-strong-950">
                {currentUser.batch}
              </span>
            </div>
            <div>
              <span className="text-text-soft-400 block font-medium">Email</span>
              <span className="font-semibold text-text-strong-950 font-mono text-[11px] leading-4">
                {currentUser.email}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. PROFESSIONAL INFORMATION */}
      <div className="bg-bg-white-0 border border-stroke-soft-200 rounded-2xl p-6 shadow-regular-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="size-4 text-primary-base" />
            <h2 className="text-base font-semibold leading-6 text-text-strong-950">
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
                <Check className="size-3 mr-1" />
                Save
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setEditingSection("professional")}
            >
              <Edit2 className="size-3 mr-1" />
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
                <span className="text-text-soft-400 block font-medium">Role</span>
                <span className="font-semibold text-text-strong-950">
                  {currentUser.role}
                </span>
              </div>
              <div>
                <span className="text-text-soft-400 block font-medium">Company</span>
                <span className="font-semibold text-text-strong-950">
                  {currentUser.company}
                </span>
              </div>
              <div>
                <span className="text-text-soft-400 block font-medium">Experience</span>
                <span className="font-semibold text-text-strong-950">
                  {currentUser.experience}
                </span>
              </div>
            </div>
            <div>
              <span className="text-text-soft-400 block font-medium text-xs">Bio</span>
              <p className="mt-1 leading-relaxed text-sm leading-5 text-text-sub-600">
                {currentUser.bio}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. SKILLS */}
      <div className="bg-bg-white-0 border border-stroke-soft-200 rounded-2xl p-6 shadow-regular-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="size-4 text-primary-base" />
            <h2 className="text-base font-semibold leading-6 text-text-strong-950">
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
                <Check className="size-3 mr-1" />
                Save
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setEditingSection("skills")}
            >
              <Edit2 className="size-3 mr-1" />
              Edit
            </Button>
          )}
        </div>

        {editingSection === "skills" ? (
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap gap-1 max-h-48 overflow-y-auto p-2 border border-stroke-soft-200 rounded-xl">
              {ALL_SKILLS.map((sk) => {
                const isSelected = skills.includes(sk);
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => handleToggleSkill(sk)}
                    className={`px-3 py-1 rounded-xl text-xs font-medium border transition-all ${
                      isSelected
                        ? "bg-primary-base text-static-white border-primary-base"
                        : "bg-bg-weak-50 text-text-sub-600 border-stroke-soft-200"
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
                className="flex-1 h-9 px-3 bg-bg-white-0 border border-stroke-soft-200 rounded-xl text-xs"
              />
              <Button type="submit" variant="secondary" size="sm">
                <Plus className="size-3 mr-1" />
                Add
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex flex-wrap gap-1 pt-2">
            {currentUser.skills?.map((sk) => (
              <span
                key={sk}
                className="px-3 py-1 rounded-xl text-xs font-medium bg-bg-weak-50 text-text-sub-600 border border-stroke-soft-200"
              >
                {sk}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 4. AVAILABILITY & STATUS */}
      <div className="bg-bg-white-0 border border-stroke-soft-200 rounded-2xl p-6 shadow-regular-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-success-base" />
            <h2 className="text-base font-semibold leading-6 text-text-strong-950">
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
                <Check className="size-3 mr-1" />
                Save
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setEditingSection("availability")}
            >
              <Edit2 className="size-3 mr-1" />
              Edit
            </Button>
          )}
        </div>

        {editingSection === "availability" ? (
          <div className="space-y-4 pt-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-text-sub-600">
                Primary Status Badge
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as UserStatus)}
                className="h-10 px-3 bg-bg-white-0 border border-stroke-soft-200 rounded-xl text-xs text-text-strong-950"
              >
                <option value="Available to Help">Available to Help</option>
                <option value="Open to Work">Open to Work</option>
                <option value="Open to Collaboration">Open to Collaboration</option>
                <option value="Hiring">Hiring</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-sub-600">
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
                      className={`px-3 py-1 rounded-xl text-xs font-medium border transition-all ${
                        isChecked
                          ? "bg-primary-base text-static-white border-primary-base"
                          : "bg-bg-weak-50 text-text-sub-600 border-stroke-soft-200"
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
              <label className="text-xs font-semibold text-text-sub-600">
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
                      className={`px-3 py-1 rounded-xl text-xs font-medium border transition-all ${
                        isChecked
                          ? "bg-emerald-600 text-static-white border-emerald-600"
                          : "bg-bg-weak-50 text-text-sub-600 border-stroke-soft-200"
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
              <span className="text-text-soft-400 block font-medium mb-1">Status</span>
              <StatusBadge status={currentUser.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-text-soft-400 block font-medium mb-1">
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
                <span className="text-text-soft-400 block font-medium mb-1">
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
      <div className="bg-bg-white-0 border border-stroke-soft-200 rounded-2xl p-6 shadow-regular-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="size-4 text-primary-base" />
            <h2 className="text-base font-semibold leading-6 text-text-strong-950">
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
                <Check className="size-3 mr-1" />
                Save
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setEditingSection("links")}
            >
              <Edit2 className="size-3 mr-1" />
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
              <span className="text-text-soft-400 block font-medium">LinkedIn</span>
              <span className="font-semibold text-text-strong-950 truncate block">
                {currentUser.linkedin || "Not provided"}
              </span>
            </div>
            <div>
              <span className="text-text-soft-400 block font-medium">Portfolio</span>
              <span className="font-semibold text-text-strong-950 truncate block">
                {currentUser.portfolio || "Not provided"}
              </span>
            </div>
            <div>
              <span className="text-text-soft-400 block font-medium">Website</span>
              <span className="font-semibold text-text-strong-950 truncate block">
                {currentUser.website || "Not provided"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 6. PRIVACY & DIRECTORY CONTROLS */}
      <div className="bg-bg-white-0 border border-stroke-soft-200 rounded-2xl p-6 shadow-regular-xs space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="size-4 text-feature-base" />
          <h2 className="text-base font-semibold leading-6 text-text-strong-950">
            Privacy & Directory Visibility
          </h2>
        </div>

        <p className="text-xs text-text-sub-600">
          Control how your profile appears in the Angkatan 5 network. Personal phone numbers and emails are never exposed publicly.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div
            onClick={() => {
              setVisibility("community");
              updateProfile(currentUser.id, { visibility: "community" });
            }}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
              currentUser.visibility === "community"
                ? "border-primary-base bg-primary-alpha-10/40"
                : "border-stroke-soft-200 hover:border-stroke-sub-300"
            }`}
          >
            <Eye className="size-5 text-primary-base shrink-0 mt-0" />
            <div>
              <h4 className="text-xs font-semibold text-text-strong-950">
                Community Members Only
              </h4>
              <p className="text-[11px] leading-4 text-text-sub-600 mt-0">
                Visible to verified Angkatan 5 members in directory searches.
              </p>
            </div>
          </div>

          <div
            onClick={() => {
              setVisibility("hidden");
              updateProfile(currentUser.id, { visibility: "hidden" });
            }}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
              currentUser.visibility === "hidden"
                ? "border-amber-600 bg-amber-50/40"
                : "border-stroke-soft-200 hover:border-stroke-sub-300"
            }`}
          >
            <Lock className="size-5 text-warning-base shrink-0 mt-0" />
            <div>
              <h4 className="text-xs font-semibold text-text-strong-950">
                Hidden from Directory
              </h4>
              <p className="text-[11px] leading-4 text-text-sub-600 mt-0">
                Your profile will not appear in search results or suggestions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
