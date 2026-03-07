"use client";

import { useQuery } from "@tanstack/react-query";

export interface RecentBuggedItem {
  id: string;
  steamid64: string;
  asset_id: string;
  original_id: string;
  defindex: number;
  inventory_link: string;
  item_name: string | null;
  image_url: string | null;
  gems: Array<{ type: string; value?: string }>;
  found_at: string;
}

interface RecentBuggedItemsResponse {
  items: RecentBuggedItem[];
}

async function fetchRecentBuggedItems(): Promise<RecentBuggedItem[]> {
  const res = await fetch("/api/recent-bugged-items");
  const data = (await res.json()) as RecentBuggedItemsResponse;
  return data.items ?? [];
}

export function useRecentBuggedItems() {
  return useQuery({
    queryKey: ["recent-bugged-items"],
    queryFn: fetchRecentBuggedItems,
    staleTime: 60 * 1000,
  });
}
