import type { DupedItem } from "@/types/dupe";

const STORAGE_KEY = "bugged-checker-searches";
const CACHE_DAYS = 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface CachedSearch {
  steamid64: string;
  displayLabel: string;
  dupedItems: DupedItem[];
  totalChecked: number;
  fetchedAt: number;
  expiresAt: number;
}

function getStoredSearches(): CachedSearch[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CachedSearch[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setStoredSearches(searches: CachedSearch[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
  } catch {
    // Storage full or disabled
  }
}

export function getSearches(): CachedSearch[] {
  const searches = getStoredSearches();
  return searches.sort((a, b) => b.fetchedAt - a.fetchedAt);
}

export function getCachedBySteamId(steamid64: string): CachedSearch | null {
  const searches = getStoredSearches();
  const match = searches.find((s) => s.steamid64 === steamid64);
  if (!match) return null;
  if (Date.now() > match.expiresAt) return null;
  return match;
}

export function saveSearch(
  steamid64: string,
  displayLabel: string,
  dupedItems: DupedItem[],
  totalChecked: number
): void {
  const now = Date.now();
  const expiresAt = now + CACHE_DAYS * MS_PER_DAY;
  const entry: CachedSearch = {
    steamid64,
    displayLabel,
    dupedItems,
    totalChecked,
    fetchedAt: now,
    expiresAt,
  };
  const searches = getStoredSearches().filter((s) => s.steamid64 !== steamid64);
  searches.unshift(entry);
  setStoredSearches(searches.slice(0, 50));
}

export function renewSearch(steamid64: string): void {
  const searches = getStoredSearches();
  const match = searches.find((s) => s.steamid64 === steamid64);
  if (!match) return;
  const now = Date.now();
  match.fetchedAt = now;
  match.expiresAt = now + CACHE_DAYS * MS_PER_DAY;
  setStoredSearches(searches);
}

export function removeSearch(steamid64: string): void {
  const searches = getStoredSearches().filter((s) => s.steamid64 !== steamid64);
  setStoredSearches(searches);
}

export function isExpired(search: CachedSearch): boolean {
  return Date.now() > search.expiresAt;
}
