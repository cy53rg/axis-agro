import { AlertCircle } from "lucide-react";

interface AdminErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function AdminErrorState({
  title = "Unable to load data",
  message,
  onRetry,
}: AdminErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 px-6 py-12 text-center">
      <AlertCircle className="h-10 w-10 text-red-600" aria-hidden="true" />
      <h3 className="mt-4 font-label text-lg font-semibold text-navy">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-body-text">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-btn bg-forest px-5 py-2.5 font-label text-sm font-semibold text-white transition-colors hover:bg-forest/90"
        >
          Try Again
        </button>
      ) : null}
    </div>
  );
}
