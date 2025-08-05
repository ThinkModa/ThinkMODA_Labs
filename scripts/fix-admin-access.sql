-- Fix admin access to courses by temporarily disabling RLS
-- Run this in your Supabase SQL editor

-- First, let's see what RLS policies exist
SELECT '=== CURRENT RLS POLICIES ===' as info;
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('courses', 'sections', 'lessons', 'users', 'user_progress')
ORDER BY tablename, policyname;

-- Check if RLS is enabled on courses table
SELECT '=== RLS STATUS ===' as info;
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('courses', 'sections', 'lessons', 'users', 'user_progress')
ORDER BY tablename;

-- Temporarily disable RLS on courses table to allow admin access
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE sections DISABLE ROW LEVEL SECURITY;
ALTER TABLE lessons DISABLE ROW LEVEL SECURITY;

-- Also disable RLS on users table to ensure admin can access
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Verify the changes
SELECT '=== RLS STATUS AFTER CHANGES ===' as info;
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('courses', 'sections', 'lessons', 'users', 'user_progress')
ORDER BY tablename;

-- Now let's check what courses are available
SELECT '=== COURSES AFTER RLS DISABLED ===' as info;
SELECT 
  id,
  title,
  description,
  visibility,
  created_at
FROM courses 
ORDER BY created_at DESC; 