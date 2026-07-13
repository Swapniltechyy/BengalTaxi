import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Mail, MapPin, Send, Clock } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/site";
import { ScrollReveal } from "@/components/ScrollReveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Bengal Taxi — Call, WhatsApp or Email" },
      { name: "description", content: "Get in touch with Bengal Taxi in Siliguri for cab bookings, airport transfers and North Bengal tours. Call, WhatsApp or send a message." },
      { property: "og:title", content: "Contact Bengal Taxi" },
      { property: "og:description", content: "Reach us by phone, WhatsApp, email or our contact form." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", from: "", to: "", date: "", pax: "", message: "" });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi Bengal Taxi, I'd like to book a cab.%0A%0AName: ${form.name}%0APhone: ${form.phone}%0AFrom: ${form.from}%0ATo: ${form.to}%0ADate: ${form.date}%0APax: ${form.pax}%0ADetails: ${form.message}`;
    window.open(`https://wa.me/919933367890?text=${text}`, "_blank");
    setSent(true);
  };

  return (
    <>
      <PageHero
        title={
          <>
            Talk to Us<br />
            We'll Get a Cab<br />
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

          {/* Form */}
          <ScrollReveal delay={0.2} direction="left" className="order-1 lg:order-2">
            <form onSubmit={onSubmit} className="rounded-[2rem] border border-border bg-card p-8 md:p-12">
              <h2 className="font-display text-3xl font-extrabold text-foreground">Send a Booking Request</h2>
              <p className="mt-2 text-muted-foreground">Fill out the form and we'll continue the conversation on WhatsApp.</p>
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
              <button type="submit" className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-8 py-4 font-bold text-brand-foreground transition-transform hover:scale-105 active:scale-95 sm:w-auto">
                <Send className="h-4 w-4" /> Send via WhatsApp
              </button>
              {sent && <p className="mt-4 text-sm text-muted-foreground">Opening WhatsApp… if nothing happens, call us at {site.phone}.</p>}
            </form>
          </ScrollReveal>
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
