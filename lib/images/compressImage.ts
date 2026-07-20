import imageCompression from "browser-image-compression";

/** Target ceiling for uploaded images (200 KB). */
export const IMAGE_UPLOAD_MAX_SIZE_MB = 0.2;

/** Longest edge after resize. */
export const IMAGE_UPLOAD_MAX_DIMENSION = 1200;

export type CompressImageOptions = {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  /** Prefer JPEG for photos to hit size targets more reliably. */
  convertToJpeg?: boolean;
};

/**
 * Client-side resize + compress before Supabase storage upload.
 * Returns the original file if compression is unavailable or fails.
 */
export async function compressImageForUpload(
  file: File,
  options: CompressImageOptions = {}
): Promise<File> {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  const maxSizeMB = options.maxSizeMB ?? IMAGE_UPLOAD_MAX_SIZE_MB;
  const maxWidthOrHeight =
    options.maxWidthOrHeight ?? IMAGE_UPLOAD_MAX_DIMENSION;
  const convertToJpeg = options.convertToJpeg ?? true;

  // Skip work when already small enough and within dimension hints is unknown —
  // still run compression so oversized dimensions are reduced.
  try {
    const compressed = await imageCompression(file, {
      maxSizeMB,
      maxWidthOrHeight,
      useWebWorker: true,
      initialQuality: 0.82,
      fileType: convertToJpeg ? "image/jpeg" : undefined,
    });

    const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
    const extension = convertToJpeg
      ? "jpg"
      : (file.name.split(".").pop() ?? "jpg");
    const mimeType = convertToJpeg
      ? "image/jpeg"
      : compressed.type || file.type;

    return new File([compressed], `${baseName}.${extension}`, {
      type: mimeType,
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error("[compressImageForUpload] failed, using original:", error);
    return file;
  }
}
