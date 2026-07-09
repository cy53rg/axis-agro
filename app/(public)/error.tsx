"use client";

import { Button } from "@/components/ui/Button";
import { SITE_CONTACT } from "@/constants/site";

export default function PublicError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-cream px-4 py-16">
      <div className="max-w-lg text-center">
        <h1 className="font-display text-3xl font-bold text-navy">
          Something went wrong loading this page.
        </h1>
        <p className="mt-4 text-base text-muted">
          Please try again. If the problem continues, contact us directly and
          we&apos;ll help you from the farm.
        </p>

        <div className="mt-8">
          <Button type="button" onClick={reset}>
            Try Again
          </Button>
        </div>

        <div className="mt-10 rounded-lg bg-white p-6 text-left shadow-sm">
          <p className="text-sm font-medium text-navy">Reach Axis Agro</p>
          <p className="mt-3 text-sm text-body-text">
            <a
              href={`tel:${SITE_CONTACT.phone}`}
              className="font-medium text-forest hover:underline"
            >
              {SITE_CONTACT.phoneDisplay}
            </a>
          </p>
          <p className="mt-2 text-sm text-body-text">
            <a
              href={`mailto:${SITE_CONTACT.email}`}
              className="font-medium text-forest hover:underline"
            >
              {SITE_CONTACT.email}
            </a>
          </p>
          <p className="mt-2 text-sm text-muted">{SITE_CONTACT.address}</p>
        </div>
      </div>
    </div>
  );
}
