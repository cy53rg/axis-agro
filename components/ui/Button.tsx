import Link from "next/link";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-forest text-white hover:bg-forest/90 active:bg-forest/80 focus-visible:ring-forest/40",
  outline:
    "border border-forest bg-transparent text-forest hover:bg-forest/5 active:bg-forest/10 focus-visible:ring-forest/30",
  ghost:
    "bg-transparent text-navy hover:bg-navy/5 active:bg-navy/10 focus-visible:ring-navy/20",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-10 gap-1.5 px-4 py-2 text-[13px]",
  md: "min-h-11 gap-2 px-5 py-2.5 text-sm",
  lg: "min-h-12 gap-2 px-6 py-3 text-base sm:min-h-11",
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  href,
  onClick,
  type = "button",
  disabled,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-btn font-label font-semibold transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
    variantClasses[variant],
    sizeClasses[size],
    disabled && "pointer-events-none opacity-50",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
