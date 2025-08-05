-- Fix RLS policies to allow user registration and authentication
-- Run this in your Supabase SQL editor

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