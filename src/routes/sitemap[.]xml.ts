import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getProductionUrl } from "@/lib/site-config";
import { getSitemapPaths } from "@/lib/site-mode";

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
        const entries: SitemapEntry[] = getSitemapPaths().map((path) => ({
          path,
          changefreq: path === "/" ? "weekly" : path === "/legal" ? "yearly" : "monthly",
          priority:
            path === "/" ? "1.0" : path === "/testing/guide" || path === "/report" ? "0.8" : "0.6",
        }));

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
