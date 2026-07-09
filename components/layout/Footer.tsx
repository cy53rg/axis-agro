import Link from "next/link";

import {
  FOOTER_QUICK_LINKS,
  FOOTER_SERVICES,
  FOOTER_TAGLINE,
  SITE_CONTACT,
  SITE_SOCIAL,
} from "@/constants/site";

export default function Footer() {
  return (
    <footer className="border-t-[3px] border-gold bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <p className="font-display text-2xl font-bold text-white">
              Axis Agro
            </p>
            <p className="text-sm font-normal text-[#9CA3AF]">
              {FOOTER_TAGLINE}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href={SITE_SOCIAL.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-white transition-colors hover:text-gold"
              >
                Facebook
              </a>
              <a
                href={SITE_SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-white transition-colors hover:text-gold"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="font-label text-xs font-semibold uppercase tracking-wider text-gold">
              Navigate
            </p>
            <ul className="mt-4 space-y-3">
              {FOOTER_QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-normal text-white/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="font-label text-xs font-semibold uppercase tracking-wider text-gold">
              What We Do
            </p>
            <ul className="mt-4 space-y-3">
              {FOOTER_SERVICES.map((service) => (
                <li
                  key={service}
                  className="text-sm font-normal text-white/60"
                >
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-label text-xs font-semibold uppercase tracking-wider text-gold">
              Get in Touch
            </p>
            <ul className="mt-4 space-y-3 text-sm font-normal text-[#9CA3AF]">
              <li>
                <span aria-hidden="true">📍 </span>
                {SITE_CONTACT.address}
              </li>
              <li>
                <span aria-hidden="true">📞 </span>
                <a
                  href={`tel:${SITE_CONTACT.phone}`}
                  className="inline-block py-1 text-lg font-semibold text-white transition-colors hover:text-gold sm:text-xl"
                >
                  {SITE_CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <span aria-hidden="true">✉️ </span>
                <a
                  href={`mailto:${SITE_CONTACT.email}`}
                  className="transition-colors hover:text-white"
                >
                  {SITE_CONTACT.email}
                </a>
              </li>
              <li>
                <span aria-hidden="true">🕐 </span>
                {SITE_CONTACT.hours}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-[13px] font-normal text-white/40 sm:flex-row">
            <p>© 2025 Axis Agro. All rights reserved.</p>
            <p>Built for Nigerian Agriculture</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
