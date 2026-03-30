
CREATE TABLE public.blog_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'General',
  read_time text NOT NULL DEFAULT '3 min read',
  published boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blog posts are viewable by everyone" ON public.blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "Admins can manage blog posts" ON public.blog_posts
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed with initial blog posts
INSERT INTO public.blog_posts (title, slug, excerpt, content, category, read_time, published) VALUES
('Top 10 In-Demand Jobs in Ethiopia for 2026', 'top-10-in-demand-jobs-ethiopia-2026', 'Explore the most sought-after career opportunities across Ethiopia''s growing economy, from tech to finance.', 'Ethiopia''s job market is evolving rapidly, driven by economic reforms, a growing tech sector, and increased foreign investment.

**1. Software Developers & Engineers**
With Ethiopia''s burgeoning tech scene, skilled developers are in high demand.

**2. Data Analysts & Scientists**
As businesses embrace data-driven decision making, professionals who can analyze and interpret complex datasets are becoming invaluable.

**3. Digital Marketing Specialists**
The shift to digital commerce has created a surge in demand for SEO experts, social media managers, and content strategists.

**4. Financial Analysts**
Ethiopia''s growing banking and finance sector needs professionals who can navigate complex financial landscapes.

**5. Healthcare Professionals**
Doctors, nurses, and public health specialists remain critically needed across the country.', 'Career Tips', '5 min read', true),

('How to Write a Winning CV for Ethiopian Employers', 'how-to-write-winning-cv-ethiopian-employers', 'Stand out from the competition with these practical tips tailored to the Ethiopian job market.', 'Your CV is your first impression — make it count.

**Keep It Concise**
Ethiopian employers typically prefer CVs that are 1-2 pages long. Focus on your most relevant experience and achievements.

**Tailor Your CV**
Customize your CV for each application. Highlight the skills and experience that match the job description.

**Highlight Your Education**
Education is highly valued in Ethiopia. List your degrees, certifications, and relevant training prominently.

**Include Relevant Skills**
List both technical and soft skills. Include language proficiency — being multilingual is a significant advantage.', 'Job Search', '4 min read', true),

('Remote Work Opportunities: A Guide for Ethiopian Professionals', 'remote-work-guide-ethiopian-professionals', 'Learn how to find and land remote positions with international companies while based in Ethiopia.', 'Remote work has opened up a world of opportunities for Ethiopian professionals.

**Where to Find Remote Jobs**
Platforms like Upwork, Toptal, and Remote.co regularly list positions suitable for Ethiopian professionals.

**Skills in Demand**
Software development, graphic design, content writing, virtual assistance, and digital marketing are among the most sought-after remote skills.

**Setting Up Your Workspace**
Invest in a reliable internet connection — this is non-negotiable for remote work.', 'Remote Work', '6 min read', true),

('Interview Tips: What Ethiopian Employers Look For', 'interview-tips-ethiopian-employers', 'Prepare for your next interview with insights from top HR professionals across Addis Ababa.', 'Landing an interview is just the first step.

**Professional Appearance**
First impressions matter. Dress professionally and arrive on time — punctuality is highly regarded.

**Knowledge of the Company**
Research the company thoroughly before your interview.

**Communication Skills**
Be clear, confident, and concise in your responses.', 'Interview Prep', '4 min read', true),

('The Rise of Tech Startups in Ethiopia', 'rise-of-tech-startups-ethiopia', 'How Ethiopia''s startup ecosystem is creating exciting new job opportunities for young professionals.', 'Ethiopia''s tech startup ecosystem is experiencing unprecedented growth.

**The Current Landscape**
Addis Ababa has become a hub for innovation, with incubators and accelerators supporting dozens of new startups each year.

**Job Opportunities**
Startups are actively hiring across all functions — from engineering and design to marketing and operations.

**Skills for the Startup World**
Adaptability, self-motivation, and a willingness to wear multiple hats are essential.', 'Industry News', '7 min read', true);
