import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { site } from "@/lib/site";

export function FloatingActions() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      <a
        href={site.whatsappHref}
        target="_blank"
        rel="noopener"
        aria-label="WhatsApp Booking"
        className="grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-white shadow-lg shadow-black/20 hover:scale-105 transition-transform"
      >
        <WhatsAppIcon className="h-6 w-6" />
      </a>
      <a
        href={site.phoneHref}
        aria-label="Call Bengal Taxi"
        className="grid h-14 w-14 place-items-center rounded-full bg-brand text-brand-foreground shadow-lg shadow-black/20 hover:scale-105 transition-transform"
      >
        <Phone className="h-6 w-6" />
      </a>
    </div>
  );
}
