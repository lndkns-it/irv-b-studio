import { PrismaClient } from "@prisma/client";

/**
 * Shared Prisma client instance
 * 
 * A single client is reused across the worker to avoid opening redundant
 * database connections. Import this `prisma` instance wherever DB access
 * is needed.
 */
export const prisma = new PrismaClient();