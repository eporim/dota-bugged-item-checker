import Redis from "ioredis";
import {
  RateLimiterMemory,
  RateLimiterRedis,
  type IRateLimiterRedisOptions,
} from "rate-limiter-flexible";

const RATE_LIMIT_POINTS = 1;
const RATE_LIMIT_DURATION = 120;
const RATE_LIMIT_KEY_PREFIX = "rl:check:";

function initRateLimiter(): RateLimiterMemory | RateLimiterRedis {
  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    const redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      enableOfflineQueue: false,
      retryStrategy(times) {
        if (times > 3) return null;
        return Math.min(times * 100, 3000);
      },
    });
    return new RateLimiterRedis({
      storeClient: redis,
      points: RATE_LIMIT_POINTS,
      duration: RATE_LIMIT_DURATION,
      keyPrefix: RATE_LIMIT_KEY_PREFIX,
    } as IRateLimiterRedisOptions);
  }
  return new RateLimiterMemory({
    points: RATE_LIMIT_POINTS,
    duration: RATE_LIMIT_DURATION,
  });
}

const rateLimiter = initRateLimiter();

export async function checkRateLimit(ip: string): Promise<boolean> {
  try {
    await rateLimiter.consume(ip);
    return true;
  } catch {
    return false;
  }
}
