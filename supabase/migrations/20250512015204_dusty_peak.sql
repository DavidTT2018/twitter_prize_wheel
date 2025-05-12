/*
  # Create sessions table for tracking unique wheel spins

  1. New Tables
    - `wheel_sessions`
      - `id` (uuid, primary key)
      - `session_id` (text, unique) - Unique session identifier
      - `ip_address` (text) - IP address of the user
      - `created_at` (timestamp) - When the session was created
      - `accessed_at` (timestamp) - When the session was last accessed
      - `is_used` (boolean) - Whether the session has been used

  2. Security
    - Enable RLS on `wheel_sessions` table
    - Add policy for inserting new sessions
    - Add policy for reading own sessions
*/

CREATE TABLE IF NOT EXISTS wheel_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  ip_address text NOT NULL,
  created_at timestamptz DEFAULT now(),
  accessed_at timestamptz,
  is_used boolean DEFAULT false
);

ALTER TABLE wheel_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert sessions"
  ON wheel_sessions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can read their own sessions"
  ON wheel_sessions
  FOR SELECT
  TO public
  USING (session_id = current_setting('request.headers')::json->>'x-session-id');