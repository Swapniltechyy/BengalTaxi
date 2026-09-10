import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Phone, Mail, MapPin, Send, Clock, Loader2, CheckCircle2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/site";
import { ScrollReveal } from "@/components/ScrollReveal";
import { createBooking } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Bengal Taxi — Call, WhatsApp or Email" },
      { name: "description", content: "Get in touch with Bengal Taxi in Siliguri for cab bookings, airport transfers and North Bengal tours. Call, WhatsApp or send a message." },
      { property: "og:title", content: "Contact Bengal Taxi" },
      { property: "og:description", content: "Reach us by phone, WhatsApp, email or our contact form." },
      { property: "og:url", content: "https://bengaltaxi.com/contact" },
    ],
    links: [{ rel: "canonical", href: "https://bengaltaxi.com/contact" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://bengaltaxi.com/" },
            { "@type": "ListItem", position: 2, name: "Contact", item: "https://bengaltaxi.com/contact" },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Bengal Taxi",
          url: "https://bengaltaxi.com",
          telephone: "+91-99333-67890",
          email: "bengaltaxi@gmail.com",
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
          sameAs: ["https://wa.me/919933367890"],
        }),
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<{
    name: string;
    phone: string;
    from: string;
    to: string;
    date: string;
    pax: string;
  } | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", from: "", to: "", date: "", pax: "", message: "" });
  const confirmationRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to confirmation on mobile and desktop
  useEffect(() => {
    if (sent && confirmationRef.current) {
      setTimeout(() => {
        confirmationRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    }
  }, [sent]);

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
      pax: form.pax.trim(),
      details: form.message.trim(),
      status: "pending",
    };

    try {
      const { error } = await createBooking(bookingPayload);
      if (error) {
        toast.error(error.message || "Could not save booking to database. Please call us directly.");
      } else {
        toast.success("Booking request saved successfully!");
        setSubmittedBooking({
          name: bookingPayload.name,
          phone: bookingPayload.phone,
          from: bookingPayload.from_location,
          to: bookingPayload.to_location,
          date: bookingPayload.pickup_date,
          pax: bookingPayload.pax,
        });
        setSent(true);
      }
    } catch (err) {
      console.error("Booking submission error:", err);
      toast.error("Something went wrong. Please call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        title={
          <>
            Talk to Us<br />
            You'll Get a Cab<br />
            on the Road.
          </>
        }
        subtitle="Available 24×7 for bookings, quotes and travel advice across North Bengal."
      />

      <section className="container-x pt-4 pb-0 md:pt-24 md:pb-0">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          {/* Details */}
          <ScrollReveal className="order-2 lg:order-1">
            <div className="space-y-6">
              <a href={site.phoneHref} className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-foreground/20 hover:shadow-sm">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground dark:bg-brand/20 dark:group-hover:bg-brand"><Phone className="h-5 w-5" /></span>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Call Us</p>
                  <p className="mt-1 font-display text-base sm:text-xl font-bold text-foreground">{site.phone}</p>
                  <p className="mt-1 text-sm text-muted-foreground">24×7 for bookings & quotes</p>
                </div>
              </a>
              <a href={site.whatsappHref} target="_blank" rel="noopener" className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-foreground/20 hover:shadow-sm">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] transition-colors group-hover:bg-[#25D366] group-hover:text-white"><WhatsAppIcon className="h-5 w-5" /></span>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">WhatsApp</p>
                  <p className="mt-1 font-display text-base sm:text-xl font-bold text-foreground">{site.whatsapp}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Fastest way to share details</p>
                </div>
              </a>
              <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${site.email}`} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-foreground/20 hover:shadow-sm">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-foreground/5 text-foreground transition-colors group-hover:bg-foreground group-hover:text-background"><Mail className="h-5 w-5" /></span>
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
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-foreground/5 text-foreground transition-colors group-hover:bg-foreground group-hover:text-background"><MapPin className="h-5 w-5" /></span>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Central Office</p>
                  <p className="mt-1 font-display text-base sm:text-lg font-bold text-foreground leading-snug">{site.address}</p>
                  <p className="mt-2 text-sm text-muted-foreground flex items-center gap-1.5"><Clock className="h-4 w-4" /> Open 24 hours</p>
                </div>
              </a>
            </div>
          </ScrollReveal>

          {/* Form / Confirmation */}
          <div className="order-1 lg:order-2">
            {sent && submittedBooking ? (
              <div
                ref={confirmationRef}
                className="rounded-[2rem] border border-border bg-card p-6 sm:p-8 md:p-12 text-center shadow-xs scroll-mt-24"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="mt-5 font-display text-2xl sm:text-3xl font-extrabold text-foreground">
                  Booking Request Received!
                </h2>
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
                  Need instant confirmation? You can also call us directly at <a href={`tel:${site.phone}`} className="font-bold text-foreground underline">{site.phone}</a>.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setForm({ name: "", phone: "", from: "", to: "", date: "", pax: "", message: "" });
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

                <h2 className="font-display text-3xl font-extrabold text-foreground">Send a Booking Request</h2>
                <p className="mt-2 text-muted-foreground">Fill out the form and our team will get back to you shortly to confirm your booking.</p>
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your Name</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value.toUpperCase() })} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm uppercase placeholder:normal-case outline-none transition-colors focus:border-brand" placeholder="Full Name" />
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
                    <input required value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-brand" placeholder="e.g. Bagdogra Airport" />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">To</label>
                    <input required value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-brand" placeholder="e.g. Darjeeling" />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</label>
                    <input type="date" required min={new Date().toISOString().split('T')[0]} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={`mt-2 w-full min-h-[46px] rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-brand uppercase dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-50 ${!form.date ? 'text-muted-foreground' : 'text-foreground'}`} />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pax</label>
                    <input required type="tel" value={form.pax} onChange={(e) => setForm({ ...form, pax: e.target.value.replace(/\D/g, "") })} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-brand" placeholder="e.g. 4 Guests" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Trip Details</label>
                    <textarea maxLength={100} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-brand resize-none" placeholder="Dates, group size, car preference…" />
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
    </>
  );
}
