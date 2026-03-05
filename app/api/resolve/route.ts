/**
 * Public API: Resolve a Steam vanity URL or profile URL to SteamID64.
 * Used by external tools; the main UI uses /api/check which resolves internally.
 */
import { NextRequest, NextResponse } from "next/server";
import { resolveSteamId, SteamApiError } from "@/lib/steam";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const vanityUrl = body?.vanityUrl ?? body?.steamIdOrUrl;
    if (!vanityUrl || typeof vanityUrl !== "string") {
      return NextResponse.json(
        { error: "vanityUrl or steamIdOrUrl is required" },
        { status: 400 }
      );
    }

    const steamid64 = await resolveSteamId(vanityUrl.trim());
    return NextResponse.json({ steamid64 });
  } catch (err) {
    if (err instanceof SteamApiError) {
      return NextResponse.json(
        { error: err.message },
        { status: 400 }
      );
    }
    console.error(err);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
