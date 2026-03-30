-- Enhanced Admin RLS Policies for Fayda Jobs
-- Run this in Supabase SQL Editor to fix admin access issues

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view their own role" ON admin_roles;
DROP POLICY IF EXISTS "Users can insert their own role" ON admin_roles;

-- Create more flexible admin policies
CREATE POLICY "Admin users can access admin_roles" ON admin_roles
  FOR ALL USING (
    auth.uid() IS NOT NULL
  );

-- Enable admin bypass for categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON categories;

CREATE POLICY "Enable read access for all users" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for admin users" ON categories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Enable update for admin users" ON categories
  FOR UPDATE WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Enable delete for admin users" ON categories
  FOR DELETE WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Similar policies for jobs table
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON jobs
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for admin users" ON jobs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Enable update for admin users" ON jobs
  FOR UPDATE WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Enable delete for admin users" ON jobs
  FOR DELETE WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Grant necessary permissions
GRANT ALL ON categories TO authenticated;
GRANT ALL ON jobs TO authenticated;
GRANT ALL ON admin_roles TO authenticated;
