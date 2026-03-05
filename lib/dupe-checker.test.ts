import { describe, it, expect } from "vitest";
import { checkInventory } from "./dupe-checker";
import { knownDupedOriginalIds } from "@/data/dupe-list";

const steamid64 = "76561198000000000";
const knownDupeId = Array.from(knownDupedOriginalIds)[0];

describe("checkInventory", () => {
  it("returns empty dupedItems when no items match the dupe list", () => {
    const items = [
      { id: "1", original_id: "99999999999", defindex: 5000 },
      { id: "2", original_id: "88888888888", defindex: 5001 },
    ];
    const result = checkInventory(items, steamid64);
    expect(result.dupedItems).toHaveLength(0);
    expect(result.totalChecked).toBe(2);
  });

  it("detects duped items and builds correct inventory links", () => {
    const items = [
      { id: "asset123", original_id: knownDupeId, defindex: 5000 },
      { id: "asset456", original_id: "99999999999", defindex: 5001 },
    ];
    const result = checkInventory(items, steamid64);
    expect(result.dupedItems).toHaveLength(1);
    expect(result.dupedItems[0]).toEqual({
      assetId: "asset123",
      originalId: knownDupeId,
      defindex: 5000,
      inventoryLink: `https://steamcommunity.com/profiles/${steamid64}/inventory#570_2_asset123`,
    });
    expect(result.totalChecked).toBe(2);
  });
});
