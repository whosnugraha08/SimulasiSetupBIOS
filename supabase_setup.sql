-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- This creates the scores table for the BIOS simulation leaderboard

CREATE TABLE IF NOT EXISTS scores (
  id SERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  skor INTEGER NOT NULL DEFAULT 0,
  mode TEXT NOT NULL DEFAULT 'practice',
  waktu_selesai INTEGER,
  detail JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Allow anyone to INSERT (no auth needed for simulation)
CREATE POLICY "Allow public insert" ON scores
  FOR INSERT WITH CHECK (true);

-- Allow anyone to SELECT (leaderboard is public)
CREATE POLICY "Allow public select" ON scores
  FOR SELECT USING (true);

-- Create index for faster leaderboard queries
CREATE INDEX IF NOT EXISTS idx_scores_skor ON scores(skor DESC, waktu_selesai ASC);
CREATE INDEX IF NOT EXISTS idx_scores_mode ON scores(mode);
