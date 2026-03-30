import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    MapPin,
    TrendingUp,
    Users,
    Landmark,
    Upload,
    ArrowRight,
    Sparkles,
    ChevronDown,
    Share2,
} from "lucide-react";

/* ─── Animation variants ─────────────────────────────────────── */
const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    }),
};

const stagger = { visible: { transition: { staggerChildren: 0.09 } } };

/* Social links data */
const SOCIAL_LINKS = [
    {
        label: "Telegram",
        href: "https://t.me/faydajobs",
        color: "#229ED9",
        shadow: "rgba(34,158,217,0.5)",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
        ),
    },
    {
        label: "Facebook",
        href: "https://facebook.com/faydajobs",
        color: "#1877F2",
        shadow: "rgba(24,119,242,0.5)",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
    },
    {
        label: "LinkedIn",
        href: "https://linkedin.com/company/faydajobs",
        color: "#0A66C2",
        shadow: "rgba(10,102,194,0.5)",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
    },
    {
        label: "WhatsApp",
        href: "https://wa.me/251900000000",
        color: "#25D366",
        shadow: "rgba(37,211,102,0.5)",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
        ),
    },
];

/* ─── Static data ─────────────────────────────────────────────── */
const ETHIOPIAN_CITIES = [
    "All Locations",
    "Addis Ababa",
    "Dire Dawa",
    "Mekelle",
    "Gondar",
    "Hawassa",
    "Bahir Dar",
    "Adama",
    "Jimma",
    "Harar",
];

const HERO_STATS = [
    { value: "10,000+", label: "Jobs Posted" },
    { value: "5,000+", label: "Companies" },
    { value: "100K+", label: "Job Seekers" },
];


/* ─── Main Component ─────────────────────────────────────────── */
const HeroSection = () => {
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("All Locations");
    const [locationOpen, setLocationOpen] = useState(false);
    const [socialHovered, setSocialHovered] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (query.trim()) params.set("search", query.trim());
        if (location !== "All Locations") params.set("location", location);
        window.location.href = `/jobs?${params.toString()}`;
    };

    return (
        <section className="relative min-h-[100svh] flex flex-col overflow-hidden">
            {/* ── Background image + gradient overlay ── */}
            <div className="absolute inset-0">
                <img
                    src="/hero-bg.png"
                    alt="Ethiopian professionals working in a modern office"
                    className="h-full w-full object-cover object-center"
                    loading="eager"
                />
                {/* Layered gradient: dark left tint + full overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
                {/* Subtle green brand tint */}
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(145,55%,10%)]/40 via-transparent to-transparent" />
                {/* Animated overlay pattern */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,transparent_50%,rgba(16,185,129,0.3)_100%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,transparent_50%,rgba(59,130,246,0.2)_100%)]" />
                </div>
            </div>

            {/* ── Decorative ambient glows ── */}
            <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-[hsl(145,55%,32%)]/20 blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full bg-[hsl(40,70%,55%)]/10 blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute bottom-0 left-1/4 h-[300px] w-[300px] rounded-full bg-[hsl(217,91%,60%)]/15 blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '4s' }} />

            {/* ── Main content ── */}
            <div className="relative flex-1 container flex items-center py-28 md:py-36">
                <div className="w-full grid grid-cols-1 gap-12 lg:gap-16 items-center">

                    {/* ═══ Center Content: headline + search + categories + CTAs ═══ */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                        className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
                    >
                        {/* Headline */}
                        <motion.h1
                            variants={fadeUp}
                            custom={1}
                            className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-[4rem] font-extrabold text-white tracking-tight leading-[1.05] mb-6"
                        >
                            <span className="drop-shadow-2xl">Find Your Next{" "}</span>
                            <span className="relative inline-block">
                                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 drop-shadow-2xl">
                                    Career
                                </span>
                                <span className="absolute -bottom-1 left-0 right-0 h-[6px] bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full opacity-60 animate-pulse" />
                                <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full opacity-40 blur-sm" />
                            </span>{" "}
                            <span className="drop-shadow-2xl">Opportunity</span>
                        </motion.h1>
                        <motion.h2
                            variants={fadeUp}
                            custom={2}
                            className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-[3.5rem] font-extrabold text-white tracking-tight leading-[1.1] mb-6"
                        >
                            <span className="relative inline-block">
                                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 drop-shadow-2xl">
                                   in Ethiopia
                                </span>
                                <span className="absolute -bottom-1 left-0 right-0 h-[6px] bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full opacity-60 animate-pulse" />
                                <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full opacity-40 blur-sm" />
                            </span>
                        </motion.h2>

                        {/* Subheadline */}
                        <motion.p
                            variants={fadeUp}
                            custom={3}
                            className="text-base md:text-lg lg:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl mx-auto drop-shadow-lg"
                        >
                            <span className="bg-gradient-to-r from-white/90 to-white/70 bg-clip-text text-transparent">
                                Discover thousands of verified jobs from top companies, NGOs, and
                                government institutions across Ethiopia.
                            </span>
                        </motion.p>

                        {/* ── Search bar ── */}
                        <motion.div variants={fadeUp} custom={4} className="mb-8 max-w-3xl mx-auto">
                            <form
                                onSubmit={handleSearch}
                                className="relative flex flex-col sm:flex-row gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/40 hover:bg-white/15 transition-all duration-300 hover:shadow-emerald-500/20 hover:border-white/30"
                            >
                                {/* Keyword input */}
                                <div className="flex-1 flex items-center gap-2.5 bg-white rounded-xl px-4 py-3.5 min-w-0 shadow-inner hover:shadow-lg transition-all duration-300 group">
                                    <Search className="h-5 w-5 text-gray-400 shrink-0 group-hover:text-emerald-500 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Job title, keyword, or company…"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className="w-full bg-transparent border-0 text-gray-800 placeholder:text-gray-400 focus:outline-none text-sm md:text-base font-medium"
                                    />
                                </div>

                                {/* Location dropdown */}
                                <div className="relative shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setLocationOpen(!locationOpen)}
                                        className="flex items-center gap-2 bg-white rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-700 w-full sm:w-48 justify-between hover:bg-gray-50 hover:border-emerald-300 transition-all shadow-sm border border-gray-100 group"
                                    >
                                        <span className="flex items-center gap-1.5 truncate">
                                            <MapPin className="h-4 w-4 text-emerald-500 shrink-0 group-hover:text-emerald-600 transition-colors" />
                                            <span className="truncate">{location}</span>
                                        </span>
                                        <ChevronDown className={`h-4 w-4 text-gray-400 shrink-0 transition-transform duration-200 group-hover:text-emerald-500 ${locationOpen ? "rotate-180" : ""}`} />
                                    </button>
                                    {locationOpen && (
                                        <div className="absolute top-full left-0 mt-2 w-full sm:w-56 rounded-2xl bg-white shadow-2xl border border-gray-100 py-2.5 z-50 max-h-72 overflow-y-auto">
                                            {ETHIOPIAN_CITIES.map((city) => (
                                                <button
                                                    key={city}
                                                    type="button"
                                                    onClick={() => { setLocation(city); setLocationOpen(false); }}
                                                    className={`w-full text-left px-5 py-2.5 text-sm transition-colors hover:bg-emerald-50 hover:text-emerald-700 ${location === city ? "text-emerald-600 font-bold bg-emerald-50" : "text-gray-700 font-medium"}`}
                                                >
                                                    {city}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Search button */}
                                <button
                                    type="submit"
                                    className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 transition-all duration-300 shadow-lg shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] text-sm md:text-base shrink-0 group"
                                >
                                    <Search className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                                    <span>Search</span>
                                </button>
                            </form>
                        </motion.div>

                        {/* CTA buttons */}
                        <motion.div variants={fadeUp} custom={6} className="flex flex-wrap gap-4 justify-center mt-4">
                            <Link href="/jobs">
                                <button className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-10 py-4 text-white font-bold text-base shadow-xl shadow-emerald-600/40 hover:shadow-emerald-600/60 hover:shadow-2xl hover:scale-[1.05] active:scale-[0.98] transition-all duration-300 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600">
                                    <span className="relative z-10">Browse All Jobs</span>
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 group-hover:rotate-6 transition-all duration-300" />
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </button>
                            </Link>
                        </motion.div>
                    </motion.div>
                    {/* right col intentionally empty — widget is absolute */}
                </div>
            </div>
            {/* ── Hover social widget — absolute right edge ── */}
            <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="fixed right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-0 z-50"
                onMouseEnter={() => setSocialHovered(true)}
                onMouseLeave={() => setSocialHovered(false)}
                style={{ width: 56 }}
            >
                {/* Expanded icons — fan downward from center */}
                <AnimatePresence>
                    {socialHovered && SOCIAL_LINKS.map((social, i) => (
                        <motion.a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.label}
                            initial={{ opacity: 0, y: -6, scale: 0.6 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.6 }}
                            transition={{
                                delay: i * 0.055,
                                type: "spring",
                                stiffness: 420,
                                damping: 24,
                            }}
                            whileHover={{ scale: 1.25, x: -6 }}
                            whileTap={{ scale: 0.9 }}
                            className="flex h-10 w-10 items-center justify-center rounded-full text-white cursor-pointer mb-2"
                            style={{
                                background: social.color,
                                boxShadow: `0 4px 18px ${social.shadow}`,
                            }}
                        >
                            {social.icon}
                        </motion.a>
                    ))}
                </AnimatePresence>

                {/* Central trigger button */}
                <motion.div
                    animate={{
                        scale: socialHovered ? 1.12 : 1,
                        rotate: socialHovered ? 15 : 0,
                        boxShadow: socialHovered
                            ? "0 0 0 8px rgba(16,185,129,0.18), 0 8px 32px rgba(16,185,129,0.55)"
                            : "0 0 0 0px rgba(16,185,129,0), 0 8px 24px rgba(16,185,129,0.35)",
                    }}
                    transition={{ type: "spring", stiffness: 340, damping: 22 }}
                    className="flex h-12 w-12 items-center justify-center rounded-full text-white cursor-pointer"
                    style={{
                        background: "linear-gradient(135deg, rgba(16,185,129,0.85), rgba(20,184,166,0.85))",
                        backdropFilter: "blur(12px)",
                        border: "1.5px solid rgba(255,255,255,0.25)",
                    }}
                    aria-label="Follow us on social media"
                >
                    <Share2 className="h-5 w-5" />
                </motion.div>

                {/* Label below button */}
                <AnimatePresence>
                    {!socialHovered && (
                        <motion.span
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.2 }}
                            className="mt-2 text-[10px] text-white/45 font-medium tracking-widest uppercase whitespace-nowrap"
                            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                        >
                            Follow
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* ── Stats bar ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="relative mt-auto"
            >
                <div className="border-t border-white/10 bg-black/40 backdrop-blur-xl">
                    <div className="container py-5">
                        <div className="flex flex-wrap items-center justify-center divide-x divide-white/10">
                            {HERO_STATS.map((stat, i) => (
                                <div
                                    key={stat.label}
                                    className={`flex flex-col items-center px-8 sm:px-12 py-1 ${i === 0 ? "pl-0" : ""} ${i === HERO_STATS.length - 1 ? "pr-0" : ""}`}
                                >
                                    <span className="text-2xl md:text-3xl font-extrabold text-white font-heading">{stat.value}</span>
                                    <span className="text-xs text-white/50 mt-0.5 font-medium">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Wave transition to page background */}
                <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden">
                    <svg viewBox="0 0 1440 48" fill="none" className="w-full h-auto">
                        <path
                            d="M0 48L48 44C96 40 192 32 288 28C384 24 480 24 576 26.7C672 29.3 768 34.7 864 36C960 37.3 1056 34.7 1152 30.7C1248 26.7 1344 21.3 1392 18.7L1440 16V48H0Z"
                            className="fill-background"
                        />
                    </svg>
                </div>
            </motion.div>


        </section>
    );
};

export default HeroSection;
