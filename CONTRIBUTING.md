# Contributing to Bugged Item Checker

This is an internal project. This document covers onboarding, development workflow, and code style for team members.

## Setup

1. Clone the repository: `git clone <repo-url>`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in required values:
   - `STEAM_API_KEY` — Steam Web API key
   - `REDIS_URL` — Redis connection URL (includes password)
   - `DOKPLOY_AUTH_TOKEN`, `DOKPLOY_APPLICATION_ID`, `DOKPLOY_URL` — CI/CD deployment credentials (optional for local dev)
4. Run the dev server: `npm run dev`

## Development

- **Lint:** `npm run lint`
- **Lint (fix):** `npm run lint:fix`
- **Typecheck:** `npm run typecheck`
- **Tests:** `npm test`

## Workflow

1. Create a branch from `main` (e.g. `fix/rate-limit`, `feat/add-export`).
2. Make your changes. Ensure `npm run lint`, `npm run typecheck`, and `npm test` pass locally.
3. Push your branch and open a PR against `main`.
4. CI runs automatically on PRs (lint, typecheck, test, build). All checks must pass.
5. Request review from a team member and address feedback.
6. Merge to `main` triggers automatic deployment via Dokploy.

## Code Style

- **TypeScript:** Strict mode. Avoid `any`; use proper types or interfaces. Import directly from specific files (e.g. `@/types/dupe`, `@/data-hooks/useCheckInventory`), not from barrel `index` files.
- **Styling:** TailwindCSS only. No custom CSS in `globals.css` unless necessary.
- **Icons:** Use `react-icons/pi` exclusively.
- **Components:** Prefer Next.js built-in components, then `/components/ui`, then RizzUI, then HTML primitives.
- **Data fetching:** Use TanStack Query. Put API client logic in `data-hooks/`.
- **Tests:** Place test files next to source (`*.test.ts`) or in `__tests__/` directories.

## Project Structure

- `app/` — Next.js App Router pages and API routes
- `components/check/` — Check form and result list
- `components/layout/` — Footer, Providers
- `components/ui/` — shadcn primitives
- `data/` — Dupe list and static data
- `data-hooks/` — TanStack Query hooks and API clients
- `lib/` — Steam API, Redis, dupe checker, rate limit
- `types/` — Shared TypeScript types

## Deployment

The project uses GitHub Actions for CI/CD (see `.github/workflows/ci.yml`).

**On every push and PR to `main`:**
- Runs `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`

**On push to `main` (after CI passes):**
- Automatically deploys to production via Dokploy

Deployment credentials are stored as GitHub Secrets:
- `DOKPLOY_AUTH_TOKEN`
- `DOKPLOY_APPLICATION_ID`
- `DOKPLOY_URL`

## Adding Dupe IDs

See [data/README.md](data/README.md) for how to add or update duped `original_id` values.
