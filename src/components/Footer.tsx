import Image from "next/image";
import Link from "next/link";
import { Mail, Facebook } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeNewsletter } from "@/lib/supabase-helpers";
import { toast } from "sonner";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const { error } = await subscribeNewsletter(email);
    setLoading(false);
    if (error) {
      if (error.code === "23505") {
        toast.info("You're already subscribed!");
      } else {
        toast.error("Failed to subscribe. Please try again.");
      }
    } else {
      toast.success("Successfully subscribed!");
      setEmail("");
    }
  };

  return (
    <footer className="border-t bg-foreground text-background">

      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-white p-0.5 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/faydajobs-logo.png"
                  alt="FaydaJobs"
                  width={64}
                  height={64}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-xl font-bold font-heading text-background tracking-tight">
                Fayda<span className="text-primary">Jobs</span>
              </span>
            </Link>
            <p className="text-sm opacity-70 mb-4">
              Ethiopia's premier job discovery platform. Find your next career opportunity.
            </p>
            
            {/* Social Media Icons - Always Visible */}
            <div className="flex items-center gap-3">
              <a 
                href="https://t.me/faydajobs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 border border-blue-600 text-white hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-110 shadow-lg shadow-blue-500/30"
                aria-label="Telegram"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
              <a 
                href="https://facebook.com/faydajobs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-background/10 border border-background/20 text-background hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm opacity-70">
              <Link href="/jobs" className="hover:opacity-100 transition-opacity">Browse Jobs</Link>
              <Link href="/categories" className="hover:opacity-100 transition-opacity">Categories</Link>
              <Link href="/companies" className="hover:opacity-100 transition-opacity">Companies</Link>
            </div>
          </div>


          <div>
            <h4 className="font-heading font-semibold mb-3">Legal</h4>
            <div className="flex flex-col gap-2 text-sm opacity-70">
              <Link href="/privacy-policy" className="hover:opacity-100 transition-opacity">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:opacity-100 transition-opacity">Terms of Service</Link>
              <Link href="/disclaimer" className="hover:opacity-100 transition-opacity">Disclaimer</Link>
              <Link href="/cookie-policy" className="hover:opacity-100 transition-opacity">Cookie Policy</Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-3">Newsletter</h4>
            <p className="text-sm opacity-70 mb-3">Get the latest jobs delivered to your inbox.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
                required
              />
              <Button type="submit" size="icon" disabled={loading} className="shrink-0">
                <Mail className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-background/10 mt-8 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm opacity-50">
              © {new Date().getFullYear()} Fayda Jobs. All rights reserved.
            </div>
            
            {/* Mobile Social Media Section */}
            <div className="flex items-center gap-3 md:hidden">
              <span className="text-xs opacity-70">Follow us:</span>
              <a 
                href="https://t.me/faydajobs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 border border-blue-600 text-white hover:bg-blue-600 hover:text-white transition-all duration-300"
                aria-label="Telegram"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
              <a 
                href="https://facebook.com/faydajobs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-background/10 border border-background/20 text-background hover:bg-primary hover:text-white transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
