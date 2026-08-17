import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/projects-static";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://uxneto.com";
const LOCALES = ["en", "pt"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = LOCALES.flatMap((locale) => [
    {
      url: `${SITE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: locale === "en" ? 1 : 0.9,
    },
    {
      url: `${SITE_URL}/${locale}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ]);

  const caseStudyPages: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    PROJECTS.map((project) => ({
      url: `${SITE_URL}/${locale}/work/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  );

  return [...staticPages, ...caseStudyPages];
}
