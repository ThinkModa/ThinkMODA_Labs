-- Fix webhook schema issues for Typeform integration
-- This migration adds missing columns that the webhook expects

-- Add missing columns to user_progress table that the webhook needs
ALTER TABLE public.user_progress 
ADD COLUMN IF NOT EXISTS completion_data JSONB,
ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'webhook';

-- Add comments for documentation
COMMENT ON COLUMN public.user_progress.completion_data IS 'JSON data containing completion details from external sources like Typeform';
COMMENT ON COLUMN public.user_progress.source IS 'Source of the completion (webhook, typeform, manual, etc.)';

-- Create index for better performance on source column
CREATE INDEX IF NOT EXISTS idx_user_progress_source 
ON public.user_progress(source);

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'user_progress' 
AND column_name IN ('completion_data', 'source')
ORDER BY ordinal_position;
