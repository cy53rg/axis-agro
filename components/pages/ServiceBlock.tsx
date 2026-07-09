import { CheckCircle } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

interface ServiceBlockProps {
  eyebrow: string;
  title: string;
  description: string;
  keyPoints: string[];
  imageUrl: string;
  imageAlt: string;
  imageOnLeft: boolean;
  ctaText: string;
  ctaHref: string;
  bgColor: "white" | "cream";
}

export function ServiceBlock({
  eyebrow,
  title,
  description,
  keyPoints,
  imageUrl,
  imageAlt,
  imageOnLeft,
  ctaText,
  ctaHref,
  bgColor,
}: ServiceBlockProps) {
  return (
    <section
      className={cn(
        "section-padding",
        bgColor === "white" ? "bg-white" : "bg-cream"
      )}
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 md:gap-12 lg:grid-cols-2 lg:gap-20">
          <div
            className={cn(
              "relative order-1 aspect-[4/3] overflow-hidden rounded-card shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
              !imageOnLeft && "lg:order-2"
            )}
          >
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              loading="lazy"
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div
            className={cn("order-2", !imageOnLeft && "lg:order-1")}
          >
            <SectionHeader eyebrow={eyebrow} title={title} />

            <p className="mt-5 text-[17px] font-normal leading-relaxed text-body-text">
              {description}
            </p>

            <ul className="mt-7 space-y-3">
              {keyPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle
                    className="mt-0.5 h-5 w-5 shrink-0 text-forest"
                    aria-hidden="true"
                  />
                  <span className="text-base font-normal text-body-text">
                    {point}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-9">
              <Button href={ctaHref} variant="primary">
                {ctaText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
