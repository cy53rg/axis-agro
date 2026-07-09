import Link from "next/link";

import { Button } from "@/components/ui/Button";

export default function PublicNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-cream px-4 py-16">
      <div className="max-w-lg text-center">
        <p className="font-display text-5xl font-bold text-navy">Axis Agro</p>
        <h1 className="mt-6 font-display text-4xl font-bold text-navy">
          Page Not Found
        </h1>
        <p className="mt-4 text-base text-muted">
          This page doesn&apos;t exist. Maybe start from the home page.
        </p>
        <div className="mt-8">
          <Button href="/">Back to Home</Button>
        </div>
        <p className="mt-8 text-sm text-muted">
          Looking for something specific?{" "}
          <Link href="/contact" className="font-medium text-forest hover:underline">
            Contact us
          </Link>{" "}
          or{" "}
          <Link
            href="/get-a-quote"
            className="font-medium text-forest hover:underline"
          >
            request a quote
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
