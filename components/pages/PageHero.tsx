import Image from "next/image";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

type PageHeroHeight = "tall" | "medium" | "short";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt?: string;
  height?: PageHeroHeight;
}

const heightClasses: Record<PageHeroHeight, string> = {
  tall: "min-h-[280px] h-[50vh] sm:h-[55vh]",
  medium: "min-h-[240px] h-[40vh] sm:h-[45vh]",
  short: "min-h-[200px] h-[32vh] sm:h-[35vh]",
};

export function PageHero({
  eyebrow,
  title,
  subtitle,
  imageUrl,
  imageAlt,
  height = "medium",
}: PageHeroProps) {
  const alt =
    imageAlt ?? `${title} at JRN Agro LTD livestock farm in Kaduna, Nigeria`;

  return (
    <section
      className={cn("relative w-full overflow-hidden", heightClasses[height])}
    >
      <Image
        src={imageUrl}
        alt={alt}
        fill
        loading="lazy"
        className="object-cover"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-navy/60" />

      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <Eyebrow color="gold">{eyebrow}</Eyebrow>
          <h1 className="mt-2 max-w-3xl font-display text-[1.75rem] font-bold leading-tight text-white sm:mt-3 sm:text-4xl md:text-5xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-normal leading-relaxed text-white/85 sm:mt-4 sm:text-base md:text-[17px]">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
