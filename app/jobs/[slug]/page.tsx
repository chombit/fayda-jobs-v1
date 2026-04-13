'use client';

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Briefcase, Clock, DollarSign, ExternalLink, Layers } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchJobBySlug, fetchBatchJobs } from "@/lib/supabase-helpers";
import { use } from "react";
import type { Job } from "@/lib/supabase-helpers";
import { sanitizeHtml } from "@/lib/utils/sanitize-html";
import { generateJobPostingSchema, generateBreadcrumbListSchema } from "@/lib/seo/structured-data";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } }
};

export default function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data: job, isLoading, error } = useQuery<Job | null>({
    queryKey: ["job", slug],
    queryFn: async () => {
      const { data } = await fetchJobBySlug(slug);
      return data as Job | null;
    },
    enabled: !!slug
  });

  // Fetch batch jobs if this is a batch job
  const { data: batchJobs, isLoading: isLoadingBatch } = useQuery<Job[]>({
    queryKey: ["batchJobs", job?.batch_id],
    queryFn: async () => {
      if (!job?.batch_id) return [];
      const { data } = await fetchBatchJobs(job.batch_id);
      return data as Job[];
    },
    enabled: !!job?.batch_id && job?.is_batch_job
  });

  // Generate structured data
  const jobPostingSchema = job ? generateJobPostingSchema(job) : null;
  const breadcrumbSchema = job ? generateBreadcrumbListSchema([
    { name: 'Home', url: '/' },
    { name: 'Jobs', url: '/jobs' },
    { name: job.title, url: `/jobs/${job.slug}` }
  ]) : null;

  // Generate metadata
  const metadata = job ? {
    title: `${job.title} - ${job.companies?.name || 'Company'} | Fayda Jobs`,
    description: job.description ? sanitizeHtml(job.description).substring(0, 160) : undefined,
    openGraph: {
      title: job.title,
      description: job.description ? sanitizeHtml(job.description).substring(0, 160) : undefined,
      images: job.companies?.logo ? [{ url: job.companies.logo }] : undefined,
      type: 'website',
      siteName: 'Fayda Jobs',
      locale: 'en_US',
    },
    alternates: {
      canonical: `/jobs/${job.slug}`,
    },
  } : {};

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Job Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">The job you're looking for doesn't exist or has been removed.</p>
          <Link href="/jobs">
            <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Browse All Jobs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-muted/20">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <motion.nav 
            initial="hidden" 
            animate="visible" 
            variants={fadeUp}
            className="mb-8"
          >
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link href="/jobs" className="hover:text-primary transition-colors">Jobs</Link>
              <span>/</span>
              <span className="text-foreground font-medium">{job.title}</span>
            </div>
          </motion.nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Job Content */}
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={fadeUp}
              className="lg:col-span-2"
            >
              {/* Company Header */}
              <div className="bg-card rounded-2xl p-8 shadow-xl border border-border/50 mb-8">
                <div className="flex items-center gap-6 mb-8">
                  {job.companies?.logo ? (
                    <img
                      src={job.companies.logo}
                      alt={job.companies.name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-border/50 shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-border/50 shadow-lg flex items-center justify-center">
                      <Briefcase className="w-10 h-10 text-primary" />
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl font-bold text-card-foreground mb-2">{job.title}</h1>
                    <p className="text-lg text-muted-foreground font-medium">{job.companies?.name || "Unknown Company"}</p>
                    {job.companies?.website && (
                      <a 
                        href={job.companies.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Follow us for the latest career opportunities and job market insights in Ethiopia.
                </p>
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{job.job_type}</span>
                  </div>
                  {job.deadline && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {job.categories?.name || "General"}
                    </span>
                  </div>
                  {job.featured && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                      Featured Job
                    </Badge>
                  )}
                </div>
              </div>

              {/* Batch Job Indicator */}
              {job.is_batch_job && (
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/10 rounded-xl border border-purple-200 dark:border-purple-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="font-semibold text-purple-800 dark:text-purple-200">Batch Job Posting</span>
                  </div>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    This position is part of a batch hiring. See all positions from this batch below.
                  </p>
                </div>
              )}

              {/* Description */}
              {job.description && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-card-foreground mb-4">Job Description</h2>
                  <div 
                    className="prose prose-sm max-w-none text-card-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(job.description) }}
                  />
                </div>
              )}

              {/* Requirements */}
              {job.requirements && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-card-foreground mb-4">Requirements</h2>
                  <div 
                    className="prose prose-sm max-w-none text-card-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(job.requirements) }}
                  />
                </div>
              )}

              {/* Responsibilities */}
              {job.responsibilities && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-card-foreground mb-4">Responsibilities</h2>
                  <div 
                    className="prose prose-sm max-w-none text-card-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(job.responsibilities) }}
                  />
                </div>
              )}

              {/* How to Apply */}
              {job.application_link && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-card-foreground mb-4">How to Apply</h2>
                  <p className="text-card-foreground mb-4">
                    To apply for this position, please visit the application link or contact the company directly.
                  </p>
                  <Button 
                    asChild 
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
                  >
                    <a 
                      href={job.application_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Apply Now
                    </a>
                  </Button>
                </div>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={stagger}
              className="lg:col-span-1 space-y-6"
            >
              {/* Quick Apply */}
              <div className="bg-card rounded-2xl p-6 shadow-xl border border-border/50">
                <h3 className="text-lg font-bold text-card-foreground mb-4">Quick Apply</h3>
                {job.application_link && (
                  <Button 
                    asChild 
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
                  >
                    <a 
                      href={job.application_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Apply Now
                    </a>
                  </Button>
                )}
              </div>

              {/* Job Summary */}
              <div className="bg-card rounded-2xl p-6 shadow-xl border border-border/50">
                <h3 className="text-lg font-bold text-card-foreground mb-4">Job Summary</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Posted:</span>
                    <p className="font-medium text-card-foreground">
                      {new Date(job.posted_date).toLocaleDateString()}
                    </p>
                  </div>
                  {job.deadline && (
                    <div>
                      <span className="text-sm text-muted-foreground">Deadline:</span>
                      <p className="font-medium text-card-foreground">
                        {new Date(job.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-muted-foreground">Type:</span>
                    <p className="font-medium text-card-foreground">{job.job_type}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Batch Jobs Section */}
          {job.is_batch_job && batchJobs && batchJobs.length > 1 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-12"
            >
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/10 rounded-2xl p-8 border border-purple-200 dark:border-purple-700">
                <div className="flex items-center gap-3 mb-6">
                  <Layers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                    All Positions from This Batch ({batchJobs.length} total)
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {batchJobs.map((batchJob) => (
                    <div key={batchJob.id} className="bg-white dark:bg-background rounded-xl p-6 shadow-lg border border-purple-200 dark:border-purple-700 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start gap-4 mb-4">
                        {batchJob.companies?.logo ? (
                          <img
                            src={batchJob.companies.logo}
                            alt={batchJob.companies.name}
                            className="w-12 h-12 rounded-lg object-cover border border-border/50"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-border/50 flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-primary" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-card-foreground mb-1">
                            {batchJob.id === job.id ? (
                              <span className="text-primary">{batchJob.title}</span>
                            ) : (
                              <Link href={`/jobs/${batchJob.slug}`} className="hover:text-primary transition-colors">
                                {batchJob.title}
                              </Link>
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {batchJob.companies?.name || "Unknown Company"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs">{batchJob.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs">{batchJob.job_type}</span>
                        </div>
                        {batchJob.deadline && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs">Due: {new Date(batchJob.deadline).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      
                      {batchJob.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {batchJob.description}
                        </p>
                      )}
                      
                      <div className="mt-4 pt-4 border-t border-border/60">
                        <Link href={`/jobs/${batchJob.slug}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            {batchJob.id === job.id ? 'Current Position' : 'View Details'}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
