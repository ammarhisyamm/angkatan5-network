"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ShieldCheckIcon, UserCheckIcon, ArrowRightIcon } from "@phosphor-icons/react";

export default function LoginPage() {
  const router = useRouter();
  const { login, addToast } = useApp();
  const [email, setEmail] = useState("hisyam");
  const [password, setPassword] = useState("123456");
  const [loginRole, setLoginRole] = useState<"member" | "admin">("member");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = email.trim().toLowerCase();
    const pass = password.trim();
    if (!user || !pass) {
      setError("Please enter username and password");
      return;
    }
    if (pass !== "123456") {
      setError("Password salah — default 123456");
      return;
    }
    setIsLoading(true);
    setError("");
    setTimeout(() => {
      // Switch determines role when password is 123456
      if (loginRole === "admin") {
        login("admin@example.com");
        setIsLoading(false);
        router.push("/admin/dashboard");
        return;
      }
      if (loginRole === "member") {
        login("member@example.com");
        setIsLoading(false);
        router.push("/dashboard");
        return;
      }
      const success = login(email);
      setIsLoading(false);
      if (success) {
        if (email.toLowerCase().includes("admin")) router.push("/admin/dashboard");
        else router.push("/dashboard");
      } else setError("Account not found.");
    }, 400);
  };

  const handleQuickDemo = (demoEmail: string, destination: string) => {
    login(demoEmail);
    router.push(destination);
  };

  return (
    <div className="min-h-screen bg-bg-weak-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <div className="inline-flex items-center justify-center size-14 rounded-xl bg-primary-base text-title-h5 font-semibold text-static-white shadow-xs mb-4">A5</div>
        <h1 className="text-page-title text-text-strong-950">Angkatan 5 Network</h1>
        <p className="mt-1 text-sm leading-5 text-text-sub-600">Private talent directory for members of Angkatan 5 SMP & IHBS</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="flex flex-col gap-6 rounded-xl border border-stroke-soft-200 bg-bg-white-0 px-6 py-8 sm:px-10 shadow-xs">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <div className="rounded-xl border border-error-light bg-error-lighter p-3 text-xs leading-4 font-medium text-error-dark">{error}</div>}

            <Input label="Username" placeholder="hisyam" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-strong-950">Login as</label>
              <div className="flex items-center gap-1 rounded-lg bg-bg-weak-50 p-1 ring-1 ring-stroke-soft-200">
                <button type="button" onClick={() => setLoginRole("member")} className={`flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md px-2 text-sm font-medium transition-colors ${loginRole === "member" ? "bg-bg-white-0 text-text-strong-950 ring-1 ring-stroke-soft-200 shadow-sm" : "text-text-sub-600 hover:text-text-strong-950"}`}>
                  <UserCheckIcon size={14} weight="regular" /> As a Member
                </button>
                <button type="button" onClick={() => setLoginRole("admin")} className={`flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md px-2 text-sm font-medium transition-colors ${loginRole === "admin" ? "bg-bg-white-0 text-text-strong-950 ring-1 ring-stroke-soft-200 shadow-sm" : "text-text-sub-600 hover:text-text-strong-950"}`}>
                  <ShieldCheckIcon size={14} weight="regular" /> As an Admin
                </button>
              </div>
            </div>
            <Input label="Password" type="password" placeholder="123456" value={password} onChange={(e) => setPassword(e.target.value)} required />

            <div className="flex items-center justify-between text-xs leading-4">
              <label className="flex cursor-pointer items-center gap-2 text-text-sub-600">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="size-4 rounded border-stroke-soft-200 text-primary-base focus:ring-primary-base" />
                <span>Remember me</span>
              </label>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  addToast("Demo mode", "Password recovery is disabled for demo.", "info");
                }}
                className="font-medium text-primary-base hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <Button type="submit" size="lg" isLoading={isLoading} className="mt-2 w-full">
              Sign In
            </Button>
          </form>



          <p className="text-center text-xs leading-4 text-text-soft-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-primary-base hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
