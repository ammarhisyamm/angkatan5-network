"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [batch, setBatch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !batch) {
      setError("Please fill in all required fields.");
      return;
    }
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      register(name, email, batch);
      setIsLoading(false);
      router.push("/onboarding");
    }, 400);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col justify-center bg-bg-weak-50 px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-sm text-center">
        <div className="mb-3 inline-flex size-12 items-center justify-center rounded-10 bg-primary-base text-label-lg font-semibold text-static-white shadow-regular-xs">
          A5
        </div>
        <h1 className="text-title-h6 text-text-strong-950">
          Join Angkatan 5 Network
        </h1>
        <p className="mx-auto mt-1 max-w-[36ch] text-paragraph-xs text-text-sub-600">
          Create a profile and connect with fellow alumni.
        </p>
      </div>

      <div className="mx-auto mt-6 w-full max-w-sm">
        <div className="flex flex-col gap-5 rounded-10 border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div role="alert" className="rounded-10 border border-error-light bg-error-lighter p-3 text-paragraph-xs font-medium text-error-base">
                {error}
              </div>
            )}

            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Ammar Hisyam"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Select
              label="School Batch"
              value={batch}
              onValueChange={setBatch}
              placeholder="Select your batch"
              required
              items={[
                { value: "Angkatan 5 (2018)", label: "Angkatan 5 (2018) - Core Cohort" },
                { value: "Angkatan 4 (2017)", label: "Angkatan 4 (2017)" },
                { value: "Angkatan 6 (2019)", label: "Angkatan 6 (2019)" },
                { value: "Faculty & Mentor", label: "Faculty & Mentor" },
              ]}
            />

            <Button type="submit" size="md" isLoading={isLoading} className="mt-1 w-full">
              Continue to Onboarding
            </Button>
          </form>

          <p className="text-center text-xs text-text-sub-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary-base font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
