import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

export function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  className = "",
  suffix = "",
}: {
  from?: number;
  to: number;
  duration?: number;
  className?: string;
  suffix?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (inView) {
      animate(count, to, { duration, ease: "easeOut" });
    }
  }, [inView, count, to, duration]);

  return (
    <div ref={ref} className={`flex items-center ${className}`}>
      <motion.span>{rounded}</motion.span>
      {suffix && <span>{suffix}</span>}
    </div>
  );
}
