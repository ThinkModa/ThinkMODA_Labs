-- Debug courses loading issue
-- Run this in your Supabase SQL editor

-- Check if courses exist
SELECT '=== COURSES IN DATABASE ===' as info;
SELECT 
  id,
  title,
  description,
  visibility,
  created_at
FROM courses 
ORDER BY created_at DESC;

-- Check if sections exist
SELECT '=== SECTIONS IN DATABASE ===' as info;
SELECT 
  id,
  title,
  description,
  course_id,
  created_at
FROM sections 
ORDER BY created_at DESC;

-- Check if lessons exist
SELECT '=== LESSONS IN DATABASE ===' as info;
SELECT 
  id,
  title,
  content,
  section_id,
  created_at
FROM lessons 
ORDER BY created_at DESC;

-- Check RLS policies
SELECT '=== RLS POLICIES ===' as info;
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
WHERE tablename IN ('courses', 'sections', 'lessons', 'users')
ORDER BY tablename, policyname;

-- Check if RLS is enabled/disabled
SELECT '=== RLS STATUS ===' as info;
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('courses', 'sections', 'lessons', 'users')
ORDER BY tablename;

-- Disable RLS on all tables to ensure admin access
SELECT '=== DISABLING RLS ===' as info;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE sections DISABLE ROW LEVEL SECURITY;
ALTER TABLE lessons DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Test query as admin
SELECT '=== TEST ADMIN QUERY ===' as info;
SELECT 
  c.id as course_id,
  c.title as course_title,
  c.visibility,
  COUNT(s.id) as sections_count,
  COUNT(l.id) as lessons_count
FROM courses c
LEFT JOIN sections s ON c.id = s.course_id
LEFT JOIN lessons l ON s.id = l.section_id
GROUP BY c.id, c.title, c.visibility
ORDER BY c.created_at DESC; 