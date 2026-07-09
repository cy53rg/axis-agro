"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { SITE_CONTACT } from "@/constants/site";
import { quoteSchema, type QuoteFormData } from "@/lib/validations/quote";
import { cn } from "@/lib/utils";

const SERVICE_OPTIONS = [
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

const inputClassName =
  "w-full min-h-11 rounded-btn border border-divider px-4 py-3 text-base text-body-text transition-colors focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest sm:text-sm";

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

export function QuoteForm() {
  const [submitError, setSubmitError] = useState(false);
  const [successName, setSuccessName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      quantity: "",
      message: "",
    },
  });

  const messageLength = watch("message")?.length ?? 0;

  const onSubmit = async (data: QuoteFormData) => {
    setSubmitError(false);

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setSubmitError(true);
        return;
      }

      setSuccessName(data.name);
    } catch {
      setSubmitError(true);
    }
  };

  const handleReset = () => {
    reset();
    setSuccessName(null);
    setSubmitError(false);
  };

  if (successName) {
    return (
      <div className="mx-auto max-w-[680px] rounded-card bg-white p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.10)] sm:p-10">
        <CheckCircle
          className="mx-auto h-12 w-12 text-forest"
          aria-hidden="true"
        />
        <h3 className="mt-4 font-display text-2xl font-bold text-navy">
          Thank you, {successName}!
        </h3>
        <p className="mt-3 text-base font-normal text-muted">
          We&apos;ve received your request and will contact you within 24 hours.
          If it&apos;s urgent, call us directly.
        </p>
        <a
          href={`tel:${SITE_CONTACT.phone}`}
          className="mt-6 inline-block text-xl font-semibold text-forest transition-colors hover:underline"
        >
          {SITE_CONTACT.phoneDisplay}
        </a>
        <div className="mt-8">
          <Button type="button" variant="outline" onClick={handleReset}>
            Submit Another Request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[680px] rounded-card bg-white p-6 shadow-[0_8px_32px_rgba(0,0,0,0.10)] sm:p-8 md:p-10">
      {submitError ? (
        <div className="mb-6 rounded-btn border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Something went wrong. Please try again or contact us directly.
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div>
          <FieldLabel required>Full Name</FieldLabel>
          <input
            type="text"
            className={cn(inputClassName, errors.name && "border-red-500")}
            {...register("name")}
          />
          <FieldError message={errors.name?.message} />
        </div>

        <div>
          <FieldLabel required>Phone Number</FieldLabel>
          <input
            type="tel"
            placeholder="08x xxx xxxx"
            className={cn(inputClassName, errors.phone && "border-red-500")}
            {...register("phone")}
          />
          <FieldError message={errors.phone?.message} />
        </div>

        <div>
          <FieldLabel optional>Email Address</FieldLabel>
          <input
            type="email"
            className={cn(inputClassName, errors.email && "border-red-500")}
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <FieldLabel required>Service Interested In</FieldLabel>
          <select
            defaultValue=""
            className={cn(
              inputClassName,
              errors.service_type && "border-red-500"
            )}
            {...register("service_type")}
          >
            <option value="" disabled>
              Select a service...
            </option>
            {SERVICE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <FieldError message={errors.service_type?.message} />
        </div>

        <div>
          <FieldLabel>Quantity or Scale (optional)</FieldLabel>
          <input
            type="text"
            placeholder="e.g. 50 broilers, 2 breeding bulls"
            className={cn(inputClassName, errors.quantity && "border-red-500")}
            {...register("quantity")}
          />
          <FieldError message={errors.quantity?.message} />
        </div>

        <div>
          <FieldLabel required>Your Message</FieldLabel>
          <textarea
            rows={4}
            placeholder="Tell us more about what you need..."
            className={cn(
              inputClassName,
              "resize-y",
              errors.message && "border-red-500"
            )}
            {...register("message")}
          />
          <div className="mt-1.5">
            <FieldError message={errors.message?.message} />
            <p className="text-right text-xs text-muted">
              {messageLength} / 2000
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-btn bg-forest px-6 py-3 font-label text-base font-semibold text-white transition-colors hover:bg-forest/90 disabled:pointer-events-none disabled:opacity-70 sm:text-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              Submitting...
            </>
          ) : (
            "Submit Request →"
          )}
        </button>
      </form>
    </div>
  );
}
