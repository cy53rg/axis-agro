import { ClipboardCheck, Dna, Heart, Users } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Heart,
    title: "Health First Breeding",
    body: "Proper nutrition, housing, and veterinary care for all our animals.",
  },
  {
    icon: Dna,
    title: "Genetically Enhanced Breeds",
    body: "We develop and supply genetically enhanced livestock through selective breeding and professional artificial insemination.",
  },
  {
    icon: ClipboardCheck,
    title: "Consistent Quality",
    body: "Strict health records and production standards across all species.",
  },
  {
    icon: Users,
    title: "Farmer Training",
    body: "Practical knowledge transfer to farmers across Nigeria.",
  },
] as const;

export function WhyJrnAgro() {
  return (
    <section className="bg-forest py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16">
          <div>
            <SectionHeader
              eyebrow="Why Choose Us"
              title="More Than Just a Farm."
              lightMode
            />

            <p className="mt-6 text-[17px] font-normal leading-relaxed text-white/80">
              We are a full livestock operation built around one principle:
              healthy, genetically enhanced animals produce better results. From
              breeding and feeding to record keeping and training, every part of
              what we do is designed to deliver consistent quality for farms
              nationwide.
            </p>

            <Button
              href="/get-a-quote"
              size="lg"
              className="mt-10 bg-white text-navy hover:bg-white/90"
            >
              Request a Quote
            </Button>
          </div>

          <div>
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className={cn(
                    "flex gap-4",
                    index > 0 && "mt-8 border-t border-white/10 pt-8"
                  )}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage">
                    <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-label text-base font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-sm font-normal leading-relaxed text-white/70">
                      {feature.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
