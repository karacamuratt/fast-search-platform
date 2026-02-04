import { redis } from "../infra/redis/redis.client";

const IDEMPOTENCY_TTL = 60 * 60;

export async function acquireIdempotencyLock(
    productId: string
): Promise<boolean> {
    const key = `reindex:product:${productId}`;

    const result = await redis.set(
        key,
        "1",
        "EX",
        IDEMPOTENCY_TTL,
        "NX"
    );

    return result === "OK";
}
