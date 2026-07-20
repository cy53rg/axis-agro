import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SectionHeader } from "@/components/ui/SectionHeader";

interface AboutSnapshotProps {
  imageUrl?: string;
}

export function AboutSnapshot({
  imageUrl = "/about-farm.jpg",
}: AboutSnapshotProps) {
  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 md:gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-card shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
            <Image
              src={imageUrl}
              alt="Livestock and poultry at JRN Agro LTD farm in Kaduna, Nigeria"
              fill
              loading="lazy"
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="order-2">
            <SectionHeader
              eyebrow="Who We Are"
              title="A Farm Built on Precision and Care"
            />

            <p className="mt-6 text-[17px] font-normal leading-[1.7] text-body-text">
              We raise cattle, goats, chickens, turkeys, and ducks with a focus
              on health, proper nutrition, and genetically enhanced breeding
              programmes. Our artificial insemination services help herds perform
              better, and our training programmes pass that knowledge on to
              farmers across Nigeria.
            </p>

            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 font-label text-[15px] font-semibold text-forest transition-colors hover:underline"
            >
              Read our full story
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
