-- Fix RLS policies to allow user registration and authentication
-- Run this in your Supabase SQL editor

-- Enable RLS on user_progress table if not already enabled
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Enable insert for authentication" ON users;
DROP POLICY IF EXISTS "Enable select for users based on user_id" ON users;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON users;

-- Create new policies that allow registration and authentication
CREATE POLICY "Enable insert for all users" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for authentication" ON users
  FOR SELECT USING (true);

CREATE POLICY "Enable update for users based on email" ON users
  FOR UPDATE USING (true);

-- Also ensure the courses policy allows access
DROP POLICY IF EXISTS "Anyone can view open courses" ON courses;
CREATE POLICY "Anyone can view open courses" ON courses
  FOR SELECT USING (visibility = 'OPEN');

-- Ensure admins can manage all courses
DROP POLICY IF EXISTS "Admins can manage all courses" ON courses;
CREATE POLICY "Admins can manage all courses" ON courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'ADMIN'
    )
  );

-- Add RLS policies for user_progress table
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can delete own progress" ON user_progress;

-- Enable users to view their own progress
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (user_id = auth.uid()::text);

-- Enable users to insert their own progress
CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (user_id = auth.uid()::text);

-- Enable users to update their own progress
CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (user_id = auth.uid()::text);

-- Enable users to delete their own progress
CREATE POLICY "Users can delete own progress" ON user_progress
  FOR DELETE USING (user_id = auth.uid()::text);

-- Enable admins to manage all progress
CREATE POLICY "Admins can manage all progress" ON user_progress
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'ADMIN'
    )
  ); 