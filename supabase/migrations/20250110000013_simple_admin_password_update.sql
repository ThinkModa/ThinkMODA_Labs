-- Simple admin password update for production
-- Password: "admin123"

UPDATE public.users 
SET password = '$2b$10$GbB03LUGCVz.rWB/UU/jE..DklGxVfamEuymAtbNE1QpcHNshhB12',
    updated_at = NOW()
WHERE email = 'admin@thinkmoda.co';
