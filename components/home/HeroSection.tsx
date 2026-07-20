import Image from "next/image";

import { HeroAnimalSearch } from "@/components/home/HeroAnimalSearch";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface HeroSectionProps {
  imageUrl?: string;
}

export function HeroSection({
  imageUrl = "/hero-farm.jpg",
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden sm:min-h-[640px] md:min-h-[720px]">
      <div className="hero-bg-motion absolute -inset-[5%]">
        <Image
          src={imageUrl}
          alt="Cattle and poultry grazing at JRN Agro LTD livestock farm in Kaduna, Nigeria"
          fill
          priority
          loading="eager"
          className="object-cover object-center"
          sizes="110vw"
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(27,46,60,0.92) 0%, rgba(27,46,60,0.55) 42%, rgba(27,46,60,0.28) 68%, rgba(27,46,60,0.12) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex h-full min-h-[100svh] max-w-4xl flex-col items-center justify-end px-5 pb-12 pt-28 text-center sm:min-h-[640px] sm:px-8 sm:pb-14 sm:pt-32 md:min-h-[720px] md:pb-20 md:pt-36">
        <Eyebrow color="gold">Kaduna, Nigeria</Eyebrow>

        <h1 className="mt-3 max-w-[18ch] font-display text-[2rem] font-bold leading-[1.1] text-white sm:max-w-none sm:text-[2.5rem] md:text-[3.75rem]">
          Quality Livestock. Built on Trust.
        </h1>

        <p className="mt-4 max-w-[36rem] text-sm font-normal leading-relaxed text-white/85 sm:mt-5 sm:text-base md:text-lg">
          JRN Agro Limited is Kaduna&apos;s mixed livestock and poultry farm,
          specialising in genetically enhanced breeding stock, quality meat
          production, and artificial insemination services for farms across
          Nigeria.
        </p>

        <HeroAnimalSearch className="mt-7 w-full sm:mt-8" />

        <div className="mt-5 flex w-full max-w-lg flex-col items-stretch justify-center gap-3 sm:mt-6 sm:max-w-none sm:flex-row sm:flex-wrap">
          <Button
            href="/get-a-quote"
            variant="primary"
            size="lg"
            className="w-full justify-center sm:w-auto"
          >
            Get a Quote
          </Button>
          <Button
            href="/gallery"
            variant="outline"
            size="lg"
            className="w-full justify-center border-white text-white hover:bg-white/10 sm:w-auto"
          >
            View Our Farm
          </Button>
        </div>
      </div>
    </section>
  );
}
