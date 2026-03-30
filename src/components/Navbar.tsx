import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// import logo from "/faydajobs-logo.png";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Jobs", href: "/jobs" },
    { label: "Blog", href: "/blog" },
    { label: "Contact Us", href: "/contact" },
  ];

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <>
      <nav
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-card/95 backdrop-blur-xl border-b shadow-sm shadow-primary/5"
            : "bg-card/80 backdrop-blur-md border-b border-transparent"
        )}
      >
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* <img
              src={logo.src}
              alt="FaydaJobs"
              className="h-9 w-9 rounded-xl object-contain transition-transform duration-300 group-hover:scale-105"
            /> */}
            <span className="text-xl font-bold font-heading text-foreground tracking-tight">
              Fayda<span className="text-primary">Jobs</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive(link.href)
                    ? "text-primary bg-primary/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5 mr-1">
              <a href="https://t.me/faydajobs" target="_blank" rel="noopener noreferrer" className="group flex h-8 w-8 items-center justify-center rounded-lg bg-muted/60 transition-all duration-300 hover:bg-[hsl(200_100%_40%)] hover:text-white hover:scale-110" aria-label="Telegram">
                <svg className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              </a>
              <a href="https://facebook.com/faydajobs" target="_blank" rel="noopener noreferrer" className="group flex h-8 w-8 items-center justify-center rounded-lg bg-muted/60 transition-all duration-300 hover:bg-[hsl(220_46%_48%)] hover:text-white hover:scale-110" aria-label="Facebook">
                <svg className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://linkedin.com/company/faydajobs" target="_blank" rel="noopener noreferrer" className="group flex h-8 w-8 items-center justify-center rounded-lg bg-muted/60 transition-all duration-300 hover:bg-[hsl(210_80%_45%)] hover:text-white hover:scale-110" aria-label="LinkedIn">
                <svg className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://wa.me/251900000000" target="_blank" rel="noopener noreferrer" className="group flex h-8 w-8 items-center justify-center rounded-lg bg-muted/60 transition-all duration-300 hover:bg-[hsl(142_70%_40%)] hover:text-white hover:scale-110" aria-label="WhatsApp">
                <svg className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              </a>
            </div>
          </div>

          {/* Mobile Toggle */}
          <Button
            className={cn(
              "md:hidden relative h-10 w-10 flex items-center justify-center rounded-xl transition-all duration-200",
              mobileOpen ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={cn(
                "absolute transition-all duration-300",
                mobileOpen ? "rotate-90 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"
              )}
            >
              <Menu className="h-5 w-5" />
            </span>
            <span
              className={cn(
                "absolute transition-all duration-300",
                mobileOpen ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-50"
              )}
            >
              <X className="h-5 w-5" />
            </span>
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={cn(
          "fixed top-16 left-0 right-0 z-40 bg-card border-b shadow-xl shadow-primary/5 md:hidden transition-all duration-300 ease-out overflow-hidden",
          mobileOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="container py-4 space-y-1">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center justify-between py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200",
                isActive(link.href)
                  ? "text-primary bg-primary/8"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
              style={{ transitionDelay: mobileOpen ? `${i * 50}ms` : "0ms" }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
              <ChevronRight className={cn("h-4 w-4 transition-colors", isActive(link.href) ? "text-primary" : "text-muted-foreground/40")} />
            </Link>
          ))}

        </div>
      </div>
    </>
  );
};

export default Navbar;
