import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  lightMode?: boolean;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = false,
  lightMode = false,
}: SectionHeaderProps) {
  return (
    <div className={cn(centered && "text-center")}>
      <p className="mb-2 font-label text-[11px] font-semibold uppercase tracking-[0.14em] text-gold sm:mb-3 sm:text-[12px] md:text-[13px]">
        {eyebrow}
      </p>
      <h2
        className={cn(
          "font-display text-[1.75rem] font-bold leading-tight sm:text-[2rem] md:text-[2.5rem]",
          lightMode ? "text-white" : "text-navy"
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "mt-3 max-w-[36rem] text-base font-normal leading-relaxed sm:mt-4 sm:text-[17px]",
            lightMode ? "text-white/80" : "text-muted",
            centered && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
