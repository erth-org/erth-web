import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getProductionUrl } from "@/lib/site-config";
import { releases } from "@/content/updates";
import { publicFeedback } from "@/content/public-feedback";

// Absolute URLs are derived from the configured production URL.
// Until one is set, paths fall back to relative (dev/preview only).
const BASE_URL = getProductionUrl() ?? "";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/features", changefreq: "monthly", priority: "0.8" },
          { path: "/updates", changefreq: "weekly", priority: "0.7" },
          { path: "/about", changefreq: "monthly", priority: "0.7" },
          { path: "/report", changefreq: "weekly", priority: "0.6" },
          { path: "/contact", changefreq: "monthly", priority: "0.5" },
          { path: "/legal", changefreq: "yearly", priority: "0.3" },
        ];

        // Only include detail routes for verified, existing content.
        for (const r of releases) {
          entries.push({
            path: `/updates/${r.slug}`,
            changefreq: "monthly",
            priority: "0.5",
          });
        }
        for (const item of publicFeedback) {
          entries.push({
            path: `/report/${item.slug}`,
            changefreq: "weekly",
            priority: "0.4",
          });
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
