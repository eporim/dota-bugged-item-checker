-- check_results: full check result per Steam profile (cache + source for carousel)
CREATE TABLE IF NOT EXISTS check_results (
  steamid64 TEXT PRIMARY KEY,
  duped_items JSONB NOT NULL DEFAULT '[]',
  total_checked INT NOT NULL DEFAULT 0,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- recent_bugged_items: denormalized for carousel (one row per duped item)
CREATE TABLE IF NOT EXISTS recent_bugged_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  steamid64 TEXT NOT NULL,
  asset_id TEXT NOT NULL,
  original_id TEXT NOT NULL,
  defindex INT NOT NULL,
  inventory_link TEXT NOT NULL,
  item_name TEXT,
  image_url TEXT,
  gems JSONB DEFAULT '[]',
  found_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recent_bugged_items_found_at
  ON recent_bugged_items (found_at DESC);

-- user_favorites: for authenticated users
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  steamid64 TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, steamid64)
);

CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id
  ON user_favorites (user_id);

-- RLS: recent_bugged_items - public read
ALTER TABLE recent_bugged_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on recent_bugged_items"
  ON recent_bugged_items FOR SELECT
  USING (true);

-- RLS: check_results - no policies; service role bypasses RLS, anon/authenticated get no access
ALTER TABLE check_results ENABLE ROW LEVEL SECURITY;

-- RLS: user_favorites - authenticated users read/write own
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own favorites"
  ON user_favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON user_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON user_favorites FOR DELETE
  USING (auth.uid() = user_id);
