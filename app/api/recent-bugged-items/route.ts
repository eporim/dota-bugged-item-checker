import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

const LIMIT = 50;

export async function GET() {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ items: [] });
  }

  try {
    const { data, error } = await supabase
      .from("recent_bugged_items")
      .select("*")
      .order("found_at", { ascending: false })
      .limit(LIMIT);

    if (error) {
      return NextResponse.json({ items: [] });
    }

    return NextResponse.json({
      items: data ?? [],
    });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
