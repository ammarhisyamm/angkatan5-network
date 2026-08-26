"use client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
const INDUSTRY_DATA = [
  { name: "Technology", count: 48, fill: "#2563eb" },
  { name: "Design", count: 36, fill: "#3b82f6" },
  { name: "Business", count: 32, fill: "#60a5fa" },
  { name: "Marketing", count: 28, fill: "#93c5fd" },
  { name: "Finance", count: 22, fill: "#38bdf8" },
  { name: "Creative & Media", count: 16, fill: "#a855f7" },
];
export default function IndustryChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={INDUSTRY_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
        <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} />
        <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#64748b" }} />
        <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
        <Bar dataKey="count" fill="#2563eb" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
