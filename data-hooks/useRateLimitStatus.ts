"use client";

import { useQuery } from "@tanstack/react-query";
import type { RateLimitInfo } from "@/types/api";

async function fetchRateLimitStatus(): Promise<RateLimitInfo> {
  const res = await fetch("/api/rate-limit-status");
  if (!res.ok) {
    return { remainingSearches: 1 };
  }
  return res.json();
}

export function useRateLimitStatus(enabled: boolean) {
  return useQuery({
    queryKey: ["rate-limit-status"],
    queryFn: fetchRateLimitStatus,
    enabled,
  });
}
