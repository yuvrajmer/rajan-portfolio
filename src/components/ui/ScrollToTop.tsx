import { motion, useScroll } from "framer-motion";
import { ArrowUp } from "lucide-react";

const SIZE = 52;
const STROKE = 2.5;
const R = (SIZE - STROKE) / 2;

/**
 * Always-visible back-to-top button, bottom-right. Its border is the scroll
 * progress line (lavender → ember) drawn as a ring that fills as you scroll.
 */
export function ScrollToTop() {
  const { scrollYProgress } = useScroll();

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="group fixed bottom-5 right-5 z-[60] grid place-items-center rounded-full bg-surface/80 text-ink backdrop-blur transition-colors hover:bg-surface2 sm:bottom-7 sm:right-7"
      style={{ width: SIZE, height: SIZE }}
    >
      <svg aria-hidden width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 -rotate-90">
        <defs>
          <linearGradient id="scroll-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" style={{ stopColor: "rgb(var(--c-lav))" }} />
            <stop offset="100%" style={{ stopColor: "rgb(var(--c-ember))" }} />
          </linearGradient>
        </defs>
        <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" strokeWidth={STROKE} style={{ stroke: "rgb(var(--c-lav) / .2)" }} />
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          strokeWidth={STROKE}
          strokeLinecap="round"
          stroke="url(#scroll-ring)"
          style={{ pathLength: scrollYProgress }}
        />
      </svg>
      <ArrowUp size={18} className="relative transition-transform duration-300 ease-back group-hover:-translate-y-0.5" />
    </button>
  );
}