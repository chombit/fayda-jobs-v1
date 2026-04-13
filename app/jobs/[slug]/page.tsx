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

                <div className="flex flex-wrap items-center justify-center gap-6">
                  {[
                    {
                      label: "Telegram",
                      href: "https://t.me/faydajobs",
                      color: "hover:bg-[#229ED9]",
                      shadow: "hover:shadow-[#229ED9]/30",
                      icon: (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                        </svg>
                      )
                    },
                    {
                      label: "Facebook",
                      href: "https://facebook.com/faydajobs",
                      color: "hover:bg-[#1877F2]/30",
                      shadow: "hover:shadow-[#1877F2]/30",
                      icon: (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      )
                    },
                    {
                      label: "LinkedIn",
                      href: "https://linkedin.com/company/faydajobs",
                      color: "hover:bg-[#0A66C2]",
                      shadow: "hover:shadow-[#0A66C2]/30",
                      icon: (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      )
                    },
                    {
                      label: "WhatsApp",
                      href: "https://wa.me/251900000000",
                      color: "hover:bg-[#25D366]",
                      shadow: "hover:shadow-[#25D366]/30",
                      icon: (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                        </svg>
                      )
                    }
                  ].map((social) => (
                    <Link
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      className={`group/btn flex items-center justify-center h-14 w-14 rounded-2xl bg-muted transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:text-white shadow-sm ${social.color} ${social.shadow}`}
                      aria-label={social.label}
                    >
                      <span className="transition-transform duration-300 group-hover/btn:scale-110">
                        {social.icon}
                      </span>
                    </Link>
                  ))}
                </div>
                    color: "hover:bg-[#1877F2]/30",
                    shadow: "hover:shadow-[#1877F2]/30",
                    icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    )
                  },
                  {
                    label: "LinkedIn",
                    href: "https://linkedin.com/company/faydajobs",
                    color: "hover:bg-[#0A66C2]",
                    shadow: "hover:shadow-[#0A66C2]/30",
                    icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    )
                  },
                  {
                    label: "WhatsApp",
                    href: "https://wa.me/251900000000",
                    color: "hover:bg-[#25D366]",
                    shadow: "hover:shadow-[#25D366]/30",
                    icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                      </svg>
                    )
                  }
                ].map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    className={`group/btn flex items-center justify-center h-14 w-14 rounded-2xl bg-muted transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:text-white shadow-sm ${social.color} ${social.shadow}`}
                    aria-label={social.label}
                  >
                    <span className="transition-transform duration-300 group-hover/btn:scale-110">
                      {social.icon}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
