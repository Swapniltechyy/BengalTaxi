import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { site } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { id: "home", label: "Home" },
  { id: "vehicle", label: "Vehicle" },
  { id: "destinations", label: "Destinations" },
  { id: "services", label: "Services" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const navigate = useNavigate();

  // Scroll listener to update active section in navigation
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      const sectionIds = ["home", "vehicle", "destinations", "services", "about", "contact"];
      
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = useCallback(
    (id: string) => {
      setOpen(false);
      setActiveSection(id);
      if (window.location.pathname === "/") {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", `#${id}`);
          return;
        }
      }
      navigate({ to: "/" }).then(() => {
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            window.history.pushState(null, "", `#${id}`);
          }
        }, 150);
      });
    },
    [navigate],
  );

  const activeClass = "text-foreground bg-accent";
  const baseDesktop =
    "rounded-md px-3 py-2 text-sm font-medium text-foreground/75 hover:text-foreground hover:bg-accent transition-colors cursor-pointer";
  const baseMobile = "rounded-md px-3 py-3 text-base font-medium hover:bg-accent text-left cursor-pointer";

  return (
    <header className="fixed top-0 left-0 w-full z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("home");
          }}
        >
          <span className="font-display text-xl font-extrabold tracking-tight relative z-0 inline-block leading-none pb-1">
            Bengal<span className="text-brand">Taxi</span>
            <svg
              className="absolute bottom-0 left-0 w-full -z-10"
              viewBox="0 0 300 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="underline-fade-nav" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FACC15" stopOpacity="1" />
                  <stop offset="60%" stopColor="#FACC15" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#FACC15" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <path
                d="M2 6 L298 6"
                stroke="url(#underline-fade-nav)"
                strokeWidth="5"
                strokeLinecap="round"
                style={{ strokeDasharray: "none" }}
              />
            </svg>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => handleNavClick(l.id)}
              className={`${baseDesktop} ${activeSection === l.id ? activeClass : ""}`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* Right action buttons */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href={site.phoneHref}
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-black/90 transition-colors dark:bg-white dark:text-black dark:hover:bg-white/90"
          >
            <Phone className="h-4 w-4" /> Book Now
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
            {links.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => handleNavClick(l.id)}
                className={`${baseMobile} ${activeSection === l.id ? "bg-accent" : ""}`}
              >
                {l.label}
              </button>
            ))}
            <a
              href={site.phoneHref}
              className="mt-2 mb-3 inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-3 text-base font-semibold text-brand-foreground"
            >
              <Phone className="h-4 w-4" /> Call Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
