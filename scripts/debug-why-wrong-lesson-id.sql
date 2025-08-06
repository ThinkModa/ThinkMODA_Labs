-- Debug why wrong lesson ID is still being used
-- Run this in your Supabase SQL editor

-- 1. Check if there are any lessons with the wrong ID that we missed
SELECT 
  id,
  title,
  content
FROM lessons 
WHERE id = 'cmdxoam330007sz8rgz2v4llf'
   OR content LIKE '%cmdxoam330007sz8rgz2v4llf%';

-- 2. Check if there are multiple lessons with similar titles
SELECT 
  id,
  title,
  content
FROM lessons 
WHERE title LIKE '%ASSESSMENT%'
ORDER BY title;

-- 3. Check if there are any cached or old records
SELECT 
  user_id,
  lesson_id,
  completed,
  typeform_submitted,
  created_at
FROM user_progress 
WHERE lesson_id = 'cmdxoam330007sz8rgz2v4llf'
ORDER BY created_at DESC;

-- 4. Check what lesson is actually being selected
SELECT 
  id,
  title,
  content
FROM lessons 
WHERE id = 'cmdxo57nr0001sz8rwjkfrkux';

-- 5. Check if there are any other lessons that might be interfering
SELECT 
  id,
  title,
  content
FROM lessons 
WHERE content LIKE '%typeform.com%'
ORDER BY title; 