import {
    CanActivate,
    ExecutionContext,
    Injectable
} from "@nestjs/common";
import { redis } from "../../infra/redis/redis.client";

@Injectable()
export class RateLimitGuard implements CanActivate {
    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const ip = req.ip;

        const key = `rate:${ip}`;
        const limit = 100; // req
        const window = 60; // seconds

        const count = await redis.incr(key);
        if (count === 1) {
            await redis.expire(key, window);
        }

        if (count > limit) {
            throw new Error("Rate limit exceeded");
        }

        return true;
    }
}
