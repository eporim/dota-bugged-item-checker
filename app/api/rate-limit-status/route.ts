import { NextRequest, NextResponse } from "next/server";
import { getRateLimitStatus } from "@/lib/rate-limit";

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  const status = await getRateLimitStatus(ip);
  return NextResponse.json(status);
}
