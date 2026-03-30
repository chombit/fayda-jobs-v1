interface AdPlaceholderProps {
  slot: string;
  format?: "horizontal" | "rectangle" | "vertical";
  className?: string;
}

const sizeMap = {
  horizontal: "h-[90px] md:h-[90px]",
  rectangle: "h-[250px]",
  vertical: "h-[600px]",
};

const labelMap = {
  horizontal: "728 × 90 — Leaderboard",
  rectangle: "300 × 250 — Medium Rectangle",
  vertical: "160 × 600 — Wide Skyscraper",
};

const AdPlaceholder = ({ slot, format = "horizontal", className = "" }: AdPlaceholderProps) => (
  <div
    data-ad-slot={slot}
    className={`relative w-full ${sizeMap[format]} rounded-xl border-2 border-dashed border-border bg-muted/40 flex items-center justify-center overflow-hidden select-none ${className}`}
  >
    <div className="flex flex-col items-center gap-1 text-muted-foreground/60">
      <span className="text-xs font-heading font-semibold uppercase tracking-widest">Advertisement</span>
      <span className="text-[10px]">{labelMap[format]} · Slot: {slot}</span>
    </div>
  </div>
);

export default AdPlaceholder;
