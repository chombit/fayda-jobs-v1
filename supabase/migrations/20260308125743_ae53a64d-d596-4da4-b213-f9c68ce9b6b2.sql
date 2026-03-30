
-- Drop the overly permissive insert policy
DROP POLICY "Anyone can subscribe" ON public.subscribers;

-- Create a more specific insert policy (still allows anyone but validates email is provided)
CREATE POLICY "Anyone can subscribe with valid email" ON public.subscribers
  FOR INSERT WITH CHECK (email IS NOT NULL AND email <> '');
