"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";

export default function HomePage() {
  const router = useRouter();
  const { currentUser } = useApp();

  useEffect(() => {
    if (currentUser) {
      if (currentUser.roleType === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/dashboard");
      }
    } else {
      router.replace("/login");
    }
  }, [currentUser, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-weak-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary-base flex items-center justify-center text-static-white font-bold text-xl animate-pulse">
          A5
        </div>
        <p className="text-xs text-text-sub-600 font-medium">
          Entering Angkatan 5 Talent Network...
        </p>
      </div>
    </div>
  );
}
