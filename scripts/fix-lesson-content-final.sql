-- Fix lesson content to use correct lesson ID
-- Run this in your Supabase SQL editor

-- 1. Check current lesson content
SELECT 
  id,
  title,
  content,
  CASE 
    WHEN content LIKE '%typeform.com%' THEN 'Has Typeform'
    ELSE 'No Typeform'
  END as typeform_status
FROM lessons 
WHERE id = 'cmdxo57nr0001sz8rwjkfrkux'
   OR title LIKE '%ASSESSMENT%';

-- 2. Update the lesson content to use the correct lesson ID
UPDATE lessons 
SET content = '/embed https://form.typeform.com/to/pZp1eiDj'
WHERE id = 'cmdxo57nr0001sz8rwjkfrkux'
  AND title LIKE '%ASSESSMENT%';

-- 3. Also fix any other lessons that might have the wrong lesson ID
UPDATE lessons 
SET content = REPLACE(
  content, 
  'lesson_id=cmdxoam330007sz8rgz2v4llf', 
  'lesson_id=cmdxo57nr0001sz8rwjkfrkux'
)
WHERE content LIKE '%cmdxoam330007sz8rgz2v4llf%';

-- 4. Verify the fix
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