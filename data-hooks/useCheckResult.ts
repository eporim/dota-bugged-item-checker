"use client";

import { useQuery } from "@tanstack/react-query";
import type { DupedItem } from "@/types/dupe";

interface CheckResultResponse {
  steamid64: string;
  dupedItems: DupedItem[];
  totalChecked: number;
  fetchedAt: string;
}

async function fetchCheckResult(steamid64: string): Promise<CheckResultResponse | null> {
  const res = await fetch(`/api/check-results/${steamid64}`);
  if (!res.ok) return null;
  return res.json() as Promise<CheckResultResponse>;
}

export function useCheckResult(steamid64: string | null) {
  return useQuery({
    queryKey: ["check-result", steamid64],
    queryFn: () => (steamid64 ? fetchCheckResult(steamid64) : Promise.resolve(null)),
    enabled: !!steamid64,
    staleTime: 5 * 60 * 1000,
  });
}
