-- Clean Schema Reset - Run this first to clear existing policies
-- This will remove all existing policies and recreate them properly

-- Drop all existing policies first
DROP POLICY IF EXISTS "Public read access for categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Users can view their own role" ON public.categories;
DROP POLICY IF EXISTS "Users can insert their own role" ON public.categories;

DROP POLICY IF EXISTS "Public read access for companies" ON public.companies;
DROP POLICY IF EXISTS "Admins can manage companies" ON public.companies;

DROP POLICY IF EXISTS "Public read access for jobs" ON public.jobs;
DROP POLICY IF EXISTS "Admins can manage jobs" ON public.jobs;

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;

DROP POLICY IF EXISTS "Anyone can subscribe with valid email" ON public.subscribers;
DROP POLICY IF EXISTS "Admins can view subscribers" ON public.subscribers;

DROP POLICY IF EXISTS "Users can view own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can manage own bookmarks" ON public.bookmarks;

DROP POLICY IF EXISTS "Public read access for blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can manage blog posts" ON public.blog_posts;

-- Drop the has_role function if it exists
DROP FUNCTION IF EXISTS public.has_role(UUID, TEXT);

-- Now recreate everything properly
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

-- Recreate policies with clean names
CREATE POLICY "categories_read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories_manage" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "companies_read" ON public.companies FOR SELECT USING (true);
CREATE POLICY "companies_manage" ON public.companies FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "jobs_read" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "jobs_manage" ON public.jobs FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "user_roles_view_own" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_roles_manage" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "subscribers_insert" ON public.subscribers FOR INSERT WITH CHECK (email IS NOT NULL AND email <> '');
CREATE POLICY "subscribers_view" ON public.subscribers FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "bookmarks_own" ON public.bookmarks FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "blog_posts_read" ON public.blog_posts FOR SELECT USING (published = true);
CREATE POLICY "blog_posts_manage" ON public.blog_posts FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Grant permissions
GRANT ALL ON public.categories TO authenticated;
GRANT ALL ON public.companies TO authenticated;
GRANT ALL ON public.jobs TO authenticated;
GRANT ALL ON public.user_roles TO authenticated;
GRANT ALL ON public.subscribers TO authenticated;
GRANT ALL ON public.bookmarks TO authenticated;
GRANT ALL ON public.blog_posts TO authenticated;

-- Success message
SELECT 'Schema cleanup completed successfully!' as status;
