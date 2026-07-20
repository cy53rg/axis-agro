import { ArrowRight, Beef, Bird, GraduationCap } from "lucide-react";
import Link from "next/link";

import { FadeIn } from "@/components/motion/FadeIn";
import { GoldBorderCard } from "@/components/ui/GoldBorderCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

const SERVICES = [
  {
    icon: Beef,
    title: "Cattle & Goats",
    body: "We breed and supply high-quality cattle and goats for beef production and breeding purposes. Our AI services improve herd genetics for better productivity.",
    href: "/what-we-do",
  },
  {
    icon: Bird,
    title: "Poultry Farming",
    body: "Broilers, layers, turkeys, and ducks — raised for quality meat and eggs. We supply individuals, restaurants, and commercial buyers with fresh poultry produce.",
    href: "/what-we-do",
  },
  {
    icon: GraduationCap,
    title: "Farmer Training & Support",
    body: "We train small and medium-scale farmers in practical livestock management, AI techniques, and farm record-keeping to improve their operations.",
    href: "/what-we-do",
  },
] as const;

export function ServicesCards() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="What We Do"
          title="Our Core Services"
          centered
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 sm:gap-8 md:grid-cols-3">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;

            return (
              <FadeIn key={service.title} delay={index * 0.05}>
                <GoldBorderCard className="flex h-full flex-col">
                  <Icon
                    className="h-9 w-9 text-forest"
                    aria-hidden="true"
                  />
                  <h3 className="mt-4 font-display text-2xl font-normal text-navy">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-[15px] font-normal leading-relaxed text-muted">
                    {service.body}
                  </p>
                  <Link
                    href={service.href}
                    className="mt-auto inline-flex items-center gap-1 pt-6 font-label text-[13px] font-semibold text-forest transition-colors hover:underline"
                  >
                    Learn more
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </GoldBorderCard>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
