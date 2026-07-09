import { format, parseISO } from "date-fns";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { QuoteStatus } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return format(parseISO(dateString), "d MMMM yyyy");
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  let normalized = digits;
  if (normalized.startsWith("234")) {
    normalized = normalized.slice(3);
  }
  if (normalized.startsWith("0")) {
    normalized = normalized.slice(1);
  }

  if (normalized.length !== 10) {
    return phone;
  }

  return `+234 ${normalized.slice(0, 3)} ${normalized.slice(3, 6)} ${normalized.slice(6)}`;
}

export function getStatusColor(status: QuoteStatus): string {
  const colors: Record<QuoteStatus, string> = {
    new: "bg-blue-100 text-blue-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    responded: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
  };

  return colors[status];
}

export function getStatusLabel(status: QuoteStatus): string {
  const labels: Record<QuoteStatus, string> = {
    new: "New",
    in_progress: "In Progress",
    responded: "Responded",
    closed: "Closed",
  };

  return labels[status];
}
