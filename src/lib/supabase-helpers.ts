import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

// ── Exported types ──────────────────────────────────────────────────

export type Job = Tables<"jobs"> & {
  companies?: Tables<"companies"> | null;
  categories?: Tables<"categories"> | null;
};

export type Company = Tables<"companies">;
export type Category = Tables<"categories">;
export type BlogPost = Tables<"blog_posts">;

// ── Job queries ─────────────────────────────────────────────────────

export async function fetchJobs(params?: {
  search?: string;
  category?: string;
  location?: string;
  jobType?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}) {
  try {
    let query = supabase
      .from("jobs")
      .select("*, companies(*), categories(*)")
      .order("posted_date", { ascending: false });

    // Text search using ilike
    if (params?.search) {
      query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`);
    }

    // Category filtering
    if (params?.category && params.category !== "all") {
      query = query.eq("category_id", params.category);
    }

    if (params?.location && params.location !== "all") {
      query = query.ilike("location", `%${params.location}%`);
    }

    if (params?.jobType && params.jobType !== "all") {
      query = query.ilike("job_type", `%${params.jobType}%`);
    }

    if (params?.featured) {
      query = query.eq("featured", true);
    }

    if (params?.limit) {
      query = query.limit(params.limit);
    }

    if (params?.offset) {
      query = query.offset(params.offset);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }

    const jobs = data || [];
    console.log(`fetchJobs success: found ${jobs.length} jobs`);
    return { data: jobs, error: null };
  } catch (err: any) {
    console.error("Critical error in fetchJobs:", err.message || err);
    return { data: [], error: err };
  }
}

export async function fetchJobBySlug(slug: string) {
  return supabase
    .from("jobs")
    .select("*, companies(*), categories(*)")
    .eq("slug", slug)
    .single();
}

// Fetch jobs from the same batch
export async function fetchBatchJobs(batchId: string) {
  try {
    const { data, error } = await supabase
      .from("jobs")
      .select("*, companies(*), categories(*)")
      .eq("batch_id", batchId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching batch jobs:", error);
      throw error;
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error("Error in fetchBatchJobs:", error);
    return { data: [], error: error as Error };
  }
}

// ── Category queries ────────────────────────────────────────────────────────

export async function fetchCategories() {
  return supabase.from("categories").select("*").order("name");
}

// ── Company queries ─────────────────────────────────────────────────────────

export async function fetchCompanies() {
  return supabase.from("companies").select("*").order("name");
}

export async function fetchCompanyById(id: string) {
  return supabase.from("companies").select("*").eq("id", id).single();
}

export async function fetchJobsByCompany(
  companyId: string,
  excludeJobId?: string,
  limit = 5
) {
  let query = supabase
    .from("jobs")
    .select("*, companies(*), categories(*)")
    .eq("company_id", companyId)
    .order("posted_date", { ascending: false })
    .limit(limit + 1);

  if (excludeJobId) {
    query = query.neq("id", excludeJobId);
  }

  return query.limit(limit);
}

// ── Newsletter ──────────────────────────────────────────────────────

export async function subscribeNewsletter(email: string) {
  return supabase.from("subscribers").insert({ email });
}

export async function fetchSubscribers() {
  return supabase.from("subscribers").select("*").order("created_at", { ascending: false });
}

// ── Utilities ───────────────────────────────────────────────────────

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// ── Admin CRUD: Jobs ────────────────────────────────────────────────

export async function createJob(
  job: Omit<TablesInsert<"jobs">, "slug"> & { title: string }
) {
  const slug = generateSlug(job.title);
  console.log('🔍 Creating job with data:', { 
    title: job.title,
    slug,
    textLengths: {
      title: job.title?.length || 0,
      description: job.description?.length || 0,
      requirements: job.requirements?.length || 0,
      responsibilities: job.responsibilities?.length || 0
    }
  });
  
  try {
    // Simple insert without select to avoid timeout issues
    console.log('🚀 Starting simple database insertion...');
    const dbInsertStart = performance.now();
    
    const { error } = await supabase
      .from("jobs")
      .insert([{ ...job, slug }]);

    const dbInsertTime = performance.now() - dbInsertStart;
    console.log(`📊 Database insertion took ${dbInsertTime.toFixed(2)}ms`);

    if (error) {
      console.error('❌ Create job error:', error);
      throw error;
    }
    
    console.log('✅ Job created successfully!');
    
    // Return success object without waiting for database response
    return { 
      id: 'created-' + Date.now(), 
      title: job.title, 
      slug,
      description: job.description,
      requirements: job.requirements,
      responsibilities: job.responsibilities,
      location: job.location,
      job_type: job.job_type,
      application_link: job.application_link,
      company_id: job.company_id,
      category_id: job.category_id,
      deadline: job.deadline,
      featured: job.featured,
      message: 'Job created successfully' 
    };
    
  } catch (err: any) {
    console.error('❌ Error in createJob:', err.message);
    throw err;
  }
}

export async function updateJob(id: string, updates: TablesUpdate<"jobs">) {
  if (updates.title) {
    updates.slug = generateSlug(updates.title);
  }

  try {
    // Remove .select() to prevent hanging with long text
    console.log('🚀 Starting job update...');
    const dbUpdateStart = performance.now();
    
    const { error } = await supabase
      .from("jobs")
      .update(updates)
      .eq("id", id);

    const dbUpdateTime = performance.now() - dbUpdateStart;
    console.log(`📊 Database update took ${dbUpdateTime.toFixed(2)}ms`);

    if (error) {
      console.error('❌ Update job error:', error);
      throw error;
    }
    
    console.log('✅ Job updated successfully!');
    
    // Return success object without waiting for database response
    return { 
      id, 
      ...updates,
      message: 'Job updated successfully' 
    };
    
  } catch (err: any) {
    console.error('❌ Error in updateJob:', err.message);
    throw err;
  }
}

export async function deleteJob(id: string) {
  const { error } = await supabase.from("jobs").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// ── Admin CRUD: Categories ──────────────────────────────────────────────────

export async function createCategory(
  category: Omit<TablesInsert<"categories">, "slug"> & { name: string }
) {
  const slug = generateSlug(category.name);
  
  try {
    // Remove .select() to prevent hanging with long text
    console.log('🚀 Starting category creation...');
    const dbInsertStart = performance.now();
    
    const { error } = await supabase
      .from("categories")
      .insert([{ ...category, slug }]);

    const dbInsertTime = performance.now() - dbInsertStart;
    console.log(`📊 Category insertion took ${dbInsertTime.toFixed(2)}ms`);

    if (error) {
      console.error('❌ Create category error:', error);
      throw error;
    }
    
    console.log('✅ Category created successfully!');
    
    // Return success object without waiting for database response
    return { 
      id: 'created-' + Date.now(), 
      ...category,
      slug,
      message: 'Category created successfully' 
    };
    
  } catch (err: any) {
    console.error('❌ Error in createCategory:', err.message);
    throw err;
  }
}

export async function updateCategory(
  id: string,
  updates: TablesUpdate<"categories">
) {
  const updateData = { ...updates } as TablesUpdate<"categories">;
  if (updates.name) {
    updateData.slug = generateSlug(updates.name);
  }
  
  try {
    // Remove .select() to prevent hanging with long text
    console.log('🚀 Starting category update...');
    const dbUpdateStart = performance.now();
    
    const { error } = await supabase
      .from("categories")
      .update(updateData)
      .eq("id", id);

    const dbUpdateTime = performance.now() - dbUpdateStart;
    console.log(`📊 Category update took ${dbUpdateTime.toFixed(2)}ms`);

    if (error) {
      console.error('❌ Update category error:', error);
      throw error;
    }
    
    console.log('✅ Category updated successfully!');
    
    // Return success object without waiting for database response
    return { 
      id, 
      ...updateData,
      message: 'Category updated successfully' 
    };
    
  } catch (err: any) {
    console.error('❌ Error in updateCategory:', err.message);
    throw err;
  }
}

export async function deleteCategory(id: string) {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// ── Admin CRUD: Companies ──────────────────────────────────────────────────

export async function createCompany(company: TablesInsert<"companies">) {
  const { data, error } = await supabase
    .from("companies")
    .insert([company])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCompany(id: string, updates: TablesUpdate<"companies">) {
  const { data, error } = await supabase
    .from("companies")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCompany(id: string) {
  const { error } = await supabase.from("companies").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// ── Admin CRUD: Blog Posts ───────────────────────────────────────────

export async function fetchBlogPosts() {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createBlogPost(
  blog: Omit<TablesInsert<"blog_posts">, "slug">
) {
  const slug = generateSlug(blog.title);
  console.log('🔍 Creating blog post with data:', { ...blog, slug });
  
  try {
    // Remove .select() to prevent hanging with long text
    console.log('🚀 Starting blog post creation...');
    const dbInsertStart = performance.now();
    
    const { error } = await supabase
      .from("blog_posts")
      .insert([{ ...blog, slug }]);

    const dbInsertTime = performance.now() - dbInsertStart;
    console.log(`📊 Blog post insertion took ${dbInsertTime.toFixed(2)}ms`);

    if (error) {
      console.error('❌ Create blog post error:', error);
      throw error;
    }
    
    console.log('✅ Blog post created successfully!');
    
    // Return success object without waiting for database response
    return { 
      id: 'created-' + Date.now(), 
      ...blog,
      slug,
      message: 'Blog post created successfully' 
    };
    
  } catch (err: any) {
    console.error('❌ Error in createBlogPost:', err.message);
    throw err;
  }
}

export async function updateBlogPost(id: string, updates: TablesUpdate<"blog_posts">) {
  if (updates.title) {
    updates.slug = generateSlug(updates.title);
  }
  
  try {
    // Remove .select() to prevent hanging with long text
    console.log('🚀 Starting blog post update...');
    const dbUpdateStart = performance.now();
    
    const { error } = await supabase
      .from("blog_posts")
      .update(updates)
      .eq("id", id);

    const dbUpdateTime = performance.now() - dbUpdateStart;
    console.log(`📊 Blog post update took ${dbUpdateTime.toFixed(2)}ms`);

    if (error) {
      console.error('❌ Update blog post error:', error);
      throw error;
    }
    
    console.log('✅ Blog post updated successfully!');
    
    // Return success object without waiting for database response
    return { 
      id, 
      ...updates,
      message: 'Blog post updated successfully' 
    };
    
  } catch (err: any) {
    console.error('❌ Error in updateBlogPost:', err.message);
    throw err;
  }
}

export async function deleteBlogPost(id: string) {
  const { error } = await supabase
    .from("blog_posts")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}
