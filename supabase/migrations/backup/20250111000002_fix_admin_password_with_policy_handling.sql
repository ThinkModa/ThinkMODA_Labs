-- Fix admin password with proper policy handling
-- First, drop the existing policy if it exists
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;

-- Recreate the policy
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid()::text = id::text);

-- Update admin password
UPDATE public.users 
SET password = '$2b$10$GbB03LUGCVz.rWB/UU/jE..DklGxVfamEuymAtbNE1QpcHNshhB12',
    updated_at = NOW()
WHERE email = 'admin@thinkmoda.co';
