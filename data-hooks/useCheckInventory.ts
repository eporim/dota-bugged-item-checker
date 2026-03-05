"use client";

import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { CheckResponse } from "@/types/api";
import {
  getCachedBySteamId,
  saveSearch,
  renewSearch,
  type CachedSearch,
} from "@/lib/check-storage";

async function fetchCheck(steamIdOrUrl: string): Promise<CheckResponse> {
  const res = await fetch("/api/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ steamIdOrUrl }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Check failed");
  }
  return data;
}

export function useCheckInventory() {
  const [cachedResult, setCachedResult] = useState<CachedSearch | null>(null);
  const [searchVersion, setSearchVersion] = useState(0);

  const mutation = useMutation({
    mutationFn: fetchCheck,
    onSuccess: (data, variables) => {
      saveSearch(
        data.steamid64,
        variables,
        data.dupedItems,
        data.totalChecked
      );
      setCachedResult(null);
      setSearchVersion((v) => v + 1);
    },
  });

  const checkFromCache = useCallback((search: CachedSearch) => {
    setCachedResult(search);
  }, []);

  const handleRenew = useCallback((steamid64: string) => {
    renewSearch(steamid64);
    const updated = getCachedBySteamId(steamid64);
    setCachedResult(updated ?? null);
    setSearchVersion((v) => v + 1);
  }, []);

  const getCached = useCallback((steamid64: string) => {
    return getCachedBySteamId(steamid64);
  }, []);

  return {
    mutation,
    cachedResult,
    checkFromCache,
    handleRenew,
    getCached,
    searchVersion,
  };
}
