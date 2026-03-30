-- Consolidated Database Schema for Fayda Jobs Ethiopia
-- This script provides a single source of truth for the database structure.

-- 1. Extensions and Enums
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Tables

-- Categories
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT DEFAULT 'Briefcase',
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Companies
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo TEXT,
    logo_url TEXT, -- Backward compatibility
    website TEXT,
    description TEXT,
    location TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Jobs
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    location TEXT NOT NULL DEFAULT 'Addis Ababa',
    job_type TEXT NOT NULL DEFAULT 'Full-time',
    description TEXT,
    requirements TEXT,
    responsibilities TEXT,
    application_link TEXT,
    deadline TIMESTAMPTZ,
    posted_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User Roles
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Subscribers
CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bookmarks
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, job_id)
);

-- Blog Posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'General',
    read_time TEXT NOT NULL DEFAULT '3 min read',
    published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Security (RLS)

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Helper function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role::text = _role
  );
END;
$$;

-- Policies
DROP POLICY IF EXISTS "Public read access for categories" ON public.categories;
CREATE POLICY "Public read access for categories" ON public.categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Public read access for companies" ON public.companies;
CREATE POLICY "Public read access for companies" ON public.companies FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage companies" ON public.companies;
CREATE POLICY "Admins can manage companies" ON public.companies FOR ALL USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Public read access for jobs" ON public.jobs;
CREATE POLICY "Public read access for jobs" ON public.jobs FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage jobs" ON public.jobs;
CREATE POLICY "Admins can manage jobs" ON public.jobs FOR ALL USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
CREATE POLICY "Admins can manage user roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Anyone can subscribe with valid email" ON public.subscribers;
CREATE POLICY "Anyone can subscribe with valid email" ON public.subscribers FOR INSERT WITH CHECK (email IS NOT NULL AND email <> '');
DROP POLICY IF EXISTS "Admins can view subscribers" ON public.subscribers;
CREATE POLICY "Admins can view subscribers" ON public.subscribers FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can view own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can view own bookmarks" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can manage own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can manage own bookmarks" ON public.bookmarks FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public read access for blog posts" ON public.blog_posts;
CREATE POLICY "Public read access for blog posts" ON public.blog_posts FOR SELECT USING (published = true);
DROP POLICY IF EXISTS "Admins can manage blog posts" ON public.blog_posts;
CREATE POLICY "Admins can manage blog posts" ON public.blog_posts FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 4. Triggers and Indexes

-- Update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_category ON public.jobs(category_id);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON public.jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_featured ON public.jobs(featured);
CREATE INDEX IF NOT EXISTS idx_jobs_deadline ON public.jobs(deadline);
CREATE INDEX IF NOT EXISTS idx_jobs_slug ON public.jobs(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
