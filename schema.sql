-- SQL Schema Setup for Veritas Forensic Dashboard
-- Paste this into your Supabase SQL Editor to initialize the database structure.

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (User Gamification Stats)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  reputation_score INT DEFAULT 100,
  xp_points INT DEFAULT 0,
  forensic_rank TEXT DEFAULT 'Novice Observer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security (RLS) for Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Allow users to update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. Scans History Table (Text, URL, Image Forensics Logs)
CREATE TABLE IF NOT EXISTS scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  input_type TEXT NOT NULL, -- 'text', 'url', 'image'
  content TEXT, -- URL or scanned text snippet
  headline TEXT, -- Scraped title or headline
  image_url TEXT, -- Saved S3 bucket path if uploaded
  exif_data JSONB, -- Extracted image EXIF tags
  credibility_score INT NOT NULL, -- 0 to 100
  bias_category TEXT, -- Leaning (Left, Right, Center, etc.)
  metrics JSONB, -- Clickbait, sensationalism, fallacies array
  reasoning TEXT, -- AI reasoning paragraph
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS for Scans
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to public scans" ON scans
  FOR SELECT USING (is_public = true);

CREATE POLICY "Allow users to insert their own scans" ON scans
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- 3. Bookmarks Table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  scan_id UUID REFERENCES scans ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, scan_id)
);

-- Enable RLS for Bookmarks
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to access their own bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to create their own bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own bookmarks" ON bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- 4. Global Verified News Feed (100% Legit Stories)
CREATE TABLE IF NOT EXISTS global_news_feed (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  source TEXT NOT NULL,
  url TEXT,
  credibility_score INT NOT NULL DEFAULT 95,
  status TEXT NOT NULL DEFAULT 'verified',
  summary TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE global_news_feed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read to news feed" ON global_news_feed
  FOR SELECT USING (true);

-- Seed Initial Verified Data
INSERT INTO global_news_feed (title, source, url, credibility_score, summary, category) VALUES
('NASA Confirms Water Ice Discovered in Massive Martian Crater', 'AP News', 'https://apnews.com/article/mars-water-ice-nasa', 98, 'Satellite spectrometry has verified deep layers of water ice in Mars southern craters, opening new doors for human exploration.', 'Science'),
('Global Inflation Rates Fall Back to Pre-Pandemic Averages in Q1', 'Bloomberg', 'https://bloomberg.com/inflation-rates-q1-2026', 95, 'Stabilizing supply chains and interest rate adjustments have successfully normalized global cost indices.', 'Economics'),
('Quantum Computing Startup Achieves Stable 1000-Logical-Qubit Processor', 'MIT Technology Review', 'https://technologyreview.com/quantum-1000-qubits', 91, 'Using advanced topological error correction, the chip ran stable simulations for over 24 hours.', 'Tech')
ON CONFLICT DO NOTHING;

-- 5. Debunked Rumors Ledger
CREATE TABLE IF NOT EXISTS debunk_rumors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  claim TEXT NOT NULL,
  status TEXT NOT NULL, -- 'debunked' or 'unverified'
  score INT NOT NULL, -- Threat level
  summary TEXT,
  source_factcheck TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE debunk_rumors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read to rumors ledger" ON debunk_rumors
  FOR SELECT USING (true);

-- Seed Initial Rumors Data
INSERT INTO debunk_rumors (claim, status, score, summary, source_factcheck) VALUES
('Viral Video Claims Eiffel Tower is Engulfed in Flames', 'debunked', 12, 'The viral TikTok clip is actually a high-fidelity CGI simulation created by a digital artist. Paris police confirmed no fire occurred.', 'Snopes Fact Check'),
('Leaked Memo: Major Bank to Freeze Private Checking Accounts Nationwide', 'unverified', 45, 'A suspicious screenshot circulating on Telegram alleges a liquidity crisis. No evidence confirms this memo, banking regulators have denied it.', 'Reuters Verification'),
('Claim: Bananas Injected with Poisonous Red Liquid to spread illness', 'debunked', 5, 'The red discoloration is actually a naturally occurring bacterial infection called Mokillo, harmless to humans. It is an old hoax resurfacing.', 'PolitiFact')
ON CONFLICT DO NOTHING;
