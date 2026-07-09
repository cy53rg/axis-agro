import { cn } from "@/lib/utils";

interface GoldBorderCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GoldBorderCard({ children, className }: GoldBorderCardProps) {
  return (
    <div
      className={cn(
        "rounded-card border-t-[3px] border-gold bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.07)] transition-shadow duration-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.1)] md:p-8",
        className
      )}
    >
      {children}
    </div>
  );
}
