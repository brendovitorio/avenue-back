CREATE TABLE IF NOT EXISTS whitelist_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  character_name TEXT NOT NULL,
  age SMALLINT NOT NULL CHECK (age >= 1 AND age <= 99),
  experience TEXT NOT NULL,
  story TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  staff_notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS whitelist_one_pending_per_player
  ON whitelist_applications(player_id) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS whitelist_applications_status_date
  ON whitelist_applications(status, submitted_at DESC);
