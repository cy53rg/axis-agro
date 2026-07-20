import type { Metadata } from "next";

import { AnimalsGrid } from "@/components/animals/AnimalsGrid";
import { FadeIn } from "@/components/motion/FadeIn";
import { PageHero } from "@/components/pages/PageHero";
import { Button } from "@/components/ui/Button";
import { getPublicAnimals } from "@/lib/supabase/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Our Animals",
  description:
    "Browse active JRN Agro LTD livestock by species, breed, or tag number — cattle, goats, and poultry in Kaduna, Nigeria.",
};

export default async function AnimalsPage() {
  const animals = await getPublicAnimals();

  const farmLat = process.env.NEXT_PUBLIC_FARM_LAT;
  const farmLng = process.env.NEXT_PUBLIC_FARM_LNG;
  const directionsHref = `https://maps.google.com?q=${farmLat},${farmLng}`;

  return (
    <>
      <PageHero
        eyebrow="Livestock"
        title="Our Animals"
        subtitle="Healthy cattle, goats, and poultry from our Kaduna farm — see who’s on the ground."
        imageUrl="/cattle.jpg"
        height="short"
      />

      <section className="bg-cream py-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <AnimalsGrid animals={animals} />
          </FadeIn>
        </div>
      </section>

      <FadeIn>
        <section className="bg-navy py-20">
          <div className="mx-auto max-w-[700px] px-4 text-center sm:px-6">
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
              Interested in an animal? Request a quote.
            </h2>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button
                href="/get-a-quote"
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                Get a Quote
              </Button>
              <a
                href={directionsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-btn bg-gold px-6 py-3 font-label text-base font-semibold text-white transition-colors hover:bg-gold/90"
              >
                Get Directions
              </a>
            </div>
          </div>
        </section>
      </FadeIn>
    </>
  );
}
