/** Shared motion tokens. Keep grant-portfolio animations restrained. */
export const FADE_DURATION = 0.3;
export const FADE_EASE = "easeOut" as const;

export const fadeTransition = {
  duration: FADE_DURATION,
  ease: FADE_EASE,
} as const;
