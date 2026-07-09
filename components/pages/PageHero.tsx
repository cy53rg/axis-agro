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
  tall: "h-[55vh]",
  medium: "h-[45vh]",
  short: "h-[35vh]",
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
    imageAlt ?? `${title} at Axis Agro livestock farm in Kaduna, Nigeria`;

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden",
        heightClasses[height]
      )}
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
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <Eyebrow color="gold">{eyebrow}</Eyebrow>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight text-white md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-[17px] font-normal text-white/80">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
