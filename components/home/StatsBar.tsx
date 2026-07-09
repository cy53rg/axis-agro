import { CheckCircle, Dna, GraduationCap, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";

const STATS = [
  {
    icon: CheckCircle,
    label: "5 Species Raised",
    sub: "Cattle, Goats, Chickens, Turkeys, Ducks",
  },
  {
    icon: Dna,
    label: "AI Services",
    sub: "Artificial Insemination Available",
  },
  {
    icon: MapPin,
    label: "Kaduna Based",
    sub: "Serving Northern Nigeria",
  },
  {
    icon: GraduationCap,
    label: "Farmer Training",
    sub: "Practical Knowledge Transfer",
  },
] as const;

export function StatsBar() {
  return (
    <section className="w-full bg-navy py-12">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-0">
          {STATS.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className={cn(
                  "flex items-start gap-3 md:px-6",
                  index > 0 && "md:border-l md:border-white/15"
                )}
              >
                <Icon
                  className="mt-0.5 h-7 w-7 shrink-0 text-gold"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-label text-base font-semibold text-white">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-[13px] font-normal text-white/60">
                    {stat.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
