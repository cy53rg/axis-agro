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
      <p className="mb-3 font-label text-[13px] font-semibold uppercase tracking-[0.12em] text-gold">
        {eyebrow}
      </p>
      <h2
        className={cn(
          "font-display text-[32px] font-bold leading-tight md:text-[40px]",
          lightMode ? "text-white" : "text-navy"
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "mt-4 max-w-[600px] text-[17px] font-normal",
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
