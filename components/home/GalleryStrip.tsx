import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { GalleryImage } from "@/types";

interface GalleryStripProps {
  images: GalleryImage[];
}

function getGalleryImageAlt(image: GalleryImage) {
  if (image.caption) {
    return image.caption;
  }

  return `${image.category} photo from Axis Agro farm in Kaduna, Nigeria`;
}

function GalleryItem({ image }: { image: GalleryImage }) {
  return (
    <Link
      href="/gallery"
      className="group relative block aspect-[4/3] cursor-pointer overflow-hidden rounded-card"
    >
      <Image
        src={image.url}
        alt={getGalleryImageAlt(image)}
        fill
        quality={80}
        loading="lazy"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      <div className="absolute inset-0 flex items-end bg-navy/0 p-4 opacity-0 transition-all duration-300 group-hover:bg-navy/60 group-hover:opacity-100">
        {image.caption ? (
          <p className="text-sm font-normal text-white">{image.caption}</p>
        ) : null}
      </div>
    </Link>
  );
}

function EmptyGalleryGrid() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="aspect-[4/3] rounded-card bg-divider"
            aria-hidden="true"
          />
        ))}
      </div>
      <p className="mt-6 text-center text-muted">Photos coming soon</p>
    </div>
  );
}

export function GalleryStrip({ images }: GalleryStripProps) {
  const displayImages = images.slice(0, 6);
  const hasImages = displayImages.length > 0;

  return (
    <section className="bg-cream py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Our Farm"
          title="See What We Do"
          centered
        />

        <div className="mt-12">
          {hasImages ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {displayImages.map((image) => (
                <GalleryItem key={image.id} image={image} />
              ))}
            </div>
          ) : (
            <EmptyGalleryGrid />
          )}
        </div>

        <div className="mt-12 text-center">
          <Button href="/gallery" variant="outline" size="lg">
            View Full Gallery
          </Button>
        </div>
      </div>
    </section>
  );
}
