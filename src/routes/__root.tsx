import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-extrabold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground hover:brightness-95"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. Please try again or head home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground hover:brightness-95"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#facc15" },
      { title: "Bengal Taxi — Taxi Service in Siliguri, Darjeeling, Sikkim & Dooars" },
      {
        name: "description",
        content:
          "Bengal Taxi offers reliable cab booking across North Bengal — airport transfers, Darjeeling, Gangtok, Dooars tours and local taxis. 24×7 service.",
      },
      { property: "og:site_name", content: "Bengal Taxi" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://bengaltaxi.com/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Bengal Taxi — Reliable Cabs Across North Bengal" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://bengaltaxi.com/og-image.jpg" },
      { name: "twitter:image:alt", content: "Bengal Taxi — Reliable Cabs Across North Bengal" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TaxiService",
          name: "Bengal Taxi",
          url: "https://bengaltaxi.com",
          logo: "https://bengaltaxi.com/og-image.jpg",
          image: "https://bengaltaxi.com/og-image.jpg",
          description: "Reliable cab booking across North Bengal — airport transfers, Darjeeling, Gangtok, Dooars tours and local taxis. 24×7 service.",
          areaServed: ["Siliguri", "Darjeeling", "Gangtok", "Sikkim", "Dooars", "Bagdogra", "Kurseong", "Mirik"],
          telephone: "+91-99333-67890",
          priceRange: "₹₹",
          openingHours: "Mo-Su 00:00-23:59",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Hill Cart Road",
            addressLocality: "Siliguri",
            addressRegion: "West Bengal",
            postalCode: "734001",
            addressCountry: "IN",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: "26.7154",
            longitude: "88.4266",
          },
          sameAs: [
            "https://wa.me/919933367890",
          ],
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Taxi Services",
            itemListElement: [
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Airport Pickup & Drop — Bagdogra IXB" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Darjeeling Tour Taxi" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sikkim Tour Taxi" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Dooars Safari Taxi" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Local Siliguri Taxi" } },
            ],
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useRouter().state.location;
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <ThemeProvider defaultTheme="light" storageKey="bengal-taxi-theme">
      <QueryClientProvider client={queryClient}>
        <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
          {!isAdminRoute && <Navbar />}
          <main className={`flex-1 ${!isAdminRoute ? 'pt-16' : ''}`}>
            <Outlet />
          </main>
          {!isAdminRoute && <Footer />}
          {!isAdminRoute && <FloatingActions />}
        </div>
        <Toaster richColors position="bottom-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
