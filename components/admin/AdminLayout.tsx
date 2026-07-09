"use client";

import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { AdminNav } from "@/components/admin/AdminNav";
import { createClient } from "@/lib/supabase/client";

const PAGE_TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/quotes": "Quote Requests",
  "/admin/gallery": "Gallery Manager",
  "/admin/services": "Services",
  "/admin/content": "Content",
  "/admin/settings": "Site Settings",
};

function getPageTitle(pathname: string) {
  const match = Object.entries(PAGE_TITLES).find(([path]) =>
    pathname.startsWith(path)
  );

  return match?.[1] ?? "Admin";
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    void supabase.auth.getUser().then(({ data: { user } }) => {
      setAdminEmail(user?.email ?? null);
    });
  }, []);

  const pageTitle = getPageTitle(pathname);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <AdminNav
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-[#E2E8F0] bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Open admin menu"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-btn text-navy transition-colors hover:bg-gray-50 lg:hidden"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="truncate font-label text-base font-semibold text-navy sm:text-lg">
              {pageTitle}
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {adminEmail ? (
              <span className="hidden max-w-[160px] truncate text-sm text-muted sm:max-w-none md:inline">
                {adminEmail}
              </span>
            ) : null}
            <span
              className="h-2 w-2 rounded-full bg-forest"
              aria-label="Logged in"
            />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
