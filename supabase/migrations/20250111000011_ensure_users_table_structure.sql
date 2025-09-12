-- Ensure users table has the correct structure for custom authentication
-- This migration ensures all required columns exist and have the right data types

-- Add missing columns if they don't exist
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS password TEXT,
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'BASIC',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Make required columns NOT NULL if they have data
UPDATE public.users 
SET first_name = '' 
WHERE first_name IS NULL;

UPDATE public.users 
SET last_name = '' 
WHERE last_name IS NULL;

UPDATE public.users 
SET email = '' 
WHERE email IS NULL;

UPDATE public.users 
SET password = '' 
WHERE password IS NULL;

-- Add NOT NULL constraints to required columns
ALTER TABLE public.users 
ALTER COLUMN first_name SET NOT NULL,
ALTER COLUMN last_name SET NOT NULL,
ALTER COLUMN email SET NOT NULL,
ALTER COLUMN password SET NOT NULL;

-- Add unique constraint on email if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'users_email_key' 
        AND table_name = 'users'
    ) THEN
        ALTER TABLE public.users ADD CONSTRAINT users_email_key UNIQUE (email);
    END IF;
END $$;

-- Ensure RLS is disabled for user creation to work
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
