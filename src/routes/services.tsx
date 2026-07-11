import { createFileRoute } from "@tanstack/react-router";
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
} from "lucide-react";
import taxiVector from "@/assets/bengal-taxi-car-logo.png";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { PageHero } from "@/components/PageHero";
import { CTASection } from "@/components/CTASection";
import { site } from "@/lib/site";
import { ScrollReveal } from "@/components/ScrollReveal";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Airport, Tours & Local Taxis | Bengal Taxi" },
      { name: "description", content: "Airport pickup & drop, local taxi, outstation, Darjeeling, Sikkim and Dooars tour taxis, plus corporate cab service." },
      { property: "og:title", content: "Bengal Taxi — Services" },
      { property: "og:description", content: "Every kind of cab need across North Bengal in one place." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

const services = [
  { icon: Plane, title: "Airport Pickup & Drop", text: "Seamless Bagdogra (IXB) transfers.", points: ["Timely pickups", "Flight tracking", "Meet & Greet service"] },
  { icon: Car, title: "Local Taxi Service", text: "Efficient city travel in Siliguri and surrounds.", points: ["Hourly packages", "Point-to-point drops", "Knowledgeable drivers"] },
  { icon: MapPin, title: "Outstation Taxi", text: "Comfortable long-distance journeys.", points: ["Premium vehicles", "Experienced highway drivers", "Flexible stops"] },
  { icon: Mountain, title: "Darjeeling Tour", text: "Scenic heritage tours.", points: ["Custom itineraries", "Hill-station expert drivers", "Sightseeing included"] },
  { icon: Mountain, title: "Sikkim Tour", text: "Adventure and beauty in the high mountains.", points: ["Permit assistance", "Multi-day packages", "4x4 vehicles available"] },
  { icon: Mountain, title: "Mirik Tour", text: "Peaceful lakeside getaways and tea gardens.", points: ["Lake sightseeing", "Tea garden visits", "Pashupati border drops"] },
  { icon: Mountain, title: "Kurseong Tour", text: "The land of white orchids and heritage.", points: ["Makaibari tea estate", "Eagle's Craig view", "Dowhill forest drive"] },
  { icon: Trees, title: "Dooars Tour", text: "Wildlife and jungle safaris.", points: ["Safari booking help", "Resort transfers", "Off-beat destination routing"] },
  { icon: Briefcase, title: "Corporate Taxi", text: "Professional travel for business needs.", points: ["Monthly billing", "Executive cars", "Dedicated support"] },
];

function ServicesPage() {
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <ScrollReveal key={s.title} delay={i * 0.1} direction="up" className="group flex flex-col rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-sm hover:border-foreground/20">
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand dark:bg-brand/20">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="relative w-fit z-10">
                <h3 className="font-display text-xl font-bold uppercase text-foreground">{s.title}</h3>
                <svg
                  className="absolute -bottom-2 left-0 w-full -z-10"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id={`underline-fade-service-${i}`} x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FACC15" stopOpacity="1" />
                      <stop offset="60%" stopColor="#FACC15" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#FACC15" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M2 6 L298 6"
                    stroke={`url(#underline-fade-service-${i})`}
                    strokeWidth="5"
                    strokeLinecap="round"
                    style={{ strokeDasharray: "none" }}
                  />
                </svg>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              <ul className="mt-6 mb-8 space-y-3 flex-1">
                {s.points.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm text-foreground/80">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <a
                href={site.whatsappHref}
                target="_blank"
                rel="noopener"
                className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <WhatsAppIcon className="h-4 w-4" /> Enquire on WhatsApp
              </a>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3} direction="up" className="mt-16 rounded-[2rem] border border-dashed border-border bg-muted/30 p-8 md:p-12 md:flex md:items-center md:justify-between md:gap-8 max-w-4xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-background border border-border shadow-sm">
              <Building2 className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold text-foreground">Need a Custom Quote?</h3>
              <p className="mt-2 text-muted-foreground max-w-md">Call us for personalized tour packages and group bookings across North Bengal.</p>
            </div>
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
