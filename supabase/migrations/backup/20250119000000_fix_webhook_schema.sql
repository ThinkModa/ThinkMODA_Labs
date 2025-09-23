-- Fix webhook schema issues for Typeform integration
-- This migration adds missing columns that the webhook expects

-- ==============================================
-- 1. FIX USER_PROGRESS TABLE
-- ==============================================

-- Add missing columns that the webhook expects
ALTER TABLE public.user_progress 
ADD COLUMN IF NOT EXISTS completion_data JSONB,
ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'webhook';

-- Add comments for documentation
COMMENT ON COLUMN public.user_progress.completion_data IS 'JSON data containing completion details from external sources like Typeform';
COMMENT ON COLUMN public.user_progress.source IS 'Source of the completion (webhook, typeform, manual, etc.)';

-- Create index for better performance on source column
CREATE INDEX IF NOT EXISTS idx_user_progress_source 
ON public.user_progress(source);

-- ==============================================
-- 2. ENSURE USERS TABLE HAS ALL REQUIRED COLUMNS
-- ==============================================

-- Add missing columns if they don't exist
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- ==============================================
-- 3. ENSURE LESSONS TABLE HAS ALL REQUIRED COLUMNS
-- ==============================================

-- Add missing columns that the webhook might need
ALTER TABLE public.lessons 
ADD COLUMN IF NOT EXISTS content TEXT,
ADD COLUMN IF NOT EXISTS details TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS order_position VARCHAR(10),
ADD COLUMN IF NOT EXISTS content_data JSONB,
ADD COLUMN IF NOT EXISTS content_type VARCHAR(50) DEFAULT 'rich_text',
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Migrate data from content_data to content column if needed
UPDATE public.lessons 
SET content = content_data->>'content'
WHERE content_data IS NOT NULL AND content IS NULL;

-- Migrate data from description to details column if needed
UPDATE public.lessons
SET details = description
WHERE description IS NOT NULL AND details IS NULL;

-- Set default empty string for null content
UPDATE public.lessons 
SET content = '' 
WHERE content IS NULL;

-- Add NOT NULL constraint to content column
ALTER TABLE public.lessons 
ALTER COLUMN content SET NOT NULL;

-- ==============================================
-- 4. FIX RLS POLICIES FOR WEBHOOK COMPATIBILITY
-- ==============================================

-- Ensure RLS policies allow service role access for webhooks
-- Users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access for authentication" ON public.users;
DROP POLICY IF EXISTS "Allow public insert for registration" ON public.users;
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.users;
DROP POLICY IF EXISTS "Service role full access" ON public.users;

-- Create new policies
CREATE POLICY "Allow public read access for authentication" ON public.users
    FOR SELECT USING (true);
CREATE POLICY "Allow public insert for registration" ON public.users
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to update own profile" ON public.users
    FOR UPDATE USING (true);
CREATE POLICY "Service role full access" ON public.users
    USING (auth.role() = 'service_role');

-- User progress table
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access for progress" ON public.user_progress;
DROP POLICY IF EXISTS "Allow public insert for progress" ON public.user_progress;
DROP POLICY IF EXISTS "Allow users to update progress" ON public.user_progress;
DROP POLICY IF EXISTS "Service role full access progress" ON public.user_progress;

-- Create new policies
CREATE POLICY "Allow public read access for progress" ON public.user_progress
    FOR SELECT USING (true);
CREATE POLICY "Allow public insert for progress" ON public.user_progress
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to update progress" ON public.user_progress
    FOR UPDATE USING (true);
CREATE POLICY "Service role full access progress" ON public.user_progress
    USING (auth.role() = 'service_role');

-- Lessons table
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access for lessons" ON public.lessons;
DROP POLICY IF EXISTS "Allow public insert for lessons" ON public.lessons;
DROP POLICY IF EXISTS "Allow users to update lessons" ON public.lessons;
DROP POLICY IF EXISTS "Service role full access lessons" ON public.lessons;

-- Create new policies
CREATE POLICY "Allow public read access for lessons" ON public.lessons
    FOR SELECT USING (true);
CREATE POLICY "Allow public insert for lessons" ON public.lessons
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to update lessons" ON public.lessons
    FOR UPDATE USING (true);
CREATE POLICY "Service role full access lessons" ON public.lessons
    USING (auth.role() = 'service_role');

-- ==============================================
-- 5. GRANT NECESSARY PERMISSIONS
-- ==============================================

-- Grant permissions for all tables
GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;

GRANT ALL ON TABLE public.user_progress TO anon;
GRANT ALL ON TABLE public.user_progress TO authenticated;
GRANT ALL ON TABLE public.user_progress TO service_role;

GRANT ALL ON TABLE public.lessons TO anon;
GRANT ALL ON TABLE public.lessons TO authenticated;
GRANT ALL ON TABLE public.lessons TO service_role;
