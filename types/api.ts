import type { DupedItem } from "./dupe";

export interface CheckRequest {
  steamIdOrUrl: string;
}

export interface RateLimitInfo {
  remainingSearches: number;
  msBeforeNext?: number;
}

export interface CheckResponse {
  dupedItems: DupedItem[];
  totalChecked: number;
  steamid64: string;
  cached: boolean;
  rateLimit?: RateLimitInfo;
}

export interface RateLimitErrorResponse {
  error: string;
  msBeforeNext?: number;
}

export interface ResolveRequest {
  vanityUrl?: string;
  steamIdOrUrl?: string;
}

export interface ResolveResponse {
  steamid64: string;
}
