"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { createClient } from "@/lib/supabase/client";
import { compressImageForUpload } from "@/lib/images/compressImage";
import {
  ANIMAL_SEX,
  ANIMAL_SPECIES,
  animalFormSchema,
  type AnimalFormData,
} from "@/lib/validations/animal";
import { cn } from "@/lib/utils";

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

export default function NewAnimalPage() {
  const router = useRouter();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AnimalFormData>({
    resolver: zodResolver(animalFormSchema),
    defaultValues: {
      tag_number: "",
      name: "",
      breed: "",
      sex: "",
      date_of_birth: "",
      arrival_date: "",
      current_weight_kg: "",
    },
  });

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setPhotoFile(file);

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  };

  const onSubmit = async (data: AnimalFormData) => {
    setSubmitError(null);
    const supabase = createClient();

    try {
      let photoUrl: string | null = null;

      if (photoFile) {
        const compressedPhoto = await compressImageForUpload(photoFile);
        const storagePath = `${Date.now()}_${compressedPhoto.name.replace(/\s+/g, "-")}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("animals")
          .upload(storagePath, compressedPhoto);

        if (uploadError || !uploadData) {
          throw new Error(uploadError?.message ?? "Photo upload failed");
        }

        const { data: publicData } = supabase.storage
          .from("animals")
          .getPublicUrl(uploadData.path);

        photoUrl = publicData.publicUrl;
      }

      const { data: inserted, error: insertError } = await supabase
        .from("animals")
        .insert({
          tag_number: data.tag_number,
          name: data.name || null,
          species: data.species,
          breed: data.breed || null,
          sex: data.sex || null,
          date_of_birth: data.date_of_birth || null,
          arrival_date: data.arrival_date || null,
          current_weight_kg: data.current_weight_kg
            ? Number(data.current_weight_kg)
            : null,
          photo_url: photoUrl,
          status: "active",
          is_public: true,
        })
        .select("id")
        .single();

      if (insertError || !inserted) {
        if (photoUrl) {
          const path = photoUrl.split("/animals/")[1];
          if (path) {
            await supabase.storage.from("animals").remove([path]);
          }
        }
        throw new Error(insertError?.message ?? "Failed to create animal");
      }

      router.push(`/admin/animals/${inserted.id}`);
      router.refresh();
    } catch (error) {
      console.error("[admin/animals/new] create failed:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Could not create animal. Please try again."
      );
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/animals"
        className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-navy transition-colors hover:text-forest"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to animals
      </Link>

      <div className="mb-6">
        <h2 className="font-label text-2xl font-semibold text-navy">
          Add Animal
        </h2>
        <p className="mt-1 text-sm text-muted">
          Register a new animal in the farm registry.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-lg bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel required>Tag number</FieldLabel>
            <input
              type="text"
              {...register("tag_number")}
              className={inputClassName}
              placeholder="e.g. CT-001"
            />
            <FieldError message={errors.tag_number?.message} />
          </div>

          <div>
            <FieldLabel optional>Name</FieldLabel>
            <input
              type="text"
              {...register("name")}
              className={inputClassName}
              placeholder="Optional name"
            />
            <FieldError message={errors.name?.message} />
          </div>

          <div>
            <FieldLabel required>Species</FieldLabel>
            <select {...register("species")} className={inputClassName} defaultValue="">
              <option value="" disabled>
                Select species
              </option>
              {ANIMAL_SPECIES.map((species) => (
                <option key={species} value={species}>
                  {species}
                </option>
              ))}
            </select>
            <FieldError message={errors.species?.message} />
          </div>

          <div>
            <FieldLabel optional>Breed</FieldLabel>
            <input
              type="text"
              {...register("breed")}
              className={inputClassName}
              placeholder="e.g. White Fulani"
            />
            <FieldError message={errors.breed?.message} />
          </div>

          <div>
            <FieldLabel optional>Sex</FieldLabel>
            <select {...register("sex")} className={inputClassName} defaultValue="">
              <option value="">Not specified</option>
              {ANIMAL_SEX.map((sex) => (
                <option key={sex} value={sex}>
                  {sex}
                </option>
              ))}
            </select>
            <FieldError message={errors.sex?.message} />
          </div>

          <div>
            <FieldLabel optional>Current weight (kg)</FieldLabel>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register("current_weight_kg")}
              className={inputClassName}
              placeholder="e.g. 250"
            />
            <FieldError message={errors.current_weight_kg?.message} />
          </div>

          <div>
            <FieldLabel optional>Date of birth</FieldLabel>
            <input
              type="date"
              {...register("date_of_birth")}
              className={inputClassName}
            />
            <FieldError message={errors.date_of_birth?.message} />
          </div>

          <div>
            <FieldLabel optional>Arrival date</FieldLabel>
            <input
              type="date"
              {...register("arrival_date")}
              className={inputClassName}
            />
            <FieldError message={errors.arrival_date?.message} />
          </div>
        </div>

        <div>
          <FieldLabel optional>Photo</FieldLabel>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <label
              className={cn(
                "flex min-h-[140px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-btn border border-dashed border-divider bg-[#F8FAFC] px-4 py-6 text-center transition-colors hover:border-forest hover:bg-green-50/40 sm:max-w-xs"
              )}
            >
              <Upload className="h-5 w-5 text-muted" aria-hidden="true" />
              <span className="text-sm font-medium text-navy">
                {photoFile ? photoFile.name : "Choose image"}
              </span>
              <span className="text-xs text-muted">JPEG, PNG, or WebP</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={handlePhotoChange}
              />
            </label>

            {photoPreview ? (
              <div className="relative h-36 w-36 overflow-hidden rounded-btn border border-[#E2E8F0]">
                <Image
                  src={photoPreview}
                  alt="Selected animal photo preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : null}
          </div>
        </div>

        {submitError ? (
          <p className="rounded-btn bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3 border-t border-[#E2E8F0] pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-11 items-center gap-2 rounded-btn bg-forest px-5 py-2.5 font-label text-sm font-semibold text-white transition-colors hover:bg-forest/90 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Saving...
              </>
            ) : (
              "Save animal"
            )}
          </button>
          <Link
            href="/admin/animals"
            className="inline-flex min-h-11 items-center rounded-btn border border-[#E2E8F0] bg-white px-5 py-2.5 font-label text-sm font-semibold text-navy transition-colors hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
