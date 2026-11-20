import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getServices } from "@/lib/api";
import {
  Plane,
  Car,
  MapPin,
  Mountain,
  Trees,
  Briefcase,
  Building2,
  CheckCircle2,
  Phone,
  Train,
  Sparkles,
} from "lucide-react";
import taxiVector from "@/assets/bengal-taxi-car-logo.png";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { PageHero } from "@/components/PageHero";
import { CTASection } from "@/components/CTASection";
import { site } from "@/lib/site";
import { ScrollReveal } from "@/components/ScrollReveal";

export const Route = createFileRoute("/services")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "services" });
  },
  head: () => ({
    meta: [
      { title: "Services — Airport, Tours & Local Taxis | Bengal Taxi" },
      { name: "description", content: "Airport pickup & drop, local taxi, outstation, Darjeeling, Sikkim and Dooars tour taxis, plus corporate cab service." },
      { property: "og:title", content: "Bengal Taxi — Services" },
      { property: "og:description", content: "Every kind of cab need across North Bengal in one place." },
      { property: "og:url", content: "https://bengaltaxi.com/services" },
    ],
    links: [{ rel: "canonical", href: "https://bengaltaxi.com/services" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://bengaltaxi.com/" },
            { "@type": "ListItem", position: 2, name: "Services", item: "https://bengaltaxi.com/services" },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "How do I book a cab with Bengal Taxi?",
              acceptedAnswer: { "@type": "Answer", text: "You can book by calling us at +91-99333-67890 or sending a WhatsApp message. We are available 24×7." },
            },
            {
              "@type": "Question",
              name: "Do you offer Bagdogra Airport transfers?",
              acceptedAnswer: { "@type": "Answer", text: "Yes, we offer airport pickup and drop service from Bagdogra Airport (IXB) to all destinations across North Bengal including Darjeeling, Sikkim and Dooars." },
            },
            {
              "@type": "Question",
              name: "What types of vehicles are available?",
              acceptedAnswer: { "@type": "Answer", text: "We have a fleet of Swift Dzire (sedan), Ertiga (MPV), Innova and Innova Crysta (SUV), and Tempo Traveller for groups up to 16 passengers." },
            },
            {
              "@type": "Question",
              name: "Do you cover Sikkim tours?",
              acceptedAnswer: { "@type": "Answer", text: "Yes, we offer complete Sikkim tour packages including permit assistance, multi-day packages, and 4×4 vehicles for North Sikkim." },
            },
            {
              "@type": "Question",
              name: "Is the pricing fixed or metered?",
              acceptedAnswer: { "@type": "Answer", text: "We offer fixed, transparent pricing shared upfront before your trip. No surge pricing or hidden charges." },
            },
          ],
        }),
      },
    ],
  }),
  component: ServicesPage,
});

const services = [
  {
    icon: Briefcase,
    title: "Corporate Taxi",
    text: "Punctual, professional travel solutions tailored for business executives, client pickups, and corporate delegations.",
    points: ["Monthly billing & GST invoices", "Pristine executive cars", "Dedicated priority support"],
  },
  {
    icon: Plane,
    title: "Airport Pickup & Drop",
    text: "Prompt transfers between Bagdogra Airport (IXB) and Siliguri, Darjeeling, Sikkim, or Dooars.",
    points: ["Flight tracking & zero wait", "Meet & Greet at arrivals", "Luggage assistance guaranteed"],
  },
  {
    icon: MapPin,
    title: "Outstation & Intercity Travel",
    text: "Comfortable, safe highway and intercity travel connecting Bengal with Sikkim, Assam, and Bihar.",
    points: ["One-way & round-trip options", "Experienced long-route drivers", "Transparent per-km rate"],
  },
  {
    icon: Train,
    title: "Railway Station Pickup & Drop",
    text: "Timely drops and pickups for New Jalpaiguri (NJP), Siliguri Junction, and regional stations.",
    points: ["Train delay monitoring", "Platform pickup assistance", "Available 24×7 day & night"],
  },
  {
    icon: Sparkles,
    title: "Wedding & Event Transportation",
    text: "Coordinated fleet services and luxury convoy management for weddings, celebrations, and functions.",
    points: ["Multi-vehicle convoy coordination", "Decorated premium cars available", "Dedicated on-ground coordinator"],
  },
  {
    icon: Mountain,
    title: "Local Sightseeing & Tour Packages",
    text: "Handcrafted holiday packages across Darjeeling, Gangtok, Pelling, Mirik, Kurseong, and Dooars.",
    points: ["Hill-expert local drivers", "Customizable scenic itineraries", "Permit assistance included"],
  },
];

const IconMap: Record<string, React.ElementType> = {
  Plane, Car, MapPin, Mountain, Trees, Briefcase, CheckCircle2, Train, Sparkles,
};

function ServicesPage() {
  const { data: dbServices, isLoading } = useQuery({ queryKey: ['services'], queryFn: getServices });
  
  // Use database services if available, filtering out inactive ones. Fallback to hardcoded array.
  const displayServices = dbServices ? dbServices.filter(s => s.is_active) : services;

  return (
    <>
      <PageHero
        title={
          <>
            Where do you <br className="hidden md:block" /> want to go?
          </>
        }
        subtitle="From quick airport drops to multi-day Sikkim expeditions, Bengal Taxi offers tailored, clean, and reliable travel across North Bengal."
      >
        <div className="flex flex-wrap gap-4">
          <a href={site.phoneHref} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-8 text-sm font-bold text-brand-foreground transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-brand/20">
            <Phone className="h-4 w-4" /> Book Now
          </a>
          <a href={site.whatsappHref} target="_blank" rel="noopener" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-background px-8 text-sm font-bold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground shadow-sm">
            <WhatsAppIcon className="h-4 w-4" /> WhatsApp Us
          </a>
        </div>
      </PageHero>

      <section className="container-x py-16 md:py-24">
        {/* Mobile View: Clean, high-impact service rows (instantly overviewed) */}
        <div className="md:hidden space-y-2.5">
          {displayServices.map((s, i) => (
            <ScrollReveal key={s.title} delay={i * 0.03} direction="up">
              <a
                href={site.whatsappHref}
                target="_blank"
                rel="noopener"
                className="group flex items-center justify-between rounded-xl border border-border bg-card/60 px-4 py-3.5 transition-all active:scale-[0.98] active:border-brand hover:border-brand/50"
              >
                <div className="flex items-center gap-3">
                  <span className="h-5 w-1 rounded-full bg-brand shrink-0" />
                  <span className="font-display text-base font-bold text-foreground group-hover:text-brand transition-colors">
                    {s.title}
                  </span>
                </div>
                <span className="text-xs font-bold text-brand shrink-0 flex items-center gap-1">
                  Enquire <span aria-hidden="true">→</span>
                </span>
              </a>
            </ScrollReveal>
          ))}
        </div>

        {/* Desktop View: Full 2-column detailed cards */}
        <div className="hidden md:grid gap-6 md:grid-cols-2">
          {displayServices.map((s, i) => {
            return (
              <ScrollReveal
                key={s.title}
                delay={i * 0.08}
                direction="up"
                className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 sm:p-8 transition-all hover:border-brand/40 hover:shadow-sm"
              >
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">{s.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {s.points.map((p: string) => (
                      <span
                        key={p}
                        className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1 text-xs text-foreground/80 border border-border/50"
                      >
                        <CheckCircle2 className="h-3 w-3 text-brand shrink-0" />
                        <span>{p}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <a
                    href={site.whatsappHref}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand/10 hover:bg-brand px-3.5 py-1.5 text-xs font-bold text-foreground hover:text-brand-foreground transition-all"
                  >
                    <WhatsAppIcon className="h-3.5 w-3.5" /> Enquire
                  </a>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={0.3} direction="up" className="mt-16 md:flex md:items-center md:justify-between md:gap-8 max-w-4xl mx-auto">
          <div>
            <h3 className="font-display text-2xl font-bold text-foreground">Need a Custom Quote?</h3>
            <p className="mt-2 text-muted-foreground max-w-md">Call us for personalized tour packages and group bookings across Bengal & Sikkim.</p>
          </div>
          <a href={site.phoneHref} className="mt-6 md:mt-0 inline-flex shrink-0 h-12 items-center justify-center gap-2 rounded-full bg-brand px-8 font-semibold text-brand-foreground transition-transform hover:scale-105 active:scale-95">
            <Phone className="h-5 w-5" /> Call Now
          </a>
        </ScrollReveal>
      </section>

      <CTASection />
      <div className="h-16" />
    </>
  );
}
