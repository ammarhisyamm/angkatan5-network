"use client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
const TOP_SKILLS_DATA = [
  { name: "UI/UX Design", count: 32, fill: "#111827" },
  { name: "BizDev", count: 27, fill: "#374151" },
  { name: "Marketing", count: 21, fill: "#6B7280" },
  { name: "Software Eng", count: 19, fill: "#9CA3AF" },
  { name: "Finance", count: 16, fill: "#D1D5DB" },
];
export default function TopSkillsChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={TOP_SKILLS_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#98A2B3" }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#98A2B3" }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#fff", fontSize: "12px" }} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {TOP_SKILLS_DATA.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
