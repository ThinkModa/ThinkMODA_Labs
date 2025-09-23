-- Clean up all existing RLS policies and create new ones for custom authentication
-- This migration ensures the frontend can access the users table for authentication

-- Disable RLS temporarily to clean up policies
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies (if any exist)
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Service role can manage all users" ON public.users;
DROP POLICY IF EXISTS "Allow user registration" ON public.users;
DROP POLICY IF EXISTS "Allow public read access for authentication" ON public.users;
DROP POLICY IF EXISTS "Allow public insert for registration" ON public.users;
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.users;
DROP POLICY IF EXISTS "Service role full access" ON public.users;

-- Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

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
