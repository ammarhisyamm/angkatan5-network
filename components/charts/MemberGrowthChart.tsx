"use client";
import { useMemo } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useApp } from "@/lib/store/AppContext";

// Cumulative member count per month over the last 7 months, from real joinedAt dates.
export default function MemberGrowthChart() {
  const { users } = useApp();
  const data = useMemo(() => {
    const months: { label: string; end: Date }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
      const label = `${start.toLocaleDateString("en-US", { month: "short" })} ${String(start.getFullYear()).slice(2)}`;
      months.push({ label, end });
    }
    return months.map((m) => ({
      month: m.label,
      members: users.filter((u) => new Date(u.joinedAt) < m.end).length,
    }));
  }, [users]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-stroke-soft-200)" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--color-text-soft-400)" }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "var(--color-text-soft-400)" }} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip contentStyle={{ backgroundColor: "var(--color-bg-white-0)", border: "1px solid var(--color-stroke-soft-200)", borderRadius: "12px", color: "var(--color-text-strong-950)", fontSize: "12px", boxShadow: "var(--shadow-regular-md)" }} labelStyle={{ color: "var(--color-text-strong-950)", fontWeight: 600 }} itemStyle={{ color: "var(--color-text-strong-950)" }} />
        <Line type="monotone" dataKey="members" stroke="var(--color-primary-base)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--color-primary-base)", strokeWidth: 2, stroke: "var(--color-bg-white-0)" }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
