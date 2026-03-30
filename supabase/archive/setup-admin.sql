// Admin Setup Script
// Run this in Supabase SQL Editor or use Supabase Dashboard

-- Create admin user (you need to do this through Supabase Auth Dashboard)
-- Email: admin@faydajobs.com
-- Password: Set a secure password

-- Create admin_roles table for better role management
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own role" ON admin_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role" ON admin_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert admin role for the admin user (you need to get the user_id from auth.users)
-- INSERT INTO admin_roles (user_id, role) 
-- VALUES ('USER_ID_FROM_AUTH_USERS', 'admin');

-- For testing, you can create a simple admin user with this SQL:
-- Go to Supabase Dashboard > Authentication > Users
-- Create a new user with email: admin@faydajobs.com
-- Set a password for this user

-- Alternative: Check if user exists and is admin
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_role TEXT;
BEGIN
  SELECT role INTO admin_role 
  FROM admin_roles 
  WHERE user_id = auth.uid();
  
  RETURN admin_role = 'admin';
END;
$$;
