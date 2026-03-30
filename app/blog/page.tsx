'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Calendar, Clock, ArrowRight, User, Tag } from "lucide-react";

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

// Mock blog data - in a real app, this would come from your database
const blogPosts = [
  {
    id: 1,
    title: "Top 10 In-Demand Jobs in Ethiopia for 2024",
    excerpt: "Discover the most sought-after career opportunities in Ethiopia's growing job market. From tech to healthcare, explore where the opportunities are.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: "Fayda Jobs Team",
    publishedAt: "2024-03-15",
    readTime: "5 min read",
    category: "Career Advice",
    tags: ["Jobs", "Career", "Ethiopia"],
    featured: true,
    image: "/placeholder.svg"
  },
  {
    id: 2,
    title: "How to Write the Perfect Resume for Ethiopian Employers",
    excerpt: "Learn the essential tips and tricks to create a resume that stands out to Ethiopian employers and increases your chances of getting hired.",
    content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    author: "Sarah Johnson",
    publishedAt: "2024-03-10",
    readTime: "7 min read",
    category: "Resume Tips",
    tags: ["Resume", "Tips", "Employment"],
    featured: false,
    image: "/placeholder.svg"
  },
  {
    id: 3,
    title: "Interview Tips: How to Impress Ethiopian Companies",
    excerpt: "Master the art of job interviews with our comprehensive guide tailored for the Ethiopian job market.",
    content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    author: "Michael Tesfaye",
    publishedAt: "2024-03-05",
    readTime: "6 min read",
    category: "Interview Tips",
    tags: ["Interview", "Tips", "Success"],
    featured: false,
    image: "/placeholder.svg"
  },
  {
    id: 4,
    title: "Remote Work Opportunities in Ethiopia: A Growing Trend",
    excerpt: "Explore the rise of remote work in Ethiopia and how you can take advantage of these flexible job opportunities.",
    content: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    author: "Fayda Jobs Team",
    publishedAt: "2024-02-28",
    readTime: "8 min read",
    category: "Remote Work",
    tags: ["Remote", "Work", "Technology"],
    featured: true,
    image: "/placeholder.svg"
  },
  {
    id: 5,
    title: "Salary Guide: What to Expect in Ethiopia's Job Market",
    excerpt: "Get insights into salary ranges across different industries and experience levels in Ethiopia.",
    content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    author: "Elena Mekonnen",
    publishedAt: "2024-02-20",
    readTime: "10 min read",
    category: "Salary Guide",
    tags: ["Salary", "Guide", "Market"],
    featured: false,
    image: "/placeholder.svg"
  },
  {
    id: 6,
    title: "Skills Development: Courses That Boost Your Career in Ethiopia",
    excerpt: "Discover the most valuable skills and courses that can help you advance your career in Ethiopia's competitive job market.",
    content: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni.",
    author: "David Haile",
    publishedAt: "2024-02-15",
    readTime: "6 min read",
    category: "Skills Development",
    tags: ["Skills", "Courses", "Career"],
    featured: false,
    image: "/placeholder.svg"
  }
];

const categories = ["All", "Career Advice", "Resume Tips", "Interview Tips", "Remote Work", "Salary Guide", "Skills Development"];

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);

  const filterPosts = () => {
    let filtered = blogPosts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    setFilteredPosts(filtered);
  };

  useEffect(() => {
    filterPosts();
  }, [searchTerm, selectedCategory]);

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="space-y-16"
        >
          {/* Header */}
          <motion.div variants={fadeUp} custom={0} className="text-center">
            <h1 className="font-heading text-4xl font-bold text-card-foreground mb-4">
              Fayda Jobs Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Career advice, job search tips, and insights into Ethiopia's job market
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div variants={fadeUp} custom={1}>
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <motion.div variants={fadeUp} custom={2}>
              <h2 className="font-heading text-2xl font-semibold text-card-foreground mb-8">
                Featured Articles
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredPosts.map((post, index) => (
                  <motion.div key={post.id} variants={fadeUp} custom={index + 3}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video bg-muted relative">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-4 left-4" variant="secondary">
                          Featured
                        </Badge>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(post.publishedAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.readTime}
                          </div>
                        </div>
                        <h3 className="font-heading text-xl font-semibold text-card-foreground mb-3 hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{post.author}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            Read More
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Regular Posts */}
          <motion.div variants={fadeUp} custom={4}>
            <h2 className="font-heading text-2xl font-semibold text-card-foreground mb-8">
              Latest Articles
            </h2>
            {regularPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No articles found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularPosts.map((post, index) => (
                  <motion.div key={post.id} variants={fadeUp} custom={index + 5}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video bg-muted">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-6">
                        <Badge variant="outline" className="mb-3">
                          {post.category}
                        </Badge>
                        <h3 className="font-heading text-lg font-semibold text-card-foreground mb-3 hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(post.publishedAt).toLocaleDateString()}
                          </div>
                          <Button variant="ghost" size="sm">
                            Read More
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                        <div className="flex gap-2 mt-4">
                          {post.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div variants={fadeUp} custom={5}>
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-8 text-center">
                <h2 className="font-heading text-2xl font-bold mb-4">
                  Stay Updated with Career Tips
                </h2>
                <p className="mb-6 opacity-90">
                  Get the latest career advice and job market insights delivered to your inbox
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input
                    placeholder="Enter your email"
                    className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
                  />
                  <Button variant="secondary" className="bg-background text-foreground hover:bg-background/90">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}
