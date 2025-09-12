-- Fix RLS policies for courses table in production database
-- Run this in the Supabase SQL Editor

-- Step 1: Disable RLS temporarily on courses table
ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop all existing policies on courses table
DROP POLICY IF EXISTS "Users can view courses" ON public.courses;
DROP POLICY IF EXISTS "Users can create courses" ON public.courses;
DROP POLICY IF EXISTS "Users can update courses" ON public.courses;
DROP POLICY IF EXISTS "Users can delete courses" ON public.courses;
DROP POLICY IF EXISTS "Allow public read access for courses" ON public.courses;
DROP POLICY IF EXISTS "Allow public insert for courses" ON public.courses;
DROP POLICY IF EXISTS "Allow users to update courses" ON public.courses;
DROP POLICY IF EXISTS "Service role full access courses" ON public.courses;

-- Step 3: Re-enable RLS on courses table
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Step 4: Create new policies that work with custom authentication
CREATE POLICY "Allow public read access for courses" ON public.courses
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert for courses" ON public.courses
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to update courses" ON public.courses
    FOR UPDATE USING (true);

CREATE POLICY "Allow users to delete courses" ON public.courses
    FOR DELETE USING (true);

CREATE POLICY "Service role full access courses" ON public.courses
    USING (auth.role() = 'service_role');

-- Step 5: Grant necessary permissions
GRANT ALL ON TABLE public.courses TO anon;
GRANT ALL ON TABLE public.courses TO authenticated;
GRANT ALL ON TABLE public.courses TO service_role;
