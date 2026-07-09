"use client";

import { AdminErrorState } from "@/components/admin/AdminErrorState";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AdminErrorState
      title="Something went wrong"
      message="An unexpected error occurred in the admin panel. Try again or sign out and log back in."
      onRetry={reset}
    />
  );
}
