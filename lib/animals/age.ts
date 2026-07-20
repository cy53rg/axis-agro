import {
  differenceInCalendarDays,
  differenceInMonths,
  differenceInYears,
  parseISO,
} from "date-fns";

/**
 * Exact calendar age broken into years, months, and days,
 * computed dynamically from date_of_birth (never stored).
 */
export interface AnimalAge {
  years: number;
  months: number;
  days: number;
}

/**
 * Computes an animal's exact age from `date_of_birth`.
 * Returns null when the date is missing or invalid.
 */
export function getAnimalAge(
  dateOfBirth: string | null | undefined,
  asOf: Date = new Date()
): AnimalAge | null {
  if (!dateOfBirth) {
    return null;
  }

  try {
    const dob = parseISO(dateOfBirth);

    if (Number.isNaN(dob.getTime()) || dob > asOf) {
      return null;
    }

    const years = differenceInYears(asOf, dob);
    const afterYears = new Date(dob);
    afterYears.setFullYear(afterYears.getFullYear() + years);

    const months = differenceInMonths(asOf, afterYears);
    const afterMonths = new Date(afterYears);
    afterMonths.setMonth(afterMonths.getMonth() + months);

    const days = Math.max(0, differenceInCalendarDays(asOf, afterMonths));

    return { years, months, days };
  } catch {
    return null;
  }
}

function pluralize(value: number, unit: string): string {
  return `${value} ${unit}${value === 1 ? "" : "s"}`;
}

/**
 * Formats an exact age string from date_of_birth, e.g. "2 years, 3 months, 5 days".
 */
export function formatAnimalAge(
  dateOfBirth: string | null | undefined,
  asOf: Date = new Date()
): string {
  const age = getAnimalAge(dateOfBirth, asOf);

  if (!age) {
    return "—";
  }

  const parts: string[] = [];

  if (age.years > 0) {
    parts.push(pluralize(age.years, "year"));
  }
  if (age.months > 0) {
    parts.push(pluralize(age.months, "month"));
  }
  if (age.days > 0 || parts.length === 0) {
    parts.push(pluralize(age.days, "day"));
  }

  return parts.join(", ");
}
