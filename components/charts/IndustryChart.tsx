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
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
        <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
        <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#64748b" }} />
        <Tooltip cursor={{ fill: "rgba(17,24,39,0.06)" }} contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "12px", color: "#111827", fontSize: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }} labelStyle={{ color: "#111827", fontWeight: 600 }} itemStyle={{ color: "#111827" }} />
        <Bar dataKey="count" fill="#111827" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
