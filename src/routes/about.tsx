import { createFileRoute } from "@tanstack/react-router";
import { Target, Heart, ShieldCheck, MapPin, Award, Smile } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { CTASection } from "@/components/CTASection";
import { ScrollReveal } from "@/components/ScrollReveal";
import { AnimatedCounter } from "@/components/AnimatedCounter";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Bengal Taxi — Siliguri's Trusted Cab Service" },
      { name: "description", content: "Bengal Taxi is a Siliguri-based cab service trusted by travellers across North Bengal, Darjeeling and Sikkim for safe, reliable rides." },
      { property: "og:title", content: "About Bengal Taxi" },
      { property: "og:description", content: "Siliguri's trusted taxi service since over a decade." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero
        title="Born in Siliguri. Trusted Across the Hills."
        subtitle="Bengal Taxi is a locally-run cab service providing safe, comfortable and affordable travel across North Bengal, Darjeeling, Sikkim and the Dooars."
      />

      <section className="container-x py-16 md:py-24">
        <div className="grid gap-16 lg:grid-cols-[1fr_0.8fr]">
          <ScrollReveal>
            <article className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <h2 className="font-display text-3xl font-extrabold text-foreground md:text-4xl">Our Story</h2>
              <p>
                Bengal Taxi is a trusted taxi service provider based in Siliguri, serving North Bengal,
                Darjeeling, Sikkim and nearby destinations with safe and reliable transportation services.
                What started as a single sedan running airport pickups from Bagdogra has grown into a
                dependable fleet of sedans and SUVs covering every popular hill route.
              </p>
              <p>
                We're not a faceless aggregator. Every driver on our roster is local, hill-trained and
                personally known to our team. That means real accountability, real road sense and a
                quality of ride that you can feel from the moment your trip begins.
              </p>
              <p>
                Whether you are landing at Bagdogra after a long flight, planning a Darjeeling holiday or
                putting together a Sikkim circuit — we'll put the right car, the best driver and the
                best itinerary on the road for you.
              </p>
            </article>
          </ScrollReveal>

          <ScrollReveal delay={0.2} direction="left">
            <aside className="rounded-[2rem] border border-border bg-muted/30 p-8 md:p-10">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-background border border-border shadow-sm">
                  <Target className="h-6 w-6 text-foreground" />
                </span>
                <h3 className="font-display text-2xl font-bold text-foreground">Our Mission</h3>
              </div>
              <p className="mt-6 text-muted-foreground">
                Provide comfortable, safe and affordable travel experiences across North Bengal — with
                transparent pricing, dependable drivers and a phone that is always answered.
              </p>
              <ul className="mt-8 grid gap-4 text-sm font-medium text-foreground/80">
                <li className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand" /> Verified drivers and insured vehicles</li>
                <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand" /> Deep local knowledge of every hill route</li>
                <li className="flex items-start gap-3"><Heart className="mt-0.5 h-5 w-5 shrink-0 text-brand" /> Hospitality that travellers remember</li>
              </ul>
            </aside>
          </ScrollReveal>
        </div>

        <div className="mt-24 grid gap-6 sm:grid-cols-3">
          {[
            { icon: Award, k: 31, suffix: "+", v: "Years serving North Bengal" },
            { icon: Smile, k: 50, suffix: "k+", v: "Trips completed safely" },
            { icon: MapPin, k: 100, suffix: "+", v: "Destinations covered" },
          ].map((s, i) => (
            <ScrollReveal key={s.v} delay={i * 0.1} direction="up" className="rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-sm text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand dark:bg-brand/20">
                <s.icon className="h-6 w-6" />
              </div>
              <AnimatedCounter to={s.k} suffix={s.suffix} className="mt-6 justify-center font-display text-4xl font-extrabold text-foreground" />
              <p className="mt-2 text-sm text-muted-foreground font-medium">{s.v}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <CTASection />
      <div className="h-16" />
    </>
  );
}
