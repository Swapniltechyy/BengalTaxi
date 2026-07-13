import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Phone,
  Clock,
  UserCheck,
  Sparkles,
  IndianRupee,
  ShieldCheck,
  MapPin,
  Star,
  Headphones,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import heroImg from "@/assets/hero-taxi.png";
import routeDarjeeling from "@/assets/route-darjeeling.png";
import routeGangtok from "@/assets/route-gangtok.jpg";
import routeDooars from "@/assets/route-dooars.jpg";
import routeAirport from "@/assets/route-airport.jpg";
import routeKurseong from "@/assets/route-kurseong.jpg";
import routeMirik from "@/assets/route-mirik.png";
import { site } from "@/lib/site";
import { CTASection } from "@/components/CTASection";
import { ScrollReveal } from "@/components/ScrollReveal";
import { AnimatedCounter } from "@/components/AnimatedCounter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bengal Taxi — Reliable Cabs in Siliguri, Darjeeling & Sikkim" },
      {
        name: "description",
        content:
          "Book a trusted cab across North Bengal. Airport transfers, Darjeeling & Sikkim tours, Dooars trips and local taxi service — 24×7.",
      },
      { property: "og:title", content: "Bengal Taxi — Cabs Across North Bengal" },
      { property: "og:description", content: "Airport transfers, Darjeeling, Sikkim, Dooars tours and local taxis." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const features = [
  { icon: Clock, title: "24×7 Service", text: "Day or night, your ride is one call away." },
  { icon: UserCheck, title: "Pro Drivers", text: "Verified, courteous and hill-trained." },
  { icon: Sparkles, title: "Clean Fleet", text: "Sanitised and serviced before every trip." },
  { icon: IndianRupee, title: "Fair Pricing", text: "Transparent fares with no surge tricks." },
  { icon: ShieldCheck, title: "Safe Travel", text: "GPS tracked, insured and well-maintained." },
];

const routes = [
  { img: routeDarjeeling, title: "Siliguri → Darjeeling", note: "Queen of the Hills" },
  { img: routeGangtok, title: "Siliguri → Gangtok", note: "Capital of Sikkim" },
  { img: routeMirik, title: "Siliguri → Mirik", note: "Mirik Lake View" },
  { img: routeAirport, title: "Bagdogra Airport", note: "On-time pickup & drop" },
  { img: routeDooars, title: "Dooars Sightseeing", note: "Forests, rivers & wildlife" },
  { img: routeKurseong, title: "Siliguri → Kurseong", note: "Hills & Waterfalls" }
];

const why = [
  { icon: UserCheck, title: "Experienced Drivers", text: "Years of safe driving on hill routes." },
  { icon: IndianRupee, title: "Transparent Pricing", text: "Fixed quotes shared upfront. No surprises." },
  { icon: Clock, title: "On-Time Pickup", text: "Punctual airport, railway & hotel pickups." },
  { icon: MapPin, title: "Local Expertise", text: "Born and based in Siliguri — we know every turn." },
  { icon: Headphones, title: "Customer Support", text: "Real humans on the phone, anytime." },
];

const reviews = [
  {
    name: "Anirban Sen",
    place: "Kolkata",
    text: "Booked a Crysta from NJP to Darjeeling. Driver was on time, road sense was excellent and pricing exactly as quoted.",
  },
  {
    name: "Lay Mankad",
    place: "Gujrat",
    text: "Did a 4-day Sikkim trip with Bengal Taxi. Clean car, polite driver and they handled every permit. Highly recommended.",
  },
  {
    name: "Sakir Alam",
    place: "Patna",
    text: "Bagdogra to Gangtok at midnight — they were waiting at arrivals with a name placard. Trustworthy service.",
  },
];

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative w-full h-screen flex items-center overflow-hidden">
        {/* Full-bleed background image — object-position pushes the car to the right */}
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Yellow taxi on a Darjeeling hill road"
            className="h-full w-full object-cover object-right"
            width={1920}
            height={1080}
            loading="eager"
          />
          {/* Gradient: strong dark on left for text, fading out to reveal the car on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
        </div>

        <div className="container-x relative z-10">
          <ScrollReveal direction="right">
            <div className="max-w-3xl">
              <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Most Reliable<br />
                <span className="whitespace-nowrap">Taxi Service Across</span><br />
                <span className="text-brand whitespace-nowrap">Sikkim & Bengal</span>
              </h1>
              <p className="mt-5 max-w-md text-base text-white/70 md:text-lg">
                Airport transfers, Darjeeling & Sikkim tours, and local taxi
                services — book in a single call.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={site.phoneHref}
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-brand px-7 text-sm font-semibold text-brand-foreground transition-transform hover:scale-105 active:scale-95"
                >
                  <Phone className="h-4 w-4" /> Book Now
                </a>
                <a
                  href={site.whatsappHref}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                </a>
              </div>
              <div className="mt-8 flex gap-8 pt-6">
                <div>
                  <AnimatedCounter to={31} suffix="+" className="font-display text-2xl font-extrabold text-white" />
                  <p className="mt-0.5 text-xs text-white/50 font-medium">Years Exp</p>
                </div>
                <div>
                  <AnimatedCounter to={50} suffix="k+" className="font-display text-2xl font-extrabold text-white" />
                  <p className="mt-0.5 text-xs text-white/50 font-medium">Rides</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-extrabold text-white">24×7</p>
                  <p className="mt-0.5 text-xs text-white/50 font-medium">Support</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* POPULAR ROUTES */}
      <section className="container-x py-16 md:py-24">
        <ScrollReveal>
          <div className="flex flex-col items-start justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-foreground">
                <span className="text-brand mr-2">●</span> Popular Routes
              </p>
              <h2 className="mt-4 font-display text-xl sm:text-4xl md:text-5xl font-extrabold text-foreground whitespace-nowrap tracking-tight">Where To Travel In North East </h2>
            </div>
            <Link to="/services" className="inline-flex items-center gap-2 font-semibold text-foreground hover:text-brand transition-colors">
              View all services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-5 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {routes.map((r, i) => (
            <ScrollReveal key={r.title} delay={i * 0.1} direction="up">
              <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-foreground/20 hover:shadow-sm">
                <div className="aspect-[16/10] sm:aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={r.img}
                    alt={r.title}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h3 className="font-display text-xl font-bold text-foreground">{r.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{r.note}</p>
                  </div>
                  <a
                    href={site.whatsappHref}
                    target="_blank"
                    rel="noopener"
                    className="mt-6 inline-flex w-fit items-center justify-center rounded-full bg-brand/10 px-5 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-brand hover:text-brand-foreground dark:bg-brand/20 dark:hover:bg-brand"
                  >
                    Get Quote
                  </a>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="container-x pb-16 pt-0 md:pb-24 md:pt-4">
        <ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 0.1} direction="up" className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand dark:bg-brand/20">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.text}</p>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* WHY CHOOSE US */}
      <section className="container-x py-16 md:py-24">
        <ScrollReveal>
          <div className="rounded-2xl sm:rounded-[3rem] bg-muted/50 px-5 py-12 sm:px-6 sm:py-16 md:px-12 md:py-24">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-foreground">
                <span className="text-brand mr-2">●</span> Why Bengal Taxi
              </p>
              <h2 className="mt-4 font-display text-xl sm:text-4xl md:text-5xl font-extrabold text-foreground whitespace-nowrap tracking-tight">A Taxi Service Trusted Since <span className="text-brand">1995</span></h2>
              <p className="mt-6 text-lg text-muted-foreground">
                We're a Siliguri-based team that has been moving travellers across North Bengal for
                over a decade. Here's what sets us apart.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {why.map((w, i) => (
                <ScrollReveal key={w.title} delay={i * 0.1}>
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-background border border-border shadow-sm">
                      <w.icon className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground">{w.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{w.text}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* REVIEWS */}
      <section className="container-x py-16 md:py-24">
        <ScrollReveal>
          <div className="max-w-2xl text-center mx-auto">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-foreground">
              <span className="text-brand mr-2">●</span> Customer Stories
            </p>
            <h2 className="mt-4 font-display text-3xl font-extrabold text-foreground sm:text-4xl md:text-5xl">Loved By Tavellers Across India</h2>
          </div>
        </ScrollReveal>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <ScrollReveal key={r.name} delay={i * 0.1}>
              <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-sm">
                <div className="flex gap-1 text-brand">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-6 flex-1 font-serif text-lg italic leading-relaxed text-foreground/90">
                  "{r.text}"
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4 border-t border-border pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 font-display text-base font-bold text-foreground dark:bg-brand/20">
                    {r.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-display text-base font-bold text-foreground">{r.name}</p>
                    <p className="text-sm text-muted-foreground">{r.place}</p>
                  </div>
                </figcaption>
              </figure>
            </ScrollReveal>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-muted-foreground">
          <CheckCircle2 className="h-5 w-5 text-brand" />
          Verified pickups · Driver verification · Trip-level insurance
        </div>
      </section>

      <CTASection />
      <div className="h-16" />
    </>
  );
}
