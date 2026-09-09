"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Check, CaretRightIcon, CaretLeftIcon, SparkleIcon, UserIcon, BriefcaseIcon, StackIcon, MagnifyingGlassIcon, GiftIcon, Plus } from "@phosphor-icons/react";
import { LookingForOption, CanOfferOption } from "@/lib/types";

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
  const { currentUser, completeOnboarding, addToast } = useApp();
  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState(currentUser?.name || "");
  const [location, setLocation] = useState(currentUser?.location || "");
  const [batch, setBatch] = useState(currentUser?.batch || "");

  const [role, setRole] = useState(currentUser?.role || "");
  const [company, setCompany] = useState(currentUser?.company || "");
  const [industry, setIndustry] = useState(currentUser?.industry || "");
  const [experience, setExperience] = useState(currentUser?.experience || "");
  const [bio, setBio] = useState(currentUser?.bio || "");

  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    currentUser?.skills || []
  );
  const [customSkillInput, setCustomSkillInput] = useState("");

  const [lookingFor, setLookingFor] = useState<LookingForOption[]>(
    currentUser?.lookingFor || []
  );

  const [canOffer, setCanOffer] = useState<CanOfferOption[]>(
    currentUser?.canOffer || []
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

  const [showCelebration, setShowCelebration] = useState(false);

  const handleComplete = () => {
    completeOnboarding({
      name,
      location,
      batch,
      role,
      company,
      industry,
      experience,
      experienceYears: parseInt(experience) || 0,
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
    setShowCelebration(true);
    setTimeout(() => router.push("/dashboard"), 2200);
  };

  const stepsList = [
    { num: 1, title: "About", icon: UserIcon },
    { num: 2, title: "Career", icon: BriefcaseIcon },
    { num: 3, title: "Skills", icon: StackIcon },
    { num: 4, title: "Looking For", icon: MagnifyingGlassIcon },
    { num: 5, title: "Can Offer", icon: GiftIcon },
  ];

  const canContinue =
    step === 1
      ? Boolean(name.trim() && location.trim() && batch.trim())
      : step === 2
        ? Boolean(role.trim() && industry && experience)
        : step === 3
          ? selectedSkills.length > 0
          : true;

  return (
    <div className="flex min-h-[100dvh] flex-col items-center bg-bg-weak-50 px-4 py-8 sm:px-6">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-title-h6 text-text-strong-950">
            Set up your profile
          </h1>
          <p className="mx-auto mt-1 max-w-[52ch] text-paragraph-sm text-text-sub-600">
            Add the information members need to discover and connect with you.
          </p>
        </div>

        {/* Stepper indicator */}
        <nav aria-label="Profile setup progress" className="mb-4 rounded-10 border border-stroke-soft-200 bg-bg-white-0 p-1.5 shadow-regular-xs">
          <div className="grid grid-cols-5 gap-1">
            {stepsList.map((s) => {
              const isCompleted = step > s.num;
              const isCurrent = step === s.num;
              const Icon = s.icon;

              return (
                <button key={s.num} type="button" disabled={s.num > step} aria-current={isCurrent ? "step" : undefined} onClick={() => s.num <= step && setStep(s.num)} className={`flex h-9 min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 text-label-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base/40 disabled:cursor-default ${isCurrent ? "bg-primary-base text-static-white" : isCompleted ? "bg-success-lighter text-success-dark" : "text-text-soft-400"}`}>
                  {isCompleted ? <Check size={14} weight="bold" aria-hidden="true" /> : <Icon className="size-4 shrink-0" aria-hidden="true" />}
                  <span className="hidden truncate sm:block">{s.title}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Step Card Content */}
        <div className="rounded-10 border border-stroke-soft-200 bg-bg-white-0 p-5 shadow-regular-xs sm:p-6">
          {/* STEP 1: ABOUT YOU */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-label-lg text-text-strong-950">
                  About you
                </h2>
                <p className="mt-0.5 text-sm leading-5 text-text-sub-600">Let&apos;s start with your identity.</p>
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

              <Input label="School batch" value={batch} onChange={(e) => setBatch(e.target.value)} placeholder="Angkatan 5 (2018)" required />
            </div>
          )}

          {/* STEP 2: PROFESSIONAL */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-label-lg text-text-strong-950">
                  Professional background
                </h2>
                <p className="mt-0.5 text-sm leading-5 text-text-sub-600">
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

                <Select
                  label="Primary Industry"
                  value={industry}
                  onValueChange={setIndustry}
                  placeholder="Select industry"
                  items={[
                    "Technology",
                    "Design",
                    "Business",
                    "Marketing",
                    "Finance",
                    "Media & Creative",
                    "Education",
                  ].map((item) => ({ value: item, label: item }))}
                />
              </div>

              <Select
                label="Years of Experience"
                value={experience}
                onValueChange={setExperience}
                placeholder="Select experience"
                items={["1+ years", "2+ years", "3+ years", "4+ years", "5+ years", "7+ years"].map((item) => ({ value: item, label: item }))}
              />

              <Textarea
                label="Short Bio"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A brief summary of your work, passion, and what makes you tick…"
              />
            </div>
          )}

          {/* STEP 3: SKILLS */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-label-lg text-text-strong-950">
                  Your skills
                </h2>
                <p className="mt-0.5 text-sm leading-5 text-text-sub-600">
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
                      aria-pressed={isSelected}
                      className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-label-sm shadow-custom-input transition-[background-color,color,box-shadow,transform] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base/40 ${
                        isSelected
                          ? "bg-primary-base text-static-white"
                          : "bg-bg-white-0 text-text-sub-600 hover:bg-bg-weak-25"
                      }`}
                    >
                      {isSelected && <Check size={14} weight="bold" aria-hidden="true" />}
                      {sk}
                    </button>
                  );
                })}
              </div>

              {/* Add custom skill input */}
              <form onSubmit={handleAddCustomSkill} className="flex gap-2 pt-3 border-t border-stroke-soft-200">
                <Input
                  aria-label="Add custom skill"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  placeholder="Add custom skill (e.g. Kubernetes, Blender)…"
                  className="flex-1"
                />
                <Button type="submit" variant="secondary" size="md">
                  <Plus size={16} weight="regular" />
                  Add
                </Button>
              </form>

              <div className="text-xs text-text-sub-600">
                Selected skills: <span className="font-semibold text-text-strong-950">{selectedSkills.length}</span>
              </div>
            </div>
          )}

          {/* STEP 4: WHAT ARE YOU LOOKING FOR? */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-label-lg text-text-strong-950">
                  What are you looking for?
                </h2>
                <p className="mt-0.5 text-sm leading-5 text-text-sub-600">
                  Select all opportunities that interest you right now.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {LOOKING_FOR_OPTIONS.map((item) => {
                  const isChecked = lookingFor.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={isChecked}
                      onClick={() => handleToggleLookingFor(item)}
                      className={`flex min-h-12 items-center justify-between rounded-10 px-3 py-2.5 text-left shadow-custom-input transition-[background-color,color,box-shadow,transform] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base/40 ${
                        isChecked
                          ? "bg-primary-base text-static-white"
                          : "bg-bg-white-0 text-text-sub-600 hover:bg-bg-weak-25"
                      }`}
                    >
                      <span className="text-sm font-semibold">{item}</span>
                      <span
                        aria-hidden="true"
                        className={`flex size-5 items-center justify-center rounded-full text-xs ${
                          isChecked ? "bg-static-white text-primary-base" : "border border-stroke-soft-200"
                        }`}
                      >
                        {isChecked && <Check size={12} weight="regular" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: WHAT CAN YOU OFFER? */}
          {step === 5 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-label-lg text-text-strong-950">
                  What can you offer?
                </h2>
                <p className="mt-0.5 text-sm leading-5 text-text-sub-600">
                  How can you help other members of Angkatan 5?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {CAN_OFFER_OPTIONS.map((item) => {
                  const isChecked = canOffer.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={isChecked}
                      onClick={() => handleToggleCanOffer(item)}
                      className={`flex min-h-12 items-center justify-between rounded-10 px-3 py-2.5 text-left shadow-custom-input transition-[background-color,color,box-shadow,transform] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base/40 ${
                        isChecked
                          ? "bg-primary-base text-static-white"
                          : "bg-bg-white-0 text-text-sub-600 hover:bg-bg-weak-25"
                      }`}
                    >
                      <span className="text-sm font-semibold">{item}</span>
                      <span
                        aria-hidden="true"
                        className={`flex size-5 items-center justify-center rounded-full text-xs ${
                          isChecked ? "bg-static-white text-primary-base" : "border border-stroke-soft-200"
                        }`}
                      >
                        {isChecked && <Check size={12} weight="regular" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stepper navigation footer */}
          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-stroke-soft-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1">
              {step > 1 ? (
                <Button type="button" variant="outline" size="sm" onClick={() => setStep(step - 1)}
                >
                  <CaretLeftIcon size={16} weight="regular" />
                  Back
                </Button>
              ) : (
                <Button type="button" variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>Skip for now</Button>
              )}
              <Button type="button" variant="ghost" size="sm" onClick={() => { localStorage.setItem("a5_onboarding_draft", JSON.stringify({ name, location, batch, role, company, industry, experience, bio, skills: selectedSkills, lookingFor, canOffer })); setShowCelebration(false); addToast("Draft saved", "You can continue setting up your profile later.", "success"); }}>Save draft</Button>
            </div>

            {step < 5 ? (
              <Button type="button" variant="primary" size="sm" disabled={!canContinue} onClick={() => setStep(step + 1)}
              >
                Next
                <CaretRightIcon size={16} weight="regular" />
              </Button>
            ) : (
              <Button type="button" variant="primary" size="sm" onClick={handleComplete} >
                Complete profile
                <Check size={16} weight="regular" className="ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-strong-950/40 backdrop-blur-sm p-4">
          <div role="status" aria-live="polite" className="w-full max-w-sm rounded-16 border border-stroke-soft-200 bg-bg-white-0 p-6 text-center shadow-custom-md">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-lighter text-success-base">
                <Check size={28} weight="bold" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-text-strong-950">Profile complete!</h3>
              <p className="mt-1 text-sm leading-5 text-text-sub-600">Your profile is ready. Taking you to the dashboard.</p>
              <div className="mx-auto mt-5 h-1 w-24 overflow-hidden rounded-full bg-bg-weak-50">
                <div className="h-full w-full origin-left animate-[progress_2.2s_linear_forwards] rounded-full bg-primary-base" />
              </div>
          </div>
          <style>{`@keyframes progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
        </div>
      )}
    </div>
  );
}
