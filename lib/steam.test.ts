import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { resolveSteamId, getPlayerItems, SteamApiError } from "./steam";

beforeEach(() => {
  process.env.STEAM_API_KEY = "test-key";
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("resolveSteamId", () => {
  it("returns SteamID64 when input is already a 17-digit ID", async () => {
    const result = await resolveSteamId("76561198000000000");
    expect(result).toBe("76561198000000000");
  });

  it("extracts SteamID64 from profile URL", async () => {
    const result = await resolveSteamId("https://steamcommunity.com/profiles/76561198000000000");
    expect(result).toBe("76561198000000000");
  });

  it("extracts SteamID64 from URL with trailing slash", async () => {
    const result = await resolveSteamId("https://steamcommunity.com/profiles/76561198000000000/");
    expect(result).toBe("76561198000000000");
  });

  it("resolves vanity URL via Steam API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ response: { steamid: "76561198123456789" } }),
      })
    );

    const result = await resolveSteamId("https://steamcommunity.com/id/exampleuser");
    expect(result).toBe("76561198123456789");
  });

  it("throws SteamApiError when profile not found", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ response: { success: 42 } }),
      })
    );

    await expect(resolveSteamId("https://steamcommunity.com/id/nonexistent")).rejects.toThrow(
      SteamApiError
    );
  });

  it("throws SteamApiError for invalid format", async () => {
    await expect(resolveSteamId("not-a-valid-url!!!")).rejects.toThrow(SteamApiError);
  });
});

describe("getPlayerItems", () => {
  it("throws SteamApiError for invalid Steam ID format", async () => {
    await expect(getPlayerItems("123")).rejects.toThrow(SteamApiError);
  });

  it("returns items when Steam API succeeds", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          result: {
            status: 1,
            items: [{ id: "100", original_id: "200", defindex: 5000 }],
          },
        }),
      })
    );

    const result = await getPlayerItems("76561198000000000");
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toEqual({
      id: "100",
      original_id: "200",
      defindex: 5000,
    });
  });

  it("throws SteamApiError when inventory is private", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ result: { status: 15 } }),
      })
    );

    await expect(getPlayerItems("76561198000000000")).rejects.toThrow(
      "Inventory is set to private"
    );
  });
});
