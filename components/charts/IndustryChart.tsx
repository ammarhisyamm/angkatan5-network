"use client";
import { useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useApp } from "@/lib/store/AppContext";

// Real industry distribution from member profiles.
export default function IndustryChart() {
  const { users } = useApp();
  const data = useMemo(() => {
    const counts = new Map<string, number>();
    users.forEach((u) => {
      if (u.industry) counts.set(u.industry, (counts.get(u.industry) || 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [users]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-stroke-soft-200)" />
        <XAxis type="number" tick={{ fontSize: 11, fill: "var(--color-text-soft-400)" }} allowDecimals={false} />
        <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "var(--color-text-soft-400)" }} />
        <Tooltip cursor={{ fill: "var(--color-primary-alpha-10)" }} contentStyle={{ backgroundColor: "var(--color-bg-white-0)", border: "1px solid var(--color-stroke-soft-200)", borderRadius: "12px", color: "var(--color-text-strong-950)", fontSize: "12px", boxShadow: "var(--shadow-regular-md)" }} labelStyle={{ color: "var(--color-text-strong-950)", fontWeight: 600 }} itemStyle={{ color: "var(--color-text-strong-950)" }} />
        <Bar dataKey="count" fill="var(--color-primary-base)" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
