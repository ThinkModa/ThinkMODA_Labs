-- Comprehensive fix for Typeform URL issue
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

-- 2. Delete ALL progress records with the wrong lesson ID
DELETE FROM user_progress 
WHERE lesson_id = 'cmdxoam330007sz8rgz2v4llf';

-- 3. Delete any lessons with the wrong ID that might be causing confusion
DELETE FROM lessons 
WHERE id = 'cmdxoam330007sz8rgz2v4llf'
  AND id != 'cmdxo57nr0001sz8rwjkfrkux';

-- 4. Update the correct lesson with clean Typeform content
UPDATE lessons 
SET content = '/embed https://form.typeform.com/to/pZp1eiDj'
WHERE id = 'cmdxo57nr0001sz8rwjkfrkux'
  AND title LIKE '%ASSESSMENT%';

-- 5. Also clean up any other lessons that might have the wrong lesson ID in content
UPDATE lessons 
SET content = REPLACE(
  content, 
  'lesson_id=cmdxoam330007sz8rgz2v4llf', 
  'lesson_id=cmdxo57nr0001sz8rwjkfrkux'
)
WHERE content LIKE '%cmdxoam330007sz8rgz2v4llf%';

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

-- 7. Check that no wrong lesson ID records exist
SELECT COUNT(*) as wrong_lesson_records
FROM user_progress 
WHERE lesson_id = 'cmdxoam330007sz8rgz2v4llf';

-- 8. Check that no lessons with wrong ID exist
SELECT COUNT(*) as wrong_lesson_count
FROM lessons 
WHERE id = 'cmdxoam330007sz8rgz2v4llf'; 