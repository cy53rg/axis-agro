import type { Metadata } from "next";
import { ExternalLink, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { MapEmbed } from "@/components/MapEmbed";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SITE_CONTACT } from "@/constants/site";

export const metadata: Metadata = {
  title: "Contact & Visit",
  description:
    "Get in touch with JRN Agro LTD. Visit our farm in Kaduna or contact us by phone, WhatsApp, or email.",
};

const BUSINESS_HOURS = [
  { day: "Monday – Friday", hours: "7:00 AM – 6:00 PM" },
  { day: "Saturday", hours: "7:00 AM – 4:00 PM" },
  { day: "Sunday", hours: "Closed" },
] as const;

interface ContactItemProps {
  icon: React.ReactNode;
  title: string;
  detail: React.ReactNode;
  sub?: string;
}

function ContactItem({ icon, title, detail, sub }: ContactItemProps) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0">{icon}</div>
      <div>
        <h3 className="font-label text-base font-semibold text-navy">{title}</h3>
        <div className="mt-1 text-[15px] font-normal text-body-text">{detail}</div>
        {sub ? (
          <p className="mt-1 text-[13px] font-normal text-muted">{sub}</p>
        ) : null}
      </div>
    </div>
  );
}

export default function ContactPage() {
  const farmLat = Number(process.env.NEXT_PUBLIC_FARM_LAT ?? "10.5271");
  const farmLng = Number(process.env.NEXT_PUBLIC_FARM_LNG ?? "7.4397");
  const farmAddress =
    process.env.NEXT_PUBLIC_FARM_ADDRESS ?? SITE_CONTACT.address;
  const directionsHref = `https://maps.google.com/?q=${farmLat},${farmLng}`;
  const whatsappNumber = SITE_CONTACT.phone.replace(/\D/g, "");
  const whatsappHref = `https://wa.me/${whatsappNumber}`;

  return (
    <>
      <section className="bg-cream pb-16 pt-[calc(4.25rem+2.5rem)] text-center sm:pt-[calc(5rem+2.5rem)]">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6">
          <Eyebrow>Find Us</Eyebrow>
          <h1 className="mt-3 font-display text-3xl font-bold text-navy sm:text-4xl md:text-5xl">
            Contact & Visit
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[17px] font-normal text-muted">
            We&apos;re based in Kaduna, Nigeria. Come visit the farm or reach out
            any way that suits you.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[2fr_3fr] lg:gap-16">
            <div className="order-2 lg:order-1">
              <SectionHeader eyebrow="Get in Touch" title="Reach Out" />

              <div className="mt-8 space-y-6">
                <ContactItem
                  icon={
                    <Phone
                      className="h-8 w-8 text-forest"
                      aria-hidden="true"
                    />
                  }
                  title="Call Us"
                  detail={
                    <a
                      href={`tel:${SITE_CONTACT.phone}`}
                      className="inline-block py-1 text-lg font-semibold text-forest transition-colors hover:underline sm:text-xl"
                    >
                      {SITE_CONTACT.phoneDisplay}
                    </a>
                  }
                  sub="Mon – Sat, 7:00am – 6:00pm"
                />

                <ContactItem
                  icon={
                    <MessageCircle
                      className="h-8 w-8 text-forest"
                      aria-hidden="true"
                    />
                  }
                  title="WhatsApp"
                  detail={
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-forest transition-colors hover:underline"
                    >
                      Message us on WhatsApp
                    </a>
                  }
                  sub="Quick responses during business hours"
                />

                <ContactItem
                  icon={
                    <Mail className="h-8 w-8 text-forest" aria-hidden="true" />
                  }
                  title="Email Us"
                  detail={
                    <a
                      href={`mailto:${SITE_CONTACT.email}`}
                      className="font-medium text-forest transition-colors hover:underline"
                    >
                      {SITE_CONTACT.email}
                    </a>
                  }
                />

                <ContactItem
                  icon={
                    <MapPin
                      className="h-8 w-8 text-forest"
                      aria-hidden="true"
                    />
                  }
                  title="Our Location"
                  detail={farmAddress}
                  sub="Kaduna State, Nigeria"
                />
              </div>

              <div className="mt-10">
                <a
                  href={directionsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-btn bg-forest px-6 py-3 font-label text-base font-semibold text-white transition-colors hover:bg-forest/90"
                >
                  Get Directions
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <MapEmbed
                lat={farmLat}
                lng={farmLng}
                address={farmAddress}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream py-24">
        <div className="mx-auto max-w-[600px] px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
            Business Hours
          </h2>

          <div className="mt-8 overflow-hidden rounded-card bg-white shadow-[0_2px_16px_rgba(0,0,0,0.07)]">
            <table className="w-full text-left">
              <tbody>
                {BUSINESS_HOURS.map((row) => (
                  <tr
                    key={row.day}
                    className="border-b border-divider last:border-b-0"
                  >
                    <td className="px-6 py-4 text-[15px] font-medium text-navy">
                      {row.day}
                    </td>
                    <td className="px-6 py-4 text-[15px] font-normal text-body-text">
                      {row.hours}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm text-muted">
            * Hours may vary during public holidays
          </p>
        </div>
      </section>
    </>
  );
}
