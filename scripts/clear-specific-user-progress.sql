-- Clear progress for specific user account
-- Run this in your Supabase SQL editor

-- 1. First, let's see what progress exists for your account
SELECT 
  user_id,
  lesson_id,
  completed,
  typeform_submitted,
  created_at
FROM user_progress 
WHERE user_id = 'rawalton9@gmail.com'
   OR user_id LIKE '%rawalton9%'
ORDER BY created_at DESC;

-- 2. Delete all progress for your specific account
DELETE FROM user_progress 
WHERE user_id = 'rawalton9@gmail.com'
   OR user_id LIKE '%rawalton9%';

-- 3. Also delete by email if the user_id is different
DELETE FROM user_progress 
WHERE user_id IN (
  SELECT id FROM users WHERE email = 'rawalton9@gmail.com'
);

-- 4. Verify the deletion
SELECT COUNT(*) as remaining_records
FROM user_progress 
WHERE user_id = 'rawalton9@gmail.com'
   OR user_id LIKE '%rawalton9%';

-- 5. Show all remaining progress records
SELECT 
  user_id,
  lesson_id,
  completed,
  typeform_submitted,
  created_at
FROM user_progress 
ORDER BY created_at DESC 
LIMIT 10; 