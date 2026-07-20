import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AnimalStatus } from "@/types";

export const ANIMAL_STATUS_OPTIONS: {
  value: AnimalStatus;
  label: string;
}[] = [
  { value: "active", label: "Active" },
  { value: "sick", label: "Sick" },
  { value: "sold", label: "Sold" },
  { value: "deceased", label: "Dead" },
];

export function getAnimalStatusLabel(status: AnimalStatus): string {
  return (
    ANIMAL_STATUS_OPTIONS.find((option) => option.value === status)?.label ??
    status
  );
}

export function AnimalStatusBadge({
  status,
  className,
}: {
  status: AnimalStatus;
  className?: string;
}) {
  const styles: Record<AnimalStatus, string> = {
    active: "border-transparent bg-green-100 text-green-800",
    sick: "border-transparent bg-amber-100 text-amber-900",
    sold: "border-transparent bg-slate-200 text-slate-700",
    deceased: "border-transparent bg-red-100 text-red-800",
  };

  return (
    <Badge
      variant="outline"
      className={cn("rounded-full px-2.5 py-0.5 font-semibold", styles[status], className)}
    >
      {getAnimalStatusLabel(status)}
    </Badge>
  );
}
