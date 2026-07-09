import type { GalleryImage, QuoteStatus, Service } from "@/types";

import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";

const GALLERY_PUBLIC_COLUMNS =
  "id, url, caption, category, is_featured, display_order";

const SERVICE_PUBLIC_COLUMNS =
  "id, slug, title, description, key_points, icon_name, display_order";

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
