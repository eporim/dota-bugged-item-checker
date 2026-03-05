import Redis from "ioredis";
import type { SteamItem } from "@/types/steam";

const CACHE_TTL = 21600;
const CACHE_KEY_PREFIX = "inv:570:";

let redisClient: Redis | null = null;

function getRedis(): Redis | null {
  if (!process.env.REDIS_URL) {
    return null;
  }
  if (!redisClient) {
    redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) return null;
        return Math.min(times * 100, 3000);
      },
    });
  }
  return redisClient;
}

export async function getCachedInventory(
  steamid64: string
): Promise<{ items: SteamItem[] } | null> {
  const redis = getRedis();
  if (!redis) return null;

  try {
    const key = `${CACHE_KEY_PREFIX}${steamid64}`;
    const data = await redis.get(key);
    if (!data) return null;
    return JSON.parse(data) as { items: SteamItem[] };
  } catch {
    return null;
  }
}

export async function setCachedInventory(
  steamid64: string,
  data: { items: SteamItem[] },
  ttl = CACHE_TTL
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    const key = `${CACHE_KEY_PREFIX}${steamid64}`;
    await redis.setex(key, ttl, JSON.stringify(data));
  } catch {
    // Cache write failure is non-fatal
  }
}
