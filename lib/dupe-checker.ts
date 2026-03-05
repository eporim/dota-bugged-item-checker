import { knownDupedOriginalIds } from "@/data/dupe-list";
import type { DupedItem, DupeCheckResult } from "@/types/dupe";
import type { SteamItem } from "@/types/steam";

export function checkInventory(
  items: SteamItem[],
  steamid64: string
): DupeCheckResult {
  const dupedItems: DupedItem[] = [];
  const baseUrl = `https://steamcommunity.com/profiles/${steamid64}/inventory`;

  for (const item of items) {
    const originalId = String(item.original_id ?? item.id);
    if (knownDupedOriginalIds.has(originalId)) {
      dupedItems.push({
        assetId: String(item.id),
        originalId,
        defindex: item.defindex,
        inventoryLink: `${baseUrl}#570_2_${item.id}`,
      });
    }
  }

  return {
    dupedItems,
    totalChecked: items.length,
  };
}
