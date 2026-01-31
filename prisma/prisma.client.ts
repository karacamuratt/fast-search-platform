import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * PostgreSQL connection pool
 * - Prisma v7 adapter
 * - Better performance & control
 */
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,               // max connections
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
});

/**
 * Prisma adapter
 */
const adapter = new PrismaPg(pool);

/**
 * Global prisma instance (singleton)
 * - Prevents multiple connections in dev / hot reload
 */
declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

export const prisma =
    global.prisma ??
    new PrismaClient({
        adapter,
        log:
            process.env.NODE_ENV === "production"
                ? ["error"]
                : ["query", "info", "warn", "error"],
    });

if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
}
