import type { Metadata } from "next";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

import { QuoteForm } from "@/components/forms/QuoteForm";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GoldBorderCard } from "@/components/ui/GoldBorderCard";
import { SITE_CONTACT } from "@/constants/site";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Request a quote from Axis Agro for livestock, poultry, or AI services. We serve Kaduna and Northern Nigeria.",
};

export default function GetAQuotePage() {
  const farmLat = process.env.NEXT_PUBLIC_FARM_LAT ?? "10.5271";
  const farmLng = process.env.NEXT_PUBLIC_FARM_LNG ?? "7.4397";
  const farmAddress =
    process.env.NEXT_PUBLIC_FARM_ADDRESS ?? SITE_CONTACT.address;
  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
  const directionsHref = `https://maps.google.com?q=${farmLat},${farmLng}`;
  const whatsappNumber = SITE_CONTACT.phone.replace(/\D/g, "");
  const whatsappHref = `https://wa.me/${whatsappNumber}`;

  const mapSrc =
    mapsKey && !mapsKey.includes("your_")
      ? `https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${farmLat},${farmLng}&zoom=15`
      : `https://maps.google.com/maps?q=${farmLat},${farmLng}&z=15&output=embed`;

  return (
    <div className="bg-cream">
      <header className="pt-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <Eyebrow>Let&apos;s Talk</Eyebrow>
          <h1 className="mt-3 font-display text-3xl font-bold text-navy sm:text-4xl md:text-5xl">
            Request a Quote
          </h1>
          <p className="mt-4 max-w-2xl text-[17px] font-normal text-muted">
            Fill in the form and we&apos;ll get back to you within 24 hours.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1200px] px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[3fr_2fr] lg:gap-12">
          <div className="w-full">
            <QuoteForm />
          </div>

          <aside className="flex flex-col gap-6">
            <GoldBorderCard className="p-6">
              <Phone
                className="h-6 w-6 text-forest"
                aria-hidden="true"
              />
              <h2 className="mt-3 font-label text-base font-semibold text-navy">
                Prefer to Call?
              </h2>
              <p className="mt-1 text-sm font-medium text-navy">
                Call Us Directly
              </p>
              <a
                href={`tel:${SITE_CONTACT.phone}`}
                className="mt-2 inline-block text-xl font-semibold text-forest transition-colors hover:underline"
              >
                {SITE_CONTACT.phoneDisplay}
              </a>
              <p className="mt-2 text-sm text-muted">{SITE_CONTACT.hours}</p>
            </GoldBorderCard>

            <GoldBorderCard className="p-6">
              <MessageCircle
                className="h-6 w-6 text-[#25D366]"
                aria-hidden="true"
              />
              <h2 className="mt-3 font-label text-base font-semibold text-navy">
                WhatsApp
              </h2>
              <p className="mt-1 text-sm font-medium text-navy">
                Message on WhatsApp
              </p>
              <div className="mt-4">
                <Button
                  href={whatsappHref}
                  variant="outline"
                  className="border-[#25D366] text-[#25D366] hover:bg-[#25D366]/5"
                >
                  Open WhatsApp →
                </Button>
              </div>
              <p className="mt-3 text-sm text-muted">
                Quick responses during business hours
              </p>
            </GoldBorderCard>

            <GoldBorderCard className="p-6">
              <MapPin
                className="h-6 w-6 text-forest"
                aria-hidden="true"
              />
              <h2 className="mt-3 font-label text-base font-semibold text-navy">
                Visit the Farm
              </h2>
              <p className="mt-1 text-sm font-medium text-navy">
                Our Location
              </p>
              <p className="mt-2 text-sm text-body-text">{farmAddress}</p>
              <div className="mt-4 overflow-hidden rounded-btn">
                <iframe
                  title="Axis Agro farm location"
                  src={mapSrc}
                  width="100%"
                  height={200}
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <Link
                href={directionsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center font-label text-sm font-semibold text-forest transition-colors hover:underline"
              >
                Get Directions →
              </Link>
            </GoldBorderCard>
          </aside>
        </div>
      </div>
    </div>
  );
}
