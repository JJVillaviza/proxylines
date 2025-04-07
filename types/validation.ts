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
  name: z.string().min(3).max(30).optional(),
  email: z.string().email().optional(),
  role: z.enum(["main", "branch"]).optional(),
  companyId: z.string().optional(),
  accountId: z.string().optional(),
});

export const companyValidation = z.object({
  businessName: z.string().min(3).max(31),
  brandName: z.string().min(3).max(31),
  description: z.string().min(20),
  vision: z.string().min(10),
  mission: z.string().min(10),
});

export const companyUpdateValidation = z.object({
  businessName: z.string().min(3).max(31).optional(),
  brandName: z.string().min(3).max(31).optional(),
  description: z.string().min(20).optional(),
  vision: z.string().min(10).optional(),
  mission: z.string().min(10).optional(),
});

export const serviceValidation = z.object({
  name: z.string().min(3).max(20),
  description: z.string().min(20),
  timeStart: z.string().time(),
  timeEnd: z.string().time(),
});

export const serviceUpdateValidation = z.object({
  name: z.string().min(3).max(20).optional(),
  description: z.string().min(20).optional(),
  timeStart: z.string().time().optional(),
  timeEnd: z.string().time().optional(),
});

export const requirementValidation = z.object({
  name: z.string().min(3).max(20),
  description: z.string().min(20),
});

export const requirementUpdateValidation = z.object({
  name: z.string().min(3).max(20).optional(),
  description: z.string().min(20).optional(),
});

export const clientValidation = z.object({
  firstName: z.string().min(3).max(30),
  middleName: z.string().min(3).max(15),
  lastName: z.string().min(3).max(15),
  phoneNumber: z.string().regex(/^(09|\+639)\d{9}$/),
  email: z.string().email(),
  username: z
    .string()
    .min(3)
    .max(31)
    .regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(3).max(255),
});

export const transactionValidation = z.object({
  status: z.enum(["ongoing", "pending", "done"]).optional(),
});
