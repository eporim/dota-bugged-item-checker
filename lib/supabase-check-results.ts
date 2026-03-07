import type { DupedItem } from "@/types/dupe";
import { createServerSupabaseClient } from "./supabase";

const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

export interface StoredCheckResult {
  steamid64: string;
  dupedItems: DupedItem[];
  totalChecked: number;
  fetchedAt: string;
}

export async function getCachedCheckResult(
  steamid64: string
): Promise<StoredCheckResult | null> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("check_results")
      .select("steamid64, duped_items, total_checked, fetched_at")
      .eq("steamid64", steamid64)
      .single();

    if (error || !data) return null;

    const fetchedAt = new Date(data.fetched_at).getTime();
    if (Date.now() - fetchedAt > CACHE_TTL_MS) return null;

    return {
      steamid64: data.steamid64,
      dupedItems: (data.duped_items ?? []) as DupedItem[],
      totalChecked: data.total_checked ?? 0,
      fetchedAt: data.fetched_at,
    };
  } catch {
    return null;
  }
}

export async function upsertCheckResult(
  steamid64: string,
  dupedItems: DupedItem[],
  totalChecked: number
): Promise<void> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return;

  const now = new Date().toISOString();

  try {
    await supabase.from("check_results").upsert(
      {
        steamid64,
        duped_items: dupedItems,
        total_checked: totalChecked,
        fetched_at: now,
        updated_at: now,
      },
      { onConflict: "steamid64" }
    );
  } catch {
    // Non-fatal
  }
}

export async function insertRecentBuggedItems(
  steamid64: string,
  dupedItems: DupedItem[]
): Promise<void> {
  const supabase = createServerSupabaseClient();
  if (!supabase || dupedItems.length === 0) return;

  const rows = dupedItems.map((item) => ({
    steamid64,
    asset_id: item.assetId,
    original_id: item.originalId,
    defindex: item.defindex,
    inventory_link: item.inventoryLink,
    item_name: item.itemName ?? null,
    image_url: item.imageUrl ?? null,
    gems: item.gems ?? [],
  }));

  try {
    await supabase.from("recent_bugged_items").insert(rows);
  } catch {
    // Non-fatal
  }
}
