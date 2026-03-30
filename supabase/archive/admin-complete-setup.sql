-- Complete Admin Setup for Fayda Jobs
-- Run this after creating the admin user in Authentication

-- Step 1: Create admin_roles table
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

-- Create policies for admin_roles
CREATE POLICY "Users can view their own role" ON admin_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON admin_roles
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

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

-- Step 2: Add your admin user to admin_roles table
-- Replace 'YOUR_ADMIN_USER_ID' with the actual user ID from Authentication

-- First, let's find the admin user (you can run this to get the ID)
SELECT id, email FROM auth.users WHERE email = 'admin@faydajobs.com';

-- Then insert into admin_roles (replace with actual ID)
-- INSERT INTO admin_roles (user_id, role) 
-- VALUES ('YOUR_ADMIN_USER_ID_HERE', 'admin');

-- Step 3: Create admin-only tables for job management
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  resume_url TEXT,
  cover_letter TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for job_applications
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Policies for job_applications
CREATE POLICY "Admins can manage all applications" ON job_applications
  FOR ALL USING (is_admin_user());

CREATE POLICY "Users can view their own applications" ON job_applications
  FOR SELECT USING (auth.uid() = (SELECT user_id FROM job_applications WHERE id = job_applications.id));

-- Step 4: Create admin stats view
CREATE OR REPLACE VIEW admin_stats AS
SELECT 
  (SELECT COUNT(*) FROM jobs) as total_jobs,
  (SELECT COUNT(*) FROM jobs WHERE featured = true) as featured_jobs,
  (SELECT COUNT(*) FROM companies) as total_companies,
  (SELECT COUNT(*) FROM categories) as total_categories,
  (SELECT COUNT(*) FROM job_applications) as total_applications,
  (SELECT COUNT(*) FROM job_applications WHERE status = 'pending') as pending_applications;

-- Grant access to admins only
CREATE POLICY "Admins can view stats" ON admin_stats
  FOR SELECT USING (is_admin_user());
