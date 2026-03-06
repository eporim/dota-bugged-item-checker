import { NextRequest, NextResponse } from "next/server";
import { resolveSteamId, getPlayerItems, SteamApiError } from "@/lib/steam";
import { getCachedInventory, setCachedInventory } from "@/lib/redis";
import { checkInventory } from "@/lib/dupe-checker";
import { checkRateLimit, getRateLimitStatus } from "@/lib/rate-limit";

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimitResult = await checkRateLimit(ip);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit reached. Please wait before checking again.",
          msBeforeNext: rateLimitResult.msBeforeNext,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const steamIdOrUrl = body?.steamIdOrUrl;
    if (!steamIdOrUrl || typeof steamIdOrUrl !== "string") {
      return NextResponse.json(
        { error: "steamIdOrUrl is required" },
        { status: 400 }
      );
    }

    const steamid64 = await resolveSteamId(steamIdOrUrl.trim());

    let items: { id: string; original_id: string; defindex: number }[];
    let cached = false;

    const cachedData = await getCachedInventory(steamid64);
    if (cachedData) {
      items = cachedData.items;
      cached = true;
    } else {
      const { items: fetchedItems } = await getPlayerItems(steamid64);
      items = fetchedItems;
      await setCachedInventory(steamid64, { items });
    }

    const result = checkInventory(items, steamid64);
    const rateLimitStatus = await getRateLimitStatus(ip);

    return NextResponse.json({
      dupedItems: result.dupedItems,
      totalChecked: result.totalChecked,
      steamid64,
      cached,
      rateLimit: rateLimitStatus,
    });
  } catch (err) {
    if (err instanceof SteamApiError) {
      const status = err.status ?? 400;
      const code = err.code;
      if (code === "RATE_LIMITED") {
        return NextResponse.json(
          {
            error: err.message,
            msBeforeNext: 120_000,
          },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: err.message },
        { status: status >= 400 ? status : 400 }
      );
    }
    console.error(err);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
