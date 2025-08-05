-- Check current admin user and fix email domain
-- Run this in your Supabase SQL editor

-- First, let's see what users exist
SELECT '=== ALL USERS IN DATABASE ===' as info;
SELECT 
  id,
  first_name,
  last_name,
  email,
  role,
  company_name,
  phone_number,
  created_at
FROM users 
ORDER BY created_at DESC;

-- Check for any admin users
SELECT '=== ADMIN USERS ===' as info;
SELECT 
  id,
  first_name,
  last_name,
  email,
  role,
  created_at
FROM users 
WHERE role = 'ADMIN';

-- Check for rod@thinkmoda.co user
SELECT '=== ROD USER ===' as info;
SELECT 
  id,
  first_name,
  last_name,
  email,
  role,
  created_at
FROM users 
WHERE email = 'rod@thinkmoda.co';

-- Update rod@thinkmoda.co to be admin if it exists
UPDATE users 
SET role = 'ADMIN'
WHERE email = 'rod@thinkmoda.co';

-- Create admin user with correct email domain
INSERT INTO users (
  id,
  first_name,
  last_name,
  email,
  password,
  role,
  company_name,
  phone_number,
  created_at,
  updated_at
) VALUES (
  'admin-user-002',
  'Admin',
  'User',
  'admin@thinkmoda.co',
  '$2b$10$xToV3a5CbkkVvxHBuJNniu/yEvn8uCLJQTUDugT7eGWFiobbRYJh6',
  'ADMIN',
  'ThinkMODA Labs',
  '+1-555-ADMIN-01',
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  role = 'ADMIN',
  updated_at = NOW();

-- Verify final admin users
SELECT '=== FINAL ADMIN USERS ===' as info;
SELECT 
  id,
  first_name,
  last_name,
  email,
  role,
  created_at
FROM users 
WHERE role = 'ADMIN'; 