-- Admin Setup Script for Fayda Jobs
-- Run this in Supabase SQL Editor

-- Create admin_roles table for better role management
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own role" ON admin_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role" ON admin_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create admin function
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

-- Find admin user (run this first to get the user ID)
SELECT id, email FROM auth.users WHERE email = 'admin@faydajobs.com';

-- Then add admin role (replace with actual user ID from above query)
-- INSERT INTO admin_roles (user_id, role) 
-- VALUES ('PASTE_USER_ID_HERE', 'admin');
