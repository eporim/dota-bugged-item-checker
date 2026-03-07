<h1 align="center">Bugged Item Checker</h1>

<p align="center">
	<img alt="Bugged Item Checker" src="https://github.com/eporim/dota-bugged-item-checker/blob/0c0a47a2efdc958d1c1958fee39c84c4dd41ef66/public/D2BIC.png" width="50%" height="500">
</p>

Self-hosted Next.js app to check Dota 2 Steam inventories for duped items before buying or trading. Enter a Steam profile URL or SteamID64, and it scans the Dota 2 inventory against a known list of duped `original_id` values. Results are cached server-side (Redis) to reduce Steam API calls, and in your browser (localStorage, 7-day expiry) with a search history of previous profiles. Built with [Next.js](https://nextjs.org), [TanStack Query](https://tanstack.com/query), and [shadcn/ui](https://ui.shadcn.com).

## Usage

1. Enter a Steam profile URL (e.g. `https://steamcommunity.com/id/username`) or a SteamID64.
2. Click **Check**.
3. View any duped items found, with direct links to each item in the Steam inventory.

The checker resolves vanity URLs to SteamID64 automatically. Inventories must be public.

## Prerequisites

Before running your own instance, you need:

- [Node.js](https://nodejs.org) 20+
- [Redis](https://redis.io) (for server-side caching and rate limiting; required for multi-instance deployments)
- [Steam API key](https://steamcommunity.com/dev/apikey) (one-time setup; users do not need to register)

## Installation

```bash
git clone <your-repo-url>
cd bugged-item-checker
npm install
```

Copy `.env.example` to `.env` and fill in the required values. Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For production:

```bash
npm run build
npm start
```

### Example .env file

The `<>` placeholders indicate what to replace; do not include them in your actual values.

```env
# Required: Steam Web API key for GetPlayerItems (dupe detection needs original_id)
# Get one at https://steamcommunity.com/dev/apikey
STEAM_API_KEY=<your_steam_api_key>

# Required: Redis connection URL for server-side caching (6h TTL)
REDIS_URL=redis://localhost:6379
```

## Railpack / Railway

This project uses [Railpack](https://railpack.com/) for zero-config builds. Deploy to [Railway](https://railway.app/) or any platform that supports Railpack.

### Deploy to Railway

1. Connect your GitHub repo to [Railway](https://railway.app/)
2. Create a new project and select your repository
3. Railway detects the Node.js/Next.js app and builds with Railpack automatically
4. Set environment variables in the Railway dashboard:
   - `STEAM_API_KEY` — your Steam Web API key
   - `REDIS_URL` — Redis connection URL (e.g. `redis://host:port`)

### Local Railpack build

To build a container image locally with Railpack:

```bash
curl -fsSL https://railpack.com/install.sh | sh
railpack build
```

Requires [Docker](https://docs.docker.com/get-docker/) or BuildKit for container output.

## API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/check` | POST | Resolve Steam ID, fetch inventory (or Redis cache), run dupe check. Body: `{ steamIdOrUrl: string }` |
| `/api/resolve` | POST | Resolve vanity URL or profile URL to SteamID64. Body: `{ vanityUrl?: string, steamIdOrUrl?: string }` |

Testing CI/CD

