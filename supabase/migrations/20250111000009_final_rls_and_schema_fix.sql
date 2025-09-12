-- Final fix for RLS policies and lessons schema
-- This migration only addresses the specific issues without touching users table

-- 1. Fix lessons table schema mismatch
-- Add missing columns that the code expects
ALTER TABLE public.lessons 
ADD COLUMN IF NOT EXISTS content TEXT,
ADD COLUMN IF NOT EXISTS details TEXT;

-- Migrate data from content_data to content column
UPDATE public.lessons 
SET content = content_data->>'content'
WHERE content_data IS NOT NULL AND content IS NULL;

-- Migrate data from description to details column
UPDATE public.lessons
SET details = description  
WHERE description IS NOT NULL AND details IS NULL;

-- Set default empty string for null content
UPDATE public.lessons 
SET content = '' 
WHERE content IS NULL;

-- 2. Ensure RLS is disabled for admin operations
ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons DISABLE ROW LEVEL SECURITY;

-- 3. Drop problematic policies that don't work with custom auth
DROP POLICY IF EXISTS "Anyone can view open courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can manage all courses" ON public.courses;
DROP POLICY IF EXISTS "Users can view sections of accessible courses" ON public.sections;
DROP POLICY IF EXISTS "Admins can manage all sections" ON public.sections;
DROP POLICY IF EXISTS "Users can view lessons of accessible sections" ON public.lessons;
DROP POLICY IF EXISTS "Admins can manage all lessons" ON public.lessons;
