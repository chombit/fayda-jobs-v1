-- Simple Setup for Fayda Jobs
-- Run this in your Supabase SQL Editor

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT DEFAULT 'Briefcase',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create companies table
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

-- Create jobs table
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

-- Enable public read access
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Companies are viewable by everyone" ON companies FOR SELECT USING (true);
CREATE POLICY "Jobs are viewable by everyone" ON jobs FOR SELECT USING (true);

-- Insert sample data
INSERT INTO categories (name, description, slug, icon) VALUES
('Software Development', 'Software engineering roles', 'software-development', 'Code'),
('Marketing', 'Marketing and communications', 'marketing', 'Megaphone'),
('Design', 'UI/UX and graphic design', 'design', 'Palette'),
('Sales', 'Sales and business development', 'sales', 'TrendingUp');

INSERT INTO companies (name, description, location) VALUES
('TechCorp Ethiopia', 'Leading technology company', 'Addis Ababa'),
('Digital Marketing Agency', 'Full-service digital marketing', 'Addis Ababa'),
('Design Studio', 'Creative design agency', 'Addis Ababa');

INSERT INTO jobs (title, description, location, job_type, salary_min, salary_max, application_link, deadline, featured, slug, category_id, company_id) VALUES
('Senior React Developer', 'Experienced React developer needed', 'Addis Ababa', 'full-time', 50000, 80000, 'https://techcorp.et/apply', '2024-12-31', true, 'senior-react-developer', (SELECT id FROM categories WHERE slug = 'software-development'), (SELECT id FROM companies WHERE name = 'TechCorp Ethiopia')),
('Digital Marketing Manager', 'Lead marketing campaigns', 'Addis Ababa', 'full-time', 40000, 60000, 'https://digitalagency.et/careers', '2024-12-25', true, 'digital-marketing-manager', (SELECT id FROM categories WHERE slug = 'marketing'), (SELECT id FROM companies WHERE name = 'Digital Marketing Agency')),
('UI/UX Designer', 'Create beautiful interfaces', 'Addis Ababa', 'full-time', 35000, 55000, 'https://designstudio.et/jobs', '2024-12-20', false, 'ui-ux-designer', (SELECT id FROM categories WHERE slug = 'design'), (SELECT id FROM companies WHERE name = 'Design Studio')),
('Sales Executive', 'Drive business growth', 'Addis Ababa', 'full-time', 30000, 50000, 'https://techcorp.et/sales', '2024-12-28', false, 'sales-executive', (SELECT id FROM categories WHERE slug = 'sales'), (SELECT id FROM companies WHERE name = 'TechCorp Ethiopia'));
