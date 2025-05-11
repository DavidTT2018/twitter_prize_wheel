/*
  # Create prizes tracking system

  1. New Tables
    - `prize_claims`
      - `id` (uuid, primary key)
      - `code` (text, unique) - Unique claim code
      - `prize` (text) - Prize won
      - `discord_username` (text) - Discord username for claiming
      - `claimed` (boolean) - Whether prize has been claimed
      - `ip_address` (text) - IP address of winner
      - `created_at` (timestamp)
      - `claimed_at` (timestamp)

  2. Security
    - Enable RLS on `prize_claims` table
    - Add policy for inserting new claims
    - Add policy for reading own claims
*/

CREATE TABLE IF NOT EXISTS prize_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  prize text NOT NULL,
  discord_username text,
  claimed boolean DEFAULT false,
  ip_address text NOT NULL,
  created_at timestamptz DEFAULT now(),
  claimed_at timestamptz
);

ALTER TABLE prize_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert prize claims"
  ON prize_claims
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can read their own claims by IP"
  ON prize_claims
  FOR SELECT
  TO public
  USING (ip_address = current_setting('request.headers')::json->>'x-real-ip');