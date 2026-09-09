"use client";
import { useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { useApp } from "@/lib/store/AppContext";

const BUCKETS = [
  { level: "1-2 Years", fill: "var(--color-stroke-sub-300)", test: (y: number) => y <= 2 },
  { level: "3-4 Years", fill: "var(--color-text-soft-400)", test: (y: number) => y > 2 && y <= 4 },
  { level: "5-6 Years", fill: "var(--color-primary-darker)", test: (y: number) => y > 4 && y <= 6 },
  { level: "7+ Years", fill: "var(--color-primary-base)", test: (y: number) => y > 6 },
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
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-stroke-soft-200)" />
        <XAxis dataKey="level" tick={{ fontSize: 11, fill: "var(--color-text-soft-400)" }} />
        <YAxis tick={{ fontSize: 11, fill: "var(--color-text-soft-400)" }} allowDecimals={false} />
        <Tooltip cursor={{ fill: "var(--color-primary-alpha-10)" }} contentStyle={{ backgroundColor: "var(--color-bg-white-0)", border: "1px solid var(--color-stroke-soft-200)", borderRadius: "12px", color: "var(--color-text-strong-950)", fontSize: "12px", boxShadow: "var(--shadow-regular-md)" }} labelStyle={{ color: "var(--color-text-strong-950)", fontWeight: 600 }} itemStyle={{ color: "var(--color-text-strong-950)" }} />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
