-- Debug Typeform URL generation issue
-- Run this in your Supabase SQL editor

-- 1. Check all lessons that might be causing confusion
SELECT 
  id,
  title,
  content,
  CASE 
    WHEN content LIKE '%pZp1eiDj%' THEN 'Has correct Typeform'
    WHEN content LIKE '%typeform.com%' THEN 'Has Typeform'
    ELSE 'No Typeform'
  END as typeform_status,
  LENGTH(content) as content_length
FROM lessons 
WHERE content LIKE '%typeform.com%'
   OR id IN ('cmdxo57nr0001sz8rwjkfrkux', 'cmdxoam330007sz8rgz2v4llf')
   OR title LIKE '%ASSESSMENT%'
ORDER BY title;

-- 2. Check if there are multiple lessons with the same title
SELECT 
  id,
  title,
  content
FROM lessons 
WHERE title LIKE '%ASSESSMENT%'
ORDER BY title;

-- 3. Check user_progress for any records with the wrong lesson ID
SELECT 
  user_id,
  lesson_id,
  completed,
  typeform_submitted,
  created_at
FROM user_progress 
WHERE lesson_id = 'cmdxoam330007sz8rgz2v4llf'
ORDER BY created_at DESC;

-- 4. Check if there are any lessons with the wrong ID that should be deleted
SELECT 
  id,
  title,
  content
FROM lessons 
WHERE id = 'cmdxoam330007sz8rgz2v4llf'
   OR (title LIKE '%ASSESSMENT%' AND id != 'cmdxo57nr0001sz8rwjkfrkux'); 