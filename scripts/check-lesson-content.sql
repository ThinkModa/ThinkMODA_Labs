-- Check lesson content and IDs
-- Run this in your Supabase SQL editor

-- Check all lessons in the LaunchPad course
SELECT 
  l.id as lesson_id,
  l.title as lesson_title,
  l.content,
  s.title as section_title,
  c.title as course_title
FROM lessons l
JOIN sections s ON l.section_id = s.id
JOIN courses c ON s.course_id = c.id
WHERE c.title LIKE '%LaunchPad%' OR c.title LIKE '%Onboarding%'
ORDER BY s.title, l.title;

-- Check specific lesson that's causing issues
SELECT 
  l.id as lesson_id,
  l.title as lesson_title,
  l.content,
  CASE 
    WHEN l.content LIKE '%typeform.com%' THEN 'Has Typeform'
    ELSE 'No Typeform'
  END as typeform_status
FROM lessons l
WHERE l.id IN ('cmdxo57nr0001sz8rwjkfrkux', 'cmdxoam330007sz8rgz2v4llf')
ORDER BY l.title;

-- Check if there are multiple lessons with similar content
SELECT 
  l1.id as lesson1_id,
  l1.title as lesson1_title,
  l2.id as lesson2_id,
  l2.title as lesson2_title,
  CASE 
    WHEN l1.content = l2.content THEN 'Same content'
    WHEN l1.content LIKE '%typeform.com%' AND l2.content LIKE '%typeform.com%' THEN 'Both have Typeform'
    ELSE 'Different content'
  END as content_comparison
FROM lessons l1
JOIN lessons l2 ON l1.id != l2.id
WHERE l1.content LIKE '%typeform.com%' OR l2.content LIKE '%typeform.com%'
ORDER BY l1.title, l2.title; 