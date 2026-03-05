# Data

## Dupe List

The file `dupe-list.ts` contains known duped `original_id` values used to detect bugged items in Dota 2 Steam inventories. The list is sourced from the Bugged Ethereal guide and community reports.

### Adding IDs

1. Open `dupe-list.ts`.
2. Add new numeric IDs to `DUPE_ORIGINAL_ID_LIST` or `HIGH_TIER_DUPE_LIST` as appropriate.
3. IDs are converted to strings at runtime for lookup. Ensure each ID is a valid number.

### Structure

- `DUPE_ORIGINAL_ID_LIST` — Standard duped items
- `HIGH_TIER_DUPE_LIST` — High-tier duped items
- `knownDupedOriginalIds` — Exported `Set<string>` used by the dupe checker
