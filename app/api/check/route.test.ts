import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/steam", () => ({
  resolveSteamId: vi.fn().mockResolvedValue("76561198000000000"),
  getPlayerItems: vi.fn().mockResolvedValue({
    items: [{ id: "1", original_id: "999", defindex: 5000 }],
  }),
  SteamApiError: class SteamApiError extends Error {
    status?: number;
    code?: string;
    constructor(message: string, status?: number, code?: string) {
      super(message);
      this.name = "SteamApiError";
      this.status = status;
      this.code = code;
    }
  },
}));

vi.mock("@/lib/redis", () => ({
  getCachedInventory: vi.fn().mockResolvedValue(null),
  setCachedInventory: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ allowed: true }),
  getRateLimitStatus: vi.fn().mockResolvedValue({
    remainingSearches: 1,
  }),
}));

vi.mock("@/lib/dupe-checker", () => ({
  checkInventory: vi.fn().mockReturnValue({
    dupedItems: [],
    totalChecked: 1,
  }),
}));

async function callCheckRoute(body: { steamIdOrUrl?: string }) {
  const { POST } = await import("./route");
  const req = new NextRequest("http://localhost/api/check", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  return POST(req);
}

describe("POST /api/check", () => {
  it("returns 400 when steamIdOrUrl is missing", async () => {
    const res = await callCheckRoute({});
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("steamIdOrUrl is required");
  });

  it("returns 400 when steamIdOrUrl is not a string", async () => {
    const res = await callCheckRoute({ steamIdOrUrl: 123 as unknown as string });
    expect(res.status).toBe(400);
  });

  it("returns dupedItems and totalChecked on success", async () => {
    const res = await callCheckRoute({ steamIdOrUrl: "76561198000000000" });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty("dupedItems");
    expect(data).toHaveProperty("totalChecked");
    expect(data).toHaveProperty("steamid64");
    expect(data).toHaveProperty("cached");
    expect(Array.isArray(data.dupedItems)).toBe(true);
  });
});
