"use client";
import { useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { useApp } from "@/lib/store/AppContext";

const BUCKETS = [
  { level: "1-2 Years", fill: "#93c5fd", test: (y: number) => y <= 2 },
  { level: "3-4 Years", fill: "#3b82f6", test: (y: number) => y > 2 && y <= 4 },
  { level: "5-6 Years", fill: "#1d4ed8", test: (y: number) => y > 4 && y <= 6 },
  { level: "7+ Years", fill: "#1e3a8a", test: (y: number) => y > 6 },
];

// Real seniority distribution from member experienceYears.
export default function ExperienceChart() {
  const { users } = useApp();
  const data = useMemo(
    () =>
      BUCKETS.map((b) => ({
        level: b.level,
        fill: b.fill,
        count: users.filter((u) => b.test(u.experienceYears || 0)).length,
      })),
    [users]
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="level" tick={{ fontSize: 11, fill: "#64748b" }} />
        <YAxis tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
        <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
