/*
  # KrishiMitra Database Schema

  ## Overview
  Creates complete database schema for KrishiMitra AI farming companion application.

  ## New Tables
  
  ### 1. disease_scans
  Stores all crop disease detection scan history
  - `id` (uuid, primary key)
  - `image_url` (text) - URL to stored disease image
  - `disease_name` (text) - Identified disease name
  - `confidence` (numeric) - AI confidence percentage
  - `crop_type` (text) - Affected crop type
  - `symptoms` (jsonb) - Array of symptoms
  - `treatment` (jsonb) - Treatment recommendations
  - `prevention` (jsonb) - Prevention tips
  - `created_at` (timestamptz) - Scan timestamp
  
  ### 2. chat_conversations
  Stores AI chat conversations and message history
  - `id` (uuid, primary key)
  - `session_id` (text) - Unique session identifier
  - `messages` (jsonb) - Array of conversation messages
  - `language` (text) - Conversation language (en/hi/kn)
  - `created_at` (timestamptz) - Conversation start time
  - `updated_at` (timestamptz) - Last message time
  
  ### 3. market_prices
  Stores mandi price data for crops
  - `id` (uuid, primary key)
  - `crop_name` (text) - Name of crop
  - `mandi_name` (text) - Market location
  - `district` (text) - District name
  - `price_per_quintal` (numeric) - Current price
  - `price_change_percentage` (numeric) - Change from previous
  - `date` (date) - Price date
  - `created_at` (timestamptz) - Record creation time
  
  ### 4. user_preferences
  Stores user settings and preferences
  - `id` (uuid, primary key)
  - `preferred_language` (text) - Selected language
  - `location` (text) - User location/district
  - `created_at` (timestamptz) - Account creation
  - `updated_at` (timestamptz) - Last update
  
  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Add permissive policies for public access (no auth required for MVP)
  - Create indexes for performance optimization
  
  ## Notes
  - All tables use UUID primary keys with auto-generation
  - Timestamps use timestamptz for timezone awareness
  - JSONB used for flexible nested data structures
  - Policies allow full public access for demo purposes
*/

-- Create disease_scans table
CREATE TABLE IF NOT EXISTS disease_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  disease_name text,
  confidence numeric,
  crop_type text,
  symptoms jsonb DEFAULT '[]'::jsonb,
  treatment jsonb DEFAULT '{}'::jsonb,
  prevention jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create chat_conversations table
CREATE TABLE IF NOT EXISTS chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  messages jsonb DEFAULT '[]'::jsonb,
  language text DEFAULT 'en',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create market_prices table
CREATE TABLE IF NOT EXISTS market_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_name text NOT NULL,
  mandi_name text NOT NULL,
  district text NOT NULL,
  price_per_quintal numeric NOT NULL,
  price_change_percentage numeric DEFAULT 0,
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  preferred_language text DEFAULT 'en',
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE disease_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for public access (MVP)
CREATE POLICY "Allow public read access to disease scans"
  ON disease_scans FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to disease scans"
  ON disease_scans FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read access to chat conversations"
  ON chat_conversations FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to chat conversations"
  ON chat_conversations FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update to chat conversations"
  ON chat_conversations FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to market prices"
  ON market_prices FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to market prices"
  ON market_prices FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read access to user preferences"
  ON user_preferences FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to user preferences"
  ON user_preferences FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update to user preferences"
  ON user_preferences FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_disease_scans_created_at ON disease_scans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_disease_scans_crop_type ON disease_scans(crop_type);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_session_id ON chat_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_market_prices_crop_name ON market_prices(crop_name);
CREATE INDEX IF NOT EXISTS idx_market_prices_district ON market_prices(district);
CREATE INDEX IF NOT EXISTS idx_market_prices_date ON market_prices(date DESC);

-- Insert sample market price data
INSERT INTO market_prices (crop_name, mandi_name, district, price_per_quintal, price_change_percentage, date)
VALUES
  ('Rice', 'Bengaluru City Market', 'Bengaluru Urban', 2850, 2.5, CURRENT_DATE),
  ('Rice', 'Mysuru APMC', 'Mysuru', 2800, 1.8, CURRENT_DATE),
  ('Wheat', 'Bengaluru City Market', 'Bengaluru Urban', 2200, -1.2, CURRENT_DATE),
  ('Sugarcane', 'Mandya APMC', 'Mandya', 3200, 3.5, CURRENT_DATE),
  ('Cotton', 'Raichur APMC', 'Raichur', 5800, 4.2, CURRENT_DATE),
  ('Groundnut', 'Dharwad APMC', 'Dharwad', 6500, 2.1, CURRENT_DATE),
  ('Turmeric', 'Hassan APMC', 'Hassan', 8200, 5.8, CURRENT_DATE),
  ('Tomato', 'Kolar Market', 'Kolar', 1200, -3.5, CURRENT_DATE),
  ('Potato', 'Bengaluru City Market', 'Bengaluru Urban', 1800, 1.5, CURRENT_DATE),
  ('Onion', 'Chitradurga APMC', 'Chitradurga', 2500, 6.2, CURRENT_DATE),
  ('Maize', 'Belgaum APMC', 'Belgaum', 1850, 2.8, CURRENT_DATE),
  ('Ragi', 'Tumakuru APMC', 'Tumakuru', 3500, 4.5, CURRENT_DATE),
  ('Jowar', 'Bijapur APMC', 'Bijapur', 2900, 3.2, CURRENT_DATE),
  ('Areca Nut', 'Shivamogga APMC', 'Shivamogga', 45000, 8.5, CURRENT_DATE),
  ('Coffee', 'Chikmagalur Market', 'Chikmagalur', 8500, 5.2, CURRENT_DATE)
ON CONFLICT DO NOTHING;
