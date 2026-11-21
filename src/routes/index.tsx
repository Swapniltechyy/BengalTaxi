import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import {
  getRoutes,
  getReviews,
  getVehicles,
  getServices,
  getAboutContent,
  createBooking,
} from "@/lib/api";
import {
  Phone,
  Clock,
  UserCheck,
  IndianRupee,
  ShieldCheck,
  MapPin,
  Star,
  Headphones,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Users,
  Briefcase,
  Snowflake,
  Music,
  Plane,
  Car,
  Mountain,
  Trees,
  Briefcase as BriefcaseIcon,
  Building2,
  Award,
  Smile,
  Send,
  Loader2,
  Mail,
  X,
  Train,
  Sparkles,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import heroImg from "@/assets/hero-taxi.png";
import heroImgMobile from "@/assets/mobile-view.png";
import routeDarjeeling from "@/assets/route-darjeeling.png";
import routeGangtok from "@/assets/route-gangtok.jpg";
import routeDooars from "@/assets/route-dooars.jpg";
import routeAirport from "@/assets/route-airport.jpg";
import routeKurseong from "@/assets/route-kurseong.jpg";
import routeMirik from "@/assets/route-Mirik.png";
import dzire from "@/assets/car-dzire.png";
import ertiga from "@/assets/car-ertiga.png";
import innova from "@/assets/car-innova.png";
import crysta from "@/assets/car-crysta.png";
import tempo from "@/assets/car-tempo.png";
import urbania from "@/assets/car-urbania.png";
import { site } from "@/lib/site";
import { CTASection } from "@/components/CTASection";
import { ScrollReveal } from "@/components/ScrollReveal";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { toast } from "sonner";

// ─── FAQ Data ────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "How do I book a cab with Bengal Taxi?",
    a: "Simply call or WhatsApp us at +91 99333 67890 — available 24×7. Tell us your pickup location, destination and date, and we'll confirm your booking instantly.",
  },
  {
    q: "Do you provide Bagdogra Airport pickup and drop?",
    a: "Yes! We offer dedicated airport transfer service from Bagdogra Airport (IXB) to Darjeeling, Gangtok, Sikkim, Dooars, Siliguri and all North Bengal destinations.",
  },
  {
    q: "What is the fare from Siliguri to Darjeeling?",
    a: "Fares depend on the vehicle type and exact pickup point. We share a fixed quote upfront before your trip — no surge pricing or hidden charges. Call us for an instant quote.",
  },
  {
    q: "Do you help with Sikkim permits?",
    a: "Yes. Our drivers are fully experienced with Sikkim Inner Line Permits (ILP). We assist you with the documentation process for North Sikkim and restricted area entry.",
  },
  {
    q: "What vehicles are available for hill routes?",
    a: "We operate Innova and Innova Crysta SUVs — best suited for Darjeeling, Sikkim and Dooars hill routes. For larger groups, we have Tempo Travellers accommodating up to 16 passengers.",
  },
  {
    q: "Is the service available on holidays and late at night?",
    a: "Absolutely. Bengal Taxi operates 24 hours a day, 365 days a year — including all public holidays, festive seasons and midnight pickups.",
  },
  {
    q: "Can I book a cab for a multi-day tour?",
    a: "Yes, we specialise in multi-day packages for Sikkim circuits, Dooars wildlife tours and Darjeeling itineraries. Contact us to get a custom itinerary and quote.",
  },
  {
    q: "Are your drivers verified and experienced?",
    a: "Every driver in our fleet is locally trained, hill-route experienced and personally known to our team. All vehicles are GPS tracked and fully insured.",
  },
];

// ─── Route Metadata ─────────────────────────────────────────────────────────
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
      { property: "og:url", content: "https://bengaltaxi.com/" },
    ],
    links: [{ rel: "canonical", href: "https://bengaltaxi.com/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TaxiService",
          name: "Bengal Taxi",
          url: "https://bengaltaxi.com",
          telephone: "+91-99333-67890",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "50000",
            bestRating: "5",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        }),
      },
    ],
  }),
  component: SinglePageWebsite,
});

// ─── Sub-Components & Data ──────────────────────────────────────────────────
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <ScrollReveal delay={index * 0.05} direction="up">
      <div className="rounded-2xl border border-border bg-card overflow-hidden transition-all hover:border-foreground/20">
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
          aria-expanded={open}
        >
          <span className="font-display text-base font-semibold text-foreground">{q}</span>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">{a}</p>
        </div>
      </div>
    </ScrollReveal>
  );
}

const fallbackRoutes = [
  { img: routeDarjeeling, title: "Siliguri → Darjeeling", note: "Queen of the Hills" },
  { img: routeGangtok, title: "Siliguri → Gangtok", note: "Capital of Sikkim" },
  { img: routeMirik, title: "Siliguri → Mirik", note: "Mirik Lake View" },
  { img: routeAirport, title: "Bagdogra Airport", note: "On-time pickup & drop" },
  { img: routeDooars, title: "Dooars Sightseeing", note: "Forests, rivers & wildlife" },
  { img: routeKurseong, title: "Siliguri → Kurseong", note: "Hills & Waterfalls" },
];

const why = [
  { icon: UserCheck, title: "Experienced Drivers", text: "Years of safe driving on hill routes." },
  { icon: IndianRupee, title: "Transparent Pricing", text: "Fixed quotes shared upfront. No surprises." },
  { icon: Clock, title: "On-Time Pickup", text: "Punctual airport, railway & hotel pickups." },
  { icon: MapPin, title: "Local Expertise", text: "Born and based in Siliguri — we know every turn." },
  { icon: Headphones, title: "Customer Support", text: "Real humans on the phone, anytime." },
];

const fallbackReviews = [
  {
    name: "Anirban Sen",
    place: "Kolkata",
    rating: 5,
    text: "Booked a Crysta from NJP to Darjeeling. Driver was on time, road sense was excellent and pricing exactly as quoted.",
  },
  {
    name: "Lay Mankad",
    place: "Gujarat",
    rating: 5,
    text: "Did a 4-day Sikkim trip with Bengal Taxi. Clean car, polite driver and they handled every permit. Highly recommended.",
  },
  {
    name: "Sakir Alam",
    place: "Patna",
    rating: 5,
    text: "Bagdogra to Gangtok at midnight — they were waiting at arrivals with a name placard. Trustworthy service.",
  },
  {
    name: "Bibek Paul",
    place: "Coochbehar",
    rating: 5,
    text: "Needed an urgent morning drop from Coochbehar to Bagdogra for a flight. Driver arrived 15 minutes early, drove very smoothly and reached comfortably in time. Super dependable!",
  },
  {
    name: "Pulasta Sen",
    place: "Jalpaiguri",
    rating: 5,
    text: "Booked an Innova for a family weekend trip to Dooars and Lataguri from Jalpaiguri. Very clean AC car, courteous hill-driver, and zero hidden charges. Will book again.",
  },
  {
    name: "Gururaj S",
    place: "Chennai",
    rating: 5,
    text: "First time visiting North Bengal and Darjeeling with family. We booked their 5-day tour package. Driver Subhash was polite, knowledgeable about scenic spots, and very patient with my elderly parents.",
  },
];

const fallbackCars = [
  {
    name: "SWIFT DZIRE",
    type: "Sedan",
    img: dzire,
    seats: "4 Passengers",
    luggage: "2-3 Large Bags",
    features: ["Air Conditioned", "Music System", "Comfortable for 2-3 adults"],
    best: "Best for: Airport transfer, city rides, couples",
  },
  {
    name: "ERTIGA",
    type: "MPV",
    img: ertiga,
    seats: "6 Passengers",
    luggage: "3-4 Large Bags",
    features: ["Air Conditioned", "Music System", "Extra leg-room"],
    best: "Best for: Small families, weekend Dooars trips",
  },
  {
    name: "INNOVA",
    type: "SUV",
    img: innova,
    seats: "6–7 Passengers",
    luggage: "4-5 Large Bags",
    features: ["Powerful AC", "Hill-tuned suspension", "Spacious cabin"],
    best: "Best for: Darjeeling tours, Sikkim circuit",
  },
  {
    name: "INNOVA CRYSTA",
    type: "Premium SUV",
    img: crysta,
    seats: "6–7 Passengers",
    luggage: "4-5 Large Bags",
    features: ["Captain seats", "Premium interior", "Best comfort on hills"],
    best: "Best for: Long tours, business travel, North Sikkim",
  },
  {
    name: "TEMPO TRAVELLER",
    type: "Minibus",
    img: tempo,
    seats: "12–16 Passengers",
    luggage: "8-10 Large Bags",
    features: ["Pushback seating", "Rooftop luggage carrier", "High roof for comfort"],
    best: "Best for: Large family groups, student tours, team trips",
  },
  {
    name: "URBANIA",
    type: "Luxury Van",
    img: urbania,
    seats: "12–16 Passengers",
    luggage: "8-10 Large Bags",
    features: ["Pushback seating", "Rooftop luggage carrier", "High roof for comfort"],
    best: "Best for: Luxury group travel, corporate tours, mountain expeditions",
  },
];

const fallbackServices = [
  {
    icon: BriefcaseIcon,
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
  Plane, Car, MapPin, Mountain, Trees, Briefcase: BriefcaseIcon, CheckCircle2, Train, Sparkles,
};

// ─── Main Single Page Website Component ─────────────────────────────────────
function SinglePageWebsite() {
  // Queries
  const { data: dbRoutes } = useQuery({ queryKey: ["routes"], queryFn: getRoutes });
  const { data: dbReviews } = useQuery({ queryKey: ["reviews"], queryFn: getReviews });
  const { data: dbCars } = useQuery({ queryKey: ["vehicles"], queryFn: getVehicles });
  const { data: dbServices } = useQuery({ queryKey: ["services"], queryFn: getServices });
  const { data: dbAbout } = useQuery({ queryKey: ["aboutContent"], queryFn: getAboutContent });

  const displayRoutes = dbRoutes ? dbRoutes.filter((r) => r.is_active) : fallbackRoutes;
  const displayReviews = dbReviews ? dbReviews.filter((r) => r.is_active) : fallbackReviews;
  const displayCars = dbCars ? dbCars.filter((c) => c.is_active) : fallbackCars;
  const displayServices = dbServices ? dbServices.filter((s) => s.is_active) : fallbackServices;
  const [selectedCar, setSelectedCar] = useState<any | null>(null);

  // About Content
  const heroTitle = dbAbout?.hero_title || "Born In Siliguri. Trusted Across the Hills.";
  const heroSubtitle =
    dbAbout?.hero_subtitle ||
    "Bengal Taxi is a locally-run cab service providing safe, comfortable and affordable travel across North Bengal, Darjeeling, Sikkim and the Dooars.";
  const storyP1 =
    dbAbout?.story_p1 ||
    "Bengal Taxi is a trusted taxi service provider based in Siliguri, serving North Bengal, Darjeeling, Sikkim and nearby destinations with safe and reliable transportation services. What started as a single sedan running airport pickups from Bagdogra has grown into a dependable fleet of sedans and SUVs covering every popular hill route.";
  const storyP2 =
    dbAbout?.story_p2 ||
    "We're not a faceless aggregator. Every driver on our roster is local, hill-trained and personally known to our team. That means real accountability, real road sense and a quality of ride that you can feel from the moment your trip begins.";
  const storyP3 =
    dbAbout?.story_p3 ||
    "Whether you are landing at Bagdogra after a long flight, planning a Darjeeling holiday or putting together a Sikkim circuit — we'll put the right car, the best driver and the best itinerary on the road for you.";
  const mission =
    dbAbout?.mission ||
    "Provide comfortable, safe and affordable travel experiences across North Bengal — with transparent pricing, dependable drivers and a phone that is always answered.";

  // Contact Form State
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<{
    name: string;
    phone: string;
    from: string;
    to: string;
    date: string;
    time: string;
    pax: string;
  } | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    from: "",
    to: "",
    date: "",
    time: "",
    pax: "",
    message: "",
  });
  const confirmationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sent && confirmationRef.current) {
      setTimeout(() => {
        confirmationRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    }
  }, [sent]);

  // Handle URL hash on initial load
  useEffect(() => {
    if (window.location.hash) {
      const hashId = window.location.hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(hashId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#${id}`);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const bookingPayload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      from_location: form.from.trim(),
      to_location: form.to.trim(),
      pickup_date: form.date,
      pickup_time: form.time,
      pax: form.pax.trim(),
      details: form.message.trim(),
      status: "pending",
    };

    try {
      const { error } = await createBooking(bookingPayload);
      if (error) {
        console.error("Booking submission error:", error);
        toast.error("Could not save online booking. Opening WhatsApp for direct confirmation…");
      } else {
        toast.success("Booking request received! We will call you shortly.");
      }

      setSubmittedBooking({
        name: form.name.trim(),
        phone: form.phone.trim(),
        from: form.from.trim(),
        to: form.to.trim(),
        date: form.date,
        time: form.time,
        pax: form.pax.trim(),
      });
      setSent(true);

      const msg = [
        `*New Booking Request — Bengal Taxi*`,
        `👤 *Name:* ${form.name.trim()}`,
        `📞 *Phone:* ${form.phone.trim()}`,
        `📍 *Pickup:* ${form.from.trim()}`,
        `🏁 *Drop:* ${form.to.trim()}`,
        form.date ? `📅 *Date:* ${form.date}` : null,
        form.time ? `⏰ *Time:* ${form.time}` : null,
        form.pax ? `👥 *Guests:* ${form.pax}` : null,
        form.message.trim() ? `💬 *Details:* ${form.message.trim()}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      const waUrl = `https://wa.me/919933367890?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred. Please call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* ──────────────────────────────────────────────────────────
          1. HOME SECTION (Hero)
      ────────────────────────────────────────────────────────── */}
      <section id="home" className="relative w-full h-screen flex items-center overflow-hidden">
        {/* Full-bleed background image */}
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Yellow taxi on a Darjeeling hill road"
            className="hidden md:block h-full w-full object-cover object-right"
            width={1920}
            height={1080}
            loading="eager"
          />
          <img
            src={heroImgMobile}
            alt="Bengal Taxi on a scenic mountain road"
            className="block md:hidden h-full w-full object-cover object-center"
            width={600}
            height={1080}
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
        </div>

        <div className="container-x relative z-10">
          <ScrollReveal direction="right">
            <div className="max-w-3xl">
              <h1 className="font-display text-4xl font-extrabold leading-[1.2] tracking-tight text-white sm:text-5xl sm:leading-[1.08] md:text-6xl lg:text-7xl">
                Most&nbsp;<br />Trusted & Affordable<br />
                <span className="whitespace-nowrap">Taxi Service Across</span><br />
                <span className="text-brand whitespace-nowrap">Bengal & Sikkim </span>
              </h1>
              <p className="mt-6 max-w-md text-base text-white/70 md:mt-5 md:text-lg">
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

      {/* ──────────────────────────────────────────────────────────
          2. VEHICLE SECTION
      ────────────────────────────────────────────────────────── */}
      <section id="vehicle" className="container-x py-16 md:py-24 scroll-mt-20">
        <ScrollReveal>
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.1em] text-foreground">
              <span className="text-brand mr-2">●</span>Our Fleet
            </p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
              Clean, Comfortable Cabs Tuned for the Hills
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              From compact sedans to premium SUVs — every vehicle is serviced, sanitised and driven by trained hill drivers.
            </p>
          </div>
        </ScrollReveal>

        {/* Mobile View: 2 vehicles per row (Row 1: 2, Row 2: 2, Row 3: 2), showing car image & click for details */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:hidden">
          {displayCars.map((c) => (
            <article
              key={c.name}
              onClick={() => setSelectedCar(c)}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-foreground/30 hover:shadow-md active:scale-95 flex flex-col"
            >
              <div className="aspect-[4/3] bg-muted/50 p-3 sm:p-4 flex items-center justify-center relative">
                {c.image_url || c.img ? (
                  <img
                    src={c.image_url || c.img}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="text-xs text-muted-foreground">No image</div>
                )}
              </div>
              <div className="p-3 text-center border-t border-border/50 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">{c.type}</p>
                  <h3 className="font-display text-xs sm:text-sm font-extrabold text-foreground truncate mt-0.5">
                    {c.name}
                  </h3>
                </div>
                <span className="mt-2 inline-flex items-center justify-center text-[11px] font-semibold text-brand underline underline-offset-2">
                  View Details →
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Desktop View: Full detailed cards in 2-column grid */}
        <div className="mt-12 hidden md:grid md:grid-cols-2 md:gap-10">
          {displayCars.map((c, i) => (
            <ScrollReveal key={c.name} delay={i * 0.1} direction="up">
              <article className="overflow-hidden rounded-[2rem] border border-border bg-card transition-shadow hover:shadow-sm hover:border-foreground/20">
                <div className="aspect-[16/10] bg-muted/50 p-8 flex items-center justify-center">
                  {c.image_url || c.img ? (
                    <img
                      src={c.image_url || c.img}
                      alt={c.name}
                      loading="lazy"
                      width={900}
                      height={600}
                      className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal drop-shadow-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        const parent = (e.target as HTMLImageElement).parentElement;
                        if (parent && !parent.querySelector(".img-fallback")) {
                          const fallback = document.createElement("div");
                          fallback.className =
                            "img-fallback flex flex-col items-center justify-center text-muted-foreground w-full h-full";
                          fallback.innerHTML =
                            '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg><span class="mt-2 text-xs font-medium">Image unavailable</span>';
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground w-full h-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                      <span className="mt-2 text-xs font-medium">No image</span>
                    </div>
                  )}
                </div>
                <div className="p-8 md:p-10">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{c.type}</p>
                      <h3 className="mt-2 font-display text-3xl font-extrabold text-foreground">{c.name}</h3>
                    </div>
                    <span className="rounded-full bg-brand/10 px-4 py-1.5 text-sm font-bold text-brand dark:bg-brand/20">
                      {(c.seats || "").split(" ")[0]} seats
                    </span>
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
                    {c.features.map((f: string) => (
                      <li key={f} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand" /> {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 border-t border-border pt-6">
                    <p className="text-sm font-semibold text-foreground">{c.best || c.best_for}</p>
                    <div className="mt-6 flex flex-wrap gap-4">
                      <a
                        href={site.phoneHref}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 font-semibold text-background transition-transform hover:scale-105 active:scale-95"
                      >
                        <Phone className="h-4 w-4" /> Book {c.name}
                      </a>
                      <a
                        href={site.whatsappHref}
                        target="_blank"
                        rel="noopener"
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-background px-6 font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        {/* Vehicle Details Modal (opened on click) */}
        {selectedCar && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedCar(null)}
          >
            <div
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[2rem] border border-border bg-card p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedCar(null)}
                className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground hover:bg-accent transition-colors cursor-pointer"
                aria-label="Close vehicle details"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="aspect-[16/10] bg-muted/50 p-6 rounded-2xl flex items-center justify-center">
                <img
                  src={selectedCar.image_url || selectedCar.img}
                  alt={selectedCar.name}
                  className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal drop-shadow-md"
                />
              </div>

              <div className="mt-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{selectedCar.type}</p>
                  <h3 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-foreground">{selectedCar.name}</h3>
                </div>
                <span className="rounded-full bg-brand/10 px-3.5 py-1 text-xs sm:text-sm font-bold text-brand dark:bg-brand/20">
                  {selectedCar.seats?.split(" ")[0]} seats
                </span>
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-3 text-xs sm:text-sm font-medium">
                <div className="flex items-center gap-2.5 rounded-xl bg-muted/50 px-3.5 py-2.5 text-foreground/80">
                  <Users className="h-4 w-4 text-brand" /> <span>{selectedCar.seats}</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl bg-muted/50 px-3.5 py-2.5 text-foreground/80">
                  <Briefcase className="h-4 w-4 text-brand" /> <span>{selectedCar.luggage}</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl bg-muted/50 px-3.5 py-2.5 text-foreground/80">
                  <Snowflake className="h-4 w-4 text-brand" /> <span>AC</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl bg-muted/50 px-3.5 py-2.5 text-foreground/80">
                  <Music className="h-4 w-4 text-brand" /> <span>Music</span>
                </div>
              </dl>

              <ul className="mt-5 space-y-2 text-xs sm:text-sm text-muted-foreground">
                {selectedCar.features?.map((f: string) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" /> {f}
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-border pt-5">
                <p className="text-xs sm:text-sm font-semibold text-foreground mb-4">{selectedCar.best || selectedCar.best_for}</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={site.phoneHref}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-transform hover:scale-105 active:scale-95"
                  >
                    <Phone className="h-4 w-4" /> Book {selectedCar.name}
                  </a>
                  <a
                    href={site.whatsappHref}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ──────────────────────────────────────────────────────────
          3. DESTINATIONS SECTION
      ────────────────────────────────────────────────────────── */}
      <section id="destinations" className="container-x py-16 md:py-24 scroll-mt-20">
        <ScrollReveal>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.1em] text-foreground">
                <span className="text-brand mr-2">●</span>Destinations
              </p>
              <h2 className="mt-4 font-display text-xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                Where To Travel In North East
              </h2>
            </div>
            <button
              type="button"
              onClick={() => scrollTo("services")}
              className="inline-flex items-center gap-2 font-semibold text-foreground hover:text-brand transition-colors cursor-pointer"
            >
              View all services <span aria-hidden="true">→</span>
            </button>
          </div>
        </ScrollReveal>

        <div id="routes-grid" className="mt-8 sm:mt-12 grid grid-cols-2 gap-3 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {displayRoutes.map((r, i) => (
            <ScrollReveal key={r.title} delay={i * 0.05} direction="up">
              <article className="group flex flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-card transition-all hover:border-foreground/20 hover:shadow-sm">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={r.image_url || r.img}
                    alt={r.title}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-3 sm:p-6">
                  <div>
                    <h3 className="font-display text-xs sm:text-lg md:text-xl font-bold text-foreground leading-snug">{r.title}</h3>
                    <p className="mt-1 sm:mt-2 text-[11px] sm:text-sm text-muted-foreground line-clamp-2">{r.note}</p>
                  </div>
                  <a
                    href={site.whatsappHref}
                    target="_blank"
                    rel="noopener"
                    className="mt-3 sm:mt-6 inline-flex w-full sm:w-fit items-center justify-center rounded-full bg-brand/10 px-3 py-1.5 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-foreground transition-colors hover:bg-brand hover:text-brand-foreground dark:bg-brand/20 dark:hover:bg-brand"
                  >
                    Get Quote
                  </a>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          4. SERVICES SECTION
      ────────────────────────────────────────────────────────── */}
      <section id="services" className="container-x py-16 md:py-24 scroll-mt-20">
        <ScrollReveal>
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.1em] text-foreground">
              <span className="text-brand mr-2">●</span>Our Services
            </p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
              Where do you want to go?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              From quick airport drops to multi-day Sikkim expeditions, Bengal Taxi offers tailored, clean, and reliable travel across North Bengal.
            </p>
          </div>
        </ScrollReveal>

        {/* Mobile View: Clean, high-impact service rows (instantly overviewed) */}
        <div className="md:hidden mt-8 space-y-2.5">
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
        <div className="hidden md:grid mt-12 gap-6 md:grid-cols-2">
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
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.text || s.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(s.points || []).map((p: string) => (
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

        {/* Custom Quote */}
        <ScrollReveal
          delay={0.3}
          direction="up"
          className="mt-16 md:flex md:items-center md:justify-between md:gap-8 max-w-4xl mx-auto"
        >
          <div>
            <h3 className="font-display text-2xl font-bold text-foreground">Need a Custom Quote?</h3>
            <p className="mt-2 text-muted-foreground max-w-md">
              Call us for personalized tour packages and group bookings across Bengal & Sikkim.
            </p>
          </div>
          <a
            href={site.phoneHref}
            className="mt-6 md:mt-0 mx-auto md:mx-0 flex md:inline-flex w-fit shrink-0 h-12 items-center justify-center gap-2 rounded-full bg-brand px-8 font-semibold text-brand-foreground transition-transform hover:scale-105 active:scale-95"
          >
            <Phone className="h-5 w-5" /> Call Now
          </a>
        </ScrollReveal>
      </section>

      {/* ──────────────────────────────────────────────────────────
          5. ABOUT SECTION
      ────────────────────────────────────────────────────────── */}
      <section id="about" className="container-x py-16 md:py-24 scroll-mt-20">
        <ScrollReveal>
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.1em] text-foreground">
              <span className="text-brand mr-2">●</span>About Us
            </p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
              Born In Siliguri.
              <br />
              Trusted Across the Hills.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              {heroSubtitle}
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12">
          <ScrollReveal>
            <article className="space-y-6 text-base sm:text-lg leading-relaxed text-muted-foreground">
              <h3 className="font-display text-2xl font-extrabold text-foreground md:text-3xl text-center">Our Story</h3>
              <p>{storyP1}</p>
              <p>{storyP2}</p>
              <p>{storyP3}</p>
            </article>
          </ScrollReveal>
        </div>

        {/* Counters */}
        <div className="hidden md:grid mt-20 gap-6 sm:grid-cols-3">
          {[
            { icon: Award, k: 31, suffix: "+", v: "Years serving North Bengal" },
            { icon: Smile, k: 50, suffix: "k+", v: "Trips completed safely" },
            { icon: MapPin, k: 100, suffix: "+", v: "Destinations covered" },
          ].map((s, i) => (
            <ScrollReveal
              key={s.v}
              delay={i * 0.1}
              direction="up"
              className="rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-sm text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand dark:bg-brand/20">
                <s.icon className="h-6 w-6" />
              </div>
              <AnimatedCounter to={s.k} suffix={s.suffix} className="mt-6 justify-center font-display text-4xl font-extrabold text-foreground" />
              <p className="mt-2 text-sm text-muted-foreground font-medium">{s.v}</p>
            </ScrollReveal>
          ))}
        </div>

        {/* Why Choose Us Box */}
        <div className="hidden md:block mt-20">
          <ScrollReveal>
            <div className="rounded-2xl sm:rounded-[3rem] bg-muted/50 px-5 py-12 sm:px-6 sm:py-16 md:px-12 md:py-24">
              <div className="max-w-2xl">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-foreground">
                  <span className="text-brand mr-2">●</span> Why Bengal Taxi
                </p>
                <h3 className="mt-4 font-display text-xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                  A Taxi Service Trusted Since <span className="text-brand">1995</span>
                </h3>
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
                        <h4 className="font-display text-lg font-bold text-foreground">{w.title}</h4>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{w.text}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>



        {/* Customer Reviews */}
        <div className="mt-20">
          <ScrollReveal>
            <div className="max-w-2xl text-center mx-auto">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-foreground">
                <span className="text-brand mr-2">●</span> Customer Stories
              </p>
              <h3 className="mt-4 font-display text-3xl font-extrabold text-foreground sm:text-4xl md:text-5xl">
                Loved By Travellers Across India
              </h3>
            </div>
          </ScrollReveal>
          {/* Customer Reviews Single Row Sliding Carousel */}
          <div className="mt-16 relative overflow-hidden py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            {/* Gradient Edge Masks for soft fade on edges */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-24 z-10 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-24 z-10 bg-gradient-to-l from-background to-transparent" />

            <div className="flex gap-6 animate-slide-reviews">
              {[...displayReviews, ...displayReviews].map((r, i) => (
                <figure
                  key={`${r.name}-${i}`}
                  className="w-[290px] sm:w-[380px] shrink-0 flex flex-col justify-between rounded-2xl border border-border bg-card p-6 sm:p-8 transition-all duration-300 hover:border-foreground/30 hover:shadow-lg"
                >
                  <div>
                    <div className="flex gap-1 text-brand">
                      {Array.from({ length: r.rating || 5 }).map((_, idx) => (
                        <Star key={idx} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <blockquote className="mt-5 text-base sm:text-lg leading-relaxed text-foreground/90">
                      "{r.text}"
                    </blockquote>
                  </div>
                  <figcaption className="mt-6 border-t border-border pt-5">
                    <div className="min-w-0">
                      <p className="font-display text-sm sm:text-base font-bold text-foreground truncate">{r.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{r.place}</p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-brand" />
            Verified pickups · Driver verification · Trip-level insurance
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          6. CONTACT SECTION
      ────────────────────────────────────────────────────────── */}
      <section id="contact" className="container-x py-16 md:py-24 scroll-mt-20">
        <ScrollReveal className="hidden md:block">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.1em] text-foreground">
              <span className="text-brand mr-2">●</span>Contact Us
            </p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
              Talk to Us — You'll Get a Cab on the Road
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Available 24×7 for bookings, quotes and travel advice across North Bengal.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-4 md:mt-12 grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          {/* Details Column */}
          <ScrollReveal className="order-2 lg:order-1">
            <div className="space-y-6">
              <a
                href={site.phoneHref}
                className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-foreground/20 hover:shadow-sm"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground dark:bg-brand/20 dark:group-hover:bg-brand">
                  <Phone className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Call Us</p>
                  <p className="mt-1 font-display text-base sm:text-xl font-bold text-foreground">{site.phone}</p>
                  <p className="mt-1 text-sm text-muted-foreground">24×7 for bookings & quotes</p>
                </div>
              </a>

              <a
                href={site.whatsappHref}
                target="_blank"
                rel="noopener"
                className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-foreground/20 hover:shadow-sm"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] transition-colors group-hover:bg-[#25D366] group-hover:text-white">
                  <WhatsAppIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">WhatsApp</p>
                  <p className="mt-1 font-display text-base sm:text-xl font-bold text-foreground">{site.whatsapp}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Fastest way to share details</p>
                </div>
              </a>

              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${site.email}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-foreground/20 hover:shadow-sm"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-foreground/5 text-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                  <Mail className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</p>
                  <p className="mt-1 font-display text-base sm:text-xl font-bold text-foreground whitespace-nowrap tracking-tight">{site.email}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Reply within a few hours</p>
                </div>
              </a>

              <a
                href="https://www.google.com/maps/place/Baba+Lokenath+Communication/@26.7154538,88.4266311,17z/data=!3m1!4b1!4m6!3m5!1s0x39e4416d11743705:0x7114c027dc33aeca!8m2!3d26.715449!4d88.429206!16s%2Fg%2F1hdzfqnnp?hl=en-US"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-foreground/20 hover:shadow-sm"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-foreground/5 text-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                  <MapPin className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Central Office</p>
                  <p className="mt-1 font-display text-base sm:text-lg font-bold text-foreground leading-snug">{site.address}</p>
                  <p className="mt-2 text-sm text-muted-foreground flex items-center gap-1.5"><Clock className="h-4 w-4" /> Open 24 hours</p>
                </div>
              </a>
            </div>
          </ScrollReveal>

          {/* Form / Confirmation Column */}
          <div className="order-1 lg:order-2">
            {sent && submittedBooking ? (
              <div
                ref={confirmationRef}
                className="rounded-[2rem] border border-border bg-card p-6 sm:p-8 md:p-12 text-center shadow-xs scroll-mt-24"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="mt-5 font-display text-2xl sm:text-3xl font-extrabold text-foreground">
                  Booking Request Received!
                </h3>
                <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
                  Thank you, <span className="font-bold text-foreground">{submittedBooking.name}</span>! We have received your booking request and our team will get in touch with you shortly.
                </p>

                {/* Booking Summary Box */}
                <div className="mt-6 rounded-2xl border border-border/70 bg-muted/30 p-4 sm:p-5 text-left text-sm space-y-2.5 max-w-md mx-auto">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground uppercase font-bold tracking-wider">Route</span>
                    <span className="font-semibold text-foreground">{submittedBooking.from} → {submittedBooking.to}</span>
                  </div>
                  {submittedBooking.date && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground uppercase font-bold tracking-wider">Pickup Date</span>
                      <span className="font-medium text-foreground">{submittedBooking.date}</span>
                    </div>
                  )}
                  {submittedBooking.time && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground uppercase font-bold tracking-wider">Pickup Time</span>
                      <span className="font-medium text-foreground">{submittedBooking.time}</span>
                    </div>
                  )}
                  {submittedBooking.pax && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground uppercase font-bold tracking-wider">Guests / Pax</span>
                      <span className="font-medium text-foreground">{submittedBooking.pax} Guests</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-xs border-t border-border/50 pt-2">
                    <span className="text-muted-foreground uppercase font-bold tracking-wider">Contact Phone</span>
                    <span className="font-bold text-brand">+91 {submittedBooking.phone}</span>
                  </div>
                </div>

                <p className="mt-6 text-xs text-muted-foreground">
                  Need instant confirmation? You can also call us directly at{" "}
                  <a href={`tel:${site.phone}`} className="font-bold text-foreground underline">{site.phone}</a>.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setForm({ name: "", phone: "", from: "", to: "", date: "", time: "", pax: "", message: "" });
                      setSubmittedBooking(null);
                      setSent(false);
                    }}
                    className="w-full sm:w-auto rounded-full bg-brand px-8 py-3.5 text-sm font-bold text-brand-foreground hover:brightness-105 transition-all cursor-pointer shadow-xs"
                  >
                    Book Another Ride
                  </button>
                  <a
                    href={`tel:${site.phone}`}
                    className="w-full sm:w-auto rounded-full border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors"
                  >
                    Call Us: {site.phone}
                  </a>
                </div>
              </div>
            ) : (
              <ScrollReveal delay={0.2} direction="left">
                <form onSubmit={onSubmit} className="rounded-[2rem] border border-border bg-card p-6 sm:p-8 md:p-12">
                  <h3 className="font-display text-3xl font-extrabold text-foreground">Send a Booking Request</h3>
                  <p className="mt-2 text-muted-foreground">Fill out the form and our team will get back to you shortly to confirm your booking.</p>
                  <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your Name</label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value.toUpperCase() })}
                        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm uppercase placeholder:normal-case outline-none transition-colors focus:border-brand"
                        placeholder="Full Name"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone</label>
                      <input
                        required
                        type="tel"
                        pattern="\d{10}"
                        maxLength={10}
                        title="Please enter exactly 10 digits"
                        value={form.phone}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^\d{0,10}$/.test(val)) {
                            setForm({ ...form, phone: val });
                          }
                        }}
                        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-brand"
                        placeholder="10-digit number"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">From</label>
                      <input
                        required
                        value={form.from}
                        onChange={(e) => setForm({ ...form, from: e.target.value })}
                        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-brand"
                        placeholder="e.g. Bagdogra Airport"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">To</label>
                      <input
                        required
                        value={form.to}
                        onChange={(e) => setForm({ ...form, to: e.target.value })}
                        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-brand"
                        placeholder="e.g. Darjeeling"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className={`mt-2 w-full min-h-[46px] rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-brand uppercase dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-50 ${!form.date ? "text-muted-foreground" : "text-foreground"}`}
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pickup Time</label>
                      <input
                        type="time"
                        value={form.time}
                        onChange={(e) => setForm({ ...form, time: e.target.value })}
                        className={`mt-2 w-full min-h-[46px] rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-brand dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-50 ${!form.time ? "text-muted-foreground" : "text-foreground"}`}
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pax</label>
                      <input
                        required
                        type="tel"
                        value={form.pax}
                        onChange={(e) => setForm({ ...form, pax: e.target.value.replace(/\D/g, "") })}
                        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-brand"
                        placeholder="e.g. 4 Guests"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Trip Details</label>
                      <textarea
                        maxLength={100}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        rows={4}
                        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-brand resize-none"
                        placeholder="Dates, group size, car preference…"
                      />
                      <p className="mt-1.5 text-xs font-medium text-muted-foreground">{form.message.length}/100</p>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-8 py-4 font-bold text-brand-foreground transition-transform hover:scale-105 active:scale-95 disabled:opacity-75 disabled:hover:scale-100 sm:w-auto cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Sending Request…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" /> Send Request
                      </>
                    )}
                  </button>
                </form>
              </ScrollReveal>
            )}
          </div>
        </div>

        {/* Map */}
        <ScrollReveal delay={0.4} direction="up">
          <div className="mt-24 overflow-hidden rounded-[2rem] border border-border bg-muted">
            <iframe
              title="Bengal Taxi — Siliguri location"
              src="https://www.google.com/maps?q=Baba+Lokenath+Communication,+Siliguri&output=embed"
              className="h-[400px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </ScrollReveal>
      </section>

      {/* ──────────────────────────────────────────────────────────
          7. FAQ SECTION
      ────────────────────────────────────────────────────────── */}
      <section id="faq" className="container-x py-16 md:py-24 scroll-mt-20">
        <ScrollReveal>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm font-bold uppercase tracking-[0.1em] text-foreground">
              <span className="text-brand mr-2">●</span>Common Questions
            </p>
            <h2 className="mt-4 font-display text-3xl font-extrabold text-foreground sm:text-4xl md:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-muted-foreground">
              Everything you need to know before booking your cab across North Bengal.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <FaqItem key={i} index={i} q={faq.q} a={faq.a} />
          ))}
        </div>

        <ScrollReveal delay={0.3}>
          <div className="mt-10 text-center text-sm text-muted-foreground space-y-1 sm:space-y-1.5">
            <p className="font-medium text-foreground/80">Still Have Questions ?</p>
            <p>
              <a
                href="tel:+919933367890"
                className="font-semibold text-foreground underline underline-offset-2 hover:text-brand transition-colors"
              >
                Call us 24×7
              </a>{" "}
              or{" "}
              <button
                type="button"
                onClick={() => scrollTo("contact")}
                className="font-semibold text-foreground underline underline-offset-2 hover:text-brand transition-colors cursor-pointer"
              >
                Send a message
              </button>
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* ──────────────────────────────────────────────────────────
          8. CALL TO ACTION SECTION
      ────────────────────────────────────────────────────────── */}
      <CTASection />
      <div className="h-16" />
    </>
  );
}
