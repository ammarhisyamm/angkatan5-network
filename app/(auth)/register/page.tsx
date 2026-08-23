"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [batch, setBatch] = useState("Angkatan 5 (2018)");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
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
    <div className="min-h-screen bg-kumo-tint flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <div className="inline-flex items-center justify-center size-14 rounded-xl bg-kumo-brand text-static-white font-bold text-2xl  mb-4">
          A5
        </div>
        <h1 className="text-page-title text-kumo-strong">
          Join Angkatan 5 Network
        </h1>
        <p className="mt-1 text-body text-kumo-subtle">
          Create your talent profile to connect with fellow alumni
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-kumo-base py-8 px-6 sm:px-10 shadow-xs border border-kumo-line rounded-xl flex flex-col gap-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="p-3 text-xs bg-error-lighter border border-error-light text-error-base rounded-xl font-medium">
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

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-kumo-subtle">
                School Batch
              </label>
              <select
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full h-10 px-3 bg-kumo-base text-kumo-strong border border-kumo-line rounded-xl text-sm focus:outline-none focus:border-kumo-brand focus:ring-2 focus:ring-kumo-brand/10"
              >
                <option value="Angkatan 5 (2018)">Angkatan 5 (2018) — Core Cohort</option>
                <option value="Angkatan 4 (2017)">Angkatan 4 (2017)</option>
                <option value="Angkatan 6 (2019)">Angkatan 6 (2019)</option>
                <option value="Faculty & Mentor">Faculty & Mentor</option>
              </select>
            </div>

            <Button type="submit" size="lg" isLoading={isLoading} className="w-full mt-3">
              Continue to Onboarding
            </Button>
          </form>

          <p className="text-center text-xs text-kumo-subtle">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-kumo-brand font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
