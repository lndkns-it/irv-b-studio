import { PrismaClient } from "@prisma/client";

/**
 * Shared Prisma client instance (singleton).
 *
 * In development, frameworks with hot-reload (like Next.js) can re-run this
 * module many times, creating a new client each time and exhausting the DB
 * connection pool. Caching the client on `globalThis` prevents that.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Re-export Prisma's generated types for consumers.
export * from "@prisma/client";
