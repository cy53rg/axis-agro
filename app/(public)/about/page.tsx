import type { Metadata } from "next";
import { Eye } from "lucide-react";

import { PageHero } from "@/components/pages/PageHero";
import { Button } from "@/components/ui/Button";
import { GoldBorderCard } from "@/components/ui/GoldBorderCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Axis Agro - our vision, mission, and approach to mixed livestock and poultry farming in Kaduna, Northern Nigeria.",
};

const MISSION_POINTS = [
  "Raise healthy, high-performing livestock through good nutrition, proper housing, and modern breeding techniques including AI.",
  "Deliver consistent quality through strict health and record-keeping practices.",
  "Train and support local farmers with practical knowledge.",
  "Grow profitably and sustainably by reducing waste and protecting animal welfare.",
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="About Axis Agro"
        subtitle="A livestock and poultry farm built on quality, care, and community."
        imageUrl="/about-hero.jpg"
        height="medium"
      />

      <section className="bg-white">
        <div className="mx-auto max-w-[760px] px-6 py-24">
          <SectionHeader eyebrow="Our Story" title="Who We Are" />

          <div className="mt-6 space-y-6 text-[17px] font-normal leading-[1.7] text-body-text">
            <p>
              Axis Agro is a mixed livestock and poultry farm based in Kaduna,
              Nigeria. We raise cattle, goats, ducks, chickens, and turkeys with
              a clear focus on producing healthy, high-performing animals for
              meat and dairy, while maintaining a strong breeding stock
              programme.
            </p>
            <p>
              Our approach combines good nutrition, proper housing, and modern
              breeding techniques — including artificial insemination — to ensure
              our animals are not just healthy but productive. We believe the
              quality of an animal starts long before it reaches the market.
            </p>
            <p>
              Beyond our own production, we actively support local farmers
              through practical training in livestock management, AI techniques,
              and farm record-keeping. Kaduna&apos;s agricultural community grows
              stronger when knowledge is shared.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cream py-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Our Direction"
            title="Vision & Mission"
            centered
          />

          <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2">
            <GoldBorderCard>
              <Eye
                className="h-8 w-8 text-forest"
                aria-hidden="true"
              />
              <h3 className="mt-4 font-display text-2xl font-bold text-navy">
                Our Vision
              </h3>
              <p className="mt-4 text-base font-normal leading-relaxed text-body-text">
                To be Kaduna&apos;s leading livestock farm for healthy breeding
                stock and sustainable meat and dairy production, setting the
                standard for quality, innovation, and trust in Northern Nigeria.
              </p>
            </GoldBorderCard>

            <GoldBorderCard>
              <h3 className="font-display text-2xl font-bold text-navy">
                Our Mission
              </h3>
              <ol className="mt-6 space-y-4">
                {MISSION_POINTS.map((point, index) => (
                  <li key={point} className="flex gap-4">
                    <span className="font-label text-xl font-bold text-forest">
                      {index + 1}.
                    </span>
                    <p className="text-base font-normal text-body-text">
                      {point}
                    </p>
                  </li>
                ))}
              </ol>
            </GoldBorderCard>
          </div>
        </div>
      </section>

      <section className="bg-navy py-20">
        <div className="mx-auto max-w-[700px] px-4 text-center sm:px-6">
          <h2 className="font-display text-4xl font-bold text-white">
            Discover Our Services
          </h2>
          <p className="mt-4 text-[17px] font-normal text-white/70">
            We offer livestock sales, poultry farming, artificial insemination
            services, and farmer training.
          </p>
          <div className="mt-10">
            <Button
              href="/what-we-do"
              size="lg"
              className="bg-white text-navy hover:bg-white/90"
            >
              See What We Do
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
