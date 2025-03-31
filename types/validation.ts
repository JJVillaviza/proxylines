import { z } from "zod";

export const registerValidation = z.object({
  name: z.string().min(3).max(30),
  email: z.string().email(),
  username: z
    .string()
    .min(3)
    .max(31)
    .regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(3).max(255),
});

export const loginValidation = z.object({
  username: z
    .string()
    .min(3)
    .max(31)
    .regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(3).max(255),
});

export const idValidation = z.object({
  id: z.string(),
});

export const branchValidation = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  // username: z.string().optional(),
  // password: z.string().optional(),
  role: z.enum(["main", "branch"]).optional(),
  companyId: z.string().optional(),
  accountId: z.string().optional(),
});
