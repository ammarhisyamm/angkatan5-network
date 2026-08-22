"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, UserCheck, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, addToast } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    setIsLoading(true);
    setError("");
    setTimeout(() => {
      const success = login(email);
      setIsLoading(false);
      if (success) {
        if (email.toLowerCase().includes("admin")) router.push("/admin/dashboard");
        else router.push("/dashboard");
      } else setError("Account not found. You can try the demo accounts below or register a new account.");
    }, 400);
  };

  const handleQuickDemo = (demoEmail: string, destination: string) => {
    login(demoEmail);
    router.push(destination);
  };

  return (
    <div className="min-h-screen bg-kumo-tint flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <div className="inline-flex items-center justify-center size-14 rounded-xl bg-kumo-brand text-title-h5 font-semibold text-static-white shadow-xs mb-4">A5</div>
        <h1 className="text-page-title text-kumo-strong">Angkatan 5 Network</h1>
        <p className="mt-1 text-sm leading-5 text-kumo-subtle">Private talent directory for members of Angkatan 5 SMP & IHBS</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="flex flex-col gap-6 rounded-lg border border-kumo-line bg-kumo-base px-6 py-8 sm:px-10 shadow-xs">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <div className="rounded-xl border border-error-light bg-error-lighter p-3 text-xs leading-4 font-medium text-error-dark">{error}</div>}

            <Input label="Email Address" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />

            <div className="flex items-center justify-between text-xs leading-4">
              <label className="flex cursor-pointer items-center gap-2 text-kumo-subtle">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="size-4 rounded border-kumo-line text-kumo-brand focus:ring-kumo-brand" />
                <span>Remember me</span>
              </label>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  addToast("Demo mode", "Password recovery is disabled for demo.", "info");
                }}
                className="font-medium text-kumo-brand hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <Button type="submit" size="lg" isLoading={isLoading} className="mt-2 w-full">
              Sign In
            </Button>
          </form>

          <div className="border-t border-kumo-line pt-5">
            <div className="mb-3 text-xs font-semibold uppercase leading-4 tracking-widest text-kumo-inactive">Instant Demo Access</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo("member@example.com", "/dashboard")}
                className="flex flex-col gap-1 rounded-xl border border-kumo-brand/20 bg-primary-alpha-10 p-3 text-left transition hover:bg-primary-alpha-10/80"
              >
                <span className="flex items-center gap-1 text-xs leading-4 font-medium text-kumo-brand">
                  <UserCheck className="size-3" /> Member <ArrowRight className="ml-auto size-3" />
                </span>
                <span className="font-mono text-xs leading-4 text-kumo-subtle">member@example.com</span>
                <span className="text-xs leading-4 text-kumo-inactive">Ammar Hisyam (Designer)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("admin@example.com", "/admin/dashboard")}
                className="flex flex-col gap-1 rounded-xl border border-kumo-line bg-kumo-tint p-3 text-left transition hover:bg-kumo-base hover:shadow-xs"
              >
                <span className="flex items-center gap-1 text-xs leading-4 font-medium text-kumo-strong">
                  <ShieldCheck className="size-3" /> Admin <ArrowRight className="ml-auto size-3 text-kumo-inactive" />
                </span>
                <span className="font-mono text-xs leading-4 text-kumo-subtle">admin@example.com</span>
                <span className="text-xs leading-4 text-kumo-inactive">Secretariat Admin</span>
              </button>
            </div>
          </div>

          <p className="text-center text-xs leading-4 text-kumo-inactive">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-kumo-brand hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
