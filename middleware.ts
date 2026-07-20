import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import {
  canAccessAnimals,
  canAccessAuditLogs,
} from "@/lib/auth/rbac";
import { attachRoleToUser } from "@/lib/supabase/auth";
import type { AppSession } from "@/types/auth";

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie.name, cookie.value);
  });
  return to;
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let session: AppSession | null = null;

  if (user) {
    const enrichedUser = await attachRoleToUser(supabase, user);

    const {
      data: { session: rawSession },
    } = await supabase.auth.getSession();

    if (rawSession) {
      session = rawSession as AppSession;
      session.user = enrichedUser;
    }
  }

  const { pathname } = request.nextUrl;
  const role = session?.user.role;
  const isApi = pathname.startsWith("/api/");

  // ─── API RBAC ───────────────────────────────────────────────────────────────
  if (pathname.startsWith("/api/admin/audit-logs")) {
    if (!session?.user) {
      return copyCookies(
        supabaseResponse,
        NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      );
    }
    if (!canAccessAuditLogs(role)) {
      return copyCookies(
        supabaseResponse,
        NextResponse.json({ error: "Forbidden" }, { status: 403 })
      );
    }
    return supabaseResponse;
  }

  if (
    pathname.startsWith("/api/admin/animals") &&
    (pathname.includes("/weight-logs") ||
      pathname.includes("/vaccinations") ||
      pathname.includes("/health-checks") ||
      pathname.includes("/logs"))
  ) {
    if (!session?.user) {
      return copyCookies(
        supabaseResponse,
        NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      );
    }
    if (!canAccessAnimals(role)) {
      return copyCookies(
        supabaseResponse,
        NextResponse.json({ error: "Forbidden" }, { status: 403 })
      );
    }
    return supabaseResponse;
  }

  if (isApi) {
    return supabaseResponse;
  }

  // ─── Page RBAC ──────────────────────────────────────────────────────────────
  let redirectUrl: string | null = null;

  if (pathname.startsWith("/admin")) {
    if (!session?.user && pathname !== "/admin/login") {
      redirectUrl = "/admin/login";
    } else if (
      session?.user &&
      (pathname === "/admin/login" || pathname === "/admin")
    ) {
      redirectUrl = "/admin/dashboard";
    } else if (session?.user && pathname.startsWith("/admin/audit-logs")) {
      if (!canAccessAuditLogs(role)) {
        redirectUrl = "/unauthorized";
      }
    } else if (session?.user && pathname.startsWith("/admin/animals")) {
      if (!canAccessAnimals(role)) {
        redirectUrl = "/unauthorized";
      }
    }
  }

  if (redirectUrl) {
    return copyCookies(
      supabaseResponse,
      NextResponse.redirect(new URL(redirectUrl, request.url))
    );
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
