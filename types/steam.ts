export interface SteamItem {
  id: string;
  original_id: string;
  defindex: number;
}

export interface GetPlayerItemsResponse {
  result: {
    status: number;
    num_backpack_slots?: number;
    items?: SteamItem[];
  };
}

export class SteamApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = "SteamApiError";
  }
}
