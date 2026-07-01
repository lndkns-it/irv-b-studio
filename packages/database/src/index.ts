import { PrismaClient } from "@prisma/client";

/**
 * Shared Prisma client instance.
 *
 * A single client is reused across all apps (web and worker) to avoid opening
 * redundant database connections. Import this `prisma` instance wherever DB
 * access is needed.
 */
export const prisma = new PrismaClient();

// Re-export Prisma's generated types so consumers get full type safety
// without importing from "@prisma/client" directly.
export * from "@prisma/client";