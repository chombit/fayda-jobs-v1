-- Complete Database Setup for Fayda Jobs
-- Run this in Supabase SQL Editor

-- Create categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT DEFAULT 'Briefcase',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create companies table if it doesn't exist
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jobs table if it doesn't exist
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  job_type TEXT DEFAULT 'full-time',
  salary_min INTEGER,
  salary_max INTEGER,
  application_link TEXT,
  deadline DATE,
  featured BOOLEAN DEFAULT false,
  slug TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  posted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Companies are viewable by everyone" ON companies
  FOR SELECT USING (true);

CREATE POLICY "Jobs are viewable by everyone" ON jobs
  FOR SELECT USING (true);

-- Insert sample data
INSERT INTO categories (id, name, description, slug, icon, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440444', 'Software Development', 'Software engineering and development roles', 'software-development', 'Code', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440445', 'Marketing', 'Marketing and communications roles', 'marketing', 'Megaphone', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440446', 'Design', 'UI/UX and graphic design roles', 'design', 'Palette', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440447', 'Sales', 'Sales and business development', 'sales', 'TrendingUp', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO companies (id, name, description, logo_url, website, location, created_at, updated_at) VALUES
('660e8400-e29b-41d4-a716-446655440444', 'TechCorp Ethiopia', 'Leading technology company in Ethiopia', NULL, 'https://techcorp.et', 'Addis Ababa', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440445', 'Digital Marketing Agency', 'Full-service digital marketing', NULL, 'https://digitalagency.et', 'Addis Ababa', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440446', 'Design Studio', 'Creative design agency', NULL, 'https://designstudio.et', 'Addis Ababa', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO jobs (
  id, title, description, location, job_type, salary_min, salary_max, 
  application_link, deadline, featured, slug, category_id, company_id, 
  posted_date, created_at, updated_at
) VALUES
('770e8400-e29b-41d4-a716-446655440444', 
 'Senior React Developer', 
 'We are looking for an experienced React developer to join our team. You will work on modern web applications using React, TypeScript, and related technologies.',
 'Addis Ababa', 
 'full-time', 
 50000, 80000, 
 'https://techcorp.et/apply', 
 '2024-12-31', 
 true, 
 'senior-react-developer', 
 '550e8400-e29b-41d4-a716-446655440444', 
 '660e8400-e29b-41d4-a716-446655440444', 
 NOW(), NOW(), NOW()),

('770e8400-e29b-41d4-a716-446655440445', 
 'Digital Marketing Manager', 
 'Lead our digital marketing efforts and manage campaigns for various clients.',
 'Addis Ababa', 
 'full-time', 
 40000, 60000, 
 'https://digitalagency.et/careers', 
 '2024-12-25', 
 true, 
 'digital-marketing-manager', 
 '550e8400-e29b-41d4-a716-446655440445', 
 '660e8400-e29b-41d4-a716-446655440445', 
 NOW(), NOW(), NOW()),

('770e8400-e29b-41d4-a716-446655440446', 
 'UI/UX Designer', 
 'Create beautiful and functional user interfaces for web and mobile applications.',
 'Addis Ababa', 
 'full-time', 
 35000, 55000, 
 'https://designstudio.et/jobs', 
 '2024-12-20', 
 false, 
 'ui-ux-designer', 
 '550e8400-e29b-41d4-a716-446655440446', 
 '660e8400-e29b-41d4-a716-446655440446', 
 NOW(), NOW(), NOW()),

('770e8400-e29b-41d4-a716-446655440447', 
 'Sales Executive', 
 'Drive business growth through strategic sales and client relationship management.',
 'Addis Ababa', 
 'full-time', 
 30000, 50000, 
 'https://techcorp.et/sales', 
 '2024-12-28', 
 false, 
 'sales-executive', 
 '550e8400-e29b-41d4-a716-446655440447', 
 '660e8400-e29b-41d4-a716-446655440444', 
 NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
