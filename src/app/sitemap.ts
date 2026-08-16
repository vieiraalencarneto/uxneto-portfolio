import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/projects-static";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://uxneto.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const caseStudyPages: MetadataRoute.Sitemap = PROJECTS.map((project) => ({
    url: `${SITE_URL}/work/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...caseStudyPages];
}
