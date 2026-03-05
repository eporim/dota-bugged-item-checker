import type {
  GetPlayerItemsResponse,
  SteamItem,
} from "@/types/steam";
import { SteamApiError } from "@/types/steam";

const STEAM_API_BASE = "https://api.steampowered.com";
const STEAMID64_REGEX = /^\d{17}$/;
const VANITY_REGEX = /^[a-zA-Z0-9_-]+$/;

function getApiKey(): string {
  const key = process.env.STEAM_API_KEY;
  if (!key) {
    throw new SteamApiError("STEAM_API_KEY is not configured");
  }
  return key;
}

export async function resolveSteamId(input: string): Promise<string> {
  const trimmed = input.trim();

  const steamIdMatch = trimmed.match(/(\d{17})/);
  if (steamIdMatch) {
    return steamIdMatch[1];
  }

  const vanityUrl = trimmed
    .replace(/^https?:\/\//, "")
    .replace(/steamcommunity\.com\/id\//, "")
    .replace(/steamcommunity\.com\/profiles\//, "")
    .replace(/\/$/, "")
    .split("/")[0];

  if (STEAMID64_REGEX.test(vanityUrl)) {
    return vanityUrl;
  }

  if (!VANITY_REGEX.test(vanityUrl)) {
    throw new SteamApiError("Invalid Steam profile URL or ID");
  }

  const url = `${STEAM_API_BASE}/ISteamUser/ResolveVanityURL/v1/?key=${getApiKey()}&vanityurl=${encodeURIComponent(vanityUrl)}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    throw new SteamApiError(
      "Failed to resolve Steam ID",
      res.status,
      "RESOLVE_FAILED"
    );
  }

  if (data.response?.success === 42) {
    throw new SteamApiError("Steam profile not found");
  }

  const steamid = data.response?.steamid;
  if (!steamid) {
    throw new SteamApiError("Failed to resolve Steam ID");
  }

  return steamid;
}

export async function getPlayerItems(
  steamid64: string
): Promise<{ items: SteamItem[] }> {
  if (!STEAMID64_REGEX.test(steamid64)) {
    throw new SteamApiError("Invalid Steam ID format");
  }

  const url = `${STEAM_API_BASE}/IEconItems_570/GetPlayerItems/v1/?key=${getApiKey()}&steamid=${steamid64}`;
  const res = await fetch(url);
  const data: GetPlayerItemsResponse = await res.json();

  if (res.status === 429) {
    throw new SteamApiError(
      "Steam API rate limit exceeded. Please try again later.",
      429,
      "RATE_LIMITED"
    );
  }

  const status = data.result?.status;
  if (status === 8) {
    throw new SteamApiError("Invalid Steam ID");
  }
  if (status === 15) {
    throw new SteamApiError("Inventory is set to private");
  }
  if (status === 18) {
    throw new SteamApiError("Steam profile does not exist");
  }
  if (status !== 1) {
    throw new SteamApiError(`Steam API error: status ${status}`);
  }

  const items = (data.result.items ?? []).map((item) => ({
    id: String(item.id),
    original_id: String(item.original_id ?? item.id),
    defindex: Number(item.defindex),
  }));

  return { items };
}

export { SteamApiError };
export type { SteamItem };
