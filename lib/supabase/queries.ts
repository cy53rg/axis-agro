import type {
  Animal,
  Event,
  GalleryImage,
  QuoteStatus,
  Service,
  Vaccination,
} from "@/types";

import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";

const GALLERY_PUBLIC_COLUMNS =
  "id, url, caption, category, is_featured, display_order";

const SERVICE_PUBLIC_COLUMNS =
  "id, slug, title, description, key_points, icon_name, display_order";

const ANIMAL_PUBLIC_COLUMNS =
  "id, tag_number, name, species, breed, sex, date_of_birth, current_weight_kg, photo_url";

const VACCINATION_PUBLIC_COLUMNS =
  "id, vaccine_name, date_given, next_due_date, administered_by";

const EVENT_PUBLIC_COLUMNS = "id, event_type, event_date, notes";

/** Event types that may contain internal sale/death details — never public. */
const PUBLIC_EVENT_TYPES = [
  "birth",
  "arrival",
  "vaccination",
  "health_check",
  "weight_update",
  "other",
] as const;

export type PublicAnimal = Pick<
  Animal,
  | "id"
  | "tag_number"
  | "name"
  | "species"
  | "breed"
  | "sex"
  | "date_of_birth"
  | "current_weight_kg"
  | "photo_url"
>;

export type PublicVaccination = Pick<
  Vaccination,
  "id" | "vaccine_name" | "date_given" | "next_due_date" | "administered_by"
>;

export type PublicEvent = Pick<
  Event,
  "id" | "event_type" | "event_date" | "notes"
>;

export interface PublicAnimalProfile {
  animal: PublicAnimal;
  vaccinations: PublicVaccination[];
  events: PublicEvent[];
}

export async function getPublicAnimals(): Promise<PublicAnimal[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("animals")
      .select(ANIMAL_PUBLIC_COLUMNS)
      .eq("is_public", true)
      .eq("status", "active")
      .order("tag_number", { ascending: true });

    if (error) {
      console.error("[getPublicAnimals]", error.message);
      return [];
    }

    return (data ?? []) as PublicAnimal[];
  } catch (error) {
    console.error("[getPublicAnimals]", error);
    return [];
  }
}

export async function getPublicAnimalByTag(
  tagNumber: string
): Promise<PublicAnimalProfile | null> {
  try {
    const supabase = createPublicClient();
    const normalizedTag = tagNumber.trim();

    if (!normalizedTag) {
      return null;
    }

    const { data: animal, error: animalError } = await supabase
      .from("animals")
      .select(ANIMAL_PUBLIC_COLUMNS)
      .eq("is_public", true)
      .eq("status", "active")
      .ilike("tag_number", normalizedTag)
      .maybeSingle();

    if (animalError) {
      console.error("[getPublicAnimalByTag]", animalError.message);
      return null;
    }

    if (!animal) {
      return null;
    }

    const publicAnimal = animal as PublicAnimal;

    const [vaccinationsResult, eventsResult] = await Promise.all([
      supabase
        .from("vaccinations")
        .select(VACCINATION_PUBLIC_COLUMNS)
        .eq("animal_id", publicAnimal.id)
        .order("date_given", { ascending: false }),
      supabase
        .from("events")
        .select(EVENT_PUBLIC_COLUMNS)
        .eq("animal_id", publicAnimal.id)
        .eq("is_public", true)
        .in("event_type", [...PUBLIC_EVENT_TYPES])
        .order("event_date", { ascending: false }),
    ]);

    if (vaccinationsResult.error) {
      console.error(
        "[getPublicAnimalByTag] vaccinations:",
        vaccinationsResult.error.message
      );
    }

    if (eventsResult.error) {
      console.error(
        "[getPublicAnimalByTag] events:",
        eventsResult.error.message
      );
    }

    return {
      animal: publicAnimal,
      vaccinations: (vaccinationsResult.data ?? []) as PublicVaccination[],
      events: (eventsResult.data ?? []) as PublicEvent[],
    };
  } catch (error) {
    console.error("[getPublicAnimalByTag]", error);
    return null;
  }
}

/**
 * Lightweight public lookup by tag for hero / directory search.
 * Returns only public-safe fields; never sold/dead or internal notes.
 */
export async function lookupPublicAnimalByTag(
  tagNumber: string
): Promise<PublicAnimal | null> {
  try {
    const normalizedTag = tagNumber.trim();

    if (!normalizedTag || normalizedTag.length > 50) {
      return null;
    }

    // Escape LIKE wildcards so tags are matched literally (case-insensitive).
    const literalTag = normalizedTag
      .replace(/\\/g, "\\\\")
      .replace(/%/g, "\\%")
      .replace(/_/g, "\\_");

    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("animals")
      .select(ANIMAL_PUBLIC_COLUMNS)
      .eq("is_public", true)
      .eq("status", "active")
      .ilike("tag_number", literalTag)
      .maybeSingle();

    if (error) {
      console.error("[lookupPublicAnimalByTag]", error.message);
      return null;
    }

    return (data as PublicAnimal | null) ?? null;
  } catch (error) {
    console.error("[lookupPublicAnimalByTag]", error);
    return null;
  }
}

export async function getGalleryImages(
  category?: string
): Promise<GalleryImage[]> {
  try {
    const supabase = createPublicClient();
    let query = supabase
      .from("gallery_images")
      .select(GALLERY_PUBLIC_COLUMNS)
      .order("display_order", { ascending: true });

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[getGalleryImages]", error.message);
      return [];
    }

    return (data ?? []) as GalleryImage[];
  } catch (error) {
    console.error("[getGalleryImages]", error);
    return [];
  }
}

export async function getFeaturedGalleryImages(
  limit = 6
): Promise<GalleryImage[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("gallery_images")
      .select(GALLERY_PUBLIC_COLUMNS)
      .eq("is_featured", true)
      .order("display_order", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("[getFeaturedGalleryImages]", error.message);
      return [];
    }

    return (data ?? []) as GalleryImage[];
  } catch (error) {
    console.error("[getFeaturedGalleryImages]", error);
    return [];
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("services")
      .select(SERVICE_PUBLIC_COLUMNS)
      .eq("is_visible", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[getServices]", error.message);
      return [];
    }

    return (data ?? []) as Service[];
  } catch (error) {
    console.error("[getServices]", error);
    return [];
  }
}

export async function getSiteContent(): Promise<Record<string, string>> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("site_content")
      .select("key, value");

    if (error) {
      console.error("[getSiteContent]", error.message);
      return {};
    }

    return Object.fromEntries(
      (data ?? []).map((row: { key: string; value: string }) => [
        row.key,
        row.value,
      ])
    );
  } catch (error) {
    console.error("[getSiteContent]", error);
    return {};
  }
}

export async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value");

    if (error) {
      console.error("[getSiteSettings]", error.message);
      return {};
    }

    return Object.fromEntries(
      (data ?? []).map((row: { key: string; value: string }) => [
        row.key,
        row.value,
      ])
    );
  } catch (error) {
    console.error("[getSiteSettings]", error);
    return {};
  }
}

export interface DashboardQuote {
  id: string;
  name: string;
  service_type: string;
  status: QuoteStatus;
  created_at: string;
}

export interface DashboardStats {
  totalQuotes: number;
  newQuotes: number;
  galleryCount: number;
  recentQuotes: DashboardQuote[];
  hasError?: boolean;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const empty: DashboardStats = {
    totalQuotes: 0,
    newQuotes: 0,
    galleryCount: 0,
    recentQuotes: [],
    hasError: false,
  };

  try {
    const supabase = await createClient();

    const [
      { count: totalQuotes, error: totalError },
      { count: newQuotes, error: newError },
      { count: galleryCount, error: galleryError },
      { data: recentQuotes, error: recentError },
    ] = await Promise.all([
      supabase
        .from("quote_requests")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("quote_requests")
        .select("id", { count: "exact", head: true })
        .eq("status", "new"),
      supabase
        .from("gallery_images")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("quote_requests")
        .select("id, name, service_type, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    if (totalError || newError || galleryError || recentError) {
      console.error("[getDashboardStats]", {
        totalError,
        newError,
        galleryError,
        recentError,
      });
      return { ...empty, hasError: true };
    }

    return {
      totalQuotes: totalQuotes ?? 0,
      newQuotes: newQuotes ?? 0,
      galleryCount: galleryCount ?? 0,
      recentQuotes: (recentQuotes ?? []) as DashboardQuote[],
      hasError: false,
    };
  } catch (error) {
    console.error("[getDashboardStats]", error);
    return { ...empty, hasError: true };
  }
}
