-- Debug current issue - check lesson IDs and content
-- Run this in your Supabase SQL editor

-- 1. Check what lesson content is actually stored
SELECT 
  id,
  title,
  content,
  CASE 
    WHEN content LIKE '%pZp1eiDj%' THEN 'Has correct Typeform'
    WHEN content LIKE '%typeform.com%' THEN 'Has Typeform'
    ELSE 'No Typeform'
  END as typeform_status
FROM lessons 
WHERE id = 'cmdxo57nr0001sz8rwjkfrkux'
   OR title LIKE '%ASSESSMENT%'
   OR id = 'cmdxoam330007sz8rgz2v4llf';

-- 2. Check if there are multiple lessons with similar content
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
WHERE (l1.id = 'cmdxo57nr0001sz8rwjkfrkux' OR l1.id = 'cmdxoam330007sz8rgz2v4llf')
  AND (l2.id = 'cmdxo57nr0001sz8rwjkfrkux' OR l2.id = 'cmdxoam330007sz8rgz2v4llf');

-- 3. Check user_progress table for existing records
SELECT 
  user_id,
  lesson_id,
  completed,
  typeform_submitted,
  created_at
FROM user_progress 
WHERE lesson_id IN ('cmdxo57nr0001sz8rwjkfrkux', 'cmdxoam330007sz8rgz2v4llf')
ORDER BY created_at DESC;

-- 4. Check if there are any lessons with the wrong ID in content
SELECT 
  id,
  title,
  content
FROM lessons 
WHERE content LIKE '%cmdxoam330007sz8rgz2v4llf%'
   OR content LIKE '%cmdxo57nr0001sz8rwjkfrkux%'; 