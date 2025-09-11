-- Fix user password for rahwalton9@gmail.com
-- Password: "password123"

UPDATE public.users 
SET password = '$2b$10$suwqYB2gx2MoeKrKBsLX7utEmB3MXtXYBwPKi79KnE6ZhZZ7wPAUi'
WHERE email = 'rahwalton9@gmail.com';
