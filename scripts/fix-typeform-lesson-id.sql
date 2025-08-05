-- Fix Typeform lesson ID issue
-- Run this in your Supabase SQL editor

-- First, let's see what lessons have Typeform content
SELECT 
  id,
  title,
  CASE 
    WHEN content LIKE '%typeform.com%' THEN 'Has Typeform'
    ELSE 'No Typeform'
  END as typeform_status,
  LENGTH(content) as content_length
FROM lessons 
WHERE content LIKE '%typeform.com%'
ORDER BY title;

-- Update the lesson content to use the correct lesson ID
-- Replace the old lesson ID with the current one
UPDATE lessons 
SET content = REPLACE(
  content, 
  'lesson_id=cmdxoam330007sz8rgz2v4llf', 
  'lesson_id=cmdxo57nr0001sz8rwjkfrkux'
)
WHERE content LIKE '%cmdxoam330007sz8rgz2v4llf%';

-- Verify the update
SELECT 
  id,
  title,
  CASE 
    WHEN content LIKE '%cmdxo57nr0001sz8rwjkfrkux%' THEN 'Has correct lesson ID'
    WHEN content LIKE '%cmdxoam330007sz8rgz2v4llf%' THEN 'Has old lesson ID'
    ELSE 'No lesson ID found'
  END as lesson_id_status
FROM lessons 
WHERE content LIKE '%typeform.com%'
ORDER BY title; 