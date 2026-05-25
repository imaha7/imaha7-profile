import type { MetadataRoute } from "next";

const baseUrl = "https://imaha7-profile.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
    },
  ];
}
