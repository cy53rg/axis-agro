"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/Button";
import { SITE_NAME } from "@/constants/site";
import { cn } from "@/lib/utils";

export interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
  pathname: string;
  visitUsHref: string;
}

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export function MobileNav({
  isOpen,
  onClose,
  links,
  pathname,
  visitUsHref,
}: MobileNavProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 xl:hidden",
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      )}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        aria-label="Close menu"
        className={cn(
          "absolute inset-0 bg-navy/40 transition-opacity duration-200 ease-out",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      <div
        id="mobile-navigation"
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-[20rem] flex-col bg-white shadow-lg transition-transform duration-200 ease-out sm:max-w-sm",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        <div className="flex items-center justify-between border-b border-divider px-4 py-3 sm:px-5">
          <div>
            <p className="font-label text-xs font-semibold uppercase tracking-wider text-muted">
              Menu
            </p>
            <p className="mt-0.5 font-display text-lg font-bold text-navy">
              {SITE_NAME}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-btn text-navy transition-colors duration-200 hover:bg-cream hover:text-forest"
            onClick={onClose}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col overflow-y-auto px-3 py-3 sm:px-4">
          {links.map((link) => {
            const active = isActive(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "flex min-h-12 items-center rounded-btn px-3 font-label text-sm font-semibold transition-colors duration-200",
                  active
                    ? "bg-forest/10 text-forest"
                    : "text-navy hover:bg-cream hover:text-forest"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-divider px-4 py-4 sm:px-5 sm:py-5">
          <Button
            href="/get-a-quote"
            variant="primary"
            size="md"
            className="w-full"
            onClick={onClose}
          >
            Get a Quote
          </Button>
          <a
            href={visitUsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 w-full items-center justify-center rounded-btn border border-divider bg-white px-5 font-label text-sm font-semibold text-navy transition-colors duration-200 hover:border-forest hover:text-forest"
            onClick={onClose}
          >
            Visit Us
          </a>
        </div>
      </div>
    </div>
  );
}
