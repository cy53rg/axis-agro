"use client";

import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { FadeIn } from "@/components/motion/FadeIn";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatAnimalAge } from "@/lib/animals/age";
import type { PublicAnimal } from "@/lib/supabase/queries";
import { ANIMAL_SPECIES } from "@/lib/validations/animal";
import { cn } from "@/lib/utils";

type SpeciesFilter = "all" | string;
type BreedFilter = "all" | string;
type StatusFilter = "all" | "active";

interface AnimalsGridProps {
  animals: PublicAnimal[];
}

function AnimalsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card
          key={index}
          className="overflow-hidden border-0 bg-white py-0 shadow-sm ring-1 ring-black/5"
        >
          <div className="skeleton-pulse aspect-[4/3] bg-navy/10" />
          <CardContent className="space-y-3 px-4 py-4">
            <div className="skeleton-pulse h-4 w-2/3 rounded bg-navy/10" />
            <div className="skeleton-pulse h-3 w-1/3 rounded bg-navy/10" />
            <div className="skeleton-pulse h-16 w-full rounded bg-navy/5" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function AnimalsGrid({ animals }: AnimalsGridProps) {
  const [speciesFilter, setSpeciesFilter] = useState<SpeciesFilter>("all");
  const [breedFilter, setBreedFilter] = useState<BreedFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");
  const [tagQuery, setTagQuery] = useState("");
  const [debouncedTagQuery, setDebouncedTagQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsSearching(true);
    const timer = window.setTimeout(() => {
      setDebouncedTagQuery(tagQuery.trim().toLowerCase());
      setIsSearching(false);
    }, 200);

    return () => window.clearTimeout(timer);
  }, [tagQuery]);

  const speciesOptions = useMemo(() => {
    const fromData = Array.from(
      new Set(
        animals
          .map((animal) => animal.species?.trim())
          .filter((species): species is string => Boolean(species))
      )
    ).sort((a, b) => a.localeCompare(b));

    return fromData.length > 0 ? fromData : [...ANIMAL_SPECIES];
  }, [animals]);

  const breedOptions = useMemo(() => {
    const scoped =
      speciesFilter === "all"
        ? animals
        : animals.filter((animal) => animal.species === speciesFilter);

    return Array.from(
      new Set(
        scoped
          .map((animal) => animal.breed?.trim())
          .filter((breed): breed is string => Boolean(breed))
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [animals, speciesFilter]);

  useEffect(() => {
    if (breedFilter !== "all" && !breedOptions.includes(breedFilter)) {
      setBreedFilter("all");
    }
  }, [breedFilter, breedOptions]);

  const filteredAnimals = useMemo(() => {
    return animals.filter((animal) => {
      const matchesSpecies =
        speciesFilter === "all" || animal.species === speciesFilter;
      const matchesBreed =
        breedFilter === "all" || animal.breed?.trim() === breedFilter;
      // Public directory only lists active animals; status filter stays evaluator-facing.
      const matchesStatus =
        statusFilter === "all" || statusFilter === "active";
      const matchesTag =
        !debouncedTagQuery ||
        animal.tag_number?.toLowerCase().includes(debouncedTagQuery);

      return matchesSpecies && matchesBreed && matchesStatus && matchesTag;
    });
  }, [
    animals,
    speciesFilter,
    breedFilter,
    statusFilter,
    debouncedTagQuery,
  ]);

  const hasActiveFilters =
    speciesFilter !== "all" ||
    breedFilter !== "all" ||
    statusFilter !== "active" ||
    Boolean(tagQuery.trim());

  const clearFilters = () => {
    setSpeciesFilter("all");
    setBreedFilter("all");
    setStatusFilter("active");
    setTagQuery("");
  };

  return (
    <div className="space-y-8">
      <Card className="gap-0 border-0 bg-white py-0 shadow-sm ring-1 ring-black/5">
        <CardHeader className="border-b border-divider px-4 py-4 sm:px-6">
          <CardTitle className="font-label text-base font-semibold text-navy">
            Find livestock
          </CardTitle>
          <CardDescription className="text-muted">
            Filter by species, breed, and active status, or search by unique tag
            number.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4 py-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="public-species">Species</Label>
              <Select
                value={speciesFilter}
                onValueChange={(value) =>
                  setSpeciesFilter((value as SpeciesFilter) || "all")
                }
              >
                <SelectTrigger
                  id="public-species"
                  className="h-11 w-full min-h-11 border-divider bg-white"
                >
                  <SelectValue placeholder="All species" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All species</SelectItem>
                  {speciesOptions.map((species) => (
                    <SelectItem key={species} value={species}>
                      {species}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="public-breed">Breed</Label>
              <Select
                value={breedFilter}
                onValueChange={(value) =>
                  setBreedFilter((value as BreedFilter) || "all")
                }
              >
                <SelectTrigger
                  id="public-breed"
                  className="h-11 w-full min-h-11 border-divider bg-white"
                >
                  <SelectValue placeholder="All breeds" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All breeds</SelectItem>
                  {breedOptions.map((breed) => (
                    <SelectItem key={breed} value={breed}>
                      {breed}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="public-status">Active status</Label>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter((value as StatusFilter) || "active")
                }
              >
                <SelectTrigger
                  id="public-status"
                  className="h-11 w-full min-h-11 border-divider bg-white"
                >
                  <SelectValue placeholder="Active" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All listed</SelectItem>
                  <SelectItem value="active">Active only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="public-tag-search">Tag number</Label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted"
                  aria-hidden="true"
                />
                <Input
                  id="public-tag-search"
                  type="search"
                  value={tagQuery}
                  onChange={(event) => setTagQuery(event.target.value)}
                  placeholder="Search tag e.g. CT-001"
                  autoComplete="off"
                  spellCheck={false}
                  aria-describedby="tag-search-hint"
                  className="h-11 min-h-11 border-divider bg-white pl-9 pr-9"
                />
                {tagQuery ? (
                  <button
                    type="button"
                    onClick={() => setTagQuery("")}
                    className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted transition-colors hover:text-navy"
                    aria-label="Clear tag search"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : null}
              </div>
              <p id="tag-search-hint" className="text-xs text-muted">
                Results update as you type — matches unique tag numbers only.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted" aria-live="polite">
              {isSearching
                ? "Searching…"
                : `${filteredAnimals.length} animal${
                    filteredAnimals.length === 1 ? "" : "s"
                  } found`}
              {debouncedTagQuery
                ? ` for tag “${debouncedTagQuery.toUpperCase()}”`
                : null}
            </p>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-medium text-forest hover:underline"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {isSearching && tagQuery.trim() ? (
        <AnimalsGridSkeleton />
      ) : filteredAnimals.length === 0 ? (
        <Card className="border-0 bg-white py-0 shadow-sm ring-1 ring-black/5">
          <CardContent className="px-6 py-16 text-center">
            <p className="text-sm text-muted">
              {animals.length === 0
                ? "No animals to show yet. Check back soon."
                : debouncedTagQuery
                  ? `No animal found with tag matching “${debouncedTagQuery}”.`
                  : "No animals match your filters."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAnimals.map((animal, index) => {
            const displayName = animal.name?.trim() || animal.tag_number;
            const imageSrc = animal.photo_url || "/cattle.jpg";

            return (
              <FadeIn key={animal.id} delay={Math.min(index, 8) * 0.04}>
                <Link
                  href={`/animals/${encodeURIComponent(animal.tag_number)}`}
                  className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2"
                >
                  <Card
                    className={cn(
                      "h-full gap-0 overflow-hidden border-0 bg-white py-0 shadow-sm ring-1 ring-black/5 transition-shadow",
                      "group-hover:shadow-md"
                    )}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-navy/5">
                      <Image
                        src={imageSrc}
                        alt={`${displayName} — ${animal.species} at JRN Agro LTD farm in Kaduna`}
                        fill
                        quality={80}
                        loading="lazy"
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <Badge className="absolute top-3 right-3 border-transparent bg-green-100 text-green-800 hover:bg-green-100">
                        Active
                      </Badge>
                    </div>

                    <CardHeader className="gap-1 px-4 pt-4 pb-2">
                      <CardTitle className="font-label text-base font-semibold text-navy">
                        {displayName}
                      </CardTitle>
                      <CardDescription className="font-mono text-sm text-muted">
                        Tag {animal.tag_number}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="px-4 pt-0 pb-4">
                      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                        <div>
                          <dt className="text-xs font-medium text-muted">
                            Species
                          </dt>
                          <dd className="text-body-text">{animal.species}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium text-muted">
                            Breed
                          </dt>
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
                    </CardContent>
                  </Card>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      )}
    </div>
  );
}
