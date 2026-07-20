"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { AdminErrorState } from "@/components/admin/AdminErrorState";
import { createClient } from "@/lib/supabase/client";
import {
  ANIMAL_STATUSES,
  healthCheckSchema,
  statusChangeSchema,
  vaccinationSchema,
  weightLogSchema,
  type HealthCheckFormData,
  type StatusChangeFormData,
  type VaccinationFormData,
  type WeightLogFormData,
} from "@/lib/validations/animal";
import { cn, formatAge, formatDate } from "@/lib/utils";
import type {
  Animal,
  AnimalStatus,
  Event,
  EventType,
  HealthCheck,
  Vaccination,
  WeightLog,
} from "@/types";

const inputClassName =
  "w-full min-h-11 rounded-btn border border-divider bg-white px-4 py-3 text-sm text-body-text transition-colors focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest";

function FieldLabel({
  children,
  required = false,
  optional = false,
}: {
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <label className="mb-2 block text-sm font-medium text-navy">
      {children}
      {required ? <span className="text-gold"> *</span> : null}
      {optional ? (
        <span className="font-normal text-muted"> (optional)</span>
      ) : null}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-1.5 text-[13px] text-red-600">{message}</p>;
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

function getEventTypeLabel(type: EventType): string {
  return type
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="font-label text-lg font-semibold text-navy">{title}</h3>
      {description ? (
        <p className="mt-1 text-sm text-muted">{description}</p>
      ) : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function AnimalDetailPage() {
  const params = useParams<{ id: string }>();
  const animalId = params.id;

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const fetchAnimalData = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const supabase = createClient();

      const [
        animalResult,
        weightsResult,
        vaccinationsResult,
        checksResult,
        eventsResult,
      ] = await Promise.all([
        supabase.from("animals").select("*").eq("id", animalId).single(),
        supabase
          .from("weight_logs")
          .select("*")
          .eq("animal_id", animalId)
          .order("recorded_at", { ascending: false }),
        supabase
          .from("vaccinations")
          .select("*")
          .eq("animal_id", animalId)
          .order("date_given", { ascending: false }),
        supabase
          .from("health_checks")
          .select("*")
          .eq("animal_id", animalId)
          .order("check_date", { ascending: false }),
        supabase
          .from("events")
          .select("*")
          .eq("animal_id", animalId)
          .order("event_date", { ascending: false }),
      ]);

      if (animalResult.error || !animalResult.data) {
        throw new Error(animalResult.error?.message ?? "Animal not found");
      }

      setAnimal(animalResult.data as Animal);
      setWeightLogs((weightsResult.data ?? []) as WeightLog[]);
      setVaccinations((vaccinationsResult.data ?? []) as Vaccination[]);
      setHealthChecks((checksResult.data ?? []) as HealthCheck[]);
      setEvents((eventsResult.data ?? []) as Event[]);
    } catch (error) {
      console.error("[admin/animals/[id]] fetch failed:", error);
      setFetchError(
        "We couldn't load this animal. Check your connection and try again."
      );
      setAnimal(null);
    } finally {
      setIsLoading(false);
    }
  }, [animalId]);

  useEffect(() => {
    void fetchAnimalData();
  }, [fetchAnimalData]);

  const weightForm = useForm<WeightLogFormData>({
    resolver: zodResolver(weightLogSchema),
    defaultValues: { weight_kg: "", recorded_at: "", notes: "" },
  });

  const vaccinationForm = useForm<VaccinationFormData>({
    resolver: zodResolver(vaccinationSchema),
    defaultValues: {
      vaccine_name: "",
      date_given: "",
      next_due_date: "",
      administered_by: "",
    },
  });

  const healthForm = useForm<HealthCheckFormData>({
    resolver: zodResolver(healthCheckSchema),
    defaultValues: { check_date: "", findings: "", vet_name: "" },
  });

  const statusForm = useForm<StatusChangeFormData>({
    resolver: zodResolver(statusChangeSchema),
    defaultValues: {
      status: "active",
      sold_to: "",
      sold_price: "",
      sold_date: "",
      cause_of_death: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (!animal) {
      return;
    }

    statusForm.reset({
      status: animal.status,
      sold_to: animal.sold_to ?? "",
      sold_price:
        animal.sold_price != null ? String(animal.sold_price) : "",
      sold_date: animal.sold_date ?? "",
      cause_of_death: animal.cause_of_death ?? "",
      notes: "",
    });
  }, [animal, statusForm]);

  const selectedStatus = statusForm.watch("status");

  const getUserId = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  };

  const onAddWeight = async (data: WeightLogFormData) => {
    setFormMessage(null);

    const response = await fetch(
      `/api/admin/animals/${animalId}/weight-logs`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    if (response.status === 401 || response.status === 403) {
      setFormMessage("You do not have permission to add weight logs.");
      return;
    }

    if (!response.ok) {
      console.error("[admin/animals/[id]] weight log failed:", response.status);
      setFormMessage("Could not save weight log. Please try again.");
      return;
    }

    weightForm.reset({ weight_kg: "", recorded_at: "", notes: "" });
    setFormMessage("Weight log added.");
    await fetchAnimalData();
  };

  const onAddVaccination = async (data: VaccinationFormData) => {
    setFormMessage(null);

    const response = await fetch(
      `/api/admin/animals/${animalId}/vaccinations`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    if (response.status === 401 || response.status === 403) {
      setFormMessage("You do not have permission to add vaccinations.");
      return;
    }

    if (!response.ok) {
      console.error(
        "[admin/animals/[id]] vaccination failed:",
        response.status
      );
      setFormMessage("Could not save vaccination. Please try again.");
      return;
    }

    vaccinationForm.reset({
      vaccine_name: "",
      date_given: "",
      next_due_date: "",
      administered_by: "",
    });
    setFormMessage("Vaccination recorded.");
    await fetchAnimalData();
  };

  const onAddHealthCheck = async (data: HealthCheckFormData) => {
    setFormMessage(null);

    const response = await fetch(
      `/api/admin/animals/${animalId}/health-checks`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    if (response.status === 401 || response.status === 403) {
      setFormMessage("You do not have permission to add health checks.");
      return;
    }

    if (!response.ok) {
      console.error(
        "[admin/animals/[id]] health check failed:",
        response.status
      );
      setFormMessage("Could not save health check. Please try again.");
      return;
    }

    healthForm.reset({ check_date: "", findings: "", vet_name: "" });
    setFormMessage("Health check recorded.");
    await fetchAnimalData();
  };

  const onChangeStatus = async (data: StatusChangeFormData) => {
    setFormMessage(null);
    const supabase = createClient();
    const recordedBy = await getUserId();

    const updatePayload: Record<string, unknown> = {
      status: data.status,
    };

    if (data.status === "sold") {
      updatePayload.sold_to = data.sold_to || null;
      updatePayload.sold_price = data.sold_price
        ? Number(data.sold_price)
        : null;
      updatePayload.sold_date = data.sold_date || null;
      updatePayload.cause_of_death = null;
    } else if (data.status === "deceased") {
      updatePayload.cause_of_death = data.cause_of_death || null;
      updatePayload.sold_to = null;
      updatePayload.sold_price = null;
      updatePayload.sold_date = null;
    } else {
      updatePayload.sold_to = null;
      updatePayload.sold_price = null;
      updatePayload.sold_date = null;
      updatePayload.cause_of_death = null;
    }

    const { error: updateError } = await supabase
      .from("animals")
      .update(updatePayload)
      .eq("id", animalId);

    if (updateError) {
      console.error(
        "[admin/animals/[id]] status update failed:",
        updateError.message
      );
      setFormMessage("Could not update status. Please try again.");
      return;
    }

    const eventType: EventType =
      data.status === "sold"
        ? "sold"
        : data.status === "deceased"
          ? "death"
          : "status_change";

    const eventNotesParts = [
      `Status set to ${getAnimalStatusLabel(data.status)}`,
      data.status === "sold" && data.sold_to
        ? `Sold to ${data.sold_to}`
        : null,
      data.status === "sold" && data.sold_price
        ? `Price: ₦${Number(data.sold_price).toLocaleString()}`
        : null,
      data.status === "deceased" && data.cause_of_death
        ? `Cause: ${data.cause_of_death}`
        : null,
      data.notes || null,
    ].filter(Boolean);

    const { error: eventError } = await supabase.from("events").insert({
      animal_id: animalId,
      event_type: eventType,
      event_date:
        data.status === "sold" && data.sold_date
          ? new Date(data.sold_date).toISOString()
          : new Date().toISOString(),
      notes: eventNotesParts.join(". "),
      is_public: data.status !== "deceased",
      recorded_by: recordedBy,
    });

    if (eventError) {
      console.error(
        "[admin/animals/[id]] status event failed:",
        eventError.message
      );
      setFormMessage(
        "Status updated, but the timeline event could not be saved."
      );
      await fetchAnimalData();
      return;
    }

    setFormMessage("Status updated.");
    await fetchAnimalData();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
        Loading animal...
      </div>
    );
  }

  if (fetchError || !animal) {
    return (
      <div>
        <Link
          href="/admin/animals"
          className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-navy transition-colors hover:text-forest"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to animals
        </Link>
        <AdminErrorState
          message={fetchError ?? "Animal not found."}
          onRetry={() => void fetchAnimalData()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/animals"
            className="mb-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-navy transition-colors hover:text-forest"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to animals
          </Link>
          <h2 className="font-label text-2xl font-semibold text-navy">
            {animal.name?.trim() || animal.tag_number}
          </h2>
          <p className="mt-1 text-sm text-muted">
            Tag {animal.tag_number} · {animal.species}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold",
            getAnimalStatusColor(animal.status)
          )}
        >
          {getAnimalStatusLabel(animal.status)}
        </span>
      </div>

      {formMessage ? (
        <p className="rounded-btn bg-green-50 px-4 py-3 text-sm text-forest">
          {formMessage}
        </p>
      ) : null}

      <SectionCard title="Profile">
        <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
          <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-btn border border-[#E2E8F0] bg-[#F8FAFC] lg:mx-0">
            {animal.photo_url ? (
              <Image
                src={animal.photo_url}
                alt={animal.name || animal.tag_number}
                fill
                className="object-cover"
                sizes="192px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted">
                No photo
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs font-medium text-muted">Tag number</p>
              <p className="text-sm text-body-text">{animal.tag_number}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted">Name</p>
              <p className="text-sm text-body-text">{displayText(animal.name)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted">Species</p>
              <p className="text-sm text-body-text">{animal.species}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted">Breed</p>
              <p className="text-sm text-body-text">
                {displayText(animal.breed)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted">Sex</p>
              <p className="text-sm text-body-text">{displayText(animal.sex)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted">Current weight</p>
              <p className="text-sm text-body-text">
                {animal.current_weight_kg != null
                  ? `${animal.current_weight_kg} kg`
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted">Age</p>
              <p className="text-sm text-body-text">
                {formatAge(animal.date_of_birth)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted">Date of birth</p>
              <p className="text-sm text-body-text">
                {formatOptionalDate(animal.date_of_birth)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted">Arrival date</p>
              <p className="text-sm text-body-text">
                {formatOptionalDate(animal.arrival_date)}
              </p>
            </div>
            {animal.status === "sold" ? (
              <>
                <div>
                  <p className="text-xs font-medium text-muted">Sold to</p>
                  <p className="text-sm text-body-text">
                    {displayText(animal.sold_to)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted">Sold price</p>
                  <p className="text-sm text-body-text">
                    {animal.sold_price != null
                      ? `₦${Number(animal.sold_price).toLocaleString()}`
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted">Sold date</p>
                  <p className="text-sm text-body-text">
                    {formatOptionalDate(animal.sold_date)}
                  </p>
                </div>
              </>
            ) : null}
            {animal.status === "deceased" ? (
              <div className="sm:col-span-2">
                <p className="text-xs font-medium text-muted">Cause of death</p>
                <p className="text-sm text-body-text">
                  {displayText(animal.cause_of_death)}
                </p>
              </div>
            ) : null}
            {animal.internal_notes ? (
              <div className="sm:col-span-2 lg:col-span-3">
                <p className="text-xs font-medium text-muted">Internal notes</p>
                <p className="whitespace-pre-wrap text-sm text-body-text">
                  {animal.internal_notes}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard
          title="Add weight log"
          description="Appends a new weight reading and updates current weight."
        >
          <form
            onSubmit={weightForm.handleSubmit(onAddWeight)}
            className="space-y-4"
          >
            <div>
              <FieldLabel required>Weight (kg)</FieldLabel>
              <input
                type="number"
                step="0.01"
                min="0"
                {...weightForm.register("weight_kg")}
                className={inputClassName}
              />
              <FieldError
                message={weightForm.formState.errors.weight_kg?.message}
              />
            </div>
            <div>
              <FieldLabel optional>Recorded at</FieldLabel>
              <input
                type="date"
                {...weightForm.register("recorded_at")}
                className={inputClassName}
              />
            </div>
            <div>
              <FieldLabel optional>Notes</FieldLabel>
              <textarea
                rows={2}
                {...weightForm.register("notes")}
                className={inputClassName}
              />
            </div>
            <button
              type="submit"
              disabled={weightForm.formState.isSubmitting}
              className="inline-flex min-h-11 items-center gap-2 rounded-btn bg-forest px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest/90 disabled:opacity-70"
            >
              {weightForm.formState.isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Saving...
                </>
              ) : (
                "Add weight"
              )}
            </button>
          </form>

          <ul className="mt-5 space-y-2 border-t border-[#E2E8F0] pt-4">
            {weightLogs.length === 0 ? (
              <li className="text-sm text-muted">No weight logs yet.</li>
            ) : (
              weightLogs.slice(0, 5).map((log) => (
                <li
                  key={log.id}
                  className="flex items-start justify-between gap-3 text-sm"
                >
                  <span className="font-medium text-navy">
                    {log.weight_kg} kg
                  </span>
                  <span className="text-muted">
                    {formatOptionalDate(log.recorded_at)}
                  </span>
                </li>
              ))
            )}
          </ul>
        </SectionCard>

        <SectionCard
          title="Add vaccination"
          description="Record a vaccine dose and optional next due date."
        >
          <form
            onSubmit={vaccinationForm.handleSubmit(onAddVaccination)}
            className="space-y-4"
          >
            <div>
              <FieldLabel required>Vaccine name</FieldLabel>
              <input
                type="text"
                {...vaccinationForm.register("vaccine_name")}
                className={inputClassName}
              />
              <FieldError
                message={vaccinationForm.formState.errors.vaccine_name?.message}
              />
            </div>
            <div>
              <FieldLabel required>Date given</FieldLabel>
              <input
                type="date"
                {...vaccinationForm.register("date_given")}
                className={inputClassName}
              />
              <FieldError
                message={vaccinationForm.formState.errors.date_given?.message}
              />
            </div>
            <div>
              <FieldLabel optional>Next due date</FieldLabel>
              <input
                type="date"
                {...vaccinationForm.register("next_due_date")}
                className={inputClassName}
              />
            </div>
            <div>
              <FieldLabel optional>Administered by</FieldLabel>
              <input
                type="text"
                {...vaccinationForm.register("administered_by")}
                className={inputClassName}
              />
            </div>
            <button
              type="submit"
              disabled={vaccinationForm.formState.isSubmitting}
              className="inline-flex min-h-11 items-center gap-2 rounded-btn bg-forest px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest/90 disabled:opacity-70"
            >
              {vaccinationForm.formState.isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Saving...
                </>
              ) : (
                "Add vaccination"
              )}
            </button>
          </form>

          <ul className="mt-5 space-y-2 border-t border-[#E2E8F0] pt-4">
            {vaccinations.length === 0 ? (
              <li className="text-sm text-muted">No vaccinations yet.</li>
            ) : (
              vaccinations.slice(0, 5).map((item) => (
                <li key={item.id} className="text-sm">
                  <p className="font-medium text-navy">{item.vaccine_name}</p>
                  <p className="text-muted">
                    {formatOptionalDate(item.date_given)}
                    {item.next_due_date
                      ? ` · Next: ${formatOptionalDate(item.next_due_date)}`
                      : ""}
                  </p>
                </li>
              ))
            )}
          </ul>
        </SectionCard>

        <SectionCard
          title="Add health check"
          description="Log vet findings for this animal."
        >
          <form
            onSubmit={healthForm.handleSubmit(onAddHealthCheck)}
            className="space-y-4"
          >
            <div>
              <FieldLabel required>Check date</FieldLabel>
              <input
                type="date"
                {...healthForm.register("check_date")}
                className={inputClassName}
              />
              <FieldError
                message={healthForm.formState.errors.check_date?.message}
              />
            </div>
            <div>
              <FieldLabel optional>Findings</FieldLabel>
              <textarea
                rows={3}
                {...healthForm.register("findings")}
                className={inputClassName}
              />
            </div>
            <div>
              <FieldLabel optional>Vet name</FieldLabel>
              <input
                type="text"
                {...healthForm.register("vet_name")}
                className={inputClassName}
              />
            </div>
            <button
              type="submit"
              disabled={healthForm.formState.isSubmitting}
              className="inline-flex min-h-11 items-center gap-2 rounded-btn bg-forest px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest/90 disabled:opacity-70"
            >
              {healthForm.formState.isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Saving...
                </>
              ) : (
                "Add health check"
              )}
            </button>
          </form>

          <ul className="mt-5 space-y-2 border-t border-[#E2E8F0] pt-4">
            {healthChecks.length === 0 ? (
              <li className="text-sm text-muted">No health checks yet.</li>
            ) : (
              healthChecks.slice(0, 5).map((item) => (
                <li key={item.id} className="text-sm">
                  <p className="font-medium text-navy">
                    {formatOptionalDate(item.check_date)}
                  </p>
                  <p className="text-muted">
                    {item.findings || item.vet_name || "No notes"}
                  </p>
                </li>
              ))
            )}
          </ul>
        </SectionCard>
      </div>

      <SectionCard
        title="Change status"
        description="Updates the animal record and writes a matching timeline event."
      >
        <form
          onSubmit={statusForm.handleSubmit(onChangeStatus)}
          className="space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel required>Status</FieldLabel>
              <select {...statusForm.register("status")} className={inputClassName}>
                {ANIMAL_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {getAnimalStatusLabel(status)}
                  </option>
                ))}
              </select>
              <FieldError
                message={statusForm.formState.errors.status?.message}
              />
            </div>
            <div>
              <FieldLabel optional>Notes</FieldLabel>
              <input
                type="text"
                {...statusForm.register("notes")}
                className={inputClassName}
                placeholder="Optional note for the event log"
              />
            </div>
          </div>

          {selectedStatus === "sold" ? (
            <div className="grid gap-4 rounded-btn border border-[#E2E8F0] bg-[#F8FAFC] p-4 sm:grid-cols-3">
              <div>
                <FieldLabel required>Sold to</FieldLabel>
                <input
                  type="text"
                  {...statusForm.register("sold_to")}
                  className={inputClassName}
                />
                <FieldError
                  message={statusForm.formState.errors.sold_to?.message}
                />
              </div>
              <div>
                <FieldLabel optional>Sold price (₦)</FieldLabel>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...statusForm.register("sold_price")}
                  className={inputClassName}
                />
                <FieldError
                  message={statusForm.formState.errors.sold_price?.message}
                />
              </div>
              <div>
                <FieldLabel required>Sold date</FieldLabel>
                <input
                  type="date"
                  {...statusForm.register("sold_date")}
                  className={inputClassName}
                />
                <FieldError
                  message={statusForm.formState.errors.sold_date?.message}
                />
              </div>
            </div>
          ) : null}

          {selectedStatus === "deceased" ? (
            <div className="rounded-btn border border-[#E2E8F0] bg-[#F8FAFC] p-4">
              <FieldLabel required>Cause of death</FieldLabel>
              <textarea
                rows={3}
                {...statusForm.register("cause_of_death")}
                className={inputClassName}
              />
              <FieldError
                message={statusForm.formState.errors.cause_of_death?.message}
              />
            </div>
          ) : null}

          <button
            type="submit"
            disabled={statusForm.formState.isSubmitting}
            className="inline-flex min-h-11 items-center gap-2 rounded-btn bg-forest px-5 py-2.5 font-label text-sm font-semibold text-white transition-colors hover:bg-forest/90 disabled:opacity-70"
          >
            {statusForm.formState.isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Updating...
              </>
            ) : (
              "Update status"
            )}
          </button>
        </form>
      </SectionCard>

      <SectionCard title="Timeline">
        {events.length === 0 ? (
          <p className="text-sm text-muted">No events recorded yet.</p>
        ) : (
          <ul className="space-y-3">
            {events.map((event) => (
              <li
                key={event.id}
                className="flex flex-col gap-1 border-b border-[#E2E8F0] pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-navy">
                    {getEventTypeLabel(event.event_type)}
                  </p>
                  {event.notes ? (
                    <p className="mt-0.5 text-sm text-body-text">{event.notes}</p>
                  ) : null}
                </div>
                <p className="shrink-0 text-sm text-muted">
                  {formatOptionalDate(event.event_date)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
