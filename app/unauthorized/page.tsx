import Link from "next/link";

import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Unauthorized",
};

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-16">
      <div className="max-w-lg text-center">
        <p className="font-label text-sm font-semibold uppercase tracking-wider text-gold">
          403
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold text-navy">
          Access denied
        </h1>
        <p className="mt-4 text-base text-muted">
          You don&apos;t have permission to view this page. If you believe this
          is a mistake, contact a farm manager or owner.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/admin/dashboard">Go to dashboard</Button>
          <Button href="/" variant="outline">
            Back to site
          </Button>
        </div>
        <p className="mt-8 text-sm text-muted">
          Need a different account?{" "}
          <Link
            href="/admin/login"
            className="font-medium text-forest hover:underline"
          >
            Sign in again
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
