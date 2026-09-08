"use client";
import { useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { useApp } from "@/lib/store/AppContext";

const BUCKETS = [
  { level: "1-2 Years", fill: "#D1D5DB", test: (y: number) => y <= 2 },
  { level: "3-4 Years", fill: "#9CA3AF", test: (y: number) => y > 2 && y <= 4 },
  { level: "5-6 Years", fill: "#374151", test: (y: number) => y > 4 && y <= 6 },
  { level: "7+ Years", fill: "#111827", test: (y: number) => y > 6 },
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
        <Tooltip cursor={{ fill: "rgba(17,24,39,0.06)" }} contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "12px", color: "#111827", fontSize: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }} labelStyle={{ color: "#111827", fontWeight: 600 }} itemStyle={{ color: "#111827" }} />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
