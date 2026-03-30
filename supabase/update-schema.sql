-- Update script for existing Fayda Jobs database
-- Run this if you already have the tables and only need the new features.

-- 1. Add missing columns to 'jobs' table
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS requirements TEXT;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS responsibilities TEXT;

-- 3. Add missing columns to 'companies' table
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 5. Add missing columns to 'categories' table
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT 'Briefcase';
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 6. Ensure subscribers table exists (it was missing from early scripts)
CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Ensure RLS for subscribers
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view subscribers" ON public.subscribers;
CREATE POLICY "Admins can view subscribers" ON public.subscribers FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
