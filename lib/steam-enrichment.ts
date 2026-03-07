import type { DupedItem, DupedItemGem } from "@/types/dupe";

const STEAM_ICON_BASE = "https://steamcommunity-a.akamaihd.net/economy/image/";
const CACHE_TTL = 3600;

interface CommunityInventoryItem {
  id: string;
  classid: string;
  instanceid: string;
  amount?: number;
  pos?: number;
}

interface CommunityDescription {
  classid: string;
  instanceid: string;
  icon_url?: string;
  icon_url_large?: string;
  name?: string;
  descriptions?: Array<{ value?: string; type?: string }>;
}

interface CommunityInventoryResponse {
  success?: boolean;
  rgInventory?: Record<string, CommunityInventoryItem>;
  rgDescriptions?: Record<string, CommunityDescription>;
}

function parseGemsFromDescriptions(
  descriptions: CommunityDescription["descriptions"]
): DupedItemGem[] {
  const gems: DupedItemGem[] = [];
  if (!descriptions || !Array.isArray(descriptions)) return gems;

  const etherealRegex = /ethereal/i;
  const prismaticRegex = /prismatic/i;

  for (const d of descriptions) {
    const value = d?.value ?? "";
    if (etherealRegex.test(value)) {
      const match = value.match(/(?:ethereal[:\s]+)?(.+)/i);
      gems.push({ type: "ethereal", value: match?.[1]?.trim() || undefined });
    } else if (prismaticRegex.test(value)) {
      const match = value.match(/(?:prismatic[:\s]+)?(.+)/i);
      gems.push({ type: "prismatic", value: match?.[1]?.trim() || undefined });
    }
  }

  return gems;
}

function getDescriptionKey(classid: string, instanceid: string): string {
  const inst = instanceid === "0" ? "0" : instanceid;
  return `${classid}_${inst}`;
}

export async function enrichDupedItems(
  dupedItems: DupedItem[],
  steamid64: string
): Promise<DupedItem[]> {
  if (dupedItems.length === 0) return dupedItems;

  const url = `https://steamcommunity.com/profiles/${steamid64}/inventory/json/570/2`;
  let data: CommunityInventoryResponse;

  try {
    const res = await fetch(url, {
      headers: { "Accept": "application/json" },
      next: { revalidate: CACHE_TTL },
    });
    data = (await res.json()) as CommunityInventoryResponse;
  } catch {
    return dupedItems;
  }

  if (!data?.success || !data.rgInventory || !data.rgDescriptions) {
    return dupedItems;
  }

  const inv = data.rgInventory;
  const desc = data.rgDescriptions;

  return dupedItems.map((item) => {
    const invEntry = Object.values(inv).find((e) => e.id === item.assetId);
    if (!invEntry) return item;

    const key = getDescriptionKey(invEntry.classid, invEntry.instanceid);
    const d = desc[key] ?? desc[invEntry.classid];
    if (!d) return item;

    const imageUrl = d.icon_url_large ?? d.icon_url;
    const fullImageUrl = imageUrl
      ? imageUrl.startsWith("http")
        ? imageUrl
        : `${STEAM_ICON_BASE}${imageUrl}`
      : undefined;

    const gems = parseGemsFromDescriptions(d.descriptions);

    return {
      ...item,
      imageUrl: fullImageUrl,
      itemName: d.name ?? item.itemName,
      gems: gems.length > 0 ? gems : item.gems,
    };
  });
}
