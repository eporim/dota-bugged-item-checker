export interface DupedItemGem {
  type: "ethereal" | "prismatic";
  value?: string;
}

export interface DupedItem {
  assetId: string;
  originalId: string;
  defindex: number;
  inventoryLink: string;
  imageUrl?: string;
  itemName?: string;
  gems?: DupedItemGem[];
}

export interface DupeCheckResult {
  dupedItems: DupedItem[];
  totalChecked: number;
}
