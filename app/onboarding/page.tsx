"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
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
  const { currentUser, completeOnboarding } = useApp();
  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState(currentUser?.name || "Ammar Hisyam");
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

  return (
    <div className="min-h-screen bg-bg-weak-50 py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="mb-2 text-sm font-medium leading-5 text-text-sub-600">Profile setup</p>
          <h1 className="text-page-title text-text-strong-950">
            Welcome to Angkatan 5 Talent Network
          </h1>
          <p className="mt-1 text-sm leading-5 text-text-sub-600">
            Complete your profile so your peers can discover your skills and opportunities.
          </p>
        </div>

        {/* Stepper indicator */}
        <div className="bg-bg-white-0 rounded-xl border border-stroke-soft-200 p-4 mb-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0 bg-bg-weak-50 -translate-y-1/2 z-0" />
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
                        ? "bg-primary-base text-static-white ring-4 ring-primary-alpha-10"
                        : "bg-bg-weak-50 text-text-soft-400"
                    }`}
                  >
                    {isCompleted ? <Check size={16} weight="regular" /> : <Icon className="size-4" />}
                  </button>
                  <span
                    className={`hidden text-xs font-medium leading-[18px] sm:block ${
                      isCurrent
                        ? "font-semibold text-primary-base"
                        : "text-text-soft-400"
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
        <div className="bg-bg-white-0 rounded-xl border border-stroke-soft-200 p-6 sm:p-8">
          {/* STEP 1: ABOUT YOU */}
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-section-title text-text-strong-950">
                  Step 1 — About You
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

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium leading-5 text-text-strong-950">
                  School Batch
                </label>
                <input
                  type="text"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  className="w-full h-10 rounded-lg border border-stroke-soft-200 bg-bg-white-0 px-3 text-sm text-text-strong-950"
                />
              </div>
            </div>
          )}

          {/* STEP 2: PROFESSIONAL */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-section-title text-text-strong-950">
                  Step 2 — Professional Background
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

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium leading-5 text-text-strong-950">
                    Primary Industry
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full h-10 px-3 bg-bg-white-0 text-text-strong-950 border border-stroke-soft-200 rounded-lg text-sm focus:outline-none focus:border-primary-base"
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
                <label className="text-sm font-medium leading-5 text-text-strong-950">
                  Years of Experience
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full h-10 px-3 bg-bg-white-0 text-text-strong-950 border border-stroke-soft-200 rounded-lg text-sm focus:outline-none focus:border-primary-base"
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
                <h2 className="text-section-title text-text-strong-950">
                  Step 3 — Your Skills
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
                      className={`px-3 py-1 rounded-xl text-xs font-medium border transition-colors ${
                        isSelected
                          ? "bg-primary-base text-static-white border-primary-base"
                          : "bg-bg-white-0 text-text-sub-600 border-stroke-soft-200 hover:bg-bg-weak-50"
                      }`}
                    >
                      {isSelected ? "✓ " : "+ "}
                      {sk}
                    </button>
                  );
                })}
              </div>

              {/* Add custom skill input */}
              <form onSubmit={handleAddCustomSkill} className="flex gap-2 pt-3 border-t border-stroke-soft-200">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  placeholder="Add custom skill (e.g. Kubernetes, Blender)..."
                  className="flex-1 h-10 px-3 bg-bg-white-0 text-text-strong-950 border border-stroke-soft-200 rounded-lg text-sm focus:outline-none focus:border-primary-base"
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
                <h2 className="text-section-title text-text-strong-950">
                  Step 4 — What are you looking for?
                </h2>
                <p className="mt-0.5 text-sm leading-5 text-text-sub-600">
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
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-colors flex items-center justify-between ${
                        isChecked
                          ? "border-primary-base bg-primary-alpha-10 text-primary-base"
                          : "border-stroke-soft-200 hover:border-stroke-soft-200 text-text-sub-600"
                      }`}
                    >
                      <span className="text-sm font-semibold">{item}</span>
                      <div
                        className={`size-5 rounded-full flex items-center justify-center text-xs ${
                          isChecked ? "bg-primary-base text-static-white" : "border border-stroke-soft-200"
                        }`}
                      >
                        {isChecked && <Check size={12} weight="regular" />}
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
                <h2 className="text-section-title text-text-strong-950">
                  Step 5 — What can you offer?
                </h2>
                <p className="mt-0.5 text-sm leading-5 text-text-sub-600">
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
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-colors flex items-center justify-between ${
                        isChecked
                          ? "border-success-base bg-success-lighter/50 text-success-dark"
                          : "border-stroke-soft-200 hover:border-stroke-soft-200 text-text-sub-600"
                      }`}
                    >
                      <span className="text-sm font-semibold">{item}</span>
                      <div
                        className={`size-5 rounded-full flex items-center justify-center text-xs ${
                          isChecked ? "bg-success-base text-static-white" : "border border-stroke-soft-200"
                        }`}
                      >
                        {isChecked && <Check size={12} weight="regular" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stepper navigation footer */}
          <div className="flex items-center justify-between pt-8 mt-6 border-t border-stroke-soft-200">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)}
              >
                <CaretLeftIcon size={16} weight="regular" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <Button type="button" variant="primary" onClick={() => setStep(step + 1)}
              >
                Next Step
                <CaretRightIcon size={16} weight="regular" />
              </Button>
            ) : (
              <Button type="button" variant="primary" size="lg" onClick={handleComplete} className="bg-success-base hover:bg-success-dark" >
                Complete Profile
                <Check size={16} weight="regular" className="ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-bg-white-0 p-8 text-center shadow-xl">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <span
                  key={i}
                  className="absolute animate-[fall_1.2s_ease-in_forwards] text-lg"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `-10%`,
                    animationDelay: `${Math.random() * 0.6}s`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                  }}
                >
                  {["🎉", "✨", "🎊", "💫"][i % 4]}
                </span>
              ))}
            </div>
            <div className="relative">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-lighter text-success-base">
                <Check size={28} weight="bold" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-text-strong-950">Profile complete!</h3>
              <p className="mt-1 text-sm text-text-sub-600">Welcome to the community 🎉</p>
              <div className="mt-5 flex items-center justify-center gap-2">
                <div className="h-2 w-32 overflow-hidden rounded-full bg-bg-weak-50 ring-1 ring-stroke-soft-200">
                  <div className="h-full w-[85%] rounded-full bg-text-strong-950" style={{ animation: "grow 0.8s ease-out forwards" }} />
                </div>
                <span className="text-sm font-semibold text-text-strong-950">85% → 100%</span>
              </div>
              <p className="mt-2 text-xs text-text-soft-400">Redirecting to dashboard…</p>
            </div>
          </div>
          <style>{`@keyframes fall { to { transform: translateY(110vh) rotate(360deg); opacity: 0; } } @keyframes grow { from { width: 85%; } to { width: 100%; } }`}</style>
        </div>
      )}
    </div>
  );
}
