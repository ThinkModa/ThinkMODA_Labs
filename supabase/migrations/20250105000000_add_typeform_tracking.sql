-- Add typeform tracking to user_progress table
-- This migration adds fields to track Typeform completion status

-- Add typeform tracking columns to user_progress table
ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS typeform_submitted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS typeform_submission_id VARCHAR,
ADD COLUMN IF NOT EXISTS typeform_completed_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS typeform_url VARCHAR;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_progress_typeform 
ON user_progress(user_id, lesson_id, typeform_submitted);

-- Add comment for documentation
COMMENT ON COLUMN user_progress.typeform_submitted IS 'Whether the user has completed the embedded Typeform for this lesson';
COMMENT ON COLUMN user_progress.typeform_submission_id IS 'Typeform submission ID for tracking';
COMMENT ON COLUMN user_progress.typeform_completed_at IS 'Timestamp when Typeform was completed';
COMMENT ON COLUMN user_progress.typeform_url IS 'URL of the embedded Typeform'; 