"use client";

import { Loader2, Plus, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { AdminErrorState } from "@/components/admin/AdminErrorState";
import { createClient } from "@/lib/supabase/client";
import { cn, formatAge, formatDate } from "@/lib/utils";
import type { Animal, AnimalStatus } from "@/types";

type SpeciesFilter = "all" | string;
type StatusFilter = "all" | AnimalStatus;

const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Sick", value: "sick" },
  { label: "Sold", value: "sold" },
  { label: "Deceased", value: "deceased" },
];

function getAnimalStatusLabel(status: AnimalStatus): string {
  const labels: Record<AnimalStatus, string> = {
    active: "Active",
    sick: "Sick",
    sold: "Sold",
    deceased: "Deceased",
  };

  return labels[status];
}

function getAnimalStatusColor(status: AnimalStatus): string {
  const colors: Record<AnimalStatus, string> = {
    active: "bg-green-100 text-green-800",
    sick: "bg-yellow-100 text-yellow-800",
    sold: "bg-gray-100 text-gray-700",
    deceased: "bg-red-100 text-red-800",
  };

  return colors[status];
}

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
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
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
    const unique = Array.from(
      new Set(
        animals
          .map((animal) => animal.species?.trim())
          .filter((species): species is string => Boolean(species))
      )
    ).sort((a, b) => a.localeCompare(b));

    return unique;
  }, [animals]);

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

  const activeChips = [
    speciesFilter !== "all"
      ? {
          key: "species",
          label: `Species: ${speciesFilter}`,
          onRemove: () => setSpeciesFilter("all"),
        }
      : null,
    statusFilter !== "all"
      ? {
          key: "status",
          label: `Status: ${getAnimalStatusLabel(statusFilter)}`,
          onRemove: () => setStatusFilter("all"),
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

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-label text-2xl font-semibold text-navy">Animals</h2>
          <p className="mt-1 text-sm text-muted">
            Internal registry of all animals, including sold and deceased.
          </p>
        </div>
        <Link
          href="/admin/animals/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-btn bg-forest px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest/90"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Animal
        </Link>
      </div>

      <div className="mb-6 space-y-4 rounded-lg bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted">
              Species
            </span>
            <select
              value={speciesFilter}
              onChange={(event) => setSpeciesFilter(event.target.value)}
              className="w-full min-h-11 rounded-btn border border-divider bg-white px-4 py-3 text-sm text-body-text focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
            >
              <option value="all">All species</option>
              {speciesOptions.map((species) => (
                <option key={species} value={species}>
                  {species}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted">
              Status
            </span>
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
              className="w-full min-h-11 rounded-btn border border-divider bg-white px-4 py-3 text-sm text-body-text focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block sm:col-span-2 lg:col-span-1">
            <span className="mb-1.5 block text-xs font-medium text-muted">
              Search
            </span>
            <input
              type="search"
              placeholder="Search by tag number or name..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full min-h-11 rounded-btn border border-divider px-4 py-3 text-sm text-body-text focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
            />
          </label>
        </div>

        {activeChips.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.onRemove}
                className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-forest"
              >
                {chip.label}
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        {fetchError ? (
          <AdminErrorState
            message={fetchError}
            onRetry={() => void fetchAnimals()}
          />
        ) : isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
            Loading animals...
          </div>
        ) : filteredAnimals.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm text-muted">
            {animals.length === 0
              ? "No animals recorded yet. Animals will appear here once added."
              : "No animals match your filters."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <tr>
                  <th className="px-4 py-3 text-sm font-medium text-muted">
                    Tag #
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-muted">
                    Name
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-muted">
                    Species
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-muted">
                    Breed
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-muted">
                    Status
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-muted">
                    Weight
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-muted">
                    Age
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-muted">
                    DOB
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAnimals.map((animal) => {
                  const isMuted =
                    animal.status === "sold" || animal.status === "deceased";

                  return (
                    <tr
                      key={animal.id}
                      onClick={() => router.push(`/admin/animals/${animal.id}`)}
                      className={cn(
                        "cursor-pointer border-b border-[#E2E8F0] transition-colors",
                        isMuted
                          ? "bg-[#F8FAFC] text-muted hover:bg-[#F1F5F9]"
                          : "hover:bg-gray-50"
                      )}
                    >
                      <td
                        className={cn(
                          "px-4 py-4 text-sm font-medium",
                          isMuted ? "text-muted" : "text-navy"
                        )}
                      >
                        {animal.tag_number}
                      </td>
                      <td
                        className={cn(
                          "px-4 py-4 text-sm",
                          isMuted ? "text-muted" : "text-body-text"
                        )}
                      >
                        <span className="inline-flex flex-wrap items-center gap-2">
                          {displayText(animal.name)}
                          {isMuted ? (
                            <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
                              {getAnimalStatusLabel(animal.status)}
                            </span>
                          ) : null}
                        </span>
                      </td>
                      <td
                        className={cn(
                          "px-4 py-4 text-sm",
                          isMuted ? "text-muted" : "text-body-text"
                        )}
                      >
                        {displayText(animal.species)}
                      </td>
                      <td
                        className={cn(
                          "px-4 py-4 text-sm",
                          isMuted ? "text-muted" : "text-body-text"
                        )}
                      >
                        {displayText(animal.breed)}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                            getAnimalStatusColor(animal.status),
                            isMuted && "opacity-80"
                          )}
                        >
                          {getAnimalStatusLabel(animal.status)}
                        </span>
                      </td>
                      <td
                        className={cn(
                          "px-4 py-4 text-sm",
                          isMuted ? "text-muted" : "text-body-text"
                        )}
                      >
                        {formatWeight(animal.current_weight_kg)}
                      </td>
                      <td
                        className={cn(
                          "px-4 py-4 text-sm",
                          isMuted ? "text-muted" : "text-body-text"
                        )}
                      >
                        {formatAge(animal.date_of_birth)}
                      </td>
                      <td
                        className={cn(
                          "px-4 py-4 text-sm",
                          isMuted ? "text-muted" : "text-body-text"
                        )}
                      >
                        {formatOptionalDate(animal.date_of_birth)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
