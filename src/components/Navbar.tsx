import { Link } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { site } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/fleet", label: "Vehicle" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center" onClick={() => setOpen(false)}>
          <span className="font-display text-xl font-extrabold tracking-tight">
            Bengal<span className="text-brand">Taxi</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/75 hover:text-foreground hover:bg-accent transition-colors"
              activeProps={{ className: "text-foreground bg-accent" }}
            >
              {l.label}
            </Link>
          ))}
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
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container-x py-2 flex flex-col">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium hover:bg-accent"
                activeProps={{ className: "bg-accent" }}
              >
                {l.label}
              </Link>
            ))}
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
