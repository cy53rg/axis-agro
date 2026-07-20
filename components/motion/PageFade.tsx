"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { fadeTransition } from "@/lib/motion";

interface PageFadeProps {
  children: ReactNode;
}

/**
 * Soft fade when a public route mounts (used from `template.tsx`).
 */
export function PageFade({ children }: PageFadeProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={fadeTransition}
    >
      {children}
    </motion.div>
  );
}
