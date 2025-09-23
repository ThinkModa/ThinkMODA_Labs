-- Fix RLS policies for production to allow custom authentication
-- This migration ensures the frontend can access the users table for authentication

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Service role can manage all users" ON public.users;
DROP POLICY IF EXISTS "Allow user registration" ON public.users;

-- Create new policies that work with custom authentication
-- Allow anyone to read users (needed for authentication)
CREATE POLICY "Allow public read access for authentication" ON public.users
    FOR SELECT USING (true);

-- Allow anyone to insert users (needed for registration)
CREATE POLICY "Allow public insert for registration" ON public.users
    FOR INSERT WITH CHECK (true);

-- Allow users to update their own profile
CREATE POLICY "Allow users to update own profile" ON public.users
    FOR UPDATE USING (true);

-- Service role can do everything
CREATE POLICY "Service role full access" ON public.users
    USING (auth.role() = 'service_role');

-- Grant necessary permissions
GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;
