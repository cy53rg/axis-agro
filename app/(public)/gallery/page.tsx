import type { Metadata } from "next";

import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { PageHero } from "@/components/pages/PageHero";
import { Button } from "@/components/ui/Button";
import { getGalleryImages } from "@/lib/supabase/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Our Farm Gallery",
  description:
    "Photos from Axis Agro farm - our cattle, goats, poultry operations and farm facilities in Kaduna, Nigeria.",
};

export default async function GalleryPage() {
  const images = await getGalleryImages();

  const farmLat = process.env.NEXT_PUBLIC_FARM_LAT;
  const farmLng = process.env.NEXT_PUBLIC_FARM_LNG;
  const directionsHref = `https://maps.google.com?q=${farmLat},${farmLng}`;

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Our Farm"
        subtitle="Photos from our livestock and poultry operations in Kaduna."
        imageUrl="/images/gallery-hero.jpg"
        height="short"
      />

      <section className="bg-cream py-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <GalleryGrid images={images} />
        </div>
      </section>

      <section className="bg-navy py-20">
        <div className="mx-auto max-w-[700px] px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
            Want to visit the farm? Get in touch.
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              href="/contact"
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              Contact Us
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
    </>
  );
}
