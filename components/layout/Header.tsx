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
          "sticky top-0 z-40 bg-white/95 backdrop-blur-sm transition-[box-shadow,border-color] duration-200",
          isScrolled && "border-b border-divider shadow-sm"
        )}
      >
        <nav
          className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-[4.5rem] sm:gap-4 sm:px-6 lg:px-8"
          aria-label="Primary"
        >
          <Link
            href="/"
            className="flex h-full max-w-[55%] shrink-0 items-center sm:max-w-[40%] lg:max-w-none"
            aria-label={`${SITE_NAME} home`}
          >
            {!logoError ? (
              <Image
                src={SITE_LOGO_PATH}
                alt={`${SITE_NAME} — quality livestock farm in Kaduna, Nigeria`}
                width={200}
                height={64}
                priority
                className="h-10 w-auto max-w-[148px] object-contain object-left sm:h-11 sm:max-w-[168px] lg:h-12 lg:max-w-[200px]"
                sizes="(max-width: 640px) 148px, (max-width: 1024px) 168px, 200px"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="font-display text-lg font-bold leading-tight text-navy sm:text-xl">
                {SITE_NAME}
              </span>
            )}
          </Link>

          <div className="hidden items-center gap-1 xl:flex">
            {PUBLIC_NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-btn px-3 py-2 font-label text-[13px] font-semibold tracking-wide transition-colors duration-200",
                    active
                      ? "bg-forest/10 text-forest"
                      : "text-navy hover:bg-cream hover:text-forest"
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
              className="flex min-h-11 min-w-11 items-center justify-center rounded-btn text-navy transition-colors duration-200 hover:bg-cream hover:text-forest xl:hidden"
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
