"use client";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
const GROWTH_DATA = [
  { month: "Sep 25", members: 45 },
  { month: "Oct 25", members: 68 },
  { month: "Nov 25", members: 92 },
  { month: "Dec 25", members: 115 },
  { month: "Jan 26", members: 140 },
  { month: "Feb 26", members: 165 },
  { month: "Mar 26", members: 182 },
];
export default function MemberGrowthChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={GROWTH_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#98A2B3" }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#98A2B3" }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#fff", fontSize: "12px" }} />
        <Line type="monotone" dataKey="members" stroke="#111827" strokeWidth={2.5} dot={{ r: 3, fill: "#111827", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
