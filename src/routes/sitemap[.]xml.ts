import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://bengaltaxi.com";
const LAST_MOD = "2026-08-23";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
  lastmod?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          // ── Core pages ──────────────────────────────────────
          { path: "/",        changefreq: "weekly",  priority: "1.0", lastmod: LAST_MOD },
          { path: "/services",changefreq: "monthly", priority: "0.9", lastmod: LAST_MOD },
          { path: "/fleet",   changefreq: "monthly", priority: "0.8", lastmod: LAST_MOD },
          { path: "/faq",     changefreq: "monthly", priority: "0.8", lastmod: LAST_MOD },
          { path: "/contact", changefreq: "monthly", priority: "0.7", lastmod: LAST_MOD },
          { path: "/about",   changefreq: "monthly", priority: "0.6", lastmod: LAST_MOD },

          // ── Airport & transfer services ──────────────────────
          { path: "/services#airport-taxi",      changefreq: "monthly", priority: "0.9", lastmod: LAST_MOD },
          { path: "/services#outstation-taxi",   changefreq: "monthly", priority: "0.8", lastmod: LAST_MOD },
          { path: "/services#local-taxi",        changefreq: "monthly", priority: "0.8", lastmod: LAST_MOD },
          { path: "/services#corporate-taxi",    changefreq: "monthly", priority: "0.7", lastmod: LAST_MOD },

          // ── Hill & tour destinations ─────────────────────────
          { path: "/services#darjeeling-tour",   changefreq: "monthly", priority: "0.9", lastmod: LAST_MOD },
          { path: "/services#sikkim-tour",       changefreq: "monthly", priority: "0.9", lastmod: LAST_MOD },
          { path: "/services#dooars-tour",       changefreq: "monthly", priority: "0.8", lastmod: LAST_MOD },
          { path: "/services#mirik-tour",        changefreq: "monthly", priority: "0.8", lastmod: LAST_MOD },
          { path: "/services#kurseong-tour",     changefreq: "monthly", priority: "0.8", lastmod: LAST_MOD },

          // ── Fleet / vehicle pages ────────────────────────────
          { path: "/fleet#swift-dzire",          changefreq: "monthly", priority: "0.7", lastmod: LAST_MOD },
          { path: "/fleet#ertiga",               changefreq: "monthly", priority: "0.7", lastmod: LAST_MOD },
          { path: "/fleet#innova-crysta",        changefreq: "monthly", priority: "0.8", lastmod: LAST_MOD },
          { path: "/fleet#tempo-traveller",      changefreq: "monthly", priority: "0.7", lastmod: LAST_MOD },
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod     ? `    <lastmod>${e.lastmod}</lastmod>`         : null,
            e.changefreq  ? `    <changefreq>${e.changefreq}</changefreq>`: null,
            e.priority    ? `    <priority>${e.priority}</priority>`      : null,
            `  </url>`,
          ].filter(Boolean).join("\n"),
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

