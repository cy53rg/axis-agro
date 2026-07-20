import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jrnagro.ng";

const publicRoutes = [
  "",
  "/about",
  "/what-we-do",
  "/gallery",
  "/get-a-quote",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
  }));
}
