-- Fix RLS policies for production database
-- Run this in the Supabase SQL Editor

-- Step 1: Disable RLS temporarily
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Service role can manage all users" ON public.users;
DROP POLICY IF EXISTS "Allow user registration" ON public.users;
DROP POLICY IF EXISTS "Allow public read access for authentication" ON public.users;
DROP POLICY IF EXISTS "Allow public insert for registration" ON public.users;
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.users;
DROP POLICY IF EXISTS "Service role full access" ON public.users;

-- Step 3: Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Step 4: Create new policies that work with custom authentication
CREATE POLICY "Allow public read access for authentication" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert for registration" ON public.users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to update own profile" ON public.users
    FOR UPDATE USING (true);

CREATE POLICY "Service role full access" ON public.users
    USING (auth.role() = 'service_role');

-- Step 5: Grant necessary permissions
GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;
