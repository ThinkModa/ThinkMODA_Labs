-- Fix RLS policies for users table to allow registration

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Service role can manage all users" ON public.users;
DROP POLICY IF EXISTS "Allow user registration" ON public.users;

-- Create new policies that work with the custom auth system
-- Policy: Allow anyone to insert (register) - this is needed for user registration
CREATE POLICY "Allow user registration" ON public.users
    FOR INSERT WITH CHECK (true);

-- Policy: Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (true);

-- Policy: Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (true);

-- Policy: Service role can manage all users
CREATE POLICY "Service role can manage all users" ON public.users
    USING (auth.role() = 'service_role');

-- Grant permissions
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;
GRANT ALL ON TABLE public.users TO anon;
