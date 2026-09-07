"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ShieldCheckIcon, UserCheckIcon } from "@phosphor-icons/react";
import { isAdminRole } from "@/lib/types";

// Static shortcuts (work even before store hydrates).
// Additional accounts (created via Admin Management) resolve dynamically by username.
const KNOWN_USERS: Record<string, { memberEmail?: string; adminEmail?: string }> = {
  hisyam: { memberEmail: "member@example.com", adminEmail: "admin@example.com" },
  dudin: { memberEmail: "dudin@example.com", adminEmail: "admin@example.com" },
  farrasabyan: { memberEmail: "farrasabyan@example.com" },
  farras: { memberEmail: "farrasabyan@example.com" },
  fakhryalfitra: { adminEmail: "fakhry@example.com" },
  fakhry: { adminEmail: "fakhry@example.com" },
};

const getQueryParam = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(key);
};

export default function LoginPage() {
  const router = useRouter();
  const { login, addToast, currentUser, isLoading: authLoading, users } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginRole, setLoginRole] = useState<"member" | "admin">("member");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState<"username" | "password" | null>(null);

  // Already logged in → go to workspace. Show middleware reason if any.
  React.useEffect(() => {
    if (getQueryParam("error") === "admin_only") {
      setError("Halaman admin khusus admin — login sebagai admin dulu.");
    }
  }, []);
  React.useEffect(() => {
    if (!authLoading && currentUser) {
      const next = getQueryParam("next");
      if (isAdminRole(currentUser.roleType)) {
        router.replace(next && next.startsWith("/admin") ? next : "/admin/dashboard");
      } else {
        router.replace(next && next.startsWith("/") && !next.startsWith("/admin") ? next : "/dashboard");
      }
    }
  }, [authLoading, currentUser, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = email.trim().toLowerCase();
    const pass = password.trim();
    setFieldError(null);
    if (!user && !pass) {
      setFieldError(null);
      setError("Masukkan username dan password dulu.");
      return;
    }
    if (!user) {
      setFieldError("username");
      setError("Username belum diisi — coba “hisyam”, “dudin”, “farrasabyan”, atau “fakhryalfitra”.");
      return;
    }
    if (!pass) {
      setFieldError("password");
      setError("Password belum diisi — default “123456”.");
      return;
    }
    if (pass !== "123456") {
      setFieldError("password");
      setError("Password salah — default “123456”.");
      return;
    }
    const known = KNOWN_USERS[user];
    // Dynamic fallback: accounts created via Admin Management resolve by username
    const dynamicUser = !known
      ? users.find(
          (u: any) =>
            u.username?.toLowerCase() === user ||
            u.email.toLowerCase() === user
        )
      : null;
    if (!known && !dynamicUser) {
      setFieldError("username");
      setError(`Username “${email.trim()}” tidak ditemukan — coba “hisyam”, “dudin”, “farrasabyan”, atau “fakhryalfitra”.`);
      return;
    }
    setIsLoading(true);
    setError("");
    setTimeout(() => {
      // Switch determines role when password is 123456.
      // hisyam & dudin can log in as Member or as Admin (superadmin).
      const goNext = (fallback: string, adminFallback: boolean) => {
        const next = getQueryParam("next");
        if (adminFallback) {
          router.push(next && next.startsWith("/admin") ? next : fallback);
        } else {
          router.push(next && next.startsWith("/") && !next.startsWith("/admin") && !next.startsWith("/login") ? next : fallback);
        }
      };
      if (loginRole === "admin") {
        const adminEmail = known?.adminEmail || (dynamicUser && isAdminRole(dynamicUser.roleType) ? dynamicUser.email : null);
        if (!adminEmail) {
          setIsLoading(false);
          setFieldError(null);
          setError(`Akun “${email.trim()}” terdaftar sebagai member, bukan admin.`);
          return;
        }
        const ok = login(adminEmail, rememberMe);
        setIsLoading(false);
        if (ok) goNext("/admin/dashboard", true);
        else setError("Akun admin tidak ditemukan.");
        return;
      }
      const targetEmail = known?.memberEmail || dynamicUser?.email || email;
      const success = login(targetEmail, rememberMe);
      setIsLoading(false);
      if (success) {
        try {
          localStorage.setItem("a5_member_email", targetEmail.toLowerCase());
        } catch {}
        goNext("/dashboard", false);
      } else setError("Akun tidak ditemukan — coba “hisyam”, “dudin”, atau “farrasabyan”.");
    }, 400);
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

            <Input label="Username" placeholder="Masukkan username" value={email} onChange={(e) => { setEmail(e.target.value); if (fieldError === "username") { setFieldError(null); setError(""); } }} required className={fieldError === "username" ? "ring-error-base focus:ring-error-base/40" : undefined} />
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
            <Input label="Password" type="password" placeholder="Masukkan password" value={password} onChange={(e) => { setPassword(e.target.value); if (fieldError === "password") { setFieldError(null); setError(""); } }} required className={fieldError === "password" ? "ring-error-base focus:ring-error-base/40" : undefined} />

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
