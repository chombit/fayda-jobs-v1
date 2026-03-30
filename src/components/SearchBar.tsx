import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const SearchBar = ({ className = "" }: { className?: string }) => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <div className="flex items-center bg-card rounded-2xl shadow-xl shadow-black/10 border border-border/50 overflow-hidden">
        <div className="flex-1 flex items-center pl-5">
          <Search className="h-5 w-5 text-muted-foreground/60 shrink-0" />
          <input
            type="text"
            placeholder="Search job title, keyword, or company..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-0 px-3 py-4 text-foreground placeholder:text-muted-foreground/50 focus:outline-none text-sm md:text-base"
          />
        </div>
        <div className="pr-2">
          <Button type="submit" size="lg" className="rounded-xl px-6 md:px-8 h-11 font-semibold shadow-md shadow-primary/20">
            Search
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
