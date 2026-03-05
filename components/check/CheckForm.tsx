"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PiMagnifyingGlass } from "react-icons/pi";
import { useCheckInventory } from "@/data-hooks/useCheckInventory";
import { ResultList } from "@/components/check/ResultList";
import { SearchHistory } from "@/components/check/SearchHistory";

export function CheckForm() {
  const [input, setInput] = useState("");
  const {
    mutation,
    cachedResult,
    checkFromCache,
    handleRenew,
    searchVersion,
  } = useCheckInventory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    mutation.mutate(trimmed);
  };

  const displayData = cachedResult ?? mutation.data;
  const isFromCache = !!cachedResult || (mutation.data?.cached ?? false);
  const isLoading = mutation.isPending && !cachedResult;

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl flex-col gap-4">
      <SearchHistory
        searchVersion={searchVersion}
        onSelect={checkFromCache}
        onRenew={handleRenew}
        disabled={mutation.isPending}
      />
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

      {mutation.isError && (
        <p className="text-sm text-destructive" role="alert">
          {mutation.error.message}
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
