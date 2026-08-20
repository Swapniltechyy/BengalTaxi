import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { site } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { to: "/", label: "Home", hash: undefined },
  { to: "/", label: "Destinations", hash: "popular-routes" },
  { to: "/services", label: "Services", hash: undefined },
  { to: "/fleet", label: "Vehicle", hash: undefined },
  { to: "/about", label: "About", hash: undefined },
  { to: "/contact", label: "Contact", hash: undefined },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [destinationsInView, setDestinationsInView] = useState(false);

  // Track whether the #popular-routes section is visible on the homepage
  useEffect(() => {
    if (pathname !== "/") {
      setDestinationsInView(false);
      return;
    }

    let observer: IntersectionObserver | null = null;
    let retryTimer: ReturnType<typeof setTimeout>;

    const setup = () => {
      const el = document.getElementById("popular-routes");
      if (!el) {
        // Element not yet in DOM — retry after route component renders
        retryTimer = setTimeout(setup, 200);
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => setDestinationsInView(entry.isIntersecting),
        { threshold: 0.05, rootMargin: "-64px 0px 0px 0px" },
      );
      observer.observe(el);
    };

    setup();

    return () => {
      clearTimeout(retryTimer);
      observer?.disconnect();
    };
  }, [pathname]);

  const handleHashNav = useCallback(
    (hash: string) => {
      setOpen(false);
      // Immediately highlight Destinations so Home doesn't flash during scroll
      setDestinationsInView(true);
      if (window.location.pathname === "/") {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          return;
        }
      }
      navigate({ to: "/" }).then(() => {
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      });
    },
    [navigate],
  );

  const isActive = (l: (typeof links)[number]) => {
    // Destinations: active when on homepage and section is in view
    if (l.hash === "popular-routes") return pathname === "/" && destinationsInView;
    // Home: active when on homepage and destinations section is NOT in view
    if (l.to === "/" && !l.hash) return pathname === "/" && !destinationsInView;
    // Other pages: match by pathname
    return pathname === l.to;
  };

  const activeClass = "text-foreground bg-accent";
  const baseDesktop =
    "rounded-md px-3 py-2 text-sm font-medium text-foreground/75 hover:text-foreground hover:bg-accent transition-colors";
  const baseMobile = "rounded-md px-3 py-3 text-base font-medium hover:bg-accent";

  return (
    <header className="fixed top-0 left-0 w-full z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center"
          onClick={(e) => {
            setOpen(false);
            if (window.location.pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <span className="font-display text-xl font-extrabold tracking-tight relative z-0 inline-block leading-none pb-1">
            Bengal<span className="text-brand">Taxi</span>
            <svg className="absolute bottom-0 left-0 w-full -z-10" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="underline-fade-nav" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#FACC15" stopOpacity="1" /><stop offset="60%" stopColor="#FACC15" stopOpacity="0.6" /><stop offset="100%" stopColor="#FACC15" stopOpacity="0.1" /></linearGradient></defs><path d="M2 6 L298 6" stroke="url(#underline-fade-nav)" strokeWidth="5" strokeLinecap="round" style={{ strokeDasharray: "none" }}/></svg>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) =>
            l.hash ? (
              <button
                key={l.label}
                type="button"
                onClick={() => handleHashNav(l.hash)}
                className={`${baseDesktop} cursor-pointer ${isActive(l) ? activeClass : ""}`}
              >
                {l.label}
              </button>
            ) : (
              <Link
                key={l.label}
                to={l.to}
                onClick={() => {
                  if (l.to === "/" && pathname === "/") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className={`${baseDesktop} ${isActive(l) ? activeClass : ""}`}
              >
                {l.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href={site.phoneHref}
            className="hidden sm:inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink/90 transition-colors dark:bg-brand dark:text-brand-foreground dark:hover:brightness-95"
          >
            <Phone className="h-4 w-4" /> {site.phone}
          </a>
          <button
            className="md:hidden inline-grid h-9 w-9 place-items-center rounded-md border border-border bg-background transition-colors hover:bg-accent focus-visible:outline-none"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container-x py-2 flex flex-col">
            {links.map((l) =>
              l.hash ? (
                <button
                  key={l.label}
                  type="button"
                  onClick={() => handleHashNav(l.hash)}
                  className={`${baseMobile} text-left cursor-pointer ${isActive(l) ? "bg-accent" : ""}`}
                >
                  {l.label}
                </button>
              ) : (
                <Link
                  key={l.label}
                  to={l.to}
                  onClick={() => {
                    setOpen(false);
                    if (l.to === "/" && pathname === "/") {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className={`${baseMobile} ${isActive(l) ? "bg-accent" : ""}`}
                >
                  {l.label}
                </Link>
              ),
            )}
            <a
              href={site.phoneHref}
              className="mt-2 mb-3 inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-3 text-base font-semibold text-brand-foreground"
            >
              <Phone className="h-4 w-4" /> Call {site.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
