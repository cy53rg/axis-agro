import Image from "next/image";

import type { GalleryImage } from "@/types";

interface GalleryImageGridProps {
  images: GalleryImage[];
}

function getGalleryImageAlt(image: GalleryImage) {
  if (image.caption) {
    return image.caption;
  }

  return `${image.category} photo from JRN Agro LTD farm in Kaduna, Nigeria`;
}

export function GalleryImageGrid({ images }: GalleryImageGridProps) {
  if (images.length === 0) {
    return (
      <p className="mt-12 text-center text-muted">
        No photos in this category yet.
      </p>
    );
  }

  return (
    <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {images.map((image) => (
        <div
          key={image.id}
          className="group relative aspect-[4/3] overflow-hidden rounded-card"
        >
          <Image
            src={image.url}
            alt={getGalleryImageAlt(image)}
            fill
            quality={80}
            loading="lazy"
            className="object-cover transition-transform duration-[400ms] group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {image.caption ? (
            <div className="absolute inset-x-0 bottom-0 translate-y-full bg-navy/75 p-3 transition-transform duration-300 group-hover:translate-y-0">
              <p className="text-[13px] font-normal text-white">
                {image.caption}
              </p>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
