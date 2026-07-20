import { z } from "zod";

export const ANIMAL_SPECIES = [
  "Cattle",
  "Goat",
  "Chicken",
  "Turkey",
  "Duck",
] as const;

export const ANIMAL_SEX = ["Male", "Female"] as const;

export const ANIMAL_STATUSES = [
  "active",
  "sold",
  "sick",
  "deceased",
] as const;

export const animalFormSchema = z.object({
  tag_number: z
    .string()
    .trim()
    .min(1, "Tag number is required")
    .max(50, "Tag number is too long"),
  name: z.string().trim().max(100),
  species: z.enum(ANIMAL_SPECIES, {
    message: "Please select a species",
  }),
  breed: z.string().trim().max(100),
  sex: z.union([z.enum(ANIMAL_SEX), z.literal("")]),
  date_of_birth: z.string().trim(),
  arrival_date: z.string().trim(),
  current_weight_kg: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" || (!Number.isNaN(Number(value)) && Number(value) >= 0),
      { message: "Enter a valid weight in kg" }
    ),
});

export type AnimalFormData = z.infer<typeof animalFormSchema>;

export const weightLogSchema = z.object({
  weight_kg: z
    .string()
    .trim()
    .min(1, "Weight is required")
    .refine(
      (value) => !Number.isNaN(Number(value)) && Number(value) > 0,
      { message: "Enter a valid weight in kg" }
    ),
  recorded_at: z.string().trim(),
  notes: z.string().trim(),
});

export type WeightLogFormData = z.infer<typeof weightLogSchema>;

export const vaccinationSchema = z.object({
  vaccine_name: z
    .string()
    .trim()
    .min(1, "Vaccine name is required")
    .max(120, "Vaccine name is too long"),
  date_given: z.string().trim().min(1, "Date given is required"),
  next_due_date: z.string().trim(),
  administered_by: z.string().trim(),
});

export type VaccinationFormData = z.infer<typeof vaccinationSchema>;

export const healthCheckSchema = z.object({
  check_date: z.string().trim().min(1, "Check date is required"),
  findings: z.string().trim(),
  vet_name: z.string().trim(),
});

export type HealthCheckFormData = z.infer<typeof healthCheckSchema>;

export const statusChangeSchema = z
  .object({
    status: z.enum(ANIMAL_STATUSES, {
      message: "Please select a status",
    }),
    sold_to: z.string().trim(),
    sold_price: z
      .string()
      .trim()
      .refine(
        (value) =>
          value === "" || (!Number.isNaN(Number(value)) && Number(value) >= 0),
        { message: "Enter a valid price" }
      ),
    sold_date: z.string().trim(),
    cause_of_death: z.string().trim(),
    notes: z.string().trim(),
  })
  .superRefine((data, ctx) => {
    if (data.status === "sold") {
      if (!data.sold_to) {
        ctx.addIssue({
          code: "custom",
          path: ["sold_to"],
          message: "Buyer name is required when marking as sold",
        });
      }
      if (!data.sold_date) {
        ctx.addIssue({
          code: "custom",
          path: ["sold_date"],
          message: "Sold date is required when marking as sold",
        });
      }
    }

    if (data.status === "deceased" && !data.cause_of_death) {
      ctx.addIssue({
        code: "custom",
        path: ["cause_of_death"],
        message: "Cause of death is required",
      });
    }
  });

export type StatusChangeFormData = z.infer<typeof statusChangeSchema>;
