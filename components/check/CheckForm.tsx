"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PiMagnifyingGlass } from "react-icons/pi";
import {
  useCheckInventory,
  type RateLimitError,
} from "@/data-hooks/useCheckInventory";
import { useRateLimitStatus } from "@/data-hooks/useRateLimitStatus";
import { ResultList } from "@/components/check/ResultList";
import { SearchHistory } from "@/components/check/SearchHistory";

function isRateLimitError(
  error: unknown
): error is RateLimitError & { message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "msBeforeNext" in error &&
    typeof (error as RateLimitError).msBeforeNext === "number"
  );
}

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}:${s.toString().padStart(2, "0")}` : `${s}s`;
}

export function CheckForm() {
  const queryClient = useQueryClient();
  const [input, setInput] = useState("");
  const [rateLimitEndTime, setRateLimitEndTime] = useState<number | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const {
    mutation,
    cachedResult,
    checkFromCache,
    handleRenew,
    searchVersion,
  } = useCheckInventory();
  const { data: rateLimitStatus } = useRateLimitStatus(true);

  useEffect(() => {
    if (
      rateLimitStatus?.remainingSearches === 0 &&
      rateLimitStatus?.msBeforeNext != null &&
      rateLimitStatus.msBeforeNext > 0 &&
      rateLimitEndTime === null
    ) {
      const msBeforeNext = rateLimitStatus.msBeforeNext;
      queueMicrotask(() => {
        setRateLimitEndTime(Date.now() + msBeforeNext);
      });
    }
  }, [rateLimitStatus?.remainingSearches, rateLimitStatus?.msBeforeNext, rateLimitEndTime]);

  useEffect(() => {
    if (rateLimitEndTime === null) return;
    const tick = () => {
      const remaining = Math.max(
        0,
        Math.ceil((rateLimitEndTime - Date.now()) / 1000)
      );
      setSecondsRemaining(remaining);
      if (remaining <= 0) {
        setRateLimitEndTime(null);
        mutation.reset();
        queryClient.invalidateQueries({ queryKey: ["rate-limit-status"] });
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [rateLimitEndTime, mutation, queryClient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    mutation.mutate(trimmed, {
      onError: (error) => {
        if (isRateLimitError(error)) {
          setRateLimitEndTime(Date.now() + error.msBeforeNext);
        }
      },
    });
  };

  const displayData = cachedResult ?? mutation.data;
  const isFromCache = !!cachedResult || (mutation.data?.cached ?? false);
  const isLoading = mutation.isPending && !cachedResult;

  const isRateLimited =
    rateLimitEndTime !== null && secondsRemaining > 0;
  const showOtherError =
    mutation.isError && !isRateLimitError(mutation.error);

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl flex-col gap-4">
      <SearchHistory
        searchVersion={searchVersion}
        onSelect={checkFromCache}
        onRenew={handleRenew}
        disabled={mutation.isPending}
      />
      {rateLimitStatus !== undefined && rateLimitStatus.remainingSearches > 0 && (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {rateLimitStatus.remainingSearches} search
          {rateLimitStatus.remainingSearches !== 1 ? "es" : ""} remaining
        </p>
      )}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          type="text"
          placeholder="Steam profile URL or SteamID64"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={mutation.isPending}
          className="flex-1"
          aria-label="Steam profile URL or SteamID64"
        />
        <Button type="submit" disabled={mutation.isPending}>
          <PiMagnifyingGlass className="size-4" aria-hidden />
          Check
        </Button>
      </div>

      {isRateLimited && (
        <div
          className="flex flex-col gap-1 text-sm text-destructive"
          role="alert"
        >
          <p>Rate limit reached. You can search again in:</p>
          <p className="font-mono font-medium tabular-nums">
            {formatCountdown(secondsRemaining)}
          </p>
        </div>
      )}

      {showOtherError && (
        <p className="text-sm text-destructive" role="alert">
          {(mutation.error as Error).message}
        </p>
      )}

      {isLoading && (
        <ResultList
          dupedItems={[]}
          totalChecked={0}
          cached={false}
          isLoading
        />
      )}

      {displayData && (
        <ResultList
          dupedItems={displayData.dupedItems}
          totalChecked={displayData.totalChecked}
          cached={isFromCache}
        />
      )}
    </form>
  );
}
