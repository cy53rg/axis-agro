"use client";

import { Loader2, Plus, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  AnimalStatusBadge,
  ANIMAL_STATUS_OPTIONS,
  getAnimalStatusLabel,
} from "@/components/admin/AnimalStatusBadge";
import { AdminErrorState } from "@/components/admin/AdminErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AGE_BUCKET_OPTIONS,
  matchesAgeBucket,
  type AgeBucket,
} from "@/lib/animals/age";
import { createClient } from "@/lib/supabase/client";
import { cn, formatAge, formatDate } from "@/lib/utils";
import type { Animal, AnimalStatus } from "@/types";

type SpeciesFilter = "all" | string;
type BreedFilter = "all" | string;
type StatusFilter = "all" | AnimalStatus;
type AgeFilter = "all" | AgeBucket;

function formatWeight(weightKg: number | null | undefined): string {
  if (weightKg == null || Number.isNaN(Number(weightKg))) {
    return "—";
  }

  return `${Number(weightKg)} kg`;
}

function formatOptionalDate(value: string | null | undefined): string {
  if (!value) {
    return "—";
  }

  try {
    return formatDate(value);
  } catch {
    return value;
  }
}

function displayText(value: string | null | undefined): string {
  if (!value || !value.trim()) {
    return "—";
  }

  return value;
}

export default function AdminAnimalsPage() {
  const router = useRouter();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [speciesFilter, setSpeciesFilter] = useState<SpeciesFilter>("all");
  const [breedFilter, setBreedFilter] = useState<BreedFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [ageFilter, setAgeFilter] = useState<AgeFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAnimals = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("animals")
        .select("*")
        .order("tag_number", { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      setAnimals((data ?? []) as Animal[]);
    } catch (error) {
      console.error("[admin/animals] fetch failed:", error);
      setFetchError(
        "We couldn't load animals. Check your connection and try again."
      );
      setAnimals([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAnimals();
  }, [fetchAnimals]);

  const speciesOptions = useMemo(() => {
    return Array.from(
      new Set(
        animals
          .map((animal) => animal.species?.trim())
          .filter((species): species is string => Boolean(species))
      )
    ).sort((a, b) => a.localeCompare(b));
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
    const query = searchQuery.trim().toLowerCase();

    return animals.filter((animal) => {
      const matchesSpecies =
        speciesFilter === "all" || animal.species === speciesFilter;
      const matchesBreed =
        breedFilter === "all" || animal.breed?.trim() === breedFilter;
      const matchesStatus =
        statusFilter === "all" || animal.status === statusFilter;
      const matchesAge = matchesAgeBucket(animal.date_of_birth, ageFilter);
      const matchesSearch =
        !query ||
        animal.tag_number?.toLowerCase().includes(query) ||
        animal.name?.toLowerCase().includes(query) ||
        animal.breed?.toLowerCase().includes(query);

      return (
        matchesSpecies &&
        matchesBreed &&
        matchesStatus &&
        matchesAge &&
        matchesSearch
      );
    });
  }, [
    animals,
    searchQuery,
    speciesFilter,
    breedFilter,
    statusFilter,
    ageFilter,
  ]);

  const activeChips = [
    speciesFilter !== "all"
      ? {
          key: "species",
          label: `Species: ${speciesFilter}`,
          onRemove: () => setSpeciesFilter("all"),
        }
      : null,
    breedFilter !== "all"
      ? {
          key: "breed",
          label: `Breed: ${breedFilter}`,
          onRemove: () => setBreedFilter("all"),
        }
      : null,
    statusFilter !== "all"
      ? {
          key: "status",
          label: `Status: ${getAnimalStatusLabel(statusFilter)}`,
          onRemove: () => setStatusFilter("all"),
        }
      : null,
    ageFilter !== "all"
      ? {
          key: "age",
          label: `Age: ${
            AGE_BUCKET_OPTIONS.find((option) => option.value === ageFilter)
              ?.label ?? ageFilter
          }`,
          onRemove: () => setAgeFilter("all"),
        }
      : null,
    searchQuery.trim()
      ? {
          key: "search",
          label: `Search: ${searchQuery.trim()}`,
          onRemove: () => setSearchQuery(""),
        }
      : null,
  ].filter(Boolean) as {
    key: string;
    label: string;
    onRemove: () => void;
  }[];

  const clearFilters = () => {
    setSpeciesFilter("all");
    setBreedFilter("all");
    setStatusFilter("all");
    setAgeFilter("all");
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-label text-2xl font-semibold text-navy">
            Animals
          </h2>
          <p className="mt-1 text-sm text-muted">
            Internal registry — includes sick, sold, and dead animals with
            commercial notes.
          </p>
        </div>
        <Button href="/admin/animals/new" variant="primary">
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          Add Animal
        </Button>
      </div>

      <Card className="bg-white py-0 shadow-sm ring-1 ring-black/5">
        <CardHeader className="border-b border-divider px-4 py-4 sm:px-6">
          <CardTitle className="font-label text-base text-navy">
            Filters
          </CardTitle>
          <CardDescription className="text-muted">
            Filter the directory by breed, age, and internal status.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4 py-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <div className="space-y-2">
              <Label htmlFor="animal-species">Species</Label>
              <Select
                value={speciesFilter}
                onValueChange={(value) =>
                  setSpeciesFilter((value as SpeciesFilter) || "all")
                }
              >
                <SelectTrigger
                  id="animal-species"
                  className="h-11 w-full min-h-11"
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
              <Label htmlFor="animal-breed">Breed</Label>
              <Select
                value={breedFilter}
                onValueChange={(value) =>
                  setBreedFilter((value as BreedFilter) || "all")
                }
              >
                <SelectTrigger
                  id="animal-breed"
                  className="h-11 w-full min-h-11"
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
              <Label htmlFor="animal-age">Age</Label>
              <Select
                value={ageFilter}
                onValueChange={(value) =>
                  setAgeFilter((value as AgeFilter) || "all")
                }
              >
                <SelectTrigger id="animal-age" className="h-11 w-full min-h-11">
                  <SelectValue placeholder="All ages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ages</SelectItem>
                  {AGE_BUCKET_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="animal-status">Status</Label>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter((value as StatusFilter) || "all")
                }
              >
                <SelectTrigger
                  id="animal-status"
                  className="h-11 w-full min-h-11"
                >
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {ANIMAL_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="animal-search">Search</Label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted"
                  aria-hidden="true"
                />
                <Input
                  id="animal-search"
                  type="search"
                  placeholder="Tag, name, or breed..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="h-11 min-h-11 pl-9"
                />
              </div>
            </div>
          </div>

          {activeChips.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              {activeChips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.onRemove}
                  className="inline-flex"
                >
                  <Badge
                    variant="secondary"
                    className="gap-1 rounded-full bg-green-50 px-3 py-1 text-forest hover:bg-green-100"
                  >
                    {chip.label}
                    <X className="h-3 w-3" aria-hidden="true" />
                  </Badge>
                </button>
              ))}
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-medium text-forest hover:underline"
              >
                Clear all
              </button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="bg-white py-0 shadow-sm ring-1 ring-black/5">
        <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-divider px-4 py-4 sm:px-6">
          <div>
            <CardTitle className="font-label text-base text-navy">
              Animal directory
            </CardTitle>
            <CardDescription className="text-muted">
              {isLoading
                ? "Loading…"
                : `${filteredAnimals.length} of ${animals.length} animals`}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-0 py-0">
          {fetchError ? (
            <div className="p-6">
              <AdminErrorState
                message={fetchError}
                onRetry={() => void fetchAnimals()}
              />
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted">
              <Loader2
                className="mr-2 h-5 w-5 animate-spin"
                aria-hidden="true"
              />
              Loading animals...
            </div>
          ) : filteredAnimals.length === 0 ? (
            <p className="px-6 py-16 text-center text-sm text-muted">
              {animals.length === 0
                ? "No animals recorded yet. Animals will appear here once added."
                : "No animals match your filters."}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-4 text-muted">Tag #</TableHead>
                  <TableHead className="px-4 text-muted">Name</TableHead>
                  <TableHead className="px-4 text-muted">Species</TableHead>
                  <TableHead className="px-4 text-muted">Breed</TableHead>
                  <TableHead className="px-4 text-muted">Status</TableHead>
                  <TableHead className="px-4 text-muted">Weight</TableHead>
                  <TableHead className="px-4 text-muted">Age</TableHead>
                  <TableHead className="px-4 text-muted">DOB</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAnimals.map((animal) => {
                  const isClosed =
                    animal.status === "sold" || animal.status === "deceased";

                  return (
                    <TableRow
                      key={animal.id}
                      onClick={() =>
                        router.push(`/admin/animals/${animal.id}`)
                      }
                      className={cn(
                        "cursor-pointer",
                        isClosed && "bg-slate-50 text-muted"
                      )}
                    >
                      <TableCell
                        className={cn(
                          "px-4 py-3 font-medium",
                          isClosed ? "text-muted" : "text-navy"
                        )}
                      >
                        {animal.tag_number}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {displayText(animal.name)}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {displayText(animal.species)}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {displayText(animal.breed)}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <AnimalStatusBadge status={animal.status} />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {formatWeight(animal.current_weight_kg)}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {formatAge(animal.date_of_birth)}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {formatOptionalDate(animal.date_of_birth)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
