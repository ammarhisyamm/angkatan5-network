"use client";
import { useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { useApp } from "@/lib/store/AppContext";

const FILLS = [
  "var(--color-primary-base)",
  "var(--color-primary-darker)",
  "var(--color-text-sub-600)",
  "var(--color-text-soft-400)",
  "var(--color-stroke-sub-300)",
];

// Top 5 skills by real member usage.
export default function TopSkillsChart() {
  const { users } = useApp();
  const data = useMemo(() => {
    const counts = new Map<string, number>();
    users.forEach((u) =>
      (u.skills || []).forEach((s) => counts.set(s, (counts.get(s) || 0) + 1))
    );
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 5)
      .map(([name, count], i) => ({ name, count, fill: FILLS[i % FILLS.length] }));
  }, [users]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-stroke-soft-200)" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--color-text-soft-400)" }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "var(--color-text-soft-400)" }} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip cursor={{ fill: "var(--color-primary-alpha-10)" }} contentStyle={{ backgroundColor: "var(--color-bg-white-0)", border: "1px solid var(--color-stroke-soft-200)", borderRadius: "12px", color: "var(--color-text-strong-950)", fontSize: "12px", boxShadow: "var(--shadow-regular-md)" }} labelStyle={{ color: "var(--color-text-strong-950)", fontWeight: 600 }} itemStyle={{ color: "var(--color-text-strong-950)" }} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
