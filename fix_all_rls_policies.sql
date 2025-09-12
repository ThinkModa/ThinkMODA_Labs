-- Fix RLS policies for all tables in production database
-- Run this in the Supabase SQL Editor

-- ==============================================
-- USERS TABLE
-- ==============================================
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Service role can manage all users" ON public.users;
DROP POLICY IF EXISTS "Allow user registration" ON public.users;
DROP POLICY IF EXISTS "Allow public read access for authentication" ON public.users;
DROP POLICY IF EXISTS "Allow public insert for registration" ON public.users;
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.users;
DROP POLICY IF EXISTS "Service role full access" ON public.users;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access for authentication" ON public.users
    FOR SELECT USING (true);
CREATE POLICY "Allow public insert for registration" ON public.users
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to update own profile" ON public.users
    FOR UPDATE USING (true);
CREATE POLICY "Service role full access" ON public.users
    USING (auth.role() = 'service_role');

GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;

-- ==============================================
-- COURSES TABLE
-- ==============================================
ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view courses" ON public.courses;
DROP POLICY IF EXISTS "Users can create courses" ON public.courses;
DROP POLICY IF EXISTS "Users can update courses" ON public.courses;
DROP POLICY IF EXISTS "Users can delete courses" ON public.courses;
DROP POLICY IF EXISTS "Allow public read access for courses" ON public.courses;
DROP POLICY IF EXISTS "Allow public insert for courses" ON public.courses;
DROP POLICY IF EXISTS "Allow users to update courses" ON public.courses;
DROP POLICY IF EXISTS "Service role full access courses" ON public.courses;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

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

GRANT ALL ON TABLE public.courses TO anon;
GRANT ALL ON TABLE public.courses TO authenticated;
GRANT ALL ON TABLE public.courses TO service_role;

-- ==============================================
-- SECTIONS TABLE
-- ==============================================
ALTER TABLE public.sections DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view sections" ON public.sections;
DROP POLICY IF EXISTS "Users can create sections" ON public.sections;
DROP POLICY IF EXISTS "Users can update sections" ON public.sections;
DROP POLICY IF EXISTS "Users can delete sections" ON public.sections;
DROP POLICY IF EXISTS "Allow public read access for sections" ON public.sections;
DROP POLICY IF EXISTS "Allow public insert for sections" ON public.sections;
DROP POLICY IF EXISTS "Allow users to update sections" ON public.sections;
DROP POLICY IF EXISTS "Service role full access sections" ON public.sections;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access for sections" ON public.sections
    FOR SELECT USING (true);
CREATE POLICY "Allow public insert for sections" ON public.sections
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to update sections" ON public.sections
    FOR UPDATE USING (true);
CREATE POLICY "Allow users to delete sections" ON public.sections
    FOR DELETE USING (true);
CREATE POLICY "Service role full access sections" ON public.sections
    USING (auth.role() = 'service_role');

GRANT ALL ON TABLE public.sections TO anon;
GRANT ALL ON TABLE public.sections TO authenticated;
GRANT ALL ON TABLE public.sections TO service_role;

-- ==============================================
-- LESSONS TABLE
-- ==============================================
ALTER TABLE public.lessons DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view lessons" ON public.lessons;
DROP POLICY IF EXISTS "Users can create lessons" ON public.lessons;
DROP POLICY IF EXISTS "Users can update lessons" ON public.lessons;
DROP POLICY IF EXISTS "Users can delete lessons" ON public.lessons;
DROP POLICY IF EXISTS "Allow public read access for lessons" ON public.lessons;
DROP POLICY IF EXISTS "Allow public insert for lessons" ON public.lessons;
DROP POLICY IF EXISTS "Allow users to update lessons" ON public.lessons;
DROP POLICY IF EXISTS "Service role full access lessons" ON public.lessons;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access for lessons" ON public.lessons
    FOR SELECT USING (true);
CREATE POLICY "Allow public insert for lessons" ON public.lessons
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to update lessons" ON public.lessons
    FOR UPDATE USING (true);
CREATE POLICY "Allow users to delete lessons" ON public.lessons
    FOR DELETE USING (true);
CREATE POLICY "Service role full access lessons" ON public.lessons
    USING (auth.role() = 'service_role');

GRANT ALL ON TABLE public.lessons TO anon;
GRANT ALL ON TABLE public.lessons TO authenticated;
GRANT ALL ON TABLE public.lessons TO service_role;

-- ==============================================
-- USER_PROGRESS TABLE
-- ==============================================
ALTER TABLE public.user_progress DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can create progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update progress" ON public.user_progress;
DROP POLICY IF EXISTS "Allow public read access for progress" ON public.user_progress;
DROP POLICY IF EXISTS "Allow public insert for progress" ON public.user_progress;
DROP POLICY IF EXISTS "Allow users to update progress" ON public.user_progress;
DROP POLICY IF EXISTS "Service role full access progress" ON public.user_progress;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access for progress" ON public.user_progress
    FOR SELECT USING (true);
CREATE POLICY "Allow public insert for progress" ON public.user_progress
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to update progress" ON public.user_progress
    FOR UPDATE USING (true);
CREATE POLICY "Service role full access progress" ON public.user_progress
    USING (auth.role() = 'service_role');

GRANT ALL ON TABLE public.user_progress TO anon;
GRANT ALL ON TABLE public.user_progress TO authenticated;
GRANT ALL ON TABLE public.user_progress TO service_role;
