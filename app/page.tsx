"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";

export default function HomePage() {
  const router = useRouter();
  const { currentUser, isLoading } = useApp();

  useEffect(() => {
    if (isLoading) return;
    if (currentUser) {
      if (currentUser.roleType === "admin" || currentUser.roleType === "superadmin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/dashboard");
      }
    } else {
      router.replace("/login");
    }
  }, [currentUser, isLoading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-weak-50 p-6">
      <div className="flex flex-col items-center gap-3 rounded-20 border border-stroke-soft-200 bg-bg-white-0 px-8 py-7 text-center shadow-regular-xs">
        <div className="flex size-12 items-center justify-center rounded-10 bg-primary-base text-xl font-semibold text-static-white animate-pulse">
          A5
        </div>
        <p className="text-paragraph-xs text-text-sub-600">
          Entering Angkatan 5 Talent Network…
        </p>
      </div>
    </div>
  );
}
