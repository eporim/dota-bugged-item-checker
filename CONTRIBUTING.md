# Contributing to Bugged Item Checker

Thank you for your interest in contributing. This document covers setup, workflow, and code style.

## Setup

1. Fork and clone the repository.
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in required values (Steam API key, Redis URL).
4. Run the dev server: `npm run dev`

## Development

- **Lint:** `npm run lint`
- **Lint (fix):** `npm run lint:fix`
- **Typecheck:** `npm run typecheck`
- **Tests:** `npm test`

## Pull Request Process

1. Create a branch from `main` (e.g. `fix/rate-limit`, `feat/add-export`).
2. Make your changes. Ensure `npm run lint`, `npm run typecheck`, and `npm test` pass.
3. Open a PR with a clear description of the change.
4. Address any review feedback.

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

## Adding Dupe IDs

See [data/README.md](data/README.md) for how to add or update duped `original_id` values.
