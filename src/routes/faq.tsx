import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Phone, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { CTASection } from "@/components/CTASection";
import { ScrollReveal } from "@/components/ScrollReveal";
import { site } from "@/lib/site";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Frequently Asked Questions | Bengal Taxi" },
      {
        name: "description",
        content:
          "Got questions about booking a cab in Siliguri, Darjeeling or Sikkim? Find answers to the most common questions about Bengal Taxi's services, pricing, fleet and more.",
      },
      { property: "og:title", content: "Bengal Taxi — FAQ" },
      { property: "og:description", content: "Answers to your most common questions about cab booking across North Bengal." },
      { property: "og:url", content: "https://bengaltaxi.com/faq" },
    ],
    links: [{ rel: "canonical", href: "https://bengaltaxi.com/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://bengaltaxi.com/" },
            { "@type": "ListItem", position: 2, name: "FAQ", item: "https://bengaltaxi.com/faq" },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqCategories.flatMap((cat) =>
            cat.items.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          ),
        }),
      },
    ],
  }),
  component: FaqPage,
});

const faqCategories = [
  {
    category: "Booking & Pricing",
    items: [
      {
        q: "How do I book a cab with Bengal Taxi?",
        a: "Simply call or WhatsApp us at +91 99333 67890 — available 24×7. Tell us your pickup location, destination and date, and we'll confirm your booking instantly.",
      },
      {
        q: "What is the fare from Siliguri to Darjeeling?",
        a: "Fares depend on vehicle type and exact pickup point. We share a fixed quote upfront before your trip — no surge pricing or hidden charges. Call us for an instant quote.",
      },
      {
        q: "Is there a booking cancellation fee?",
        a: "We understand travel plans change. Contact us as soon as possible if you need to cancel or reschedule and we will do our best to accommodate with minimal hassle.",
      },
      {
        q: "Can I pay cash or do you accept digital payments?",
        a: "We accept cash, UPI, Google Pay and bank transfers. Payment details are confirmed at the time of booking.",
      },
    ],
  },
  {
    category: "Airport Transfers",
    items: [
      {
        q: "Do you provide Bagdogra Airport pickup and drop?",
        a: "Yes! We offer dedicated airport transfer service from Bagdogra Airport (IXB) to Darjeeling, Gangtok, Sikkim, Dooars, Siliguri and all North Bengal destinations.",
      },
      {
        q: "Do you track flights for airport pickups?",
        a: "Yes. We monitor your flight status and adjust the pickup time if your flight is delayed. Your driver will wait at the arrival gate with a name placard.",
      },
      {
        q: "How early should I book an airport cab?",
        a: "We recommend booking at least 24 hours in advance for airport transfers. However, we often accommodate last-minute bookings — call us to check availability.",
      },
    ],
  },
  {
    category: "Tours & Destinations",
    items: [
      {
        q: "Do you offer Darjeeling tour packages?",
        a: "Yes! We offer full-day and multi-day Darjeeling tours covering Tiger Hill, Batasia Loop, Rock Garden, Tea Gardens and more. Our drivers know every scenic route.",
      },
      {
        q: "Do you cover Sikkim tours?",
        a: "Yes. We run complete Sikkim tour packages — Gangtok sightseeing, Tsomgo Lake, Baba Mandir, North Sikkim (Lachen/Lachung), and Pelling. We assist with Inner Line Permits.",
      },
      {
        q: "Do you help with Sikkim Inner Line Permits?",
        a: "Yes. Our drivers are fully experienced with Sikkim Inner Line Permits (ILP). We assist you with the documentation process for North Sikkim and restricted area entry.",
      },
      {
        q: "Can I book a Dooars safari taxi?",
        a: "Absolutely. We offer Dooars tour taxis covering Gorumara National Park, Jaldapara Wildlife Sanctuary, Buxa Tiger Reserve, Chapramari and Lataguri. Resort transfers included.",
      },
      {
        q: "Do you go to Mirik and Kurseong?",
        a: "Yes. We cover Mirik (Mirik Lake, Srikhola, Pashupati border) and Kurseong (Makaibari Tea Estate, Eagle's Craig, Dowhill Forest). These are popular half-day or full-day trips.",
      },
    ],
  },
  {
    category: "Fleet & Drivers",
    items: [
      {
        q: "What vehicles are available for hill routes?",
        a: "We operate Innova and Innova Crysta SUVs — best suited for Darjeeling, Sikkim and Dooars hill routes. For larger groups, we have Tempo Travellers for up to 16 passengers.",
      },
      {
        q: "Are your vehicles air-conditioned?",
        a: "Yes. All our vehicles — Swift Dzire, Ertiga, Innova, Innova Crysta and Tempo Traveller — are fully air-conditioned and well-maintained.",
      },
      {
        q: "Are your drivers verified and experienced?",
        a: "Every driver in our fleet is locally trained, hill-route experienced and personally known to our team. All vehicles are GPS tracked and fully insured.",
      },
      {
        q: "Is the service available late at night and on holidays?",
        a: "Absolutely. Bengal Taxi operates 24 hours a day, 365 days a year — including all public holidays, festive seasons and midnight pickups.",
      },
    ],
  },
];

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden transition-all hover:border-foreground/20">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
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
  );
}

function FaqPage() {
  return (
    <>
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Everything you need to know before booking your cab across North Bengal — answered clearly and honestly."
      />

      <section className="container-x py-16 md:py-24">
        <div className="max-w-3xl mx-auto space-y-16">
          {faqCategories.map((cat, ci) => (
            <ScrollReveal key={cat.category} delay={ci * 0.1}>
              <div>
                {/* Category heading */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-px flex-1 bg-border" />
                  <h2 className="font-display text-sm font-bold uppercase tracking-[0.15em] text-muted-foreground whitespace-nowrap">
                    {cat.category}
                  </h2>
                  <span className="h-px flex-1 bg-border" />
                </div>

                {/* FAQ items */}
                <div className="space-y-3">
                  {cat.items.map((faq, fi) => (
                    <FaqItem key={fi} q={faq.q} a={faq.a} index={fi} />
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Still have questions CTA */}
        <ScrollReveal delay={0.4} direction="up">
          <div className="mt-20 max-w-3xl mx-auto rounded-[2rem] bg-muted/50 border border-border p-10 text-center">
            <h2 className="font-display text-2xl font-extrabold text-foreground">
              Still have a question?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Our team is available 24×7 — just call or message us and we'll answer right away.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href={site.phoneHref}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-brand px-8 text-sm font-bold text-brand-foreground transition-transform hover:scale-105 active:scale-95"
              >
                <Phone className="h-4 w-4" /> Call Now
              </a>
              <a
                href={site.whatsappHref}
                target="_blank"
                rel="noopener"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-background px-8 text-sm font-bold text-foreground transition-colors hover:bg-accent"
              >
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp Us
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <CTASection />
      <div className="h-16" />
    </>
  );
}
