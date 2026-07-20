import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { getPublicAnimalByTag } from "@/lib/supabase/queries";
import { formatAnimalAge } from "@/lib/animals/age";
import { formatDate } from "@/lib/utils";
import type { AnimalStatus, EventType } from "@/types";

export const revalidate = 3600;

interface AnimalProfilePageProps {
  params: { tag: string };
}

function displayText(value: string | null | undefined): string {
  if (!value || !String(value).trim()) {
    return "—";
  }

  return String(value);
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

function getStatusLabel(status: AnimalStatus): string {
  if (status === "sold") {
    return "Sold";
  }

  return "Active";
}

function getStatusColor(status: AnimalStatus): string {
  if (status === "sold") {
    return "bg-gray-100 text-gray-700";
  }

  return "bg-green-100 text-green-800";
}

function getEventTypeLabel(type: EventType): string {
  return type
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: AnimalProfilePageProps): Promise<Metadata> {
  const tag = decodeURIComponent(params.tag);
  const profile = await getPublicAnimalByTag(tag);

  if (!profile) {
    return {
      title: "Animal Not Found",
    };
  }

  const { animal } = profile;
  const displayName = animal.name?.trim() || animal.tag_number;

  return {
    title: `${displayName} (${animal.tag_number})`,
    description: `${animal.species}${animal.breed ? ` · ${animal.breed}` : ""} at JRN Agro LTD farm in Kaduna, Nigeria.`,
  };
}

export default async function AnimalProfilePage({
  params,
}: AnimalProfilePageProps) {
  const tag = decodeURIComponent(params.tag);
  const profile = await getPublicAnimalByTag(tag);

  if (!profile) {
    notFound();
  }

  const { animal, vaccinations, events } = profile;
  const displayName = animal.name?.trim() || animal.tag_number;
  const imageSrc = animal.photo_url || "/cattle.jpg";

  return (
    <>
      <section className="bg-cream py-10 md:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <Link
            href="/animals"
            className="inline-flex min-h-11 items-center text-sm font-medium text-forest transition-colors hover:text-navy"
          >
            ← Back to animals
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
            <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-navy/10 shadow-[0_2px_16px_rgba(0,0,0,0.07)]">
              <Image
                src={imageSrc}
                alt={`${displayName} — ${animal.species} at JRN Agro LTD farm in Kaduna`}
                fill
                priority
                quality={85}
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-3xl font-bold text-navy md:text-4xl">
                  {displayName}
                </h1>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(animal.status)}`}
                >
                  {getStatusLabel(animal.status)}
                </span>
              </div>
              <p className="mt-2 text-base text-muted">
                Tag {animal.tag_number}
              </p>

              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                    Species
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-navy">
                    {animal.species}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                    Breed
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-navy">
                    {displayText(animal.breed)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                    Sex
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-navy">
                    {displayText(animal.sex)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                    Age
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-navy">
                    {formatAnimalAge(animal.date_of_birth)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                    Date of birth
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-navy">
                    {formatOptionalDate(animal.date_of_birth)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                    Current weight
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-navy">
                    {animal.current_weight_kg != null
                      ? `${animal.current_weight_kg} kg`
                      : "—"}
                  </dd>
                </div>
              </dl>

              <div className="mt-10">
                <Button href="/get-a-quote" variant="primary" size="lg">
                  Request a Quote
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-navy">
              Vaccination history
            </h2>
            {vaccinations.length === 0 ? (
              <p className="mt-4 text-sm text-muted">
                No public vaccination records yet.
              </p>
            ) : (
              <ul className="mt-6 space-y-4">
                {vaccinations.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-card border border-[#E2E8F0] bg-cream/40 px-4 py-4"
                  >
                    <p className="font-label text-sm font-semibold text-navy">
                      {item.vaccine_name}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      Given {formatOptionalDate(item.date_given)}
                      {item.next_due_date
                        ? ` · Next due ${formatOptionalDate(item.next_due_date)}`
                        : ""}
                    </p>
                    {item.administered_by ? (
                      <p className="mt-1 text-sm text-body-text">
                        By {item.administered_by}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-navy">
              Farm timeline
            </h2>
            {events.length === 0 ? (
              <p className="mt-4 text-sm text-muted">
                No public events recorded yet.
              </p>
            ) : (
              <ul className="mt-6 space-y-4">
                {events.map((event) => (
                  <li
                    key={event.id}
                    className="rounded-card border border-[#E2E8F0] bg-cream/40 px-4 py-4"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-label text-sm font-semibold text-navy">
                        {getEventTypeLabel(event.event_type)}
                      </p>
                      <p className="text-sm text-muted">
                        {formatOptionalDate(event.event_date)}
                      </p>
                    </div>
                    {event.notes ? (
                      <p className="mt-2 text-sm text-body-text">{event.notes}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section className="bg-navy py-16">
        <div className="mx-auto max-w-[700px] px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
            Want this animal or something similar?
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              href="/get-a-quote"
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              Get a Quote
            </Button>
            <Button
              href="/animals"
              variant="primary"
              size="lg"
              className="bg-gold text-white hover:bg-gold/90"
            >
              Browse Animals
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
