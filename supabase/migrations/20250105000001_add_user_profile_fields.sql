-- Add company name and phone number to users table
-- This migration adds fields needed for Typeform hidden fields

-- Add new columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS company_name VARCHAR,
ADD COLUMN IF NOT EXISTS phone_number VARCHAR;

-- Create index for phone number lookups
CREATE INDEX IF NOT EXISTS idx_users_phone_number 
ON users(phone_number);

-- Add comments for documentation
COMMENT ON COLUMN users.company_name IS 'User company name for Typeform hidden fields';
COMMENT ON COLUMN users.phone_number IS 'User phone number for Typeform hidden fields'; 