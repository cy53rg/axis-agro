import type { Metadata } from "next";

import { AboutSnapshot } from "@/components/home/AboutSnapshot";
import { GalleryStrip } from "@/components/home/GalleryStrip";
import { HeroSection } from "@/components/home/HeroSection";
import { QuoteCTA } from "@/components/home/QuoteCTA";
import { ServicesCards } from "@/components/home/ServicesCards";
import { StatsBar } from "@/components/home/StatsBar";
import { WhyJrnAgro } from "@/components/home/WhyJrnAgro";
import { getFeaturedGalleryImages } from "@/lib/supabase/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: {
    absolute: "JRN Agro LTD | Quality Livestock Farm in Kaduna, Nigeria",
  },
  description:
    "JRN Agro Limited is a mixed livestock and poultry farm in Kaduna, Nigeria. We raise cattle, goats, chickens, turkeys and ducks. AI services and farmer training available.",
};

export default async function HomePage() {
  const featuredImages = await getFeaturedGalleryImages(6);

  return (
    <>
      <HeroSection imageUrl="/hero-farm.jpg" />
      <StatsBar />
      <AboutSnapshot imageUrl="/about-farm.jpg" />
      <ServicesCards />
      <GalleryStrip images={featuredImages} />
      <WhyJrnAgro />
      <QuoteCTA />
    </>
  );
}
