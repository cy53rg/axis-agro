"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

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
        "fixed inset-0 z-50 lg:hidden",
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      )}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        aria-label="Close menu"
        className={cn(
          "absolute inset-0 bg-navy/40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between border-b border-divider px-4 py-4 sm:px-6">
          <span className="font-label text-sm font-semibold uppercase tracking-wide text-navy">
            Menu
          </span>
          <button
            type="button"
            aria-label="Close menu"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-btn text-navy transition-colors hover:text-forest"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col px-4 py-4 sm:px-6">
          {links.map((link) => {
            const active = isActive(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "flex min-h-11 items-center border-b border-divider font-label text-sm font-semibold transition-colors",
                  active
                    ? "text-forest"
                    : "text-navy hover:text-forest"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-divider px-4 py-4 sm:px-6 sm:py-6">
          <a
            href={visitUsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 w-full items-center justify-center rounded-btn bg-forest px-5 font-label text-sm font-semibold text-white transition-colors hover:bg-forest/90"
            onClick={onClose}
          >
            Visit Us
          </a>
        </div>
      </div>
    </div>
  );
}
