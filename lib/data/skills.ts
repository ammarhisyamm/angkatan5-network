import { Skill } from "../types";

// Skill taxonomy (category names only — memberCount starts at 0).
// Counts grow in real time as members add skills to their profiles.

export const initialSkills: Skill[] = [
  // Design
  { id: "sk-1", name: "UI/UX Design", category: "Design", memberCount: 0 },
  { id: "sk-2", name: "Design Systems", category: "Design", memberCount: 0 },
  { id: "sk-3", name: "User Research", category: "Design", memberCount: 0 },
  { id: "sk-4", name: "Product Design", category: "Design", memberCount: 0 },
  { id: "sk-5", name: "Graphic Design", category: "Design", memberCount: 0 },
  { id: "sk-6", name: "3D & Motion", category: "Design", memberCount: 0 },

  // Technology
  { id: "sk-7", name: "Software Development", category: "Technology", memberCount: 0 },
  { id: "sk-8", name: "React / Next.js", category: "Technology", memberCount: 0 },
  { id: "sk-9", name: "Node.js & Backend", category: "Technology", memberCount: 0 },
  { id: "sk-10", name: "Python & AI / ML", category: "Technology", memberCount: 0 },
  { id: "sk-11", name: "Mobile App (Flutter / React Native)", category: "Technology", memberCount: 0 },
  { id: "sk-12", name: "Cloud & DevOps", category: "Technology", memberCount: 0 },
  { id: "sk-13", name: "Cybersecurity", category: "Technology", memberCount: 0 },

  // Business & Product
  { id: "sk-14", name: "Business Development", category: "Business", memberCount: 0 },
  { id: "sk-15", name: "Product Management", category: "Business", memberCount: 0 },
  { id: "sk-16", name: "Entrepreneurship", category: "Business", memberCount: 0 },
  { id: "sk-17", name: "Operations Management", category: "Business", memberCount: 0 },
  { id: "sk-18", name: "Strategy Consulting", category: "Business", memberCount: 0 },
  { id: "sk-19", name: "Sales & Partnerships", category: "Business", memberCount: 0 },

  // Marketing
  { id: "sk-20", name: "Marketing", category: "Marketing", memberCount: 0 },
  { id: "sk-21", name: "Growth & Performance Marketing", category: "Marketing", memberCount: 0 },
  { id: "sk-22", name: "Brand Strategy", category: "Marketing", memberCount: 0 },
  { id: "sk-23", name: "Social Media Management", category: "Marketing", memberCount: 0 },
  { id: "sk-24", name: "SEO & SEM", category: "Marketing", memberCount: 0 },

  // Finance
  { id: "sk-25", name: "Finance", category: "Finance", memberCount: 0 },
  { id: "sk-26", name: "Accounting & Tax", category: "Finance", memberCount: 0 },
  { id: "sk-27", name: "Venture Capital & Investment", category: "Finance", memberCount: 0 },
  { id: "sk-28", name: "Financial Modeling", category: "Finance", memberCount: 0 },

  // Media & Creative
  { id: "sk-29", name: "Photography", category: "Media & Creative", memberCount: 0 },
  { id: "sk-30", name: "Video Editing & Production", category: "Media & Creative", memberCount: 0 },
  { id: "sk-31", name: "Content Creation", category: "Media & Creative", memberCount: 0 },
  { id: "sk-32", name: "Teaching & Coaching", category: "Media & Creative", memberCount: 0 },
];
