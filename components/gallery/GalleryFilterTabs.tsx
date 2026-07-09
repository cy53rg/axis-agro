"use client";

import type { GalleryCategory } from "@/types";

import { cn } from "@/lib/utils";

export type GalleryFilter = "all" | GalleryCategory;

export const GALLERY_FILTERS: { label: string; value: GalleryFilter }[] = [
  { label: "All", value: "all" },
  { label: "Cattle & Goats", value: "Cattle & Goats" },
  { label: "Poultry", value: "Poultry" },
  { label: "Farm Facilities", value: "Farm Facilities" },
  { label: "General", value: "General" },
];

interface GalleryFilterTabsProps {
  activeFilter: GalleryFilter;
  onFilterChange: (filter: GalleryFilter) => void;
}

export function GalleryFilterTabs({
  activeFilter,
  onFilterChange,
}: GalleryFilterTabsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {GALLERY_FILTERS.map((filter) => {
        const isActive = activeFilter === filter.value;

        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onFilterChange(filter.value)}
            className={cn(
              "min-h-11 rounded-full px-5 py-2 font-label text-[13px] font-semibold transition-colors",
              isActive
                ? "bg-forest text-white"
                : "border border-forest/30 bg-transparent text-navy hover:border-forest hover:text-forest"
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
