import { SITE_NAME } from "@/constants/site";
import { cn } from "@/lib/utils";

export type SiteLogoTone = "brand" | "inverse";

type SiteLogoProps = {
  /** brand = forest/navy on light surfaces; inverse = white for dark heroes */
  tone?: SiteLogoTone;
  /** Show wordmark next to the mark */
  showWordmark?: boolean;
  className?: string;
  title?: string;
};

/**
 * Responsive inline SVG logo with transparent background and tone switching.
 */
export function SiteLogo({
  tone = "brand",
  showWordmark = true,
  className,
  title = SITE_NAME,
}: SiteLogoProps) {
  const mark = tone === "inverse" ? "#ffffff" : "#1e5631";
  const wordmark = tone === "inverse" ? "#ffffff" : "#1b2e3c";
  const voidFill = tone === "inverse" ? "rgba(15, 42, 24, 0.35)" : "#0c2414";

  if (!showWordmark) {
    return (
      <svg
        viewBox="0 0 96 96"
        role="img"
        aria-label={title}
        className={cn("h-10 w-10 shrink-0", className)}
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>{title}</title>
        <LogoMark mark={mark} voidFill={voidFill} />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 268 72"
      role="img"
      aria-label={title}
      className={cn("h-11 w-auto shrink-0 sm:h-12 lg:h-14", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <g transform="translate(2 4) scale(0.667)">
        <LogoMark mark={mark} voidFill={voidFill} />
      </g>
      <text
        x="78"
        y="32"
        fill={wordmark}
        fontFamily="var(--font-label), Montserrat, Arial, sans-serif"
        fontSize="15"
        fontWeight="700"
        letterSpacing="0.14em"
      >
        JRN AGRO
      </text>
      <text
        x="78"
        y="54"
        fill={wordmark}
        fontFamily="var(--font-label), Montserrat, Arial, sans-serif"
        fontSize="13"
        fontWeight="600"
        letterSpacing="0.28em"
        opacity={tone === "inverse" ? 0.9 : 0.85}
      >
        LTD
      </text>
    </svg>
  );
}

function LogoMark({ mark, voidFill }: { mark: string; voidFill: string }) {
  return (
    <g>
      <circle
        cx="48"
        cy="48"
        r="45"
        fill="none"
        stroke={mark}
        strokeWidth="5.5"
      />
      <circle
        cx="48"
        cy="48"
        r="38"
        fill="none"
        stroke={mark}
        strokeWidth="1.25"
        opacity="0.45"
      />

      {/* Cow */}
      <g fill={mark}>
        <path d="M24 36c0-8 7-15 16-16 6-1 12 1 16 5 2-3 6-5 10-4 5 1 8 6 8 11 0 3-1 5-3 7 4 3 6 8 5 13-1 8-8 14-16 15-3 4-8 6-13 6-9 0-16-6-18-14-4-2-7-7-6-12 1-4 3-8 7-11z" />
      </g>
      <g fill={voidFill}>
        <ellipse cx="36" cy="40" rx="3.2" ry="3.8" />
        <ellipse cx="48" cy="39" rx="3.2" ry="3.8" />
        <ellipse cx="42" cy="50" rx="6" ry="4.2" />
      </g>

      {/* Goat horn + ear cue */}
      <path
        d="M62 26c4-6 9-9 14-10-2 4-2 8 0 12-4 1-8 1-12 0l-2-2z"
        fill={mark}
      />

      {/* Rooster body */}
      <path
        d="M30 58c7-3 15-2 21 2 4 3 5 7 3 11-7 0-14-1-21 1-4 1-7-2-7-6 0-3 1-6 4-8z"
        fill={mark}
      />
      <path
        d="M50 61c5 2 9 6 11 11-5-1-9-3-12-6v-5z"
        fill={mark}
      />
      <path d="M36 52c3-5 7-7 11-7-3 3-4 6-5 9h-6z" fill={mark} />
      <circle cx="42" cy="63" r="1.5" fill={voidFill} />
    </g>
  );
}
