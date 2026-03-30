'use client';

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Briefcase, Clock, DollarSign, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchJobBySlug } from "@/lib/supabase-helpers";
import { use } from "react";
import type { Job } from "@/lib/supabase-helpers";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading job details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-16">
          <div className="text-center">
            <h1 className="font-heading text-3xl font-bold text-card-foreground mb-4">
              Job Not Found
            </h1>
            <p className="text-muted-foreground mb-8">
              The job you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/jobs">
              <Button className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Jobs
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-4xl mx-auto"
        >
          {/* Back Button */}
          <motion.div variants={fadeUp} custom={0} className="mb-6">
            <Link href="/jobs">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Jobs
              </Button>
            </Link>
          </motion.div>

          {/* Job Header */}
          <motion.div variants={fadeUp} custom={1} className="bg-card rounded-lg p-8 border border-border mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <h1 className="font-heading text-3xl font-bold text-card-foreground mb-4">
                  {job.title}
                </h1>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span>{job.companies?.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{job.job_type}</span>
                  </div>
                  

                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {job.featured && (
                    <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                  )}
                  {job.categories && (
                    <Badge variant="secondary">{job.categories.name}</Badge>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0">
                <Link href={job.application_link || '#'} target="_blank">
                  <Button className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Apply Now
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Job Details: Description, Requirements, Responsibilities */}
          <motion.div variants={fadeUp} custom={2} className="space-y-6 mt-6">
            <div className="bg-card rounded-lg p-8 border border-border">
              <h2 className="font-heading text-2xl font-semibold text-card-foreground mb-6 underline decoration-primary/30 underline-offset-8">
                Job Description
              </h2>
              <div 
                className="text-muted-foreground leading-relaxed rich-text-content"
                dangerouslySetInnerHTML={{ __html: job.description || "" }}
              />
            </div>

            {job.requirements && (
              <div className="bg-card rounded-lg p-8 border border-border">
                <h2 className="font-heading text-2xl font-semibold text-card-foreground mb-6 underline decoration-primary/30 underline-offset-8">
                  Requirements
                </h2>
                <div 
                  className="text-muted-foreground leading-relaxed rich-text-content"
                  dangerouslySetInnerHTML={{ __html: job.requirements }}
                />
              </div>
            )}

            {job.responsibilities && (
              <div className="bg-card rounded-lg p-8 border border-border">
                <h2 className="font-heading text-2xl font-semibold text-card-foreground mb-6 underline decoration-primary/30 underline-offset-8">
                  Key Responsibilities
                </h2>
                <div 
                  className="text-muted-foreground leading-relaxed rich-text-content"
                  dangerouslySetInnerHTML={{ __html: job.responsibilities }}
                />
              </div>
            )}
          </motion.div>

          {job.deadline && (
            <motion.div variants={fadeUp} custom={3} className="mt-8 p-6 bg-muted/50 rounded-lg max-w-4xl mx-auto border border-border/50">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold text-card-foreground">
                    Application Deadline
                  </h3>
                  <p className="text-muted-foreground">
                    {new Date(job.deadline).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Company Info */}
          {job.companies && (
            <motion.div variants={fadeUp} custom={4} className="mt-12 bg-card rounded-lg p-8 border border-border">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {job.companies.logo_url && (
                  <div className="w-20 h-20 rounded-lg border border-border overflow-hidden bg-white flex-shrink-0">
                    <img 
                      src={job.companies.logo_url} 
                      alt={job.companies.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="font-heading text-2xl font-semibold text-card-foreground mb-4">
                    About {job.companies.name}
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {job.companies.description}
                  </p>
                  {job.companies.website && (
                    <Link 
                      href={job.companies.website} 
                      target="_blank" 
                      className="text-primary hover:underline inline-flex items-center gap-2 font-medium"
                    >
                      Visit Website <ExternalLink className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}
