import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-background text-foreground">
      <div className="checker-stripe h-1 w-full opacity-50" />
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center">
            <span className="font-display text-2xl font-extrabold tracking-tight">
              Bengal<span className="text-brand">Taxi</span>
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            Trusted taxi service based in Siliguri — covering Darjeeling, Sikkim, Dooars and
            Bagdogra Airport with safe, on-time, affordable cabs.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Home</Link></li>
            <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
            <li><Link to="/fleet" className="hover:text-foreground">Vehicle</Link></li>
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <a href={site.phoneHref} className="hover:text-foreground">{site.phone}</a>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${site.email}`} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">{site.email}</a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <a href="https://www.google.com/maps/place/Baba+Lokenath+Communication/@26.7154538,88.4266311,17z/data=!3m1!4b1!4m6!3m5!1s0x39e4416d11743705:0x7114c027dc33aeca!8m2!3d26.715449!4d88.429206!16s%2Fg%2F1hdzfqnnp?hl=en-US" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">{site.address}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Bengal Taxi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
