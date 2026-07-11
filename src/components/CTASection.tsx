import { site } from "@/lib/site";
import { ScrollReveal } from "@/components/ScrollReveal";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export function CTASection() {
  return (
    <section className="container-x my-20">
      <ScrollReveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#FAFAFA] dark:bg-muted/30 px-6 py-20 text-center md:px-12 md:py-28 border border-border">
          {/* Soft yellow blurred gradients */}
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-brand/20 blur-[80px] pointer-events-none" />
          <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-brand/20 blur-[80px] pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="font-display text-4xl font-extrabold text-foreground md:text-5xl leading-tight">
              Need a Taxi? <br />
              Call <br />
              <span className="relative inline-block">
                Bengal<span className="text-brand">Taxi</span>
                {/* Tapered brush-stroke underline: thick head → thin tail, faded gradient */}
                <svg
                  className="absolute -bottom-1 left-0 w-full -z-10"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="underline-fade" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FACC15" stopOpacity="1" />
                      <stop offset="60%" stopColor="#FACC15" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#FACC15" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M2 6 L298 6"
                    stroke="url(#underline-fade)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    style={{ strokeDasharray: "none" }}
                  />
                </svg>
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-[15px] text-muted-foreground md:text-base leading-relaxed">
              Available 24×7 across North & Sikkim.<br /> One call and your clean, reliable cab is on its way.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={site.phoneHref}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-8 text-sm font-bold text-background transition-transform hover:scale-105 active:scale-95"
              >
                {site.phone}
              </a>
              <a
                href={site.whatsappHref}
                target="_blank"
                rel="noopener"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-background px-8 text-sm font-bold text-foreground transition-colors hover:bg-accent"
              >
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
