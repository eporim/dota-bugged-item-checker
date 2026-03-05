"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PiClockCounterClockwise, PiArrowClockwise } from "react-icons/pi";
import { getSearches, isExpired, type CachedSearch } from "@/lib/check-storage";

interface SearchHistoryProps {
  searchVersion: number;
  onSelect: (search: CachedSearch) => void;
  onRenew: (steamid64: string) => void;
  disabled?: boolean;
}

function formatLabel(label: string): string {
  const trimmed = label.trim();
  const match = trimmed.match(/steamcommunity\.com\/id\/([^/?#]+)/);
  if (match) return match[1];
  if (/^\d{17}$/.test(trimmed)) return `ID ${trimmed.slice(-6)}`;
  return trimmed.length > 24 ? `${trimmed.slice(0, 24)}…` : trimmed;
}

export function SearchHistory({
  searchVersion,
  onSelect,
  onRenew,
  disabled = false,
}: SearchHistoryProps) {
  const [searches, setSearches] = useState<CachedSearch[]>([]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setSearches(getSearches()));
    return () => cancelAnimationFrame(id);
  }, [searchVersion]);

  if (searches.length === 0) return null;

  return (
    <div className="w-full space-y-2">
      <p className="text-xs font-medium text-muted-foreground">
        Previous searches
      </p>
      <div className="flex flex-wrap gap-2">
        {searches.map((search) => {
          const expired = isExpired(search);
          return (
            <div
              key={search.steamid64}
              className="flex items-center gap-1 rounded-md border bg-muted/50"
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 px-2 text-xs font-normal"
                disabled={disabled}
                onClick={() => {
                  if (expired) return;
                  onSelect(search);
                }}
                aria-label={`Load ${formatLabel(search.displayLabel)}`}
              >
                <PiClockCounterClockwise className="size-3.5" aria-hidden />
                {formatLabel(search.displayLabel)}
                {expired && (
                  <span className="text-muted-foreground">(expired)</span>
                )}
              </Button>
              {expired && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  disabled={disabled}
                  onClick={() => onRenew(search.steamid64)}
                  aria-label={`Renew ${formatLabel(search.displayLabel)}`}
                >
                  <PiArrowClockwise className="size-3" aria-hidden />
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
