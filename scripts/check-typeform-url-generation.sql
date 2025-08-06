-- Check Typeform URL generation issue
-- Run this in your Supabase SQL editor

-- 1. Check what lesson content is actually being used
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
ORDER BY title;

-- 2. Check if there are any lessons with the wrong ID that might be interfering
SELECT 
  id,
  title,
  content
FROM lessons 
WHERE id = 'cmdxoam330007sz8rgz2v4llf'
   OR (title LIKE '%ASSESSMENT%' AND id != 'cmdxo57nr0001sz8rwjkfrkux');

-- 3. Check if the lesson content contains the wrong lesson ID
SELECT 
  id,
  title,
  CASE 
    WHEN content LIKE '%cmdxoam330007sz8rgz2v4llf%' THEN 'Contains wrong lesson ID'
    WHEN content LIKE '%cmdxo57nr0001sz8rwjkfrkux%' THEN 'Contains correct lesson ID'
    ELSE 'No lesson ID found'
  END as lesson_id_status,
  content
FROM lessons 
WHERE content LIKE '%typeform.com%'
   OR id = 'cmdxo57nr0001sz8rwjkfrkux'
   OR title LIKE '%ASSESSMENT%';

-- 4. Check user_progress for any existing records with the wrong lesson ID
SELECT 
  user_id,
  lesson_id,
  completed,
  typeform_submitted,
  created_at
FROM user_progress 
WHERE lesson_id = 'cmdxoam330007sz8rgz2v4llf'
ORDER BY created_at DESC; 