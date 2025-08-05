-- Add Typeform columns to user_progress table
-- Run this in your Supabase SQL editor

-- Add Typeform-related columns to user_progress table
ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS typeform_submitted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS typeform_submission_id VARCHAR,
ADD COLUMN IF NOT EXISTS typeform_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS typeform_url VARCHAR;

-- Add index for typeform_submitted for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_typeform_submitted 
ON user_progress(typeform_submitted);

-- Add index for typeform_submission_id for uniqueness checks
CREATE INDEX IF NOT EXISTS idx_user_progress_typeform_submission_id 
ON user_progress(typeform_submission_id);

-- Verify the columns were added
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'user_progress' 
AND column_name LIKE 'typeform%'
ORDER BY column_name;

-- Show current user_progress structure
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_progress'
ORDER BY ordinal_position; 