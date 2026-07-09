"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { MobileNav, type NavLink } from "@/components/layout/MobileNav";
import { cn } from "@/lib/utils";

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/what-we-do", label: "What We Do" },
  { href: "/gallery", label: "Our Farm" },
  { href: "/get-a-quote", label: "Get a Quote" },
];

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
          "sticky top-0 z-40 bg-white transition-shadow duration-200",
          isScrolled && "border-b border-divider shadow-sm"
        )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center">
            {!logoError ? (
              <Image
                src="/logo.png"
                alt="Axis Agro — quality livestock farm in Kaduna, Nigeria"
                width={140}
                height={48}
                className="h-9 w-auto sm:h-10 md:h-12"
                sizes="(max-width: 768px) 120px, 140px"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="font-display text-lg font-bold text-navy sm:text-xl">
                Axis Agro
              </span>
            )}
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "font-label text-sm font-semibold transition-colors",
                    active
                      ? "border-b-2 border-forest pb-1 text-forest"
                      : "text-navy hover:text-forest"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={visitUsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-btn bg-forest px-5 py-2.5 font-label text-sm font-semibold text-white transition-colors hover:bg-forest/90 lg:inline-block"
            >
              Visit Us
            </a>

            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-btn text-navy transition-colors hover:text-forest lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </nav>
      </header>

      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={NAV_LINKS}
        pathname={pathname}
        visitUsHref={visitUsHref}
      />
    </>
  );
}
