-- Fix database permission issues for user_progress table
-- Run this in your Supabase SQL editor

-- 1. Completely disable RLS on user_progress table
ALTER TABLE user_progress DISABLE ROW LEVEL SECURITY;

-- 2. Drop any existing policies that might be causing conflicts
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can delete own progress" ON user_progress;
DROP POLICY IF EXISTS "Enable all operations for user_progress" ON user_progress;
DROP POLICY IF EXISTS "Enable insert for authentication" ON user_progress;
DROP POLICY IF EXISTS "Enable select for authentication" ON user_progress;
DROP POLICY IF EXISTS "Enable update for authentication" ON user_progress;
DROP POLICY IF EXISTS "Enable delete for authentication" ON user_progress;

-- 3. Ensure the typeform_submitted column exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_progress' 
    AND column_name = 'typeform_submitted'
  ) THEN
    ALTER TABLE user_progress ADD COLUMN typeform_submitted BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- 4. Check table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_progress'
ORDER BY ordinal_position;

-- 5. Test inserting a record
INSERT INTO user_progress (user_id, lesson_id, completed, typeform_submitted)
VALUES ('test-user-id', 'test-lesson-id', true, true)
ON CONFLICT (user_id, lesson_id) DO UPDATE SET
  completed = EXCLUDED.completed,
  typeform_submitted = EXCLUDED.typeform_submitted,
  updated_at = NOW();

-- 6. Clean up test record
DELETE FROM user_progress WHERE user_id = 'test-user-id'; 