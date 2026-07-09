import type { Metadata } from "next";

import { PageHero } from "@/components/pages/PageHero";
import { ServiceBlock } from "@/components/pages/ServiceBlock";
import { QuoteCTA } from "@/components/home/QuoteCTA";

export const metadata: Metadata = {
  title: "What We Do - Services",
  description:
    "Cattle breeding, goat farming, broilers, layers, turkeys, ducks, and artificial insemination services. Based in Kaduna, Nigeria.",
};

export default function WhatWeDoPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title="What We Do"
        subtitle="From livestock breeding to poultry farming and farmer training."
        imageUrl="/images/what-we-do-hero.jpg"
        height="medium"
      />

      <ServiceBlock
        eyebrow="Cattle & Goats"
        title="Beef Production, Breeding & AI Services"
        description="Our cattle and goat operations focus on quality breeding stock and beef production. Whether you need animals for your own farm or quality meat supply, we maintain strict health and nutrition standards throughout."
        keyPoints={[
          "Breeding stock sales — cattle and goats",
          "Quality beef production",
          "Artificial insemination services",
          "Herd improvement consultations",
          "Sourcing of quality breeds",
        ]}
        imageUrl="/images/cattle.jpg"
        imageAlt="Cattle and goats at Axis Agro farm in Kaduna"
        imageOnLeft={true}
        bgColor="white"
        ctaText="Request a Quote"
        ctaHref="/get-a-quote"
      />

      <ServiceBlock
        eyebrow="Poultry"
        title="Broilers, Layers, Turkeys & Ducks"
        description="Our poultry operations produce a wide range of birds for meat and eggs. We maintain hygienic housing, proper vaccination schedules, and balanced feeding to deliver birds that are healthy and market-ready."
        keyPoints={[
          "Broiler chickens for meat",
          "Layers for egg production",
          "Turkeys for meat supply",
          "Ducks for meat and eggs",
          "Supply to individuals, restaurants, and markets",
        ]}
        imageUrl="/images/poultry.jpg"
        imageAlt="Poultry farming at Axis Agro"
        imageOnLeft={false}
        bgColor="cream"
        ctaText="Request a Quote"
        ctaHref="/get-a-quote"
      />

      <ServiceBlock
        eyebrow="Farmer Support"
        title="Training & Support for Local Farmers"
        description="We believe in sharing knowledge. Our practical training programmes help small and medium-scale farmers in Kaduna improve their operations — from basic livestock management to advanced AI techniques."
        keyPoints={[
          "Practical livestock management training",
          "Artificial insemination technique training",
          "Farm record-keeping and business management",
          "On-farm advisory visits",
          "Support for small and medium-scale farmers",
        ]}
        imageUrl="/images/training.jpg"
        imageAlt="Farmer training session at Axis Agro"
        imageOnLeft={true}
        bgColor="white"
        ctaText="Get in Touch"
        ctaHref="/contact"
      />

      <QuoteCTA />
    </>
  );
}
