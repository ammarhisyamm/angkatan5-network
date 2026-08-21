export type UserStatus =
  | "Available to Help"
  | "Open to Work"
  | "Open to Collaboration"
  | "Hiring";

export type LookingForOption =
  | "Open to Work"
  | "Freelance"
  | "Collaboration"
  | "Mentorship"
  | "Networking";

export type CanOfferOption =
  | "Consultation"
  | "Mentoring"
  | "Collaboration"
  | "Hiring"
  | "Professional Help";

export type UserVisibility = "community" | "hidden";

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  batch: string;
  location: string;
  role: string;
  company: string;
  industry: string;
  experience: string;
  experienceYears: number;
  bio: string;
  skills: string[];
  status: UserStatus;
  lookingFor: LookingForOption[];
  canOffer: CanOfferOption[];
  profileCompletion: number;
  visibility: UserVisibility;
  roleType: "member" | "admin";
  verified?: boolean;
  suspended?: boolean;
  joinedAt: string;
  phone?: string;
  linkedin?: string;
  portfolio?: string;
  website?: string;
  experiences?: ExperienceItem[];
}

export type SkillCategory =
  | "Design"
  | "Technology"
  | "Business"
  | "Marketing"
  | "Finance"
  | "Media & Creative"
  | "Other";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  memberCount: number;
}

export type OpportunityCategory =
  | "Jobs"
  | "Freelance"
  | "Collaboration"
  | "Internship"
  | "Hiring"
  | "Mentorship"
  | "Business";

export type OpportunityType =
  | "Full-time"
  | "Part-time"
  | "Freelance"
  | "Internship"
  | "Collaboration"
  | "Mentorship";

export type OpportunityStatus = "Pending" | "Approved" | "Published" | "Archived";

export interface Opportunity {
  id: string;
  title: string;
  category: OpportunityCategory;
  description: string;
  requirements: string[];
  requiredSkills: string[];
  location: string;
  type: OpportunityType;
  deadline: string;
  contactPreference: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  authorCompany: string;
  status: OpportunityStatus;
  createdAt: string;
}

export interface Connection {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: string;
  receiverId: string;
  message: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "error" | "info" | "warning";
}
