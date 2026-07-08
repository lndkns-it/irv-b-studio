import { z } from "zod";

/**
 * Validation schemas for authentication.
 *
 * These run on the server to guarantee data integrity, regardless of any
 * client-side validation (which exists only for UX and can be bypassed).
 */

export const registerSchema = z.object({
    email: z.email("A valid email is required"),
    name: z.string().min(1, "Name is required").max(100),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(72, "Password is too long"),
    artistName: z.string().max(100).optional(),
});

export const loginSchema = z.object({
    email: z.email("A valid email is required"),
    password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;