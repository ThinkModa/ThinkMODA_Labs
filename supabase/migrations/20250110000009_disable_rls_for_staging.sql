-- Temporarily disable RLS on courses, sections, and lessons for staging environment
-- This allows the custom authentication system to work properly

-- Disable RLS on courses table
ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;

-- Disable RLS on sections table  
ALTER TABLE public.sections DISABLE ROW LEVEL SECURITY;

-- Disable RLS on lessons table
ALTER TABLE public.lessons DISABLE ROW LEVEL SECURITY;

-- Keep RLS enabled on users table for security
-- ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
