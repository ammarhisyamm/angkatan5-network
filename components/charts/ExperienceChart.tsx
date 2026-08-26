"use client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
const EXPERIENCE_DATA = [
  { level: "1-2 Years", count: 34, fill: "#93c5fd" },
  { level: "3-4 Years", count: 78, fill: "#3b82f6" },
  { level: "5-6 Years", count: 52, fill: "#1d4ed8" },
  { level: "7+ Years", count: 18, fill: "#1e3a8a" },
];
export default function ExperienceChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={EXPERIENCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="level" tick={{ fontSize: 11, fill: "#64748b" }} />
        <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
        <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {EXPERIENCE_DATA.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
