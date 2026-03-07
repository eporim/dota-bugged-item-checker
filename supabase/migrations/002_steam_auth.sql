-- Steam auth: app_users replaces auth.users for user_favorites
CREATE TABLE IF NOT EXISTS app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  steam_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_app_users_steam_id ON app_users (steam_id);

-- Recreate user_favorites to reference app_users
DROP TABLE IF EXISTS user_favorites;
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  steamid64 TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, steamid64)
);

CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites (user_id);

ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- No policies: anon/authenticated get no access; API routes use service role (bypasses RLS)
