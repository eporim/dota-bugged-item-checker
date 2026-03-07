import { NextRequest, NextResponse } from "next/server";
import { getCachedCheckResult } from "@/lib/supabase-check-results";

const STEAMID64_REGEX = /^\d{17}$/;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ steamid64: string }> }
) {
  const { steamid64 } = await params;
  if (!steamid64 || !STEAMID64_REGEX.test(steamid64)) {
    return NextResponse.json({ error: "Invalid steamid64" }, { status: 400 });
  }

  const result = await getCachedCheckResult(steamid64);
  if (!result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
