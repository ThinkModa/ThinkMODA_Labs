-- Reset all user progress for testing
-- Run this in your Supabase SQL editor

-- 1. First, let's see what progress records exist
SELECT 
  COUNT(*) as total_progress_records,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT lesson_id) as unique_lessons
FROM user_progress;

-- 2. Show some sample records before deletion
SELECT 
  user_id,
  lesson_id,
  completed,
  typeform_submitted,
  created_at
FROM user_progress 
ORDER BY created_at DESC 
LIMIT 10;

-- 3. Delete ALL user progress records
DELETE FROM user_progress;

-- 4. Verify all records are deleted
SELECT COUNT(*) as remaining_records
FROM user_progress;

-- 5. Also clean up any lessons with wrong lesson IDs
DELETE FROM lessons 
WHERE id = 'cmdxoam330007sz8rgz2v4llf'
  AND id != 'cmdxo57nr0001sz8rwjkfrkux';

-- 6. Ensure the correct lesson has the right content
UPDATE lessons 
SET content = '/embed https://form.typeform.com/to/pZp1eiDj'
WHERE id = 'cmdxo57nr0001sz8rwjkfrkux'
  AND title LIKE '%ASSESSMENT%';

-- 7. Final verification
SELECT 
  'Progress records deleted' as status,
  COUNT(*) as remaining_records
FROM user_progress
UNION ALL
SELECT 
  'Correct lesson content' as status,
  CASE 
    WHEN content LIKE '%pZp1eiDj%' THEN 1 
    ELSE 0 
  END as has_correct_content
FROM lessons 
WHERE id = 'cmdxo57nr0001sz8rwjkfrkux'; 