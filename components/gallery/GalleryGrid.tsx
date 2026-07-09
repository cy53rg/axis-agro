"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  GalleryFilterTabs,
  type GalleryFilter,
} from "@/components/gallery/GalleryFilterTabs";
import { GalleryImageGrid } from "@/components/gallery/GalleryImageGrid";
import type { GalleryImage } from "@/types";

interface GalleryGridProps {
  images: GalleryImage[];
}

function GalleryGridSkeleton() {
  return (
    <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="skeleton-pulse aspect-[4/3] rounded-card bg-navy/10"
        />
      ))}
    </div>
  );
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>("all");
  const [isFiltering, setIsFiltering] = useState(false);
  const isFirstFilterRender = useRef(true);

  const filteredImages = useMemo(() => {
    if (activeFilter === "all") {
      return images;
    }

    return images.filter((image) => image.category === activeFilter);
  }, [activeFilter, images]);

  useEffect(() => {
    if (isFirstFilterRender.current) {
      isFirstFilterRender.current = false;
      return;
    }

    setIsFiltering(true);
    const timer = window.setTimeout(() => setIsFiltering(false), 300);
    return () => window.clearTimeout(timer);
  }, [activeFilter]);

  return (
    <div>
      <GalleryFilterTabs
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {isFiltering ? (
        <GalleryGridSkeleton />
      ) : (
        <GalleryImageGrid images={filteredImages} />
      )}
    </div>
  );
}
