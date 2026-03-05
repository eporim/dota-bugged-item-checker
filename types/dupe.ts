export interface DupedItem {
  assetId: string;
  originalId: string;
  defindex: number;
  inventoryLink: string;
}

export interface DupeCheckResult {
  dupedItems: DupedItem[];
  totalChecked: number;
}
