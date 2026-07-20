import type { Metadata } from "next";

import { QuoteCTA } from "@/components/home/QuoteCTA";
import { FadeIn } from "@/components/motion/FadeIn";
import { PageHero } from "@/components/pages/PageHero";
import { ServiceBlock } from "@/components/pages/ServiceBlock";

export const metadata: Metadata = {
  title: "What We Do",
  description:
    "Genetically enhanced cattle and goat breeding, poultry farming, artificial insemination, and farmer training from our Kaduna base, serving farms across Nigeria.",
};

export default function WhatWeDoPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title="What We Do"
        subtitle="From genetically enhanced livestock breeding to poultry farming and farmer training."
        imageUrl="/about-hero.jpg"
        height="medium"
      />

      <FadeIn>
        <ServiceBlock
          eyebrow="Cattle & Goats"
          title="Beef Production, Breeding & AI Services"
          description="Our cattle and goat operations focus on genetically enhanced breeding stock and beef production. Whether you need animals for your own farm or quality meat supply, we maintain strict health and nutrition standards for clients across Nigeria."
          keyPoints={[
            "Genetically enhanced breeding stock for cattle and goats",
            "Quality beef production",
            "Artificial insemination services",
            "Herd improvement consultations",
            "Sourcing of improved and enhanced breeds",
          ]}
          imageUrl="/cattle.jpg"
          imageAlt="Cattle and goats at JRN Agro LTD farm in Kaduna"
          imageOnLeft={true}
          bgColor="white"
          ctaText="Request a Quote"
          ctaHref="/get-a-quote"
        />
      </FadeIn>

      <FadeIn>
        <ServiceBlock
          eyebrow="Poultry"
          title="Broilers, Layers, Turkeys & Ducks"
          description="Our poultry operations produce a wide range of birds for meat and eggs. We maintain hygienic housing, proper vaccination schedules, and balanced feeding to deliver birds that are healthy and market ready."
          keyPoints={[
            "Broiler chickens for meat",
            "Layers for egg production",
            "Turkeys for meat supply",
            "Ducks for meat and eggs",
            "Supply to individuals, restaurants, and markets nationwide",
          ]}
          imageUrl="/about-farm.jpg"
          imageAlt="Poultry farming at JRN Agro LTD"
          imageOnLeft={false}
          bgColor="cream"
          ctaText="Request a Quote"
          ctaHref="/get-a-quote"
        />
      </FadeIn>

      <FadeIn>
        <ServiceBlock
          eyebrow="Farmer Support"
          title="Training & Support for Farmers Nationwide"
          description="We believe in sharing knowledge. Our practical training programmes help small and medium scale farmers across Nigeria improve their operations, from basic livestock management to advanced AI and genetic improvement techniques."
          keyPoints={[
            "Practical livestock management training",
            "Artificial insemination technique training",
            "Farm record keeping and business management",
            "On farm advisory visits",
            "Support for small and medium scale farmers",
          ]}
          imageUrl="/hero-farm.jpg"
          imageAlt="Farmer training session at JRN Agro LTD"
          imageOnLeft={true}
          bgColor="white"
          ctaText="Get in Touch"
          ctaHref="/contact"
        />
      </FadeIn>

      <FadeIn>
        <QuoteCTA />
      </FadeIn>
    </>
  );
}
