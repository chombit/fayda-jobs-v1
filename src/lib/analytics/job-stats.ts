export interface JobAnalytics {
  total_views: number;
  total_applications: number;
  view_rate: number;
  application_rate: number;
  daily_views: { date: string; views: number }[];
  daily_applications: { date: string; applications: number }[];
  top_locations: { location: string; count: number }[];
  top_categories: { category: string; count: number }[];
  performance_score: number;
}

export interface CompanyAnalytics {
  total_jobs: number;
  active_jobs: number;
  total_views: number;
  total_applications: number;
  average_views_per_job: number;
  average_applications_per_job: number;
  conversion_rate: number;
  top_performing_jobs: {
    job_id: string;
    job_title: string;
    views: number;
    applications: number;
  }[];
  monthly_trends: {
    month: string;
    jobs_posted: number;
    total_views: number;
    total_applications: number;
  }[];
}

export interface SystemAnalytics {
  total_jobs: number;
  active_jobs: number;
  total_companies: number;
  total_users: number;
  total_views: number;
  total_applications: number;
  monthly_growth: {
    month: string;
    jobs: number;
    companies: number;
    users: number;
    views: number;
    applications: number;
  }[];
  popular_categories: {
    category: string;
    job_count: number;
    total_views: number;
  }[];
  popular_locations: {
    location: string;
    job_count: number;
    total_views: number;
  }[];
}

/**
 * Calculate job performance metrics
 */
export function calculateJobAnalytics(
  jobViews: { date: string; views: number }[],
  jobApplications: { date: string; applications: number }[]
): JobAnalytics {
  const totalViews = jobViews.reduce((sum, day) => sum + day.views, 0);
  const totalApplications = jobApplications.reduce((sum, day) => sum + day.applications, 0);
  
  const viewRate = totalViews > 0 ? 1 : 0;
  const applicationRate = totalViews > 0 ? totalApplications / totalViews : 0;
  
  // Calculate performance score (0-100)
  const performanceScore = Math.min(100, (
    (Math.min(totalViews / 100, 1) * 30) + // Views score (30%)
    (Math.min(applicationRate * 100, 1) * 50) + // Application rate score (50%)
    (Math.min(jobApplications.length / 30, 1) * 20) // Consistency score (20%)
  ));

  return {
    total_views: totalViews,
    total_applications: totalApplications,
    view_rate: viewRate,
    application_rate: applicationRate,
    daily_views: jobViews,
    daily_applications: jobApplications,
    top_locations: [], // Would be calculated from actual data
    top_categories: [], // Would be calculated from actual data
    performance_score: Math.round(performanceScore),
  };
}

/**
 * Calculate company analytics
 */
export function calculateCompanyAnalytics(
  jobs: Array<{
    id: string;
    title: string;
    views: number;
    applications: number;
    created_at: string;
  }>
): CompanyAnalytics {
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(job => isJobActive(job.created_at)).length;
  const totalViews = jobs.reduce((sum, job) => sum + job.views, 0);
  const totalApplications = jobs.reduce((sum, job) => sum + job.applications, 0);
  
  const averageViewsPerJob = totalJobs > 0 ? totalViews / totalJobs : 0;
  const averageApplicationsPerJob = totalJobs > 0 ? totalApplications / totalJobs : 0;
  const conversionRate = totalViews > 0 ? totalApplications / totalViews : 0;

  // Top performing jobs
  const topPerformingJobs = jobs
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
    .map(job => ({
      job_id: job.id,
      job_title: job.title,
      views: job.views,
      applications: job.applications,
    }));

  // Monthly trends (mock data - would come from actual database)
  const monthlyTrends = generateMonthlyTrends(jobs);

  return {
    total_jobs: totalJobs,
    active_jobs: activeJobs,
    total_views: totalViews,
    total_applications: totalApplications,
    average_views_per_job: Math.round(averageViewsPerJob),
    average_applications_per_job: Math.round(averageApplicationsPerJob),
    conversion_rate: Math.round(conversionRate * 100) / 100,
    top_performing_jobs: topPerformingJobs,
    monthly_trends: monthlyTrends,
  };
}

/**
 * Check if job is still active (not expired)
 */
function isJobActive(createdAt: string): boolean {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const daysSinceCreation = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
  
  // Consider jobs active for 30 days by default
  return daysSinceCreation <= 30;
}

/**
 * Generate monthly trends data
 */
function generateMonthlyTrends(jobs: any[]) {
  const trends = [];
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    // Filter jobs created in this month
    const monthJobs = jobs.filter(job => {
      const jobDate = new Date(job.created_at);
      return jobDate.getMonth() === month.getMonth() && 
             jobDate.getFullYear() === month.getFullYear();
    });
    
    trends.push({
      month: monthName,
      jobs_posted: monthJobs.length,
      total_views: monthJobs.reduce((sum, job) => sum + job.views, 0),
      total_applications: monthJobs.reduce((sum, job) => sum + job.applications, 0),
    });
  }
  
  return trends;
}

/**
 * Calculate system-wide analytics
 */
export function calculateSystemAnalytics(
  jobs: Array<{
    category: string;
    location: string;
    views: number;
    applications: number;
    created_at: string;
  }>,
  totalCompanies: number,
  totalUsers: number
): SystemAnalytics {
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(job => isJobActive(job.created_at)).length;
  const totalViews = jobs.reduce((sum, job) => sum + job.views, 0);
  const totalApplications = jobs.reduce((sum, job) => sum + job.applications, 0);

  // Popular categories
  const categoryStats = jobs.reduce((acc, job) => {
    if (!acc[job.category]) {
      acc[job.category] = { count: 0, views: 0 };
    }
    acc[job.category].count++;
    acc[job.category].views += job.views;
    return acc;
  }, {} as Record<string, { count: number; views: number }>);

  const popularCategories = Object.entries(categoryStats)
    .map(([category, stats]) => ({
      category,
      job_count: stats.count,
      total_views: stats.views,
    }))
    .sort((a, b) => b.job_count - a.job_count)
    .slice(0, 10);

  // Popular locations
  const locationStats = jobs.reduce((acc, job) => {
    if (!acc[job.location]) {
      acc[job.location] = { count: 0, views: 0 };
    }
    acc[job.location].count++;
    acc[job.location].views += job.views;
    return acc;
  }, {} as Record<string, { count: number; views: number }>);

  const popularLocations = Object.entries(locationStats)
    .map(([location, stats]) => ({
      location,
      job_count: stats.count,
      total_views: stats.views,
    }))
    .sort((a, b) => b.job_count - a.job_count)
    .slice(0, 10);

  // Monthly growth trends
  const monthlyGrowth = generateMonthlyGrowth(jobs);

  return {
    total_jobs: totalJobs,
    active_jobs: activeJobs,
    total_companies: totalCompanies,
    total_users: totalUsers,
    total_views: totalViews,
    total_applications: totalApplications,
    monthly_growth: monthlyGrowth,
    popular_categories: popularCategories,
    popular_locations: popularLocations,
  };
}

/**
 * Generate monthly growth data
 */
function generateMonthlyGrowth(jobs: any[]) {
  const growth = [];
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    // Filter jobs created in this month
    const monthJobs = jobs.filter(job => {
      const jobDate = new Date(job.created_at);
      return jobDate.getMonth() === month.getMonth() && 
             jobDate.getFullYear() === month.getFullYear();
    });
    
    growth.push({
      month: monthName,
      jobs: monthJobs.length,
      companies: new Set(monthJobs.map(job => job.company_id)).size,
      users: 0, // Would come from user data
      views: monthJobs.reduce((sum, job) => sum + job.views, 0),
      applications: monthJobs.reduce((sum, job) => sum + job.applications, 0),
    });
  }
  
  return growth;
}

/**
 * Track job view
 */
export function trackJobView(jobId: string, userId?: string) {
  // This would typically save to a database
  console.log(`Job ${jobId} viewed by user ${userId || 'anonymous'}`);
  
  // In production, you would:
  // 1. Save view event to database
  // 2. Update job view count
  // 3. Track user behavior
  // 4. Update analytics cache
}

/**
 * Track job application
 */
export function trackJobApplication(jobId: string, userId?: string) {
  // This would typically save to a database
  console.log(`Job ${jobId} applied by user ${userId || 'anonymous'}`);
  
  // In production, you would:
  // 1. Save application event to database
  // 2. Update job application count
  // 3. Track conversion metrics
  // 4. Update analytics cache
}
