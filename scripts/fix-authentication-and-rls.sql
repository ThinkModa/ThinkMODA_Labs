-- Comprehensive fix for authentication and RLS issues
-- Run this in your Supabase SQL editor

-- 1. Disable RLS on all tables since we're using custom authentication
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE sections DISABLE ROW LEVEL SECURITY;
ALTER TABLE lessons DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress DISABLE ROW LEVEL SECURITY;

-- 2. Verify RLS is disabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('users', 'courses', 'sections', 'lessons', 'user_courses', 'user_progress')
ORDER BY tablename;

-- 3. Test database operations
SELECT 'Testing database access...' as status;

-- Test reading courses
SELECT COUNT(*) as courses_count FROM courses;

-- Test reading lessons
SELECT COUNT(*) as lessons_count FROM lessons;

-- Test reading sections
SELECT COUNT(*) as sections_count FROM sections;

-- Test reading user_progress
SELECT COUNT(*) as progress_count FROM user_progress;

-- 4. Show current data for debugging
SELECT 'Current courses:' as info;
SELECT id, title, visibility FROM courses ORDER BY created_at DESC;

SELECT 'Current sections:' as info;
SELECT id, title, course_id FROM sections ORDER BY created_at DESC;

SELECT 'Current lessons:' as info;
SELECT id, title, section_id FROM lessons ORDER BY created_at DESC;

-- 5. Test deletion capability (this will be handled by the application)
SELECT 'Database is now accessible for all operations' as status; 