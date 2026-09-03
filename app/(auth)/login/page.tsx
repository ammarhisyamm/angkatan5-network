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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = email.trim().toLowerCase();
    const pass = password.trim().toLowerCase();
    if (!user || !pass) {
      setError("Please enter username and password");
      return;
    }
    // hisyam + admin/member
    const isHisyamAdmin = (user === "hisyam" && pass === "admin") || (user === "hisyam admin" && pass === "admin");
    const isHisyamMember = (user === "hisyam" && pass === "member") || (user === "hisyam member" && pass === "member");
    setIsLoading(true);
    setError("");
    setTimeout(() => {
      if (isHisyamAdmin) {
        login("admin@example.com");
        setIsLoading(false);
        router.push("/admin/dashboard");
        return;
      }
      if (isHisyamMember) {
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
      } else setError("Account not found. Try hisyam / admin or hisyam / member.");
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
            <Input label="Password" type="password" placeholder="admin / member" value={password} onChange={(e) => setPassword(e.target.value)} required />

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

          <div className="border-t border-stroke-soft-200 pt-5">
            <div className="mb-3 text-sm font-medium leading-5 text-text-sub-600">Login as Hisyam — based on role</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setEmail("hisyam"); setPassword("member"); setTimeout(() => { login("member@example.com"); router.push("/dashboard"); }, 100); }}
                className="flex flex-col gap-1 rounded-xl border border-primary-base/20 bg-primary-alpha-10 p-3 text-left transition hover:bg-primary-alpha-10/80"
              >
                <span className="flex items-center gap-1 text-xs leading-4 font-medium text-primary-base">
                  <UserCheckIcon size={12} weight="regular" /> Member <ArrowRightIcon size={12} weight="regular" className="ml-auto" />
                </span>
                <span className="font-mono text-xs leading-4 text-text-strong-950">hisyam / member</span>
                <span className="text-xs leading-4 text-text-soft-400">→ Member dashboard</span>
              </button>
              <button
                type="button"
                onClick={() => { setEmail("hisyam"); setPassword("admin"); setTimeout(() => { login("admin@example.com"); router.push("/admin/dashboard"); }, 100); }}
                className="flex flex-col gap-1 rounded-xl border border-stroke-soft-200 bg-bg-weak-50 p-3 text-left transition hover:bg-bg-white-0 hover:shadow-xs"
              >
                <span className="flex items-center gap-1 text-xs leading-4 font-medium text-text-strong-950">
                  <ShieldCheckIcon size={12} weight="regular" /> Admin <ArrowRightIcon size={12} weight="regular" className="ml-auto text-text-soft-400" />
                </span>
                <span className="font-mono text-xs leading-4 text-text-strong-950">hisyam / admin</span>
                <span className="text-xs leading-4 text-text-soft-400">→ Admin dashboard</span>
              </button>
            </div>
            <p className="mt-2 text-center text-xs text-text-soft-400">or type username “hisyam” + password “member” / “admin” above</p>
          </div>

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
