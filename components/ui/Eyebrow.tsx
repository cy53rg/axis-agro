import { cn } from "@/lib/utils";

type EyebrowColor = "gold" | "white" | "sage";

interface EyebrowProps {
  children: React.ReactNode;
  color?: EyebrowColor;
  className?: string;
}

const colorClasses: Record<EyebrowColor, string> = {
  gold: "text-gold",
  white: "text-white",
  sage: "text-sage",
};

export function Eyebrow({
  children,
  color = "gold",
  className,
}: EyebrowProps) {
  return (
    <span
      className={cn(
        "font-label text-[13px] font-semibold uppercase tracking-[0.12em]",
        colorClasses[color],
        className
      )}
    >
      {children}
    </span>
  );
}
