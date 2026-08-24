import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";
import { AppProvider } from "@/lib/store/AppContext";
import { ToastContainer } from "@/components/ui/ToastContainer";

export const metadata: Metadata = {
  title: "Angkatan 5 Network — Private Community Talent Network",
  description:
    "Discover skills, professional backgrounds, career opportunities, and collaboration partners across Angkatan 5 SMP & IHBS.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased font-sans light">
      <body className="min-h-full flex flex-col bg-white text-kumo-strong selection:bg-kumo-brand selection:text-static-white">
        <AppProvider>
          {children}
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}
