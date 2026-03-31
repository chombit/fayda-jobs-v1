'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Plus,
  Edit,
  Trash2,
  Briefcase,
  Building2,
  TrendingUp,
  Users,
  LogIn,
  LogOut,
  Loader2,
  Bold,
  Italic,
  List,
  Heading1,
  Heading2,
  Heading3,
  ListOrdered,
} from "lucide-react";
import { useRef } from "react";
import RichTextEditor from "@/components/RichTextEditor";
import {
  fetchJobs,
  fetchCategories,
  fetchCompanies,
  createJob,
  updateJob,
  deleteJob,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchSubscribers,
  createCompany,
  updateCompany,
  deleteCompany,
  fetchBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "@/lib/supabase-helpers";
import type { Job, Category, Company } from "@/lib/supabase-helpers";
import type { BlogPost } from "@/lib/supabase-helpers";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

// ── Animation variants ──────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

// ── Auth section ────────────────────────────────────────────────────────────

function AdminLogin({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("🔐 Attempting admin login for:", email);
    
    try {
      // Test supabase connection first
      console.log('🔍 Testing Supabase connection...');
      const { data: testData, error: testError } = await supabase.from('companies').select('id').limit(1);
      
      if (testError && !testError.message.includes('does not exist')) {
        console.error('❌ Supabase connection test failed:', testError);
        toast.error('Database connection error. Please check your configuration.');
        setLoading(false);
        return;
      }
      
      console.log('✅ Supabase connection OK, attempting login...');
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      setLoading(false);
      
      if (error) {
        console.error("❌ Login failed:", {
          message: error.message,
          status: error.status,
          name: error.name
        });
        
        // Provide more specific error messages
        let errorMessage = error.message;
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please confirm your email address first.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Too many login attempts. Please try again later.';
        }
        
        toast.error(`Login failed: ${errorMessage}`);
      } else {
        console.log("✅ Login successful! Session user:", data.user?.email);
        toast.success(`Welcome back, ${data.user?.email}!`);
        onLoggedIn();
      }
    } catch (err: any) {
      setLoading(false);
      console.error("❌ Unexpected login error:", err);
      toast.error("An unexpected error occurred during login. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto h-16 w-16 bg-white rounded-2xl p-2 shadow-sm border flex items-center justify-center">
            <Image 
              src="/faydajobs-logo.png" 
              alt="Fayda Jobs Logo" 
              width={80} 
              height={80} 
              className="object-contain"
            />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">Admin Dashboard</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Please sign in to manage your job portal</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="admin@faydajobs.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Main admin page ─────────────────────────────────────────────────────────

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // null = loading
  const [authLoading, setAuthLoading] = useState(true);
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isBlogDialogOpen, setIsBlogDialogOpen] = useState(false);
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);

  // ── Auth check ──────────────────────────────────────────────────────────

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setAuthLoading(true);
        console.log('🔍 Checking authentication...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('📊 Session data:', session?.user?.email ? `User: ${session.user.email}` : 'No session');
        
        if (session?.user) {
          setUser(session.user);
          
          // Check admin role with error handling
          try {
            const { data, error } = await supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", session.user.id)
              .eq("role", "admin")
              .maybeSingle();
            
            if (error) {
              console.warn('⚠️ Admin role check failed (table may not exist):', error.message);
              // For now, allow any authenticated user to access admin
              setIsAdmin(true);
            } else {
              console.log('👤 Admin role check result:', data ? 'Admin' : 'Not admin');
              setIsAdmin(!!data);
            }
          } catch (roleError) {
            console.warn('⚠️ Error checking admin role:', roleError);
            // Allow access if role check fails
            setIsAdmin(true);
          }
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('❌ Auth check error:', error);
        setUser(null);
        setIsAdmin(false);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        try {
          setAuthLoading(true);
          console.log('🔄 Auth state changed:', _event, session?.user?.email);
          
          if (session?.user) {
            setUser(session.user);
            
            // Check admin role with error handling
            try {
              const { data, error } = await supabase
                .from("user_roles")
                .select("role")
                .eq("user_id", session.user.id)
                .eq("role", "admin")
                .maybeSingle();
              
              if (error) {
                console.warn('⚠️ Admin role check failed (table may not exist):', error.message);
                setIsAdmin(true);
              } else {
                console.log('👤 Admin role check result:', data ? 'Admin' : 'Not admin');
                setIsAdmin(!!data);
              }
            } catch (roleError) {
              console.warn('⚠️ Error checking admin role:', roleError);
              setIsAdmin(true);
            }
          } else {
            setUser(null);
            setIsAdmin(false);
          }
        } catch (error) {
          console.error('❌ Auth state change error:', error);
          setUser(null);
          setIsAdmin(false);
        } finally {
          setAuthLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  // ── Show loading if checking auth ─────────────────────────────────────

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div className="text-center space-y-2">
                <h3 className="font-semibold">Checking Authentication...</h3>
                <p className="text-muted-foreground text-sm">Please wait while we verify your access</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Show login if not authenticated ─────────────────────────────────────

  if (!user) {
    return <AdminLogin onLoggedIn={() => {}} />;
  }

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              You don&apos;t have admin privileges. Contact the site administrator.
            </p>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Authenticated admin dashboard ───────────────────────────────────────

  return <AdminDashboard onLogout={handleLogout} user={user} />;
}

// ── Dashboard component ─────────────────────────────────────────────────────

function AdminDashboard({
  onLogout,
  user,
}: {
  onLogout: () => void;
  user: User;
}) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isBlogDialogOpen, setIsBlogDialogOpen] = useState(false);
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);

  // State for rich text fields
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [responsibilities, setResponsibilities] = useState("");

  // Update payload indicator in real-time
  const payloadIndicatorTimer = useRef<number | null>(null);
  useEffect(() => {
    const updatePayloadIndicator = () => {
      const indicator = document.getElementById('payload-indicator');
      if (indicator) {
        // Use raw text for measuring
        const cleanDesc = description || "";
        const cleanReq = requirements || "";
        const cleanRes = responsibilities || "";
        
        const totalPayloadBytes = new Blob([JSON.stringify({
          description: cleanDesc,
          requirements: cleanReq,
          responsibilities: cleanRes
        })]).size;

        const maxSize = 200 * 1024; // 200KB limit (matches helper)
        const sizeKB = (totalPayloadBytes / 1024).toFixed(2);
        const maxKB = (maxSize / 1024).toFixed(2);
        const percentage = Math.min((totalPayloadBytes / maxSize) * 100, 100);
        
        if (percentage > 90) {
          indicator.className = 'text-sm text-red-600 font-bold';
          indicator.textContent = `🚨 Critical Size: ${sizeKB} / ${maxKB} KB`;
        } else if (percentage > 70) {
          indicator.className = 'text-sm text-orange-600 font-medium';
          indicator.textContent = `⚠️ Large: ${sizeKB} KB (cleaning applied)`;
        } else {
          indicator.className = 'text-sm text-muted-foreground';
          indicator.textContent = `Size: ${sizeKB} KB`;
        }
      }
    };

    if (payloadIndicatorTimer.current) {
      window.clearTimeout(payloadIndicatorTimer.current);
    }

    payloadIndicatorTimer.current = window.setTimeout(() => {
      updatePayloadIndicator();
    }, 250);

    return () => {
      if (payloadIndicatorTimer.current) {
        window.clearTimeout(payloadIndicatorTimer.current);
      }
    };
  }, [description, requirements, responsibilities]);

  // Populate rich text states when editing
  useEffect(() => {
    if (editingJob && isJobDialogOpen) {
      setDescription(editingJob.description || "");
      setRequirements(editingJob.requirements || "");
      setResponsibilities(editingJob.responsibilities || "");
    } else if (!editingJob && isJobDialogOpen) {
      // Clear states for new job
      setDescription("");
      setRequirements("");
      setResponsibilities("");
    }
  }, [editingJob, isJobDialogOpen]);

  // ── Queries ─────────────────────────────────────────────────────────────

  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: async () => {
      const { data } = await fetchJobs();
      return data as Job[];
    },
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await fetchCategories();
      return (data ?? []) as Category[];
    },
  });

  const { data: companies } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data } = await fetchCompanies();
      return (data ?? []) as Company[];
    },
  });

  const { data: subscribers, isLoading: subscribersLoading } = useQuery({
    queryKey: ["admin-subscribers"],
    queryFn: async () => {
      const { data } = await fetchSubscribers();
      return (data ?? []) as any[];
    },
  });

  const { data: blogPosts, isLoading: blogPostsLoading } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const data = await fetchBlogPosts();
      return (data ?? []) as BlogPost[];
    },
  });

  // ── Mutations ───────────────────────────────────────────────────────────

  const createJobMutation = useMutation({
    mutationFn: (job: any) => {
      console.log("Attempting to create job with payload:", job);
      return createJob(job);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Job created successfully!");
      setIsJobDialogOpen(false);
      // Clear form states
      setDescription("");
      setRequirements("");
      setResponsibilities("");
    },
    onError: (error: any) => {
      console.error("Detailed error creating job. Message:", error.message, "Details:", error.details, "Code:", error.code, "Hint:", error.hint);
      if (typeof error?.message === "string" && error.message.toLowerCase().includes("timed out")) {
        // If the request completed just after our client timeout, refresh the list.
        queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
      }
      toast.error(error.message || "Failed to create job");
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: ({ id, ...updates }: { id: string } & any) => {
      console.log("Attempting to update job:", id, updates);
      return updateJob(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Job updated successfully!");
      setIsJobDialogOpen(false);
      setEditingJob(null);
    },
    onError: (error: any) => {
      console.error("Detailed error updating job. Message:", error.message, "Details:", error.details, "Code:", error.code, "Hint:", error.hint);
      if (typeof error?.message === "string" && error.message.toLowerCase().includes("timed out")) {
        queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
      }
      toast.error(error.message || "Failed to update job");
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Job deleted successfully!");
    },
    onError: (error: any) => {
      console.error("Failed to delete job:", error);
      toast.error(error.message || "Failed to delete job");
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully!");
      setIsCategoryDialogOpen(false);
    },
    onError: (error: any) => {
      console.error("Failed to create category:", error);
      toast.error(error.message || "Failed to create category");
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({
      id,
      ...data
    }: {
      id: string;
      name?: string;
      slug?: string;
    }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated successfully!");
      setIsCategoryDialogOpen(false);
      setEditingCategory(null);
    },
    onError: (error: any) => {
      console.error("Failed to update category:", error);
      toast.error(error.message || "Failed to update category");
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully!");
    },
    onError: (error: any) => {
      console.error("Failed to delete category:", error);
      toast.error(error.message || "Failed to delete category");
    },
  });

  const createCompanyMutation = useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Company created successfully!");
      setIsCompanyDialogOpen(false);
    },
    onError: (error: any) => {
      console.error("Failed to create company:", error);
      toast.error(error.message || "Failed to create company");
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: ({ id, ...updates }: { id: string } & TablesUpdate<"companies">) =>
      updateCompany(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Company updated successfully!");
      setIsCompanyDialogOpen(false);
    },
    onError: (error: any) => {
      console.error("Failed to update company:", error);
      toast.error(error.message || "Failed to update company");
    },
  });

  const deleteCompanyMutation = useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Company deleted successfully!");
    },
    onError: (error: any) => {
      console.error("Detailed error deleting company. Message:", error.message, "Details:", error.details, "Code:", error.code, "Hint:", error.hint);
      toast.error(error.message || "Failed to delete company");
    },
  });

  const createBlogPostMutation = useMutation({
    mutationFn: createBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast.success("Blog post created successfully!");
      setIsBlogDialogOpen(false);
    },
    onError: (error: any) => {
      console.error("Failed to create blog post:", error);
      toast.error(error.message || "Failed to create blog post");
    },
  });

  const updateBlogPostMutation = useMutation({
    mutationFn: ({ id, ...updates }: { id: string } & any) => {
      return updateBlogPost(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast.success("Blog post updated successfully!");
      setIsBlogDialogOpen(false);
      setEditingBlogPost(null);
    },
    onError: (error: any) => {
      console.error("Failed to update blog post:", error);
      toast.error(error.message || "Failed to update blog post");
    },
  });

  const deleteBlogPostMutation = useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast.success("Blog post deleted successfully!");
    },
    onError: (error: any) => {
      console.error("Failed to delete blog post:", error);
      toast.error(error.message || "Failed to delete blog post");
    },
  });

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Form submission started');
    const startTime = performance.now();
    
    const formData = new FormData(e.target as HTMLFormElement);
    const companyIdRaw = formData.get("company_id") as string;
    
    // Get and process form data with timing
    const processStart = performance.now();
    
    // Try direct form data first to bypass rich text state issues
    const rawDesc = (formData.get("description") as string) || description;
    const rawReq = (formData.get("requirements") as string) || requirements;
    const rawRes = (formData.get("responsibilities") as string) || responsibilities;
    
    // Use raw text directly without HTML cleaning
    const descriptionClean = rawDesc.trim();
    const requirementsClean = rawReq.trim();
    const responsibilitiesClean = rawRes.trim();
    
    console.log('🔍 Content Processing (Raw vs Processed):', {
      desc: { processed: descriptionClean.length, raw: rawDesc.length },
      req: { processed: requirementsClean.length, raw: rawReq.length }
    });
    
    const jobData = {
      title: formData.get("title") as string,
      company_id: (companyIdRaw && companyIdRaw !== "") ? companyIdRaw : null,
      location: (formData.get("location") as string || "Addis Ababa").trim(),
      job_type: (formData.get("type") as string || "Full-time").trim(),
      category_id: (formData.get("category_id") as string && formData.get("category_id") !== "") ? formData.get("category_id") as string : null,
      description: descriptionClean.trim(),
      requirements: requirementsClean.trim(),
      responsibilities: responsibilitiesClean.trim(),
      application_link: (formData.get("application_link") as string || "").trim(),
      deadline: (formData.get("deadline") as string) || null,
      featured: formData.get("featured") === "on",
    };
    const processTime = performance.now() - processStart;
    console.log(`⚡ Form processing took ${processTime.toFixed(2)}ms`);

    // Payload size validation (Relaxed for rich text)
    const MAX_TEXT_LENGTH = 50000; // Increased to 50k
    const MAX_PAYLOAD_SIZE = 200 * 1024; // 200KB (must match helper)
    const validationErrors = [];
    
    // Check individual field lengths
    if (jobData.description.length > MAX_TEXT_LENGTH) {
      validationErrors.push(`Description too long (${jobData.description.length} chars). Maximum: ${MAX_TEXT_LENGTH}`);
    }
    if (jobData.requirements?.length > MAX_TEXT_LENGTH) {
      validationErrors.push(`Requirements too long (${jobData.requirements.length} chars). Maximum: ${MAX_TEXT_LENGTH}`);
    }
    if (jobData.responsibilities?.length > MAX_TEXT_LENGTH) {
      validationErrors.push(`Responsibilities too long (${jobData.responsibilities.length} chars). Maximum: ${MAX_TEXT_LENGTH}`);
    }
    
    // Calculate total payload size (bytes, not string length)
    const totalPayloadBytes = new Blob([JSON.stringify(jobData)]).size;
    console.log(`📦 Total payload size: ${totalPayloadBytes} bytes (${(totalPayloadBytes/1024).toFixed(2)} KB)`);
    
    if (totalPayloadBytes > MAX_PAYLOAD_SIZE) {
      validationErrors.push(`Total content too large (${(totalPayloadBytes/1024).toFixed(2)} KB). Maximum: ${(MAX_PAYLOAD_SIZE/1024).toFixed(2)} KB`);
    }

    // Show validation errors if any
    if (validationErrors.length > 0) {
      toast.error(validationErrors.join('. '));
      console.error('Validation errors:', validationErrors);
      return;
    }

    console.log('📊 Processed job data (Rich Text):', {
      title: jobData.title,
      descLength: jobData.description.length,
      reqLength: jobData.requirements?.length,
      resLength: jobData.responsibilities.length,
      payloadSizeKB: (totalPayloadBytes/1024).toFixed(2),
      totalTime: (performance.now() - startTime).toFixed(2)
    });

    try {
      console.log('🎯 Starting mutation...');
      const mutationStart = performance.now();
      
      if (editingJob) {
        updateJobMutation.mutate({ id: editingJob.id, ...jobData });
      } else {
        createJobMutation.mutate(jobData);
      }
      
      const mutationTime = performance.now() - mutationStart;
      console.log(`⚡ Mutation call took ${mutationTime.toFixed(2)}ms`);
      
    } catch (err: any) {
      console.error('Unexpected error in handleJobSubmit:', err);
      toast.error('An unexpected error occurred. Please check the console.');
    }
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const categoryData = {
      name: formData.get("name") as string,
      icon: formData.get("icon") as string,
      description: formData.get("description") as string,
    };

    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, ...categoryData });
    } else {
      createCategoryMutation.mutate(categoryData);
    }
  };

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const companyData = {
      name: formData.get("name") as string,
      logo_url: formData.get("logo_url") as string,
      website: formData.get("website") as string,
      description: formData.get("description") as string,
      location: formData.get("location") as string,
    };

    if (editingCompany) {
      updateCompanyMutation.mutate({ id: editingCompany.id, ...companyData });
    } else {
      createCompanyMutation.mutate(companyData);
    }
  };

  const handleBlogPostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const blogData = {
      title: formData.get("title") as string,
      excerpt: formData.get("excerpt") as string,
      content: formData.get("content") as string,
      category: formData.get("category") as string,
      read_time: formData.get("read_time") as string,
      published: formData.get("published") === "true",
    };

    if (editingBlogPost) {
      updateBlogPostMutation.mutate({ id: editingBlogPost.id, ...blogData });
    } else {
      createBlogPostMutation.mutate(blogData);
    }
  };

  const handleDeleteJob = (id: string) => {
    if (confirm("Are you sure you want to delete this job?")) {
      deleteJobMutation.mutate(id);
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategoryMutation.mutate(id);
    }
  };

  const handleDeleteBlogPost = (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      deleteBlogPostMutation.mutate(id);
    }
  };

  // ── Computed stats ──────────────────────────────────────────────────────

  const stats = {
    totalJobs: jobs?.length || 0,
    totalCategories: categories?.length || 0,
    totalSubscribers: subscribers?.length || 0,
    featuredJobs: jobs?.filter((job) => job.featured).length || 0,
    recentJobs:
      jobs?.filter((job) => {
        const createdAt = new Date(job.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdAt > weekAgo;
      }).length || 0,
  };

  /** Count jobs per category */
  const jobCountByCategory = (categoryId: string) =>
    jobs?.filter((j) => j.category_id === categoryId).length ?? 0;

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="container py-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={fadeUp} custom={0}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold text-card-foreground mb-2">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Signed in as {user.email}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
              >
                Back to Site
              </Button>
              <Button variant="ghost" onClick={onLogout} className="gap-2">
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={fadeUp} custom={1}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Jobs
                </CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalJobs}</div>
                <p className="text-xs text-muted-foreground">
                  Active job listings
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Categories
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalCategories}
                </div>
                <p className="text-xs text-muted-foreground">Job categories</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Subscribers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalSubscribers}
                </div>
                <p className="text-xs text-muted-foreground">Newsletter subs</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Featured</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.featuredJobs}</div>
                <p className="text-xs text-muted-foreground">Featured jobs</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  New This Week
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.recentJobs}</div>
                <p className="text-xs text-muted-foreground">Recently added</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div variants={fadeUp} custom={2}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="companies">Companies</TabsTrigger>
              <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
              <TabsTrigger value="blog">Blog Posts</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Recent job postings and platform activity will appear here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Jobs Tab ──────────────────────────────────────────── */}
            <TabsContent value="jobs" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Job Management</h2>
                <Dialog
                  open={isJobDialogOpen}
                  onOpenChange={setIsJobDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button 
                      type="button"
                      onClick={() => {
                        setEditingJob(null);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Job
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingJob ? "Edit Job" : "Add New Job"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingJob ? "Modify the details of the existing job posting." : "Fill in the details to post a new job."}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleJobSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          name="title"
                          placeholder="Job Title"
                          defaultValue={editingJob?.title}
                          required
                        />
                        <select
                          name="company_id"
                          className="w-full p-2 border rounded"
                          defaultValue={editingJob?.company_id ?? ""}
                        >
                          <option value="">Select Company</option>
                          {companies?.map((comp) => (
                            <option key={comp.id} value={comp.id}>
                              {comp.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          name="location"
                          placeholder="Location"
                          defaultValue={editingJob?.location}
                          required
                        />
                        <Input
                          name="type"
                          placeholder="Job Type (e.g. Full-time)"
                          defaultValue={editingJob?.job_type}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <select
                          name="category_id"
                          className="w-full p-2 border rounded"
                          defaultValue={editingJob?.category_id ?? ""}
                          required
                        >
                          <option value="">Select Category</option>
                          {categories?.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Description</label>
                        <RichTextEditor 
                          value={description} 
                          onChange={setDescription} 
                          placeholder="Detailed job description..." 
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Requirements</label>
                        <RichTextEditor 
                          value={requirements} 
                          onChange={setRequirements} 
                          placeholder="Job requirements and qualifications..." 
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Responsibilities</label>
                        <RichTextEditor 
                          value={responsibilities} 
                          onChange={setResponsibilities} 
                          placeholder="Key responsibilities and daily tasks..." 
                        />
                      </div>

                      <div className="space-y-4 mt-6 pt-6 border-t">
                        <div className="space-y-1">
                          <label className="text-sm font-medium">Application Link (URL)</label>
                          <Input
                            name="application_link"
                            placeholder="https://company.com/apply"
                            defaultValue={editingJob?.application_link ?? ""}
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-sm font-medium">Application Deadline</label>
                          <Input
                            name="deadline"
                            type="date"
                            placeholder="Deadline"
                            defaultValue={editingJob?.deadline ?? ""}
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="featured"
                          defaultChecked={editingJob?.featured}
                        />
                        <label>Featured Job</label>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          <span id="payload-indicator">Calculating size...</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsJobDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={
                              createJobMutation.isPending ||
                              updateJobMutation.isPending
                            }
                            className="min-w-[120px]"
                          >
                            {(createJobMutation.isPending || updateJobMutation.isPending) ? (
                              <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
                                {editingJob ? "Updating..." : "Creating..."}
                              </>
                            ) : (
                              <>
                                {editingJob ? "Update" : "Create"} Job
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Featured</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobsLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                          </TableCell>
                        </TableRow>
                      ) : jobs?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            No jobs found
                          </TableCell>
                        </TableRow>
                      ) : (
                        jobs?.map((job) => (
                          <TableRow key={job.id}>
                            <TableCell className="font-medium">
                              {job.title}
                            </TableCell>
                            <TableCell>
                              {job.companies?.name ?? "—"}
                            </TableCell>
                            <TableCell>{job.location}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{job.job_type}</Badge>
                            </TableCell>
                            <TableCell>
                              {job.featured && <Badge>Featured</Badge>}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    console.log("Edit Job clicked", job.id);
                                    setEditingJob(job);
                                    setIsJobDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    console.log("Delete Job clicked", job.id);
                                    handleDeleteJob(job.id);
                                  }}
                                  disabled={deleteJobMutation.isPending}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Categories Tab ────────────────────────────────────── */}
            <TabsContent value="categories" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Category Management</h2>
                <Dialog
                  open={isCategoryDialogOpen}
                  onOpenChange={setIsCategoryDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button 
                      type="button"
                      onClick={() => setEditingCategory(null)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingCategory
                          ? "Edit Category"
                          : "Add New Category"}
                      </DialogTitle>
                      <DialogDescription>
                        Create or update job categories to organize your listings.
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={handleCategorySubmit}
                      className="space-y-4"
                    >
                      <Input
                        name="name"
                        placeholder="Category Name"
                        defaultValue={editingCategory?.name}
                        required
                      />
                      <Input
                        name="icon"
                        placeholder="Icon Name (Lucide icon, e.g. Heart, Code)"
                        defaultValue={editingCategory?.icon ?? ""}
                      />
                      <textarea
                        name="description"
                        placeholder="Category Description"
                        className="w-full p-2 border rounded h-24"
                        defaultValue={editingCategory?.description ?? ""}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsCategoryDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={
                            createCategoryMutation.isPending ||
                            updateCategoryMutation.isPending
                          }
                        >
                          {editingCategory ? "Update" : "Create"} Category
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Jobs Count</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categoriesLoading ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                          </TableCell>
                        </TableRow>
                      ) : categories?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            No categories found
                          </TableCell>
                        </TableRow>
                      ) : (
                        categories?.map((category) => (
                          <TableRow key={category.id}>
                            <TableCell className="font-medium">
                              {category.name}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {category.slug}
                            </TableCell>
                            <TableCell>
                              {jobCountByCategory(category.id)}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingCategory(category);
                                    setIsCategoryDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleDeleteCategory(category.id)
                                  }
                                  disabled={deleteCategoryMutation.isPending}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Companies Tab ─────────────────────────────────────── */}
            <TabsContent value="companies" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Company Management</h2>
                <Dialog
                  open={isCompanyDialogOpen}
                  onOpenChange={setIsCompanyDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button 
                      type="button"
                      onClick={() => setEditingCompany(null)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Company
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingCompany ? "Edit Company" : "Add New Company"}
                      </DialogTitle>
                      <DialogDescription>
                        Manage company profiles that post jobs on the platform.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCompanySubmit} className="space-y-4">
                      <Input
                        name="name"
                        placeholder="Company Name"
                        defaultValue={editingCompany?.name}
                        required
                      />
                      <Input
                        name="website"
                        placeholder="Website (e.g. https://...)"
                        defaultValue={editingCompany?.website ?? ""}
                      />
                      <Input
                        name="logo_url"
                        placeholder="Logo URL"
                        defaultValue={editingCompany?.logo_url ?? ""}
                      />
                      <Input
                        name="location"
                        placeholder="Location"
                        defaultValue={editingCompany?.location ?? ""}
                      />
                      <textarea
                        name="description"
                        placeholder="About Company"
                        className="w-full p-2 border rounded h-24"
                        defaultValue={editingCompany?.description ?? ""}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsCompanyDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={
                            createCompanyMutation.isPending ||
                            updateCompanyMutation.isPending
                          }
                        >
                          {editingCompany ? "Update" : "Create"} Company
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Website</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!companies ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                          </TableCell>
                        </TableRow>
                      ) : companies.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            No companies found
                          </TableCell>
                        </TableRow>
                      ) : (
                        companies.map((company: any) => (
                          <TableRow key={company.id}>
                            <TableCell className="font-medium">
                              {company.name}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {company.location}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {company.website}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingCompany(company);
                                    setIsCompanyDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    if (confirm("Delete this company? This may break related jobs.")) {
                                      deleteCompanyMutation.mutate(company.id);
                                    }
                                  }}
                                  disabled={deleteCompanyMutation.isPending}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Blog Posts Tab ─────────────────────────────────── */}
            <TabsContent value="blog" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Blog Posts Management</h2>
                <Dialog
                  open={isBlogDialogOpen}
                  onOpenChange={setIsBlogDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button 
                      type="button"
                      onClick={() => setEditingBlogPost(null)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Blog Post
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingBlogPost ? "Edit Blog Post" : "Add New Blog Post"}
                      </DialogTitle>
                      <DialogDescription>
                        Create or update blog posts for your audience.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleBlogPostSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <div>
                          <label htmlFor="title" className="text-sm font-medium">
                            Title
                          </label>
                          <Input
                            id="title"
                            name="title"
                            placeholder="Enter blog post title"
                            defaultValue={editingBlogPost?.title || ""}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="excerpt" className="text-sm font-medium">
                            Excerpt
                          </label>
                          <textarea
                            id="excerpt"
                            name="excerpt"
                            placeholder="Brief description of the post"
                            defaultValue={editingBlogPost?.excerpt || ""}
                            className="w-full p-3 border rounded-md"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label htmlFor="content" className="text-sm font-medium">
                            Content
                          </label>
                          <textarea
                            id="content"
                            name="content"
                            placeholder="Full blog post content"
                            defaultValue={editingBlogPost?.content || ""}
                            className="w-full p-3 border rounded-md"
                            rows={10}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="category" className="text-sm font-medium">
                            Category
                          </label>
                          <Input
                            id="category"
                            name="category"
                            placeholder="e.g., General, Tech, Career"
                            defaultValue={editingBlogPost?.category || "General"}
                          />
                        </div>
                        <div>
                          <label htmlFor="read_time" className="text-sm font-medium">
                            Read Time
                          </label>
                          <Input
                            id="read_time"
                            name="read_time"
                            placeholder="e.g., 5 min read"
                            defaultValue={editingBlogPost?.read_time || "3 min read"}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="published"
                            name="published"
                            defaultChecked={editingBlogPost?.published || false}
                          />
                          <label htmlFor="published" className="text-sm">
                            Published
                          </label>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsBlogDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={
                            createBlogPostMutation.isPending ||
                            updateBlogPostMutation.isPending
                          }
                        >
                          {editingBlogPost ? "Update" : "Create"} Blog Post
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Blog Posts Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Blog Posts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {blogPostsLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                    ) : blogPosts && blogPosts.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Published</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {blogPosts.map((post) => (
                            <TableRow key={post.id}>
                              <TableCell className="font-medium">
                                {post.title}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{post.category}</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={post.published ? "default" : "secondary"}>
                                  {post.published ? "Published" : "Draft"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(post.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingBlogPost(post);
                                      setIsBlogDialogOpen(true);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      if (confirm("Delete this blog post?")) {
                                        handleDeleteBlogPost(post.id);
                                      }
                                    }}
                                    disabled={deleteBlogPostMutation.isPending}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No blog posts found. Create your first blog post!
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ── Subscribers Tab ────────────────────────────────────── */}
            <TabsContent value="subscribers" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Newsletter Subscribers</h2>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Subscribed Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscribersLoading ? (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center py-8">
                            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                          </TableCell>
                        </TableRow>
                      ) : subscribers?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center py-8">
                            No subscribers found
                          </TableCell>
                        </TableRow>
                      ) : (
                        subscribers?.map((sub) => (
                          <TableRow key={sub.id}>
                            <TableCell className="font-medium">
                              {sub.email}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(sub.created_at).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
}
