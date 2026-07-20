import type { UserRole } from "@/types";

export const USER_ROLES: readonly UserRole[] = [
  "worker",
  "manager",
  "owner",
] as const;

/** Roles that may access /admin/animals and create animal logs. */
export const ANIMAL_ACCESS_ROLES: readonly UserRole[] = [
  "worker",
  "manager",
  "owner",
] as const;

/** Roles that may access /admin/audit-logs and related APIs. */
export const AUDIT_LOG_ACCESS_ROLES: readonly UserRole[] = [
  "manager",
  "owner",
] as const;

export function isUserRole(value: string | null | undefined): value is UserRole {
  return !!value && USER_ROLES.includes(value as UserRole);
}

export function hasRole(
  role: string | null | undefined,
  allowed: readonly UserRole[]
): boolean {
  return isUserRole(role) && allowed.includes(role);
}

export function canAccessAnimals(role: string | null | undefined): boolean {
  return hasRole(role, ANIMAL_ACCESS_ROLES);
}

export function canAccessAuditLogs(role: string | null | undefined): boolean {
  return hasRole(role, AUDIT_LOG_ACCESS_ROLES);
}
