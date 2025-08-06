-- Fix lesson ID conflict issue
-- Run this in your Supabase SQL editor

-- 1. First, let's see what we're dealing with
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
WHERE id IN ('cmdxo57nr0001sz8rwjkfrkux', 'cmdxoam330007sz8rgz2v4llf')
   OR title LIKE '%ASSESSMENT%';

-- 2. Delete any existing progress records with the wrong lesson ID
DELETE FROM user_progress 
WHERE lesson_id = 'cmdxoam330007sz8rgz2v4llf';

-- 3. Update the correct lesson to have the proper Typeform content
UPDATE lessons 
SET content = '/embed https://form.typeform.com/to/pZp1eiDj'
WHERE id = 'cmdxo57nr0001sz8rwjkfrkux'
  AND title LIKE '%ASSESSMENT%';

-- 4. If there's a lesson with the wrong ID, either delete it or update it
-- First, check if the wrong lesson exists
SELECT id, title FROM lessons WHERE id = 'cmdxoam330007sz8rgz2v4llf';

-- 5. If the wrong lesson exists and is different from the correct one, delete it
DELETE FROM lessons 
WHERE id = 'cmdxoam330007sz8rgz2v4llf'
  AND id != 'cmdxo57nr0001sz8rwjkfrkux';

-- 6. Verify the fix
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
   OR title LIKE '%ASSESSMENT%';

-- 7. Check that no progress records exist for the wrong lesson ID
SELECT COUNT(*) as wrong_lesson_records
FROM user_progress 
WHERE lesson_id = 'cmdxoam330007sz8rgz2v4llf'; 