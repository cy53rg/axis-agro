import type { Metadata } from "next";

import { AboutSnapshot } from "@/components/home/AboutSnapshot";
import { GalleryStrip } from "@/components/home/GalleryStrip";
import { HeroSection } from "@/components/home/HeroSection";
import { QuoteCTA } from "@/components/home/QuoteCTA";
import { ServicesCards } from "@/components/home/ServicesCards";
import { StatsBar } from "@/components/home/StatsBar";
import { WhyAxisAgro } from "@/components/home/WhyAxisAgro";
import { getFeaturedGalleryImages } from "@/lib/supabase/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: {
    absolute: "Axis Agro | Quality Livestock Farm in Kaduna, Nigeria",
  },
  description:
    "Axis Agro is a mixed livestock and poultry farm in Kaduna, Nigeria. We raise cattle, goats, chickens, turkeys and ducks. AI services and farmer training available.",
};

export default async function HomePage() {
  const featuredImages = await getFeaturedGalleryImages(6);

  return (
    <>
      {/* TODO: Replace hero and about imageUrl with actual client photos */}
      <HeroSection imageUrl="/images/hero-farm.jpg" />
      <StatsBar />
      <AboutSnapshot imageUrl="/images/about-farm.jpg" />
      <ServicesCards />
      <GalleryStrip images={featuredImages} />
      <WhyAxisAgro />
      <QuoteCTA />
    </>
  );
}
