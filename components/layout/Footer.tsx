import Link from "next/link";

import {
  FOOTER_QUICK_LINKS,
  FOOTER_SERVICES,
  FOOTER_TAGLINE,
  SITE_COMPLIANCE,
  SITE_CONTACT,
  SITE_NAME,
  SITE_SOCIAL,
} from "@/constants/site";

export default function Footer() {
  return (
    <footer className="border-t-[3px] border-gold bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div className="space-y-3 sm:space-y-4">
            <p className="font-display text-xl font-bold text-white sm:text-2xl">
              {SITE_NAME}
            </p>
            <p className="max-w-xs text-sm font-normal leading-relaxed text-white/60">
              {FOOTER_TAGLINE}
            </p>
            <p className="text-xs font-normal leading-relaxed text-white/45">
              {SITE_COMPLIANCE.legalName} · RC {SITE_COMPLIANCE.rcNumber} ·{" "}
              <Link
                href="/about#corporate-compliance"
                className="underline-offset-2 transition-colors hover:text-gold hover:underline"
              >
                View CAC certificate
              </Link>
            </p>
            <div className="flex items-center gap-5 pt-1">
              <a
                href={SITE_SOCIAL.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center text-sm font-semibold text-white transition-colors hover:text-gold"
              >
                Facebook
              </a>
              <a
                href={SITE_SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center text-sm font-semibold text-white transition-colors hover:text-gold"
              >
                Instagram
              </a>
            </div>
          </div>

          <div>
            <p className="font-label text-[11px] font-semibold uppercase tracking-wider text-gold sm:text-xs">
              Navigate
            </p>
            <ul className="mt-3 space-y-1 sm:mt-4">
              {FOOTER_QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-10 items-center text-sm font-normal text-white/75 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-label text-[11px] font-semibold uppercase tracking-wider text-gold sm:text-xs">
              What We Do
            </p>
            <ul className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
              {FOOTER_SERVICES.map((service) => (
                <li
                  key={service}
                  className="text-sm font-normal text-white/55"
                >
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-label text-[11px] font-semibold uppercase tracking-wider text-gold sm:text-xs">
              Get in Touch
            </p>
            <ul className="mt-3 space-y-3 text-sm font-normal text-white/60 sm:mt-4">
              <li className="leading-relaxed">{SITE_CONTACT.address}</li>
              <li>
                <a
                  href={`tel:${SITE_CONTACT.phone}`}
                  className="inline-flex min-h-11 items-center text-base font-semibold text-white transition-colors hover:text-gold sm:text-lg"
                >
                  {SITE_CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_CONTACT.email}`}
                  className="inline-flex min-h-10 items-center break-all transition-colors hover:text-white"
                >
                  {SITE_CONTACT.email}
                </a>
              </li>
              <li>{SITE_CONTACT.hours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 sm:mt-12 sm:pt-8">
          <div className="flex flex-col items-center justify-between gap-3 text-center text-xs font-normal text-white/40 sm:flex-row sm:text-left sm:text-[13px]">
            <p>
              © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
            </p>
            <p>Built for Nigerian Agriculture</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
