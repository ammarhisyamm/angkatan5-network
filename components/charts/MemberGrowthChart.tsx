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
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#98A2B3" }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#98A2B3" }} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "12px", color: "#111827", fontSize: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }} labelStyle={{ color: "#111827", fontWeight: 600 }} itemStyle={{ color: "#111827" }} />
        <Line type="monotone" dataKey="members" stroke="#111827" strokeWidth={2.5} dot={{ r: 3, fill: "#111827", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
