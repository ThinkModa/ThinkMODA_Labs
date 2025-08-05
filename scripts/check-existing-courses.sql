-- Check what courses currently exist in the database
-- Run this in your Supabase SQL editor

-- Check all courses
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
SELECT 
  c.title as course_title,
  s.id as section_id,
  s.title as section_title,
  s.description as section_description
FROM courses c
LEFT JOIN sections s ON c.id = s.course_id
ORDER BY c.created_at, s.created_at;

-- Check lessons for each section
SELECT 
  c.title as course_title,
  s.title as section_title,
  l.id as lesson_id,
  l.title as lesson_title,
  l.details as lesson_details
FROM courses c
LEFT JOIN sections s ON c.id = s.course_id
LEFT JOIN lessons l ON s.id = l.section_id
ORDER BY c.created_at, s.created_at, l.created_at;

-- Count summary
SELECT 
  COUNT(*) as total_courses,
  COUNT(CASE WHEN visibility = 'OPEN' THEN 1 END) as open_courses,
  COUNT(CASE WHEN visibility = 'PRIVATE' THEN 1 END) as private_courses
FROM courses; 