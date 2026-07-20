import type { Metadata } from "next";

import { AboutSnapshot } from "@/components/home/AboutSnapshot";
import { GalleryStrip } from "@/components/home/GalleryStrip";
import { HeroSection } from "@/components/home/HeroSection";
import { QuoteCTA } from "@/components/home/QuoteCTA";
import { ServicesCards } from "@/components/home/ServicesCards";
import { StatsBar } from "@/components/home/StatsBar";
import { WhyJrnAgro } from "@/components/home/WhyJrnAgro";
import { FadeIn } from "@/components/motion/FadeIn";
import { getFeaturedGalleryImages } from "@/lib/supabase/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: {
    absolute: "JRN Agro LTD | Quality Livestock Farm in Kaduna, Nigeria",
  },
  description:
    "JRN Agro Limited is a mixed livestock and poultry farm in Kaduna, Nigeria. We raise genetically enhanced cattle, goats, chickens, turkeys and ducks, with AI services and farmer training for farms across Nigeria.",
};

export default async function HomePage() {
  const featuredImages = await getFeaturedGalleryImages(6);

  return (
    <>
      <HeroSection imageUrl="/hero-farm.jpg" />
      <FadeIn>
        <StatsBar />
      </FadeIn>
      <FadeIn>
        <AboutSnapshot imageUrl="/about-farm.jpg" />
      </FadeIn>
      <FadeIn>
        <ServicesCards />
      </FadeIn>
      <FadeIn>
        <GalleryStrip images={featuredImages} />
      </FadeIn>
      <FadeIn>
        <WhyJrnAgro />
      </FadeIn>
      <FadeIn>
        <QuoteCTA />
      </FadeIn>
    </>
  );
}
