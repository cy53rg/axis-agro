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

export type AnimalStatus = "active" | "sold" | "sick" | "deceased";

export type EventType =
  | "birth"
  | "arrival"
  | "vaccination"
  | "health_check"
  | "weight_update"
  | "status_change"
  | "sold"
  | "death"
  | "other";

export type AuditAction = "insert" | "update" | "delete";

export interface Animal {
  id: string;
  tag_number: string;
  name: string;
  species: string;
  breed: string;
  sex: string;
  date_of_birth: string;
  arrival_date: string;
  current_weight_kg: number;
  status: AnimalStatus;
  photo_url: string;
  internal_notes: string;
  cause_of_death: string;
  sold_to: string;
  sold_price: number;
  sold_date: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface WeightLog {
  id: string;
  animal_id: string;
  weight_kg: number;
  recorded_at: string;
  recorded_by: string;
  notes: string;
}

export interface Vaccination {
  id: string;
  animal_id: string;
  vaccine_name: string;
  date_given: string;
  next_due_date: string;
  administered_by: string;
  recorded_by: string;
}

export interface HealthCheck {
  id: string;
  animal_id: string;
  check_date: string;
  findings: string;
  vet_name: string;
  recorded_by: string;
}

export interface Event {
  id: string;
  animal_id: string;
  event_type: EventType;
  event_date: string;
  notes: string;
  is_public: boolean;
  recorded_by: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  action: AuditAction;
  table_name: string;
  record_id: string;
  before_data: Record<string, unknown>;
  after_data: Record<string, unknown>;
  created_at: string;
}

export interface AnimalWithHistory extends Animal {
  weight_logs: WeightLog[];
  vaccinations: Vaccination[];
  health_checks: HealthCheck[];
  events: Event[];
}

export type UserRole = "worker" | "manager" | "owner";

export interface Profile {
  id: string;
  role: UserRole;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLogEntry extends AuditLog {
  actor_email: string | null;
}
