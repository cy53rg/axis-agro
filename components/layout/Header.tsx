"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { MobileNav } from "@/components/layout/MobileNav";
import { Button } from "@/components/ui/Button";
import { PUBLIC_NAV_LINKS, SITE_LOGO_PATH, SITE_NAME } from "@/constants/site";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const farmLat = process.env.NEXT_PUBLIC_FARM_LAT;
  const farmLng = process.env.NEXT_PUBLIC_FARM_LNG;
  const visitUsHref = `https://maps.google.com?q=${farmLat},${farmLng}`;
  const isHome = pathname === "/";
  const hasDarkHero =
    isHome ||
    pathname === "/about" ||
    pathname === "/what-we-do" ||
    pathname === "/animals" ||
    pathname === "/gallery";
  const useLightChrome = hasDarkHero && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 border-b bg-transparent backdrop-blur-2xl transition-[border-color] duration-200",
          "supports-[backdrop-filter]:bg-transparent",
          useLightChrome ? "border-white/10" : "border-divider/30",
          isScrolled && (useLightChrome ? "border-white/15" : "border-divider/40")
        )}
      >
        <nav
          className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-3 px-4 sm:h-[5rem] sm:gap-5 sm:px-6 lg:px-8"
          aria-label="Primary"
        >
          <Link
            href="/"
            className="flex h-full max-w-[62%] shrink-0 items-center py-2 sm:max-w-[48%] lg:max-w-none"
            aria-label={`${SITE_NAME} home`}
          >
            {!logoError ? (
              <Image
                src={SITE_LOGO_PATH}
                alt={`${SITE_NAME} quality livestock farm in Kaduna, Nigeria`}
                width={280}
                height={88}
                priority
                className="h-12 w-auto max-w-[176px] object-contain object-left drop-shadow-sm sm:h-14 sm:max-w-[220px] lg:h-[3.75rem] lg:max-w-[260px]"
                sizes="(max-width: 640px) 176px, (max-width: 1024px) 220px, 260px"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span
                className={cn(
                  "font-display text-xl font-bold leading-tight sm:text-2xl",
                  useLightChrome ? "text-white" : "text-navy"
                )}
              >
                {SITE_NAME}
              </span>
            )}
          </Link>

          <div className="hidden items-center gap-0.5 xl:flex">
            {PUBLIC_NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-btn px-3.5 py-2.5 font-label text-[13px] font-semibold tracking-wide transition-colors duration-200",
                    useLightChrome
                      ? active
                        ? "bg-white/20 text-white"
                        : "text-white/90 hover:bg-white/10 hover:text-white"
                      : active
                        ? "bg-forest/10 text-forest"
                        : "text-navy hover:bg-white/40 hover:text-forest"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              href="/get-a-quote"
              variant="primary"
              size="sm"
              className="hidden min-h-10 px-4 text-[13px] sm:inline-flex"
            >
              Get a Quote
            </Button>

            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              className={cn(
                "flex min-h-11 min-w-11 items-center justify-center rounded-btn transition-colors duration-200 xl:hidden",
                useLightChrome
                  ? "text-white hover:bg-white/10"
                  : "text-navy hover:bg-white/40 hover:text-forest"
              )}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>

      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={[...PUBLIC_NAV_LINKS]}
        pathname={pathname}
        visitUsHref={visitUsHref}
      />
    </>
  );
}
