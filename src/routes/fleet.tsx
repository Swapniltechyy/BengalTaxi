import { createFileRoute } from "@tanstack/react-router";
import { Users, Briefcase, Snowflake, Phone, Music } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { PageHero } from "@/components/PageHero";
import { CTASection } from "@/components/CTASection";
import { site } from "@/lib/site";
import dzire from "@/assets/car-dzire.png";
import ertiga from "@/assets/car-ertiga.png";
import innova from "@/assets/car-innova.png";
import crysta from "@/assets/car-crysta.png";
import tempo from "@/assets/car-tempo.png";
import { ScrollReveal } from "@/components/ScrollReveal";

export const Route = createFileRoute("/fleet")({
  head: () => ({
    meta: [
      { title: "Our Fleet — Sedans & SUVs | Bengal Taxi" },
      { name: "description", content: "Swift Dzire, Ertiga, Innova and Innova Crysta — clean, well-maintained cabs for every group size and route across North Bengal." },
      { property: "og:title", content: "Bengal Taxi — Fleet" },
      { property: "og:description", content: "Sedans, MPVs and SUVs maintained for hill driving." },
      { property: "og:url", content: "/fleet" },
    ],
    links: [{ rel: "canonical", href: "/fleet" }],
  }),
  component: FleetPage,
});

const cars = [
  {
    name: "Swift Dzire",
    type: "Sedan",
    img: dzire,
    seats: "4 Passengers",
    luggage: "2-3 Large Bags",
    features: ["Air Conditioned", "Music System", "Comfortable for 2-3 adults"],
    best: "Best for: Airport transfer, city rides, couples",
  },
  {
    name: "Ertiga",
    type: "MPV",
    img: ertiga,
    seats: "6 Passengers",
    luggage: "3-4 Large Bags",
    features: ["Air Conditioned", "Music System", "Extra leg-room"],
    best: "Best for: Small families, weekend Dooars trips",
  },
  {
    name: "Innova",
    type: "SUV",
    img: innova,
    seats: "6–7 Passengers",
    luggage: "4-5 Large Bags",
    features: ["Powerful AC", "Hill-tuned suspension", "Spacious cabin"],
    best: "Best for: Darjeeling tours, Sikkim circuit",
  },
  {
    name: "Innova Crysta",
    type: "Premium SUV",
    img: crysta,
    seats: "6–7 Passengers",
    luggage: "4-5 Large Bags",
    features: ["Captain seats", "Premium interior", "Best comfort on hills"],
    best: "Best for: Long tours, business travel, North Sikkim",
  },
  {
    name: "Tempo Traveller",
    type: "Minibus",
    img: tempo,
    seats: "12–16 Passengers",
    luggage: "8-10 Large Bags",
    features: ["Pushback seating", "Rooftop luggage carrier", "High roof for comfort"],
    best: "Best for: Large family groups, student tours, team trips",
  },
];

function FleetPage() {
  return (
    <>
      <PageHero
        title="Clean, Comfortable Cabs Tuned for the Hills."
        subtitle="From compact sedans to premium SUVs — every vehicle is serviced, sanitised and driven by trained hill drivers."
      />

      <section className="container-x py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-2">
          {cars.map((c, i) => (
            <ScrollReveal key={c.name} delay={i * 0.1} direction="up">
              <article className="overflow-hidden rounded-[2rem] border border-border bg-card transition-shadow hover:shadow-sm hover:border-foreground/20">
                <div className="aspect-[16/10] bg-muted/50 p-8 flex items-center justify-center">
                  <img
                    src={c.img}
                    alt={c.name}
                    loading="lazy"
                    width={900}
                    height={600}
                    className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal drop-shadow-md"
                  />
                </div>
                <div className="p-8 md:p-10">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{c.type}</p>
                      <h3 className="mt-2 font-display text-3xl font-extrabold text-foreground">{c.name}</h3>
                    </div>
                    <span className="rounded-full bg-brand/10 px-4 py-1.5 text-sm font-bold text-brand dark:bg-brand/20">{c.seats.split(" ")[0]} seats</span>
                  </div>

                  <dl className="mt-8 grid grid-cols-2 gap-4 text-sm font-medium">
                    <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3 text-foreground/80">
                      <Users className="h-5 w-5 text-brand" /> <span>{c.seats}</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3 text-foreground/80">
                      <Briefcase className="h-5 w-5 text-brand" /> <span>{c.luggage}</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3 text-foreground/80">
                      <Snowflake className="h-5 w-5 text-brand" /> <span>AC</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3 text-foreground/80">
                      <Music className="h-5 w-5 text-brand" /> <span>Music</span>
                    </div>
                  </dl>

                  <ul className="mt-6 space-y-2.5 text-sm text-muted-foreground">
                    {c.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand" /> {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 border-t border-border pt-6">
                    <p className="text-sm font-semibold text-foreground">{c.best}</p>
                    <div className="mt-6 flex flex-wrap gap-4">
                      <a href={site.phoneHref} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 font-semibold text-background transition-transform hover:scale-105 active:scale-95">
                        <Phone className="h-4 w-4" /> Book {c.name}
                      </a>
                      <a href={site.whatsappHref} target="_blank" rel="noopener" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-background px-6 font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                        <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <CTASection />
      <div className="h-16" />
    </>
  );
}
