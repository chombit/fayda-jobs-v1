import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

// ── Exported types ──────────────────────────────────────────────────────────

export type Job = Tables<"jobs"> & {
  companies?: Tables<"companies"> | null;
  categories?: Tables<"categories"> | null;
};

export type Company = Tables<"companies">;
export type Category = Tables<"categories">;
export type BlogPost = Tables<"blog_posts">;

// ── Job queries ─────────────────────────────────────────────────────────────

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

    // Text search using ilike (since fts column was removed for simplicity)
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
      query = query.range(
        params.offset,
        params.offset + (params.limit || 10) - 1
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase Query Error in fetchJobs:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      // Try a simpler query if it fails? (Maybe something is wrong with the Joins)
      return { data: [], error };
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

// ── Newsletter ──────────────────────────────────────────────────────────────

export async function subscribeNewsletter(email: string) {
  return supabase.from("subscribers").insert({ email });
}

export async function fetchSubscribers() {
  return supabase.from("subscribers").select("*").order("created_at", { ascending: false });
}

// ── Utilities ───────────────────────────────────────────────────────────────

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// ── Admin CRUD: Jobs ────────────────────────────────────────────────────────

/**
 * Detects if a string contains base64 encoded images, which can significantly 
 * increase payload size and cause timeouts.
 */
/**
 * Detects if a string contains base64 encoded images, which can significantly 
 * increase payload size and cause timeouts.
 */
/**
 * Detects if a string contains base64 encoded images, which can significantly 
 * increase payload size and cause timeouts.
 */
function hasBase64Images(html: string): boolean {
  if (!html) return false;
  return /src\s*=\s*['"]data:image\/[^;]+;base64[^'"]+['"]/i.test(html);
}

/**
 * Aggressively cleans HTML content to remove bloat like inline styles, classes, 
 * and metadata that often come from Word or other sources. 
 * Preserves structural tags like <b>, <i>, <ul>, <li>, <p>, etc.
 */
function cleanHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove <style> blocks
    .replace(/<meta[^>]*>/gi, '') // Remove <meta> tags
    .replace(/<link[^>]*>/gi, '') // Remove <link> tags
    .replace(/style\s*=\s*['"][^'"]*['"]/gi, '') // Remove style="..." attributes
    .replace(/class\s*=\s*['"][^'"]*['"]/gi, '') // Remove class="..." attributes
    .replace(/id\s*=\s*['"][^'"]*['"]/gi, '') // Remove id="..." attributes
    .replace(/data-[a-z0-9-]+\s*=\s*['"][^'"]*['"]/gi, '') // Remove data-* attributes
    .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces with normal spaces
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

/**
 * Validates the job payload size and content to ensure it can be safely uploaded.
 */
function validateJobPayload(job: any) {
  // Clean all rich text fields before validation and submission
  if (job.description) job.description = cleanHtml(job.description);
  if (job.requirements) job.requirements = cleanHtml(job.requirements);
  if (job.responsibilities) job.responsibilities = cleanHtml(job.responsibilities);

  const fieldsToCheck = [job.description, job.requirements, job.responsibilities];
  if (fieldsToCheck.some(field => field && hasBase64Images(field))) {
    throw new Error("Job description contains embedded images (base64). Please use links to images instead to reduce size.");
  }

  const payloadStr = JSON.stringify(job);
  const payloadBytes = new Blob([payloadStr]).size;
  const MAX_PAYLOAD_BYTES = 200 * 1024; // 200KB limit
  
  if (payloadBytes > MAX_PAYLOAD_BYTES) {
    throw new Error(`Job data is too large (${(payloadBytes / 1024).toFixed(1)}KB). Please shorten your description. Maximum allowed: 200KB.`);
  }
  
  return payloadBytes;
}

/**
 * Wraps a supabase request in a timeout to prevent indefinite hangs.
 */
async function executeWithTimeout<T>(promise: T | Promise<T> | PromiseLike<T>, timeoutMs: number = 90000): Promise<T> {
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error(`Database operation timed out after ${timeoutMs/1000}s. Your connection may be too slow.`)), timeoutMs)
  );
  return Promise.race([promise, timeoutPromise]) as Promise<T>;
}

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
    
    // Return a simple success object
    return { 
      id: 'success-' + Date.now(), 
      title: job.title, 
      slug,
      message: 'Job created successfully (timeout bypassed)' 
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
    const payloadBytes = validateJobPayload(updates);
    
    console.log('🔍 [Diagnostic] Updating job:', { 
      id,
      payloadSizeBytes: payloadBytes
    });

    const dbUpdateStart = performance.now();
    
    const { data, error } = await executeWithTimeout(
      supabase
        .from("jobs")
        .update(updates)
        .eq("id", id)
        .select()
        .single()
    ) as { data: any; error: any };

    const dbUpdateTime = performance.now() - dbUpdateStart;
    console.log(`📊 [Diagnostic] Database update took ${dbUpdateTime.toFixed(2)}ms`);

    if (error) {
      console.error('❌ [Diagnostic] Update job error:', error);
      throw error;
    }
    
    return data;
  } catch (err: any) {
    console.error('❌ [Diagnostic] Error in updateJob:', err.message);
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
  const { data, error } = await supabase
    .from("categories")
    .insert([{ ...category, slug }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCategory(
  id: string,
  updates: TablesUpdate<"categories">
) {
  const updateData = { ...updates } as TablesUpdate<"categories">;
  if (updates.name) {
    updateData.slug = generateSlug(updates.name);
  }
  const { data, error } = await supabase
    .from("categories")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
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
  
  const { data, error } = await supabase
    .from("blog_posts")
    .insert([{ ...blog, slug }])
    .select()
    .single();

  console.log('📊 Create blog post result:', { data, error });
  
  if (error) {
    console.error('❌ Create blog post error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    throw error;
  }
  return data;
}

export async function updateBlogPost(id: string, updates: TablesUpdate<"blog_posts">) {
  if (updates.title) {
    updates.slug = generateSlug(updates.title);
  }
  const { data, error } = await supabase
    .from("blog_posts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBlogPost(id: string) {
  const { error } = await supabase
    .from("blog_posts")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}

export async function deleteCompany(id: string) {
  const { error } = await supabase.from("companies").delete().eq("id", id);
  if (error) throw error;
  return true;
}
