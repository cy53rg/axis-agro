"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { fadeTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  /** Extra delay in seconds (e.g. card stagger). */
  delay?: number;
  /** When false, animates on mount instead of scroll into view. */
  onScroll?: boolean;
}

/**
 * Lightweight opacity fade for sections and cards.
 * No translate, scale, or bounce, suitable for a grant portfolio.
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  onScroll = true,
}: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const transition = { ...fadeTransition, delay };

  if (!onScroll) {
    return (
      <motion.div
        className={cn(className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -32px 0px" }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
