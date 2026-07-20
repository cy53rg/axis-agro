"use client";

import { Loader2, Search, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatAnimalAge } from "@/lib/animals/age";
import type { PublicAnimal } from "@/lib/supabase/queries";
import { cn } from "@/lib/utils";

type LookupAnimal = PublicAnimal & { status: "active" };

function formatWeight(weightKg: number | null | undefined): string {
  if (weightKg == null || Number.isNaN(Number(weightKg))) {
    return "—";
  }

  return `${Number(weightKg)} kg`;
}

export function HeroAnimalSearch({ className }: { className?: string }) {
  const inputId = useId();
  const errorId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [tagQuery, setTagQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [animal, setAnimal] = useState<LookupAnimal | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (!isPreviewOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsPreviewOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isPreviewOpen]);

  const closePreview = () => {
    setIsPreviewOpen(false);
  };

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const tag = tagQuery.trim();

    setError(null);
    setAnimal(null);

    if (!tag) {
      setError("Enter a tag number to search.");
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(
        `/api/animals/lookup?tag=${encodeURIComponent(tag)}`
      );
      const payload = (await response.json()) as {
        animal: LookupAnimal | null;
        error?: string;
      };

      if (!response.ok || !payload.animal) {
        setError(payload.error || "Tag number not found");
        setIsPreviewOpen(false);
        return;
      }

      setAnimal(payload.animal);
      setIsPreviewOpen(true);
    } catch {
      setError("Tag number not found");
      setIsPreviewOpen(false);
    } finally {
      setIsSearching(false);
    }
  };

  const displayName = animal?.name?.trim() || animal?.tag_number || "";

  return (
    <>
      <div
        className={cn(
          "mx-auto w-full max-w-xl rounded-card border border-white/25 bg-white/95 p-4 text-left shadow-[0_12px_40px_rgba(0,0,0,0.22)] backdrop-blur-md sm:p-5 md:max-w-2xl md:p-6",
          className
        )}
      >
        <form onSubmit={handleSearch} className="space-y-3" noValidate>
          <div className="space-y-1">
            <Label
              htmlFor={inputId}
              className="font-label text-xs font-semibold uppercase tracking-[0.14em] text-navy/75"
            >
              Find by tag number
            </Label>
            <p className="text-sm text-muted">
              Look up active livestock by unique farm tag.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <Input
                id={inputId}
                type="search"
                value={tagQuery}
                onChange={(event) => {
                  setTagQuery(event.target.value);
                  if (error) {
                    setError(null);
                  }
                }}
                placeholder="e.g. CT-001"
                autoComplete="off"
                spellCheck={false}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                className="h-14 min-h-14 border-divider bg-white pl-12 text-base font-medium tracking-wide text-body-text shadow-sm placeholder:font-normal placeholder:tracking-normal sm:text-[1.0625rem]"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSearching}
              className="h-14 min-h-14 shrink-0 px-8 text-base sm:w-auto"
            >
              {isSearching ? (
                <>
                  <Loader2
                    className="h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Searching</span>
                </>
              ) : (
                "Search"
              )}
            </Button>
          </div>
          {error ? (
            <p
              id={errorId}
              role="status"
              className="text-sm text-red-700"
              aria-live="polite"
            >
              {error}
            </p>
          ) : null}
        </form>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-50",
          isPreviewOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!isPreviewOpen}
      >
        <button
          type="button"
          aria-label="Close animal preview"
          className={cn(
            "absolute inset-0 bg-navy/50 transition-opacity duration-200 ease-out",
            isPreviewOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={closePreview}
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-label={animal ? `Animal ${animal.tag_number}` : "Animal preview"}
          className={cn(
            "absolute top-1/2 left-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-card bg-white shadow-xl transition-opacity duration-200 ease-out",
            isPreviewOpen ? "opacity-100" : "opacity-0"
          )}
        >
          {animal ? (
            <div className="overflow-hidden rounded-card">
              <div className="relative aspect-[16/10] bg-cream">
                <Image
                  src={animal.photo_url || "/cattle.jpg"}
                  alt={`${displayName} — ${animal.species} at JRN Agro LTD`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 448px) 100vw, 448px"
                />
                <button
                  ref={closeRef}
                  type="button"
                  onClick={closePreview}
                  className="absolute top-3 right-3 flex min-h-10 min-w-10 items-center justify-center rounded-btn bg-white/95 text-navy shadow-sm transition-colors hover:bg-white"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="space-y-4 p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-navy">
                      {displayName}
                    </h2>
                    <p className="mt-1 font-mono text-sm text-muted">
                      Tag {animal.tag_number}
                    </p>
                  </div>
                  <Badge className="border-transparent bg-green-100 text-green-800 hover:bg-green-100">
                    Active
                  </Badge>
                </div>

                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                      Breed
                    </dt>
                    <dd className="mt-1 font-medium text-navy">
                      {animal.breed?.trim() || "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                      Weight
                    </dt>
                    <dd className="mt-1 font-medium text-navy">
                      {formatWeight(animal.current_weight_kg)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                      Species
                    </dt>
                    <dd className="mt-1 font-medium text-navy">
                      {animal.species}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                      Age
                    </dt>
                    <dd className="mt-1 font-medium text-navy">
                      {formatAnimalAge(animal.date_of_birth)}
                    </dd>
                  </div>
                </dl>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    href={`/animals/${encodeURIComponent(animal.tag_number)}`}
                    variant="primary"
                    className="w-full sm:flex-1"
                  >
                    View full profile
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:flex-1"
                    onClick={closePreview}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
