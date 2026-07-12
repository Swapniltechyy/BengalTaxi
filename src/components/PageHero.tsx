import type { ReactNode } from "react";
import taxiVector from "@/assets/bengal-taxi-car-logo.png";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-background">
      {/* Angled Yellow Background (Bottom-Right Triangle) */}
      <div 
        className="absolute inset-0 bg-brand opacity-20 md:opacity-100 pointer-events-none" 
        style={{ clipPath: "polygon(100% 25%, 100% 100%, 30% 100%)" }}
      />

      <div className="container-x relative grid gap-12 lg:grid-cols-2 lg:items-center">
        {/* Left Content */}
        <div className="max-w-xl py-20">
          {eyebrow && (
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-3xl font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-7xl">
            {title}
          </h1>
          
          {/* Small yellow divider line */}
          <div className="mt-6 h-1 w-16 bg-brand rounded-full"></div>
          
          {subtitle && (
            <p className="mt-6 text-lg text-muted-foreground md:text-xl leading-relaxed">
              {subtitle}
            </p>
          )}
          
          {children && <div className="mt-10">{children}</div>}
        </div>

        {/* Right Image */}
        <div className="relative hidden lg:block z-30">
           <img 
             src={taxiVector} 
             alt="Bengal Taxi" 
             className="relative z-30 w-[115%] max-w-none object-contain -translate-x-12 -translate-y-6 drop-shadow-2xl" 
           />
        </div>
      </div>
    </section>
  );
}
