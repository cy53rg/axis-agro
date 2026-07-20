"use client";

import {
  ClipboardList,
  Image,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  PawPrint,
  Settings,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import {
  canAccessAnimals,
  canAccessAuditLogs,
} from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  visible: (role: string | null | undefined) => boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    visible: () => true,
  },
  {
    href: "/admin/animals",
    label: "Animals",
    icon: PawPrint,
    visible: (role) => canAccessAnimals(role),
  },
  {
    href: "/admin/audit-logs",
    label: "Audit Logs",
    icon: ClipboardList,
    visible: (role) => canAccessAuditLogs(role),
  },
  {
    href: "/admin/quotes",
    label: "Quotes",
    icon: MessageSquare,
    visible: () => true,
  },
  {
    href: "/admin/gallery",
    label: "Gallery",
    icon: Image,
    visible: () => true,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
    visible: () => true,
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin/dashboard") {
    return pathname === href;
  }

  return pathname.startsWith(href);
}

interface AdminNavProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  userRole?: UserRole | string | null;
}

function NavContent({
  pathname,
  onNavigate,
  onSignOut,
  userRole,
}: {
  pathname: string;
  onNavigate?: () => void;
  onSignOut: () => void;
  userRole?: UserRole | string | null;
}) {
  const items = useMemo(
    () => NAV_ITEMS.filter((item) => item.visible(userRole)),
    [userRole]
  );

  return (
    <>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-r-lg px-4 font-label text-sm font-medium text-navy transition-colors",
                active
                  ? "border-l-[3px] border-forest bg-green-50 text-forest"
                  : "border-l-[3px] border-transparent hover:bg-gray-50"
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#E2E8F0] p-4">
        <button
          type="button"
          onClick={onSignOut}
          className="flex min-h-11 w-full items-center gap-3 rounded-lg px-4 font-label text-sm font-medium text-navy transition-colors hover:bg-gray-50"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
          Sign Out
        </button>
      </div>
    </>
  );
}

export function AdminNav({
  mobileOpen = false,
  onMobileClose,
  userRole = null,
}: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onMobileClose?.();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen, onMobileClose]);

  useEffect(() => {
    onMobileClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <aside className="hidden h-screen w-60 shrink-0 flex-col border-r border-[#E2E8F0] bg-white lg:flex">
        <div className="border-b border-[#E2E8F0] px-5 py-6">
          <p className="font-display text-lg font-bold text-navy">JRN Agro LTD</p>
          <p className="mt-1 text-xs font-normal text-muted">Admin Panel</p>
        </div>
        <NavContent
          pathname={pathname}
          onSignOut={handleSignOut}
          userRole={userRole}
        />
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          aria-label="Close admin menu"
          className={cn(
            "absolute inset-0 bg-navy/40 transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={onMobileClose}
        />

        <aside
          className={cn(
            "absolute left-0 top-0 flex h-full w-full max-w-xs flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Admin navigation"
        >
          <div className="flex items-center justify-between border-b border-[#E2E8F0] px-4 py-4">
            <div>
              <p className="font-display text-lg font-bold text-navy">
                JRN Agro LTD
              </p>
              <p className="text-xs text-muted">Admin Panel</p>
            </div>
            <button
              type="button"
              aria-label="Close admin menu"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-btn text-navy"
              onClick={onMobileClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <NavContent
            pathname={pathname}
            onNavigate={onMobileClose}
            onSignOut={handleSignOut}
            userRole={userRole}
          />
        </aside>
      </div>
    </>
  );
}
