/*
  # Schema for Car Sales Website

  1. New Tables
    - `cars`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, required)
      - `price` (numeric, required)
      - `year` (integer, required)
      - `mileage` (integer, required)
      - `images` (text array, max 3 images)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS on `cars` table
    - Add policies for:
      - Anyone can view cars
      - Authenticated users can create cars
      - Users can only update/delete their own cars
*/

CREATE TABLE cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL,
  year integer NOT NULL,
  mileage integer NOT NULL,
  images text[] NOT NULL DEFAULT '{}',
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT max_images CHECK (array_length(images, 1) <= 3)
);

ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view cars
CREATE POLICY "Anyone can view cars"
  ON cars
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can create cars
CREATE POLICY "Users can create cars"
  ON cars
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own cars
CREATE POLICY "Users can update own cars"
  ON cars
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own cars
CREATE POLICY "Users can delete own cars"
  ON cars
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);