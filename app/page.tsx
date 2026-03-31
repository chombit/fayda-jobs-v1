'use client';

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowRight, Briefcase, Building2, TrendingUp, Users, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import JobCard from "@/components/JobCard";
import AdPlaceholder from "@/components/AdPlaceholder";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchJobs, fetchCategories } from "@/lib/supabase-helpers";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "ngo-jobs": <Users className="h-6 w-6" />,
  "government-jobs": <Building2 className="h-6 w-6" />,
  "bank-jobs": <TrendingUp className="h-6 w-6" />,
  "it-jobs": <Briefcase className="h-6 w-6" />,
  "remote-jobs": <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  "internship": <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  "fresh-graduate-jobs": <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>,
  "engineering-jobs": <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  "health-jobs": <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
};

const CATEGORY_COLORS: Record<string, { bg: string, hover: string, text: string, icon: string, glow: string }> = {
  "ngo-jobs": { 
    bg: "from-emerald-500/20 to-teal-500/20", 
    hover: "hover:from-emerald-500/30 hover:to-teal-500/30", 
    text: "text-emerald-700 dark:text-emerald-400",
    icon: "text-emerald-600 dark:text-emerald-400",
    glow: "group-hover:shadow-emerald-500/25"
  },
  "government-jobs": { 
    bg: "from-blue-500/20 to-indigo-500/20", 
    hover: "hover:from-blue-500/30 hover:to-indigo-500/30", 
    text: "text-blue-700 dark:text-blue-400",
    icon: "text-blue-600 dark:text-blue-400",
    glow: "group-hover:shadow-blue-500/25"
  },
  "bank-jobs": { 
    bg: "from-purple-500/20 to-pink-500/20", 
    hover: "hover:from-purple-500/30 hover:to-pink-500/30", 
    text: "text-purple-700 dark:text-purple-400",
    icon: "text-purple-600 dark:text-purple-400",
    glow: "group-hover:shadow-purple-500/25"
  },
  "it-jobs": { 
    bg: "from-orange-500/20 to-red-500/20", 
    hover: "hover:from-orange-500/30 hover:to-red-500/30", 
    text: "text-orange-700 dark:text-orange-400",
    icon: "text-orange-600 dark:text-orange-400",
    glow: "group-hover:shadow-orange-500/25"
  },
  "remote-jobs": { 
    bg: "from-cyan-500/20 to-blue-500/20", 
    hover: "hover:from-cyan-500/30 hover:to-blue-500/30", 
    text: "text-cyan-700 dark:text-cyan-400",
    icon: "text-cyan-600 dark:text-cyan-400",
    glow: "group-hover:shadow-cyan-500/25"
  },
  "internship": { 
    bg: "from-green-500/20 to-emerald-500/20", 
    hover: "hover:from-green-500/30 hover:to-emerald-500/30", 
    text: "text-green-700 dark:text-green-400",
    icon: "text-green-600 dark:text-green-400",
    glow: "group-hover:shadow-green-500/25"
  },
  "fresh-graduate-jobs": { 
    bg: "from-yellow-500/20 to-orange-500/20", 
    hover: "hover:from-yellow-500/30 hover:to-orange-500/30", 
    text: "text-yellow-700 dark:text-yellow-400",
    icon: "text-yellow-600 dark:text-yellow-400",
    glow: "group-hover:shadow-yellow-500/25"
  },
  "engineering-jobs": { 
    bg: "from-red-500/20 to-pink-500/20", 
    hover: "hover:from-red-500/30 hover:to-pink-500/30", 
    text: "text-red-700 dark:text-red-400",
    icon: "text-red-600 dark:text-red-400",
    glow: "group-hover:shadow-red-500/25"
  },
  "health-jobs": { 
    bg: "from-rose-500/20 to-pink-500/20", 
    hover: "hover:from-rose-500/30 hover:to-pink-500/30", 
    text: "text-rose-700 dark:text-rose-400",
    icon: "text-rose-600 dark:text-rose-400",
    glow: "group-hover:shadow-rose-500/25"
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  })
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } }
};

export default function HomePage() {
  const { data: latestJobs } = useQuery({
    queryKey: ["jobs", "latest"],
    queryFn: async () => {
      const { data } = await fetchJobs({ limit: 6 });
      return data || [];
    }
  });

  const { data: featuredJobs } = useQuery({
    queryKey: ["jobs", "featured"],
    queryFn: async () => {
      const { data } = await fetchJobs({ featured: true, limit: 4 });
      return data || [];
    }
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await fetchCategories();
      return data || [];
    }
  });

  const { data: jobsByCategory } = useQuery({
    queryKey: ["jobs", "by-category"],
    queryFn: async () => {
      const { data } = await fetchJobs({ limit: 100 });
      return data || [];
    }
  });

  // Calculate job counts for each category
  const getJobCountForCategory = (categoryId: string) => {
    if (!jobsByCategory) return 0;
    return jobsByCategory.filter(job => job.category_id === categoryId).length;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section */}
      <HeroSection />

      {/* Categories */}
      <section className="container py-16 md:py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-secondary/10 to-primary/10 blur-3xl" />
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp} custom={0}>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary">Popular Categories</span>
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-75" />
            </div>
            <h2 className="font-heading text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-4 leading-tight">
              Browse by Category
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Discover thousands of jobs tailored to your expertise and career aspirations across Ethiopia
            </p>
          </motion.div>
          <motion.div variants={fadeUp} custom={1}>
            <Link href="/categories">
              <Button variant="outline" className="flex gap-2 text-primary hover:text-primary hover:bg-primary hover:text-white group px-8 py-3 rounded-full text-base font-semibold border-2 border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-lg hover:shadow-primary/25 hover:scale-105">
                <span>View All Categories</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
        >
          {categories?.slice(0, 8).map((cat, i) => {
            const colors = CATEGORY_COLORS[cat.slug] || { 
              bg: "from-primary/20 to-primary/10", 
              hover: "hover:from-primary/30 hover:to-primary/20", 
              text: "text-primary", 
              icon: "text-primary",
              glow: "group-hover:shadow-primary/25"
            };
            const jobCount = getJobCountForCategory(cat.id);
            return (
              <motion.div key={cat.id} variants={fadeUp} custom={i}>
                <Link
                  href={`/jobs?category=${cat.id}`}
                  className={`group block relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br ${colors.bg} ${colors.hover} p-6 transition-all duration-700 hover:shadow-2xl hover:shadow-xl ${colors.glow} hover:-translate-y-2 hover:border-primary/40 hover:bg-white/80 dark:hover:bg-black/80 backdrop-blur-sm`}
                >
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-2xl animate-pulse delay-75" />
                  </div>
                  
                  {/* Animated top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  
                  {/* Floating particles */}
                  <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-4 right-4 w-2 h-2 bg-primary/30 rounded-full animate-ping" />
                    <div className="absolute bottom-6 left-6 w-1 h-1 bg-secondary/30 rounded-full animate-ping delay-150" />
                    <div className="absolute top-12 left-8 w-1.5 h-1.5 bg-primary/20 rounded-full animate-ping delay-300" />
                  </div>
                  
                  <div className="relative z-10">
                    {/* Enhanced icon container */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.bg} ${colors.hover} mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-primary/20 backdrop-blur-sm border border-white/20 dark:border-black/20`}>
                      <div className={`${colors.icon} transition-all duration-500 group-hover:scale-110`}>
                        {CATEGORY_ICONS[cat.slug] || <Briefcase className="h-8 w-8" />}
                      </div>
                    </div>
                    
                    {/* Enhanced title */}
                    <h3 className={`font-heading font-bold text-xl mb-2 ${colors.text} group-hover:text-primary transition-all duration-500 group-hover:scale-105`}>
                      {cat.name}
                    </h3>
                    
                    {/* Enhanced description */}
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed group-hover:text-foreground/90 transition-colors duration-500">
                      Browse {cat.name.toLowerCase()} opportunities
                    </p>
                    
                    {/* Enhanced footer with job count */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${colors.icon} animate-pulse`} />
                        <span className={`text-sm font-semibold ${colors.text} group-hover:text-primary transition-colors duration-500`}>
                          {jobCount} {jobCount === 1 ? 'job' : 'jobs'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-2">
                        <span className="text-sm font-bold">Explore</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                    
                    {/* Hover overlay effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Ad: After Categories */}
      <div className="container py-4">
        <AdPlaceholder slot="home-after-categories" format="horizontal" />
      </div>

      {/* Telegram Channel Section */}
      <section className="container py-16 md:py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-3xl" />
        
        <div className="relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.div variants={fadeUp} custom={0}>
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 mb-6">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-blue-600 dark:text-blue-400">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Join Our Community</span>
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              </div>
              <h2 className="font-heading text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent mb-4 leading-tight">
                Join Fayda Jobs Telegram Channel
              </h2>
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Get instant job updates, career tips, and exclusive opportunities directly on your phone. Join thousands of professionals already benefiting from our daily job alerts!
              </p>
            </motion.div>
            <motion.div variants={fadeUp} custom={1}>
              <a 
                href="https://t.me/faydajobs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-12 py-5 text-white font-bold text-lg shadow-xl shadow-blue-600/40 hover:shadow-blue-600/60 hover:shadow-2xl hover:scale-[1.05] active:scale-[0.98] transition-all duration-300 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                <span className="relative z-10">Join @faydajobs on Telegram</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 group-hover:rotate-6 transition-all duration-300" />
              </a>
            </motion.div>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          >
            <motion.div variants={fadeUp} custom={2} className="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-blue-600 dark:text-blue-400">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">Daily Job Updates</h3>
              <p className="text-muted-foreground">Get instant notifications about new job opportunities matching your profile</p>
            </motion.div>

            <motion.div variants={fadeUp} custom={3} className="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-blue-600 dark:text-blue-400">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">Exclusive Opportunities</h3>
              <p className="text-muted-foreground">Access jobs and career tips not available anywhere else</p>
            </motion.div>

            <motion.div variants={fadeUp} custom={4} className="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-blue-600 dark:text-blue-400">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">Professional Network</h3>
              <p className="text-muted-foreground">Connect with thousands of job seekers and employers in Ethiopia</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="container py-16 md:py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="text-center mb-12"
        >
          <motion.div variants={fadeUp} custom={0}>
            <h2 className="font-heading text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
              Featured Jobs
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Handpicked opportunities from top employers across Ethiopia
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {featuredJobs?.map((job, i) => (
            <motion.div key={job.id} variants={fadeUp} custom={i}>
              <JobCard job={job} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Latest Jobs */}
      <section className="container py-16 md:py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="text-center mb-12"
        >
          <motion.div variants={fadeUp} custom={0}>
            <h2 className="font-heading text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
              Latest Opportunities
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Fresh job postings updated daily
            </p>
          </motion.div>
          <motion.div variants={fadeUp} custom={1}>
            <Link href="/jobs">
              <Button className="gap-2">
                View All Jobs
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {latestJobs?.map((job, i) => (
            <motion.div key={job.id} variants={fadeUp} custom={i}>
              <JobCard job={job} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container py-16 md:py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="text-center"
        >
          <motion.div variants={fadeUp} custom={0}>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Ready to Find Your Dream Job?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who found their perfect career opportunity through Fayda Jobs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/jobs">
                <Button size="lg" className="gap-2">
                  <Briefcase className="h-5 w-5" />
                  Browse Jobs
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="gap-2">
                  <Sparkles className="h-5 w-5" />
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>
      
      <Footer />
    </div>
  );
}
