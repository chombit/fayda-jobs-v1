'use client';

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Search, Filter, ArrowUpDown, RefreshCw, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import JobCard from "@/components/JobCard";
import { JobCardSkeletonGrid } from "../../components/JobCardSkeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchJobs, fetchCategories } from "@/lib/supabase-helpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [urlParamsLoaded, setUrlParamsLoaded] = useState(false);

  // Read URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('search');
    const location = urlParams.get('location');
    
    console.log('URL params loaded:', { search, location, url: window.location.search });
    
    if (search) {
      console.log('Setting search query:', search);
      setSearchQuery(search);
    }
    if (location) {
      console.log('Setting location:', location);
      setSelectedLocation(location);
    }
    
    // Mark URL params as loaded
    setUrlParamsLoaded(true);
  }, []);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await fetchCategories();
      if (error) throw error;
      return data || [];
    }
  });

  const { data: jobs, isLoading, error, refetch } = useQuery({
    queryKey: ["jobs", { search: searchQuery, category: selectedCategory, location: selectedLocation, type: selectedType }],
    queryFn: async () => {
      console.log('Query executing with:', { searchQuery, selectedCategory, selectedLocation, selectedType });
      const { data, error } = await fetchJobs({ 
        search: searchQuery, 
        category: selectedCategory, 
        location: selectedLocation,
        jobType: selectedType 
      });
      
      console.log('Query result:', { data: data?.length, error });
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 30000,
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: urlParamsLoaded, // Only run after URL params are loaded
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container py-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-col lg:flex-row items-start lg:items-center gap-6"
          >
            <motion.div variants={fadeUp} custom={0} className="flex-1">
              <h1 className="font-heading text-3xl font-bold text-card-foreground mb-2">
                Browse Jobs
              </h1>
              <p className="text-muted-foreground">
                Find your perfect career opportunity from our curated job listings
              </p>
            </motion.div>
            <motion.div variants={fadeUp} custom={1}>
              <Link href="/">
                <Button variant="outline" className="gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-muted/30 border-b">
        <div className="container py-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-col lg:flex-row gap-4"
          >
            <motion.div variants={fadeUp} custom={0} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </motion.div>
            <motion.div variants={fadeUp} custom={1} className="w-full lg:w-48">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
            <motion.div variants={fadeUp} custom={2} className="flex-1">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Location (e.g. Addis Ababa)"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
            </motion.div>
            <motion.div variants={fadeUp} custom={3} className="w-full lg:w-40">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
            <motion.div variants={fadeUp} custom={4}>
              <Button 
                onClick={() => refetch()} 
                disabled={isLoading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Results */}
      <div className="container py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="space-y-6"
        >
          {/* Results count */}
          <motion.div variants={fadeUp} custom={0} className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-xl font-semibold text-card-foreground">
                Available Jobs
              </h2>
              <p className="text-muted-foreground">
                {jobs?.length || 0} positions found
              </p>
            </div>
            {(searchQuery || selectedCategory || selectedLocation || selectedType) && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedLocation("");
                  setSelectedType("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </motion.div>

          {/* Job listings */}
          {isLoading ? (
            <motion.div variants={fadeUp} custom={1}>
              <JobCardSkeletonGrid count={6} />
            </motion.div>
          ) : error ? (
            <motion.div variants={fadeUp} custom={1} className="text-center py-12">
              <p className="text-destructive">Error loading jobs. Please try again.</p>
            </motion.div>
          ) : jobs?.length === 0 ? (
            <motion.div variants={fadeUp} custom={1} className="text-center py-12">
              <p className="text-muted-foreground">No jobs found matching your criteria.</p>
            </motion.div>
          ) : (
            <motion.div
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {jobs?.map((job, i) => (
                <motion.div key={job.id} variants={fadeUp} custom={i + 1}>
                  <JobCard job={job} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}
