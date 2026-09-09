import { useId } from "react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const clipId = useId();

  const toggle = () => {
    if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(isDark ? "light" : "dark");
    } else {
      setTheme(theme === "light" ? "dark" : "light");
    }
  };

  return (
    <button
      onClick={toggle}
      type="button"
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer ${className}`}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform duration-200 active:scale-90"
        aria-hidden="true"
      >
        <defs>
          <clipPath id={clipId}>
            <path d="M 12 3 A 9 9 0 0 1 12 21 Z" />
          </clipPath>
        </defs>

        {/* Outer circular boundary */}
        <circle cx="12" cy="12" r="9" />

        {/* Center vertical dividing line */}
        <line x1="12" y1="3" x2="12" y2="21" />

        {/* Right-half diagonal hatch stripes (45° angle) */}
        <g clipPath={`url(#${clipId})`}>
          <line x1="-5" y1="24" x2="24" y2="-5" />
          <line x1="-1" y1="24" x2="24" y2="-1" />
          <line x1="3" y1="24" x2="24" y2="3" />
          <line x1="7" y1="24" x2="24" y2="7" />
          <line x1="11" y1="24" x2="24" y2="11" />
        </g>
      </svg>
    </button>
  );
}

