import Link from "next/link";
import { MapPin, Clock, Calendar, Briefcase, Star, ArrowUpRight, Users, Building, TrendingUp, Heart, BookmarkPlus, ExternalLink, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Job } from "@/lib/supabase-helpers";
import { format, formatDistanceToNow, isPast } from "date-fns";
import { useState } from "react";

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const isExpired = job.deadline ? isPast(new Date(job.deadline)) : false;
  const isUrgent = job.deadline && !isExpired && new Date(job.deadline).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000; // Less than 7 days
  const isBatchJob = job.is_batch_job || false;
  
  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsBookmarked(!isBookmarked);
  };
  
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLiked(!isLiked);
  };

  return (
    <Link href={`/jobs/${job.slug}`} className="block group">
      <div className="relative rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 hover:border-primary/30 hover:bg-gradient-to-br hover:from-white hover:to-muted/50 dark:hover:from-background dark:hover:to-muted/50 overflow-hidden">
        
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-secondary/3" />
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
        </div>
        
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Featured badge */}
        {job.featured && (
          <div className="absolute top-4 right-4 z-10">
            <span className="badge-featured shadow-lg animate-pulse">
              <Star className="h-3 w-3 mr-1 fill-current" /> Featured
            </span>
          </div>
        )}
        
        {/* Batch job badge */}
        {isBatchJob && !job.featured && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 shadow-lg animate-pulse">
              <Layers className="h-3 w-3 mr-1" /> Batch Job
            </Badge>
          </div>
        )}
        
        {/* Urgent badge */}
        {isUrgent && !job.featured && !isBatchJob && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-lg animate-pulse">
              <TrendingUp className="h-3 w-3 mr-1" /> Urgent
            </Badge>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="absolute top-4 left-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={handleBookmark}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 dark:bg-background/90 backdrop-blur-sm border border-border/50 shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200 group/btn"
            aria-label="Bookmark job"
          >
            <BookmarkPlus className={`h-4 w-4 transition-colors duration-200 ${isBookmarked ? 'text-primary fill-current' : 'text-muted-foreground group-hover/btn:text-primary'}`} />
          </button>
          <button
            onClick={handleLike}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 dark:bg-background/90 backdrop-blur-sm border border-border/50 shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200 group/btn"
            aria-label="Like job"
          >
            <Heart className={`h-4 w-4 transition-colors duration-200 ${isLiked ? 'text-red-500 fill-current' : 'text-muted-foreground group-hover/btn:text-red-500'}`} />
          </button>
        </div>

        <div className="relative mt-4">
          <div className="flex items-start gap-4">
            {job.companies?.logo ? (
              <div className="relative">
                <img
                  src={job.companies.logo}
                  alt={job.companies.name}
                  className="h-14 w-14 rounded-2xl object-cover border-2 border-border/50 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
                  loading="lazy"
                />
                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Building className="h-2 w-2 text-white" />
                </div>
              </div>
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-border/50 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-bold text-lg text-card-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight mb-2">
                {job.title}
                {isBatchJob && (
                  <span className="ml-2 text-xs font-normal text-purple-600 dark:text-purple-400">
                    (Part of batch hiring)
                  </span>
                )}
              </h3>
              <p className="text-sm font-medium text-muted-foreground">
                {job.companies?.name || "Unknown Company"}
              </p>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="h-px w-6 bg-gradient-to-r from-primary/20 to-primary/60 group-hover:w-8 transition-all duration-300" />
              <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge className="text-xs rounded-lg font-medium bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300">
            <MapPin className="h-3 w-3 mr-1" />
            {job.location}
          </Badge>
          <Badge className="text-xs rounded-lg font-medium bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300">
            <Clock className="h-3 w-3 mr-1" />
            {job.job_type}
          </Badge>
          {isBatchJob && (
            <Badge className="text-xs rounded-lg font-medium bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300">
              <Layers className="h-3 w-3 mr-1" />
              Multiple Positions
            </Badge>
          )}
          {job.deadline && (
            <Badge variant={isExpired ? "destructive" : "outline"} className={`text-xs rounded-lg font-medium transition-all duration-300 ${
              isExpired 
                ? 'bg-gradient-to-r from-red-500/20 to-red-500/10 border-red-500/30 text-red-700 dark:text-red-400' 
                : isUrgent 
                ? 'bg-gradient-to-r from-orange-500/20 to-yellow-500/10 border-orange-500/30 text-orange-700 dark:text-orange-400'
                : 'bg-gradient-to-r from-purple-500/20 to-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-400'
            }`}>
              <Calendar className="h-3 w-3 mr-1" />
              {isExpired ? "Expired" : isUrgent ? `Urgent: ${format(new Date(job.deadline), "MMM d")}` : `Due ${format(new Date(job.deadline), "MMM d")}`}
            </Badge>
          )}
        </div>

        {job.description && (
          <div className="mt-4 relative">
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed group-hover:line-clamp-3 transition-all duration-500">
              {job.description}
            </p>
            <div className="absolute bottom-0 right-0 bg-gradient-to-l from-card/80 to-transparent px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-xs text-primary">Read more</span>
            </div>
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
            {formatDistanceToNow(new Date(job.posted_date), { addSuffix: true })}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2">
              {isBatchJob ? "View All Positions" : "View Details"}
            </span>
            <ArrowUpRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
