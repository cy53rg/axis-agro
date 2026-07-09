export type ServiceType =
  | "Cattle Purchase"
  | "Goat Purchase"
  | "Broiler Chickens"
  | "Layers"
  | "Turkeys"
  | "Ducks"
  | "AI Services"
  | "Farmer Training"
  | "Other";

export type QuoteStatus = "new" | "in_progress" | "responded" | "closed";

export type GalleryCategory =
  | "Cattle & Goats"
  | "Poultry"
  | "Farm Facilities"
  | "General";

export interface GalleryImage {
  id: string;
  url: string;
  storage_path: string;
  caption: string;
  category: GalleryCategory;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  key_points: string[];
  icon_name: string;
  is_visible: boolean;
  display_order: number;
}

export interface QuoteRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  service_type: ServiceType;
  quantity: string;
  message: string;
  status: QuoteStatus;
  admin_notes: string;
  created_at: string;
}

export interface SiteContent {
  key: string;
  value: string;
}

export interface SiteSetting {
  key: string;
  value: string;
}
