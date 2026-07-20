"use client";

import { Loader2, Star, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";

import { createClient } from "@/lib/supabase/client";
import { compressImageForUpload } from "@/lib/images/compressImage";
import { cn } from "@/lib/utils";
import { AdminErrorState } from "@/components/admin/AdminErrorState";
import type { GalleryCategory, GalleryImage } from "@/types";

type CategoryFilter = "all" | GalleryCategory;

const CATEGORIES: GalleryCategory[] = [
  "Cattle & Goats",
  "Poultry",
  "Farm Facilities",
  "General",
];

const FILTER_TABS: { label: string; value: CategoryFilter }[] = [
  { label: "All", value: "all" },
  ...CATEGORIES.map((category) => ({ label: category, value: category })),
];

interface UploadItem {
  id: string;
  name: string;
  progress: number;
  status: "uploading" | "done" | "error";
  error?: string;
}

interface EditModalState {
  image: GalleryImage;
  caption: string;
  category: GalleryCategory;
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
  const [editModal, setEditModal] = useState<EditModalState | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      setImages((data ?? []) as GalleryImage[]);
    } catch (error) {
      console.error("[admin/gallery] fetch failed:", error);
      setFetchError(
        "We couldn't load gallery images. Check your connection and try again."
      );
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchImages();
  }, [fetchImages]);

  const filteredImages = useMemo(() => {
    if (categoryFilter === "all") {
      return images;
    }

    return images.filter((image) => image.category === categoryFilter);
  }, [categoryFilter, images]);

  const updateUploadItem = (id: string, patch: Partial<UploadItem>) => {
    setUploadItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const uploadFile = useCallback(async (file: File, uploadId: string) => {
    const supabase = createClient();

    try {
      updateUploadItem(uploadId, { progress: 15 });

      const compressed = await compressImageForUpload(file);
      const storagePath = `${Date.now()}_${compressed.name.replace(/\s+/g, "-")}`;

      updateUploadItem(uploadId, { progress: 35 });

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(storagePath, compressed);

      if (uploadError || !uploadData) {
        throw new Error(uploadError?.message ?? "Upload failed");
      }

      updateUploadItem(uploadId, { progress: 60 });

      const { data: publicData } = supabase.storage
        .from("gallery")
        .getPublicUrl(uploadData.path);

      const { data: inserted, error: insertError } = await supabase
        .from("gallery_images")
        .insert({
          url: publicData.publicUrl,
          storage_path: uploadData.path,
          caption: "",
          category: "General",
          is_featured: false,
          display_order: 0,
        })
        .select("*")
        .single();

      if (insertError || !inserted) {
        await supabase.storage.from("gallery").remove([uploadData.path]);
        throw new Error(insertError?.message ?? "Failed to save image record");
      }

      setImages((current) => [inserted as GalleryImage, ...current]);
      updateUploadItem(uploadId, { progress: 100, status: "done" });
    } catch (error) {
      updateUploadItem(uploadId, {
        progress: 100,
        status: "error",
        error: error instanceof Error ? error.message : "Upload failed",
      });
    }
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = acceptedFiles.slice(0, 10);
      const newItems = files.map((file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        name: file.name,
        progress: 0,
        status: "uploading" as const,
      }));

      setUploadItems((current) => [...newItems, ...current]);
      void Promise.all(
        files.map((file, index) => uploadFile(file, newItems[index].id))
      );
    },
    [uploadFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 5 * 1024 * 1024,
    maxFiles: 10,
    multiple: true,
  });

  const toggleFeatured = async (image: GalleryImage) => {
    const nextValue = !image.is_featured;
    const previous = images;

    setImages((current) =>
      current.map((item) =>
        item.id === image.id ? { ...item, is_featured: nextValue } : item
      )
    );

    const supabase = createClient();
    const { error } = await supabase
      .from("gallery_images")
      .update({ is_featured: nextValue })
      .eq("id", image.id);

    if (error) {
      console.error("[admin/gallery] featured toggle failed:", error.message);
      setImages(previous);
    }
  };

  const deleteImage = async (image: GalleryImage) => {
    const confirmed = window.confirm(
      "Delete this photo from the gallery and storage?"
    );

    if (!confirmed) {
      return;
    }

    const previous = images;
    setImages((current) => current.filter((item) => item.id !== image.id));

    const supabase = createClient();
    const { error: storageError } = await supabase.storage
      .from("gallery")
      .remove([image.storage_path]);

    if (storageError) {
      console.error("[admin/gallery] storage delete failed:", storageError.message);
    }

    const { error: dbError } = await supabase
      .from("gallery_images")
      .delete()
      .eq("id", image.id);

    if (dbError) {
      console.error("[admin/gallery] db delete failed:", dbError.message);
      setImages(previous);
    }
  };

  const openEditModal = (image: GalleryImage) => {
    setEditModal({
      image,
      caption: image.caption ?? "",
      category: image.category,
    });
  };

  const saveEditModal = async () => {
    if (!editModal) {
      return;
    }

    setIsSavingEdit(true);
    const previous = images;
    const { image, caption, category } = editModal;

    setImages((current) =>
      current.map((item) =>
        item.id === image.id ? { ...item, caption, category } : item
      )
    );

    const supabase = createClient();
    const { error } = await supabase
      .from("gallery_images")
      .update({ caption, category })
      .eq("id", image.id);

    setIsSavingEdit(false);

    if (error) {
      console.error("[admin/gallery] edit save failed:", error.message);
      setImages(previous);
      return;
    }

    setEditModal(null);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-label text-2xl font-semibold text-navy">
          Gallery Manager
        </h2>
        <button
          type="button"
          onClick={() => setShowUpload((current) => !current)}
          className="inline-flex items-center justify-center rounded-btn bg-forest px-5 py-2.5 font-label text-sm font-semibold text-white transition-colors hover:bg-forest/90"
        >
          Upload Photos
        </button>
      </div>

      {showUpload ? (
        <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
          <div
            {...getRootProps()}
            className={cn(
              "cursor-pointer rounded-lg border-2 border-dashed bg-cream px-6 py-10 text-center transition-colors",
              isDragActive
                ? "border-forest bg-green-50"
                : "border-divider hover:border-forest/50"
            )}
          >
            <input {...getInputProps()} />
            <p className="font-medium text-navy">
              Drag photos here or click to browse
            </p>
            <p className="mt-2 text-sm text-muted">
              JPEG, PNG, or WebP, up to 5MB each, 10 files max
            </p>
          </div>

          {uploadItems.length > 0 ? (
            <div className="mt-4 space-y-3">
              {uploadItems.map((item) => (
                <div key={item.id} className="rounded-lg border border-[#E2E8F0] p-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium text-navy">
                      {item.name}
                    </p>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        item.status === "done" && "text-forest",
                        item.status === "error" && "text-red-600",
                        item.status === "uploading" && "text-muted"
                      )}
                    >
                      {item.status === "uploading"
                        ? "Uploading..."
                        : item.status === "done"
                          ? "Complete"
                          : "Failed"}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#E2E8F0]">
                    <div
                      className={cn(
                        "h-full transition-all duration-300",
                        item.status === "error" ? "bg-red-500" : "bg-forest"
                      )}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  {item.error ? (
                    <p className="mt-2 text-xs text-red-600">{item.error}</p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setCategoryFilter(tab.value)}
            className={cn(
              "rounded-full px-4 py-2 font-label text-[13px] font-semibold transition-colors",
              categoryFilter === tab.value
                ? "bg-forest text-white"
                : "border border-[#E2E8F0] bg-white text-navy hover:bg-gray-50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {fetchError ? (
        <AdminErrorState
          message={fetchError}
          onRetry={() => void fetchImages()}
        />
      ) : isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
          Loading gallery...
        </div>
      ) : filteredImages.length === 0 ? (
        <p className="rounded-lg bg-white py-16 text-center text-sm text-muted shadow-sm">
          No photos in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="overflow-hidden rounded-lg bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={image.url}
                  alt={
                    image.caption ||
                    `${image.category} photo at JRN Agro LTD farm`
                  }
                  fill
                  quality={80}
                  loading="lazy"
                  className="rounded-t-lg object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute right-2 top-2 flex gap-1">
                  <button
                    type="button"
                    onClick={() => toggleFeatured(image)}
                    className="rounded-full bg-white/90 p-1.5 shadow-sm transition-colors hover:bg-white"
                    aria-label={
                      image.is_featured
                        ? "Remove from featured"
                        : "Mark as featured"
                    }
                  >
                    <Star
                      className={cn(
                        "h-4 w-4",
                        image.is_featured
                          ? "fill-gold text-gold"
                          : "text-muted"
                      )}
                      aria-hidden="true"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteImage(image)}
                    className="rounded-full bg-white/90 p-1.5 shadow-sm transition-colors hover:bg-white"
                    aria-label="Delete image"
                  >
                    <Trash2
                      className="h-4 w-4 text-red-600"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>

              <div className="space-y-2 p-3">
                <span className="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-forest">
                  {image.category}
                </span>
                <button
                  type="button"
                  onClick={() => openEditModal(image)}
                  className="block w-full text-left text-sm text-body-text transition-colors hover:text-forest"
                >
                  {image.caption || "Add caption..."}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-label text-lg font-semibold text-navy">
                Edit Photo
              </h3>
              <button
                type="button"
                onClick={() => setEditModal(null)}
                className="rounded-lg p-1 text-muted transition-colors hover:text-navy"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="caption"
                  className="mb-2 block text-sm font-medium text-navy"
                >
                  Caption
                </label>
                <textarea
                  id="caption"
                  rows={3}
                  value={editModal.caption}
                  onChange={(event) =>
                    setEditModal((current) =>
                      current
                        ? { ...current, caption: event.target.value }
                        : current
                    )
                  }
                  className="w-full rounded-btn border border-divider px-4 py-3 text-sm text-body-text focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-navy"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={editModal.category}
                  onChange={(event) =>
                    setEditModal((current) =>
                      current
                        ? {
                            ...current,
                            category: event.target.value as GalleryCategory,
                          }
                        : current
                    )
                  }
                  className="w-full rounded-btn border border-divider px-4 py-3 text-sm text-body-text focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={saveEditModal}
                disabled={isSavingEdit}
                className="inline-flex w-full items-center justify-center gap-2 rounded-btn bg-forest px-4 py-3 font-label text-sm font-semibold text-white transition-colors hover:bg-forest/90 disabled:opacity-70"
              >
                {isSavingEdit ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
