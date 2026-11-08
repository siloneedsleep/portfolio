import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";
import { getCaseStudySlugs } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = profile.siteUrl;
  const lastModified = new Date();
  const slugs = getCaseStudySlugs();

  const homeEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          vi: baseUrl,
          en: `${baseUrl}/en`,
        },
      },
    },
    {
      url: `${baseUrl}/en`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          vi: baseUrl,
          en: `${baseUrl}/en`,
        },
      },
    },
  ];

  const projectEntries: MetadataRoute.Sitemap = slugs.flatMap((slug) => {
    const viUrl = `${baseUrl}/projects/${slug}`;
    const enUrl = `${baseUrl}/en/projects/${slug}`;
    return [
      {
        url: viUrl,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.8,
        alternates: {
          languages: {
            vi: viUrl,
            en: enUrl,
          },
        },
      },
      {
        url: enUrl,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.8,
        alternates: {
          languages: {
            vi: viUrl,
            en: enUrl,
          },
        },
      },
    ];
  });

  return [...homeEntries, ...projectEntries];
}
