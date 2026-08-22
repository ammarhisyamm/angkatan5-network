"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  User,
  Briefcase,
  Layers,
  Search,
  Gift,
  Plus,
} from "lucide-react";
import { LookingForOption, CanOfferOption } from "@/lib/types";

const AVATAR_OPTIONS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
];

const PREDEFINED_SKILLS = [
  "UI/UX Design",
  "Software Development",
  "Business Development",
  "Marketing",
  "Sales",
  "Finance",
  "Accounting",
  "Product Management",
  "Photography",
  "Video Editing",
  "Content Creation",
  "Entrepreneurship",
  "Teaching",
  "React / Next.js",
  "Python & AI / ML",
  "Cloud & DevOps",
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

export default function OnboardingPage() {
  const router = useRouter();
  const { currentUser, completeOnboarding } = useApp();
  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState(currentUser?.name || "Ammar Hisyam");
  const [avatar, setAvatar] = useState(currentUser?.avatar || AVATAR_OPTIONS[0]);
  const [location, setLocation] = useState(currentUser?.location || "Jakarta, Indonesia");
  const [batch, setBatch] = useState(currentUser?.batch || "Angkatan 5 (2018)");

  const [role, setRole] = useState(currentUser?.role || "Product Designer");
  const [company, setCompany] = useState(currentUser?.company || "Gojek");
  const [industry, setIndustry] = useState(currentUser?.industry || "Design");
  const [experience, setExperience] = useState(currentUser?.experience || "3+ years");
  const [bio, setBio] = useState(
    currentUser?.bio ||
      "Passionate about building intuitive digital products and helping community members level up."
  );

  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    currentUser?.skills || ["UI/UX Design", "Product Design"]
  );
  const [customSkillInput, setCustomSkillInput] = useState("");

  const [lookingFor, setLookingFor] = useState<LookingForOption[]>(
    currentUser?.lookingFor || ["Collaboration", "Mentorship"]
  );

  const [canOffer, setCanOffer] = useState<CanOfferOption[]>(
    currentUser?.canOffer || ["Consultation", "Mentoring"]
  );

  const handleToggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkillInput.trim() && !selectedSkills.includes(customSkillInput.trim())) {
      setSelectedSkills([...selectedSkills, customSkillInput.trim()]);
      setCustomSkillInput("");
    }
  };

  const handleToggleLookingFor = (item: LookingForOption) => {
    if (lookingFor.includes(item)) {
      setLookingFor(lookingFor.filter((i) => i !== item));
    } else {
      setLookingFor([...lookingFor, item]);
    }
  };

  const handleToggleCanOffer = (item: CanOfferOption) => {
    if (canOffer.includes(item)) {
      setCanOffer(canOffer.filter((i) => i !== item));
    } else {
      setCanOffer([...canOffer, item]);
    }
  };

  const handleComplete = () => {
    completeOnboarding({
      name,
      avatar,
      location,
      batch,
      role,
      company,
      industry,
      experience,
      experienceYears: parseInt(experience) || 3,
      bio,
      skills: selectedSkills,
      lookingFor,
      canOffer,
      status: lookingFor.includes("Open to Work")
        ? "Open to Work"
        : canOffer.includes("Hiring")
        ? "Hiring"
        : "Available to Help",
    });
    router.push("/dashboard");
  };

  const stepsList = [
    { num: 1, title: "About", icon: User },
    { num: 2, title: "Career", icon: Briefcase },
    { num: 3, title: "Skills", icon: Layers },
    { num: 4, title: "Looking For", icon: Search },
    { num: 5, title: "Can Offer", icon: Gift },
  ];

  return (
    <div className="min-h-screen bg-kumo-tint py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="mb-2 text-xs font-semibold uppercase leading-4 tracking-widest text-kumo-inactive">Profile Setup</p>
          <h1 className="text-2xl font-semibold leading-8 tracking-tight text-kumo-strong">
            Welcome to Angkatan 5 Talent Network
          </h1>
          <p className="mt-1 text-sm leading-5 text-kumo-subtle">
            Complete your profile so your peers can discover your skills and opportunities.
          </p>
        </div>

        {/* Stepper indicator */}
        <div className="bg-kumo-base rounded-xl border border-kumo-line p-4 mb-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0 bg-kumo-tint -translate-y-1/2 z-0" />
            {stepsList.map((s) => {
              const isCompleted = step > s.num;
              const isCurrent = step === s.num;
              const Icon = s.icon;

              return (
                <div key={s.num} className="relative z-10 flex flex-col items-center gap-2">
                  <button
                    onClick={() => s.num < step && setStep(s.num)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                      isCompleted
                        ? "bg-success-base text-static-white"
                        : isCurrent
                        ? "bg-kumo-brand text-static-white ring-4 ring-primary-alpha-10"
                        : "bg-kumo-tint text-kumo-inactive"
                    }`}
                  >
                    {isCompleted ? <Check className="size-4" /> : <Icon className="size-4" />}
                  </button>
                  <span
                    className={`hidden text-xs font-medium leading-[18px] sm:block ${
                      isCurrent
                        ? "font-semibold text-kumo-brand"
                        : "text-kumo-inactive"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Card Content */}
        <div className="bg-kumo-base rounded-xl border border-kumo-line p-6 sm:p-8">
          {/* STEP 1: ABOUT YOU */}
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-base font-semibold leading-6 text-kumo-strong">
                  Step 1 — About You
                </h2>
                <p className="mt-0.5 text-sm leading-5 text-kumo-subtle">
                  Let&apos;s start with your identity and profile photo.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium leading-5 text-kumo-strong">
                  Choose Profile Photo
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  {AVATAR_OPTIONS.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="avatar"
                      onClick={() => setAvatar(url)}
                      className={`size-12 rounded-full bg-kumo-tint object-cover ring-1 transition-all cursor-pointer ${
                        avatar === url
                          ? "ring-2 ring-kumo-brand"
                          : "ring-kumo-line hover:ring-stroke-sub-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ammar Hisyam"
                required
              />

              <Input
                label="Current City / Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Jakarta, Indonesia"
                required
              />

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium leading-5 text-kumo-strong">
                  School Batch
                </label>
                <input
                  type="text"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  className="w-full h-10 rounded-lg border border-kumo-line bg-kumo-base px-3 text-sm text-kumo-strong"
                />
              </div>
            </div>
          )}

          {/* STEP 2: PROFESSIONAL */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-semibold leading-6 text-kumo-strong">
                  Step 2 — Professional Background
                </h2>
                <p className="mt-0.5 text-sm leading-5 text-kumo-subtle">
                  Share what you do and your experience level.
                </p>
              </div>

              <Input
                label="Current Role / Title"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Product Designer / Backend Engineer"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Company / Organization"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Gojek / Independent"
                />

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium leading-5 text-kumo-strong">
                    Primary Industry
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full h-10 px-3 bg-kumo-base text-kumo-strong border border-kumo-line rounded-lg text-sm focus:outline-none focus:border-kumo-brand"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Design">Design</option>
                    <option value="Business">Business</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Media & Creative">Media & Creative</option>
                    <option value="Education">Education</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium leading-5 text-kumo-strong">
                  Years of Experience
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full h-10 px-3 bg-kumo-base text-kumo-strong border border-kumo-line rounded-lg text-sm focus:outline-none focus:border-kumo-brand"
                >
                  <option value="1+ years">1+ years</option>
                  <option value="2+ years">2+ years</option>
                  <option value="3+ years">3+ years</option>
                  <option value="4+ years">4+ years</option>
                  <option value="5+ years">5+ years</option>
                  <option value="7+ years">7+ years</option>
                </select>
              </div>

              <Textarea
                label="Short Bio"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A brief summary of your work, passion, and what makes you tick..."
              />
            </div>
          )}

          {/* STEP 3: SKILLS */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-semibold leading-6 text-kumo-strong">
                  Step 3 — Your Skills
                </h2>
                <p className="mt-0.5 text-sm leading-5 text-kumo-subtle">
                  Select your top skills or add custom ones.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {PREDEFINED_SKILLS.map((sk) => {
                  const isSelected = selectedSkills.includes(sk);
                  return (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => handleToggleSkill(sk)}
                      className={`px-3 py-1 rounded-xl text-xs font-medium border transition-all ${
                        isSelected
                          ? "bg-kumo-brand text-static-white border-kumo-brand"
                          : "bg-kumo-base text-kumo-subtle border-kumo-line hover:bg-kumo-tint"
                      }`}
                    >
                      {isSelected ? "✓ " : "+ "}
                      {sk}
                    </button>
                  );
                })}
              </div>

              {/* Add custom skill input */}
              <form onSubmit={handleAddCustomSkill} className="flex gap-2 pt-3 border-t border-kumo-line">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  placeholder="Add custom skill (e.g. Kubernetes, Blender)..."
                  className="flex-1 h-10 px-3 bg-kumo-base text-kumo-strong border border-kumo-line rounded-lg text-sm focus:outline-none focus:border-kumo-brand"
                />
                <Button type="submit" variant="secondary" size="md">
                  <Plus className="size-4" />
                  Add
                </Button>
              </form>

              <div className="text-xs text-kumo-subtle">
                Selected skills: <span className="font-semibold text-kumo-strong">{selectedSkills.length}</span>
              </div>
            </div>
          )}

          {/* STEP 4: WHAT ARE YOU LOOKING FOR? */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-semibold leading-6 text-kumo-strong">
                  Step 4 — What are you looking for?
                </h2>
                <p className="mt-0.5 text-sm leading-5 text-kumo-subtle">
                  Select all opportunities that interest you right now.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {LOOKING_FOR_OPTIONS.map((item) => {
                  const isChecked = lookingFor.includes(item);
                  return (
                    <div
                      key={item}
                      onClick={() => handleToggleLookingFor(item)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        isChecked
                          ? "border-kumo-brand bg-primary-alpha-10 text-kumo-brand"
                          : "border-kumo-line hover:border-kumo-line text-kumo-subtle"
                      }`}
                    >
                      <span className="text-sm font-semibold">{item}</span>
                      <div
                        className={`size-5 rounded-full flex items-center justify-center text-xs ${
                          isChecked ? "bg-kumo-brand text-static-white" : "border border-kumo-line"
                        }`}
                      >
                        {isChecked && <Check className="size-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: WHAT CAN YOU OFFER? */}
          {step === 5 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-semibold leading-6 text-kumo-strong">
                  Step 5 — What can you offer?
                </h2>
                <p className="mt-0.5 text-sm leading-5 text-kumo-subtle">
                  How can you help other members of Angkatan 5?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {CAN_OFFER_OPTIONS.map((item) => {
                  const isChecked = canOffer.includes(item);
                  return (
                    <div
                      key={item}
                      onClick={() => handleToggleCanOffer(item)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        isChecked
                          ? "border-emerald-600 bg-emerald-50/50 text-emerald-900"
                          : "border-kumo-line hover:border-kumo-line text-kumo-subtle"
                      }`}
                    >
                      <span className="text-sm font-semibold">{item}</span>
                      <div
                        className={`size-5 rounded-full flex items-center justify-center text-xs ${
                          isChecked ? "bg-success-base text-static-white" : "border border-kumo-line"
                        }`}
                      >
                        {isChecked && <Check className="size-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stepper navigation footer */}
          <div className="flex items-center justify-between pt-8 mt-6 border-t border-kumo-line">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)}
              >
                <ChevronLeft className="size-4" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <Button type="button" variant="primary" onClick={() => setStep(step + 1)}
              >
                Next Step
                <ChevronRight className="size-4" />
              </Button>
            ) : (
              <Button type="button" variant="primary" size="lg" onClick={handleComplete} className="bg-emerald-600 hover:bg-emerald-700" >
                Complete Profile
                <Check className="size-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
