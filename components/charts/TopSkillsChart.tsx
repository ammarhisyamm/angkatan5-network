"use client";
import { useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { useApp } from "@/lib/store/AppContext";

const FILLS = ["#111827", "#374151", "#6B7280", "#9CA3AF", "#D1D5DB"];

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
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#98A2B3" }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#98A2B3" }} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip cursor={{ fill: "rgba(17,24,39,0.06)" }} contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "12px", color: "#111827", fontSize: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }} labelStyle={{ color: "#111827", fontWeight: 600 }} itemStyle={{ color: "#111827" }} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
