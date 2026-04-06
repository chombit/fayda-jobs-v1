import { MetadataRoute } from 'next';
import { fetchJobs, fetchCategories } from '@/lib/supabase-helpers';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://faydajobs.com';
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/admin`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.4,
    },
  ];

  // Dynamic job pages
  let jobPages: MetadataRoute.Sitemap = [];
  try {
    const { data: jobs } = await fetchJobs({ limit: 1000 });
    if (jobs) {
      jobPages = jobs.map((job) => ({
        url: `${baseUrl}/jobs/${job.slug}`,
        lastModified: new Date(job.updated_at || job.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error('Error fetching jobs for sitemap:', error);
  }

  // Dynamic category pages
  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const { data: categories } = await fetchCategories();
    if (categories) {
      categoryPages = categories.map((category) => ({
        url: `${baseUrl}/jobs?category=${category.id}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
  }

  return [...staticPages, ...jobPages, ...categoryPages];
}
