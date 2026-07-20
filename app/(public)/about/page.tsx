import type { Metadata } from "next";
import Image from "next/image";
import { Eye } from "lucide-react";

import { PageHero } from "@/components/pages/PageHero";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/Button";
import { GoldBorderCard } from "@/components/ui/GoldBorderCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  SITE_COMPLIANCE,
  SITE_NAME,
  SITE_NAME_FORMAL,
} from "@/constants/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${SITE_NAME_FORMAL}, our vision, mission, CAC registration, and genetically enhanced livestock programmes serving farms across Nigeria.`,
};

const MISSION_POINTS = [
  "Raise healthy, high performing, genetically enhanced livestock through good nutrition, proper housing, and modern breeding techniques including AI.",
  "Deliver consistent quality through strict health and record keeping practices.",
  "Train and support farmers nationwide with practical knowledge.",
  "Grow profitably and sustainably by reducing waste and protecting animal welfare.",
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title={`About ${SITE_NAME}`}
        subtitle="A livestock and poultry farm built on quality, care, and community."
        imageUrl="/about-hero.jpg"
        height="medium"
      />

      <FadeIn>
        <section className="bg-white">
          <div className="mx-auto max-w-[760px] px-6 py-24">
            <SectionHeader eyebrow="Our Story" title="Who We Are" />

            <div className="mt-6 space-y-6 text-[17px] font-normal leading-[1.7] text-body-text">
              <p>
                {SITE_NAME_FORMAL} is a mixed livestock and poultry farm based in
                Kaduna, Nigeria. We raise cattle, goats, ducks, chickens, and
                turkeys with a clear focus on producing healthy, genetically
                enhanced animals for meat and dairy, while maintaining a strong
                breeding stock programme that serves farms across Nigeria.
              </p>
              <p>
                Our approach combines good nutrition, proper housing, and modern
                breeding techniques, including artificial insemination, to ensure
                our animals are not just healthy but productive. We believe the
                quality of an animal starts long before it reaches the market.
              </p>
              <p>
                Beyond our own production, we actively support farmers through
                practical training in livestock management, AI techniques, and
                farm record keeping. Nigeria&apos;s agricultural community grows
                stronger when knowledge is shared.
              </p>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="bg-cream py-24">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Our Direction"
              title="Vision & Mission"
              centered
            />

            <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2">
              <FadeIn delay={0.05}>
                <GoldBorderCard>
                  <Eye className="h-8 w-8 text-forest" aria-hidden="true" />
                  <h3 className="mt-4 font-display text-2xl font-bold text-navy">
                    Our Vision
                  </h3>
                  <p className="mt-4 text-base font-normal leading-relaxed text-body-text">
                    To be Nigeria&apos;s trusted livestock partner for genetically
                    enhanced breeding stock and sustainable meat and dairy
                    production, setting the standard for quality, innovation, and
                    trust nationwide.
                  </p>
                </GoldBorderCard>
              </FadeIn>

              <FadeIn delay={0.1}>
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
              </FadeIn>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="bg-white py-24" id="corporate-compliance">
          <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Corporate Compliance"
              title="Registered with the Corporate Affairs Commission"
              centered
            />
            <p className="mx-auto mt-4 max-w-2xl text-center text-[17px] font-normal text-body-text">
              {SITE_COMPLIANCE.legalName} is a private company limited by shares,
              incorporated under the {SITE_COMPLIANCE.incorporatedUnder}. Official
              registration number:{" "}
              <span className="font-semibold text-navy">
                RC {SITE_COMPLIANCE.rcNumber}
              </span>
              .
            </p>

            <div className="mt-12 overflow-hidden rounded-card border border-[#E2E8F0] bg-cream/40 p-4 shadow-[0_2px_16px_rgba(0,0,0,0.06)] sm:p-6">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-xl">
                <Image
                  src={SITE_COMPLIANCE.certificatePath}
                  alt={`${SITE_NAME} Certificate of Incorporation, RC ${SITE_COMPLIANCE.rcNumber}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 576px"
                />
              </div>
              <dl className="mx-auto mt-6 grid max-w-xl gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                    Legal name
                  </dt>
                  <dd className="mt-1 font-medium text-navy">
                    {SITE_COMPLIANCE.legalName}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                    RC number
                  </dt>
                  <dd className="mt-1 font-medium text-navy">
                    RC {SITE_COMPLIANCE.rcNumber}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="bg-navy py-20">
          <div className="mx-auto max-w-[700px] px-4 text-center sm:px-6">
            <h2 className="font-display text-4xl font-bold text-white">
              Discover Our Services
            </h2>
            <p className="mt-4 text-[17px] font-normal text-white/70">
              We offer genetically enhanced livestock sales, poultry farming,
              artificial insemination services, and farmer training across Nigeria.
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
      </FadeIn>
    </>
  );
}
