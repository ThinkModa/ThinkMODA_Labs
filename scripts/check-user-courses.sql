-- Check what courses are currently in the database
-- This will help us understand what needs to be migrated
-- Run this in your Supabase SQL editor

-- Check all courses in the database
SELECT '=== ALL COURSES IN DATABASE ===' as info;
SELECT 
  id,
  title,
  description,
  visibility,
  created_at,
  updated_at
FROM courses 
ORDER BY created_at DESC;

-- Check sections for each course
SELECT '=== SECTIONS FOR EACH COURSE ===' as info;
SELECT 
  c.id as course_id,
  c.title as course_title,
  c.visibility as course_visibility,
  s.id as section_id,
  s.title as section_title,
  s.description as section_description
FROM courses c
LEFT JOIN sections s ON c.id = s.course_id
ORDER BY c.created_at DESC, s.created_at;

-- Check lessons for each section
SELECT '=== LESSONS FOR EACH SECTION ===' as info;
SELECT 
  c.title as course_title,
  s.title as section_title,
  l.id as lesson_id,
  l.title as lesson_title,
  l.details as lesson_details
FROM courses c
LEFT JOIN sections s ON c.id = s.course_id
LEFT JOIN lessons l ON s.id = l.section_id
ORDER BY c.created_at DESC, s.created_at, l.created_at;

-- Summary counts
SELECT '=== SUMMARY COUNTS ===' as info;
SELECT 
  COUNT(*) as total_courses,
  COUNT(CASE WHEN visibility = 'OPEN' THEN 1 END) as open_courses,
  COUNT(CASE WHEN visibility = 'PRIVATE' THEN 1 END) as private_courses
FROM courses;

-- Count sections and lessons
SELECT '=== SECTION AND LESSON COUNTS ===' as info;
SELECT 
  c.title as course_title,
  c.visibility,
  COUNT(DISTINCT s.id) as section_count,
  COUNT(DISTINCT l.id) as lesson_count
FROM courses c
LEFT JOIN sections s ON c.id = s.course_id
LEFT JOIN lessons l ON s.id = l.section_id
GROUP BY c.id, c.title, c.visibility
ORDER BY c.created_at DESC; 