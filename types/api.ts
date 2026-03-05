import type { DupedItem } from "./dupe";

export interface CheckRequest {
  steamIdOrUrl: string;
}

export interface CheckResponse {
  dupedItems: DupedItem[];
  totalChecked: number;
  steamid64: string;
  cached: boolean;
}

export interface ResolveRequest {
  vanityUrl?: string;
  steamIdOrUrl?: string;
}

export interface ResolveResponse {
  steamid64: string;
}
