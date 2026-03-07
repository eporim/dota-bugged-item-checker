import Redis from "ioredis";
import {
  RateLimiterMemory,
  RateLimiterRedis,
  type IRateLimiterRedisOptions,
} from "rate-limiter-flexible";

const RATE_LIMIT_POINTS = 10;
const RATE_LIMIT_DURATION = 3600;
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

export interface RateLimitResult {
  allowed: boolean;
  msBeforeNext?: number;
}

export interface RateLimitStatus {
  remainingSearches: number;
  msBeforeNext?: number;
}

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  try {
    const res = await rateLimiter.consume(ip);
    return { allowed: true, msBeforeNext: res.msBeforeNext };
  } catch (rejected) {
    const res = rejected as { msBeforeNext?: number };
    return {
      allowed: false,
      msBeforeNext: res?.msBeforeNext ?? RATE_LIMIT_DURATION * 1000,
    };
  }
}

export async function getRateLimitStatus(ip: string): Promise<RateLimitStatus> {
  try {
    const res = await rateLimiter.get(ip);
    if (!res) {
      return { remainingSearches: RATE_LIMIT_POINTS };
    }
    const remaining = Math.max(0, res.remainingPoints ?? 0);
    return {
      remainingSearches: remaining,
      msBeforeNext: remaining === 0 ? res.msBeforeNext : undefined,
    };
  } catch {
    return { remainingSearches: RATE_LIMIT_POINTS };
  }
}
