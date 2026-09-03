import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name minimal 2 karakter").max(50, "Name maksimal 50 karakter"),
  email: z.string().email("Email tidak valid"),
  location: z.string().max(100).optional(),
  batch: z.string().max(50).optional(),
  role: z.string().min(2).max(50),
  company: z.string().max(50).optional(),
  bio: z.string().max(500, "Bio maksimal 500 karakter").optional(),
});

export const opportunitySchema = z.object({
  title: z.string().min(5, "Title minimal 5 karakter").max(100),
  description: z.string().min(20, "Deskripsi minimal 20 karakter").max(2000),
  location: z.string().min(2).max(100),
  deadline: z.string().refine((val) => !val || new Date(val) > new Date(), "Deadline harus di masa depan"),
});

export const loginSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(20),
});
