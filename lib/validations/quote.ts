import { z } from "zod";

const serviceTypeValues = [
  "Cattle Purchase",
  "Goat Purchase",
  "Broiler Chickens",
  "Layers",
  "Turkeys",
  "Ducks",
  "AI Services",
  "Farmer Training",
  "Other",
] as const;

const nigerianPhoneRegex = /^(\+?234|0)[789]\d{9}$/;

export const quoteSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(100, "Please enter your full name"),
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/[\s-]/g, ""))
    .refine((value) => nigerianPhoneRegex.test(value), {
      message: "Please enter a valid Nigerian phone number",
    }),
  email: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || z.string().email().safeParse(value).success,
      { message: "Please enter a valid email address" }
    )
    .optional(),
  service_type: z.enum(serviceTypeValues, {
    message: "Please select a service",
  }),
  quantity: z.string().trim().max(200).optional(),
  message: z
    .string()
    .trim()
    .min(10, "Please provide more detail (at least 10 characters)")
    .max(2000, "Please provide more detail (at least 10 characters)"),
});

export type QuoteFormData = z.infer<typeof quoteSchema>;
