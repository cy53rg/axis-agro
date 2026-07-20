import { ChevronDown } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface HeroSectionProps {
  imageUrl?: string;
}

export function HeroSection({
  imageUrl = "/hero-farm.jpg",
}: HeroSectionProps) {
  return (
    <section className="relative h-[65vh] min-h-[420px] w-full overflow-hidden md:h-[90vh]">
      <Image
        src={imageUrl}
        alt="Cattle and poultry grazing at JRN Agro LTD livestock farm in Kaduna, Nigeria"
        fill
        priority
        loading="eager"
        className="object-cover"
        sizes="100vw"
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(27,46,60,0.85) 0%, rgba(27,46,60,0.4) 60%, transparent 100%)",
        }}
      />

      <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-10 sm:px-8 md:pb-20 md:pl-20 md:pr-10">
        <Eyebrow color="gold">Kaduna, Nigeria</Eyebrow>

        <h1 className="mt-3 max-w-[700px] font-display text-[2rem] font-bold leading-[1.1] text-white sm:text-[2.375rem] md:text-[3.75rem]">
          Quality Livestock. Built on Trust.
        </h1>

        <p className="mt-4 max-w-[580px] text-sm font-normal leading-relaxed text-white/85 sm:mt-5 sm:text-base md:text-lg">
          JRN Agro Limited is Kaduna&apos;s mixed livestock and poultry farm —
          specialising in healthy breeding stock, quality meat production, and
          artificial insemination services.
        </p>

        <div className="mt-7 flex w-full max-w-md flex-col gap-3 sm:mt-9 sm:max-w-none sm:flex-row sm:flex-wrap">
          <Button
            href="/get-a-quote"
            variant="primary"
            size="lg"
            className="w-full min-h-11 justify-center sm:w-auto"
          >
            Get a Quote →
          </Button>
          <Button
            href="/gallery"
            variant="outline"
            size="lg"
            className="w-full min-h-11 justify-center border-white text-white hover:bg-white/10 sm:w-auto"
          >
            View Our Farm
          </Button>
        </div>
      </div>

      <ChevronDown
        className="absolute bottom-6 left-1/2 hidden h-8 w-8 -translate-x-1/2 animate-bounce text-white sm:bottom-8 sm:block"
        aria-hidden="true"
      />
    </section>
  );
}
