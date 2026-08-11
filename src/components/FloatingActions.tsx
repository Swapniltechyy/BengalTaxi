import { useEffect, useState } from "react";
import { Phone, ArrowUp } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { site } from "@/lib/site";
import { useRouter } from "@tanstack/react-router";

export function FloatingActions() {
  const [isVisible, setIsVisible] = useState(false);
  const [showMobileContact, setShowMobileContact] = useState(false);
  
  const router = useRouter();
  const isHome = router.state.location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      // 1. Back to top logic (applies globally on scroll > 300)
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // 2. Mobile Contact Buttons Logic
      if (isHome) {
        const routesEl = document.getElementById("routes-grid");
        const ctaEl = document.getElementById("cta-section");
        
        if (routesEl && ctaEl) {
          const routesBottom = routesEl.getBoundingClientRect().bottom;
          const ctaTop = ctaEl.getBoundingClientRect().top;
          
          // Show when user scrolls past the routes grid (routesBottom <= window.innerHeight)
          // Hide when CTA section enters viewport (ctaTop < window.innerHeight)
          if (routesBottom <= window.innerHeight && ctaTop >= window.innerHeight) {
             setShowMobileContact(true);
          } else {
             setShowMobileContact(false);
          }
        } else {
          setShowMobileContact(false);
        }
      } else {
        setShowMobileContact(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-center gap-3">
      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        aria-label="Back to Top"
        className={`grid h-12 w-12 place-items-center rounded-full bg-[#111111] text-white hover:bg-brand hover:text-black dark:bg-brand dark:text-black dark:hover:bg-white dark:hover:text-black shadow-lg shadow-black/20 hover:scale-105 transition-all duration-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      {/* Existing WhatsApp Button */}
      <a
        href={site.whatsappHref}
        target="_blank"
        rel="noopener"
        aria-label="WhatsApp Booking"
        className={`h-12 w-12 place-items-center rounded-full bg-whatsapp text-white shadow-lg shadow-black/20 hover:scale-105 transition-transform md:grid ${
          showMobileContact ? "grid" : "hidden"
        }`}
      >
        <WhatsAppIcon className="h-5 w-5" />
      </a>
      
      {/* Existing Phone Button */}
      <a
        href={site.phoneHref}
        aria-label="Call Bengal Taxi"
        className={`h-12 w-12 place-items-center rounded-full bg-brand text-brand-foreground shadow-lg shadow-black/20 hover:scale-105 transition-transform md:grid ${
          showMobileContact ? "grid" : "hidden"
        }`}
      >
        <Phone className="h-5 w-5" />
      </a>
    </div>
  );
}
