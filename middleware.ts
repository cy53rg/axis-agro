import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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

  const { pathname } = request.nextUrl;
  let redirectUrl: string | null = null;

  // Handle Admin Routes Routing Logic
  if (pathname.startsWith("/admin")) {
    if (!user && pathname !== "/admin/login") {
      // Unauthenticated users trying to access ANY admin page get sent to login
      redirectUrl = "/admin/login";
    } else if (user && (pathname === "/admin/login" || pathname === "/admin")) {
      // Authenticated users on the login page or the base /admin route get sent to dashboard
      redirectUrl = "/admin/dashboard";
    }
  }

  // If a redirect is required, we must transfer the cookies from supabaseResponse
  if (redirectUrl) {
    const redirectResponse = NextResponse.redirect(new URL(redirectUrl, request.url));
    
    // CRITICAL: Prevent token drops by transferring refreshed cookies
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    
    return redirectResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};