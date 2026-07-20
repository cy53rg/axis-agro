"use client";

import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { AdminErrorState } from "@/components/admin/AdminErrorState";

type ToastType = "success" | "error";

interface ToastState {
  type: ToastType;
  message: string;
}

interface ContactForm {
  farm_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  farm_hours: string;
}

interface LocationForm {
  farm_lat: string;
  farm_lng: string;
  google_maps_link: string;
}

interface SocialForm {
  facebook_url: string;
  instagram_url: string;
}

interface NotificationForm {
  admin_email: string;
}

const inputClassName =
  "w-full rounded-btn border border-divider px-4 py-3 text-sm text-body-text transition-colors focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-navy">{label}</label>
      {children}
    </div>
  );
}

function SettingsCard({
  title,
  children,
  onSave,
  isSaving,
}: {
  title: string;
  children: React.ReactNode;
  onSave: () => void;
  isSaving: boolean;
}) {
  return (
    <section className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="font-label text-lg font-semibold text-navy">{title}</h3>
      <div className="mt-6 space-y-4">{children}</div>
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-btn bg-forest px-5 py-2.5 font-label text-sm font-semibold text-white transition-colors hover:bg-forest/90 disabled:opacity-70"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </section>
  );
}

function settingsToMap(
  rows: { key: string; value: string }[]
): Record<string, string> {
  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
}

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [savingCard, setSavingCard] = useState<string | null>(null);

  const [contact, setContact] = useState<ContactForm>({
    farm_name: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    farm_hours: "",
  });

  const [location, setLocation] = useState<LocationForm>({
    farm_lat: "",
    farm_lng: "",
    google_maps_link: "",
  });

  const [social, setSocial] = useState<SocialForm>({
    facebook_url: "",
    instagram_url: "",
  });

  const [notification, setNotification] = useState<NotificationForm>({
    admin_email: "",
  });

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 4000);
  };

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("site_settings").select("*");

      if (error) {
        throw new Error(error.message);
      }

      const settings = settingsToMap(data ?? []);

      setContact({
        farm_name: settings.farm_name ?? "",
        phone: settings.phone ?? "",
        whatsapp: settings.whatsapp ?? "",
        email: settings.email ?? "",
        address: settings.address ?? "",
        farm_hours: settings.farm_hours ?? "",
      });

      setLocation({
        farm_lat: settings.farm_lat ?? "",
        farm_lng: settings.farm_lng ?? "",
        google_maps_link: settings.google_maps_link ?? "",
      });

      setSocial({
        facebook_url: settings.facebook_url ?? "",
        instagram_url: settings.instagram_url ?? "",
      });

      setNotification({
        admin_email: settings.admin_email ?? "",
      });

      setIsLoading(false);
    } catch (error) {
      console.error("[admin/settings] fetch failed:", error);
      setFetchError(
        "We couldn't load site settings. Check your connection and try again."
      );
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSettings();
  }, [fetchSettings]);

  const upsertSettings = async (
    cardKey: string,
    entries: { key: string; value: string }[]
  ) => {
    setSavingCard(cardKey);
    const supabase = createClient();
    const { error } = await supabase
      .from("site_settings")
      .upsert(entries, { onConflict: "key" });

    setSavingCard(null);

    if (error) {
      console.error("[admin/settings] save failed:", error.message);
      showToast("error", "Failed to save settings. Please try again.");
      return;
    }

    showToast("success", "Settings saved successfully.");
  };

  const saveContact = () => {
    void upsertSettings("contact", [
      { key: "farm_name", value: contact.farm_name },
      { key: "phone", value: contact.phone },
      { key: "whatsapp", value: contact.whatsapp },
      { key: "email", value: contact.email },
      { key: "address", value: contact.address },
      { key: "farm_hours", value: contact.farm_hours },
    ]);
  };

  const saveLocation = () => {
    void upsertSettings("location", [
      { key: "farm_lat", value: location.farm_lat },
      { key: "farm_lng", value: location.farm_lng },
      { key: "google_maps_link", value: location.google_maps_link },
    ]);
  };

  const saveSocial = () => {
    void upsertSettings("social", [
      { key: "facebook_url", value: social.facebook_url },
      { key: "instagram_url", value: social.instagram_url },
    ]);
  };

  const saveNotification = () => {
    void upsertSettings("notification", [
      { key: "admin_email", value: notification.admin_email },
    ]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
        Loading settings...
      </div>
    );
  }

  if (fetchError) {
    return (
      <AdminErrorState
        message={fetchError}
        onRetry={() => void fetchSettings()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-label text-2xl font-semibold text-navy">
        Site Settings
      </h2>

      <SettingsCard
        title="Contact Information"
        onSave={saveContact}
        isSaving={savingCard === "contact"}
      >
        <Field label="Farm Name">
          <input
            type="text"
            value={contact.farm_name}
            onChange={(event) =>
              setContact((current) => ({
                ...current,
                farm_name: event.target.value,
              }))
            }
            className={inputClassName}
          />
        </Field>
        <Field label="Phone Number">
          <input
            type="tel"
            value={contact.phone}
            onChange={(event) =>
              setContact((current) => ({
                ...current,
                phone: event.target.value,
              }))
            }
            className={inputClassName}
          />
        </Field>
        <Field label="WhatsApp Number">
          <input
            type="tel"
            value={contact.whatsapp}
            onChange={(event) =>
              setContact((current) => ({
                ...current,
                whatsapp: event.target.value,
              }))
            }
            className={inputClassName}
          />
        </Field>
        <Field label="Email Address">
          <input
            type="email"
            value={contact.email}
            onChange={(event) =>
              setContact((current) => ({
                ...current,
                email: event.target.value,
              }))
            }
            className={inputClassName}
          />
        </Field>
        <Field label="Physical Address">
          <textarea
            rows={2}
            value={contact.address}
            onChange={(event) =>
              setContact((current) => ({
                ...current,
                address: event.target.value,
              }))
            }
            className={cn(inputClassName, "resize-y")}
          />
        </Field>
        <Field label="Business Hours">
          <textarea
            rows={2}
            value={contact.farm_hours}
            onChange={(event) =>
              setContact((current) => ({
                ...current,
                farm_hours: event.target.value,
              }))
            }
            placeholder="Mon to Sat 7am to 6pm"
            className={cn(inputClassName, "resize-y")}
          />
        </Field>
      </SettingsCard>

      <SettingsCard
        title="Farm Location"
        onSave={saveLocation}
        isSaving={savingCard === "location"}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Latitude">
            <input
              type="number"
              step="0.0001"
              value={location.farm_lat}
              onChange={(event) =>
                setLocation((current) => ({
                  ...current,
                  farm_lat: event.target.value,
                }))
              }
              className={inputClassName}
            />
          </Field>
          <Field label="Longitude">
            <input
              type="number"
              step="0.0001"
              value={location.farm_lng}
              onChange={(event) =>
                setLocation((current) => ({
                  ...current,
                  farm_lng: event.target.value,
                }))
              }
              className={inputClassName}
            />
          </Field>
        </div>
        <Field label="Google Maps Link">
          <input
            type="url"
            value={location.google_maps_link}
            onChange={(event) =>
              setLocation((current) => ({
                ...current,
                google_maps_link: event.target.value,
              }))
            }
            className={inputClassName}
          />
        </Field>
        <p className="text-sm text-muted">
          Tip: Right-click your location on Google Maps → &quot;What&apos;s
          here?&quot; to get coordinates.
        </p>
      </SettingsCard>

      <SettingsCard
        title="Social Media"
        onSave={saveSocial}
        isSaving={savingCard === "social"}
      >
        <Field label="Facebook URL">
          <input
            type="url"
            value={social.facebook_url}
            onChange={(event) =>
              setSocial((current) => ({
                ...current,
                facebook_url: event.target.value,
              }))
            }
            className={inputClassName}
          />
        </Field>
        <Field label="Instagram URL">
          <input
            type="url"
            value={social.instagram_url}
            onChange={(event) =>
              setSocial((current) => ({
                ...current,
                instagram_url: event.target.value,
              }))
            }
            className={inputClassName}
          />
        </Field>
      </SettingsCard>

      <SettingsCard
        title="Notification Settings"
        onSave={saveNotification}
        isSaving={savingCard === "notification"}
      >
        <Field label="Admin Email for Quote Notifications">
          <input
            type="email"
            value={notification.admin_email}
            onChange={(event) =>
              setNotification({
                admin_email: event.target.value,
              })
            }
            className={inputClassName}
          />
        </Field>
        <p className="text-sm text-muted">
          Quote requests will be emailed to this address.
        </p>
      </SettingsCard>

      {toast ? (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-50 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg",
            toast.type === "success" ? "bg-forest" : "bg-red-600"
          )}
          role="status"
        >
          {toast.message}
        </div>
      ) : null}
    </div>
  );
}
