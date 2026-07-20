"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import type { PublicAnimal } from "@/lib/supabase/queries";
import { formatAnimalAge } from "@/lib/animals/age";
import { ANIMAL_SPECIES } from "@/lib/validations/animal";
import { cn } from "@/lib/utils";

type SpeciesFilter = "all" | (typeof ANIMAL_SPECIES)[number];
type StatusFilter = "all" | "active" | "sold";

const SPECIES_FILTERS: { label: string; value: SpeciesFilter }[] = [
  { label: "All", value: "all" },
  ...ANIMAL_SPECIES.map((species) => ({
    label: species,
    value: species,
  })),
];

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Sold", value: "sold" },
];

interface AnimalsGridProps {
  animals: PublicAnimal[];
}

function AnimalsGridSkeleton() {
  return (
    <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="skeleton-pulse overflow-hidden rounded-card bg-navy/10"
        >
          <div className="aspect-[4/3]" />
          <div className="h-28 bg-navy/5" />
        </div>
      ))}
    </div>
  );
}

function getStatusBadge(status: PublicAnimal["status"]) {
  if (status === "sold") {
    return {
      label: "Sold",
      className: "bg-gray-100 text-gray-700",
    };
  }

  return {
    label: "Active",
    className: "bg-green-100 text-green-800",
  };
}

export function AnimalsGrid({ animals }: AnimalsGridProps) {
  const [speciesFilter, setSpeciesFilter] = useState<SpeciesFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const isFirstFilterRender = useRef(true);

  const filteredAnimals = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return animals.filter((animal) => {
      const matchesSpecies =
        speciesFilter === "all" || animal.species === speciesFilter;
      const matchesStatus =
        statusFilter === "all" || animal.status === statusFilter;
      const matchesSearch =
        !query ||
        animal.tag_number?.toLowerCase().includes(query) ||
        animal.name?.toLowerCase().includes(query);

      return matchesSpecies && matchesStatus && matchesSearch;
    });
  }, [animals, searchQuery, speciesFilter, statusFilter]);

  useEffect(() => {
    if (isFirstFilterRender.current) {
      isFirstFilterRender.current = false;
      return;
    }

    setIsFiltering(true);
    const timer = window.setTimeout(() => setIsFiltering(false), 300);
    return () => window.clearTimeout(timer);
  }, [speciesFilter, statusFilter, searchQuery]);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-3">
        {SPECIES_FILTERS.map((filter) => {
          const isActive = speciesFilter === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => setSpeciesFilter(filter.value)}
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

      <div className="mx-auto mt-6 flex max-w-3xl flex-col gap-3 sm:flex-row">
        <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
          {STATUS_FILTERS.map((filter) => {
            const isActive = statusFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setStatusFilter(filter.value)}
                className={cn(
                  "min-h-11 rounded-full px-4 py-2 font-label text-[13px] font-semibold transition-colors",
                  isActive
                    ? "bg-navy text-white"
                    : "border border-navy/20 bg-transparent text-navy hover:border-navy hover:bg-navy/5"
                )}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search by tag number or name..."
          className="min-h-11 w-full flex-1 rounded-btn border border-forest/20 bg-white px-4 py-3 text-sm text-body-text transition-colors focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
        />
      </div>

      {isFiltering ? (
        <AnimalsGridSkeleton />
      ) : filteredAnimals.length === 0 ? (
        <p className="mt-12 text-center text-muted">
          {animals.length === 0
            ? "No animals to show yet. Check back soon."
            : "No animals match your filters."}
        </p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAnimals.map((animal) => {
            const badge = getStatusBadge(animal.status);
            const displayName = animal.name?.trim() || animal.tag_number;
            const imageSrc = animal.photo_url || "/cattle.jpg";

            return (
              <Link
                key={animal.id}
                href={`/animals/${encodeURIComponent(animal.tag_number)}`}
                className="group overflow-hidden rounded-card bg-white shadow-[0_2px_16px_rgba(0,0,0,0.07)] transition-shadow hover:shadow-[0_4px_24px_rgba(0,0,0,0.1)]"
              >
                <article>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={imageSrc}
                    alt={`${displayName} — ${animal.species} at JRN Agro LTD farm in Kaduna`}
                    fill
                    quality={80}
                    loading="lazy"
                    className="object-cover transition-transform duration-[400ms] group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <span
                    className={cn(
                      "absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold",
                      badge.className
                    )}
                  >
                    {badge.label}
                  </span>
                </div>

                <div className="space-y-2 p-4">
                  <div>
                    <h3 className="font-label text-base font-semibold text-navy">
                      {displayName}
                    </h3>
                    <p className="mt-0.5 text-sm text-muted">
                      Tag {animal.tag_number}
                    </p>
                  </div>

                  <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                    <div>
                      <dt className="text-xs font-medium text-muted">Species</dt>
                      <dd className="text-body-text">{animal.species}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-muted">Breed</dt>
                      <dd className="text-body-text">
                        {animal.breed?.trim() || "—"}
                      </dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-xs font-medium text-muted">Age</dt>
                      <dd className="text-body-text">
                        {formatAnimalAge(animal.date_of_birth)}
                      </dd>
                    </div>
                  </dl>
                </div>
                </article>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
