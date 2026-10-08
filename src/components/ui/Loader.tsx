import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { site } from "../../data/site";
import { usePageReady } from "../../lib/hooks";

/**
 * The loader mark — the same two overlapping circles as the favicon
 * (lavender = interface, ember = motion) drifting apart and back together.
 * Colours come from theme tokens, so it follows dark / light automatically.
 */
export function LoaderMark({ size = 56 }: { size?: number }) {
  const reduce = useReducedMotion();
  const r = size / 2;
  const travel = size * 0.22;
  const loop = { duration: 1.4, repeat: Infinity, ease: [0.16, 1, 0.3, 1] as const, repeatType: "mirror" as const };

  return (
    <div role="status" aria-live="polite" className="relative" style={{ width: size * 1.6, height: size }}>
      <span className="sr-only">Loading…</span>
      <motion.span
        aria-hidden
        className="absolute top-0 rounded-full bg-lav/50"
        style={{ width: size, height: size, left: r * 0.3 }}
        animate={reduce ? undefined : { x: [0, travel, 0] }}
        transition={loop}
      />
      <motion.span
        aria-hidden
        className="absolute top-0 rounded-full bg-ember"
        style={{ width: size, height: size, right: r * 0.3 }}
        animate={reduce ? undefined : { x: [0, -travel, 0] }}
        transition={loop}
      />
    </div>
  );
}

/** Full-screen splash shown on first visit until fonts + assets have loaded, then fades out. */
export function PageLoader() {
  const ready = usePageReady();

  // Freeze the page behind the splash so it can't be scrolled while loading
  useEffect(() => {
    if (ready) return;
    const el = document.documentElement;
    const prev = el.style.overflow;
    el.style.overflow = "hidden";
    return () => {
      el.style.overflow = prev;
    };
  }, [ready]);

  return (
    <AnimatePresence>
      {!ready && (
        <motion.div
          key="page-loader"
          className="fixed inset-0 z-[200] grid place-items-center bg-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-col items-center gap-6">
            <LoaderMark />
            <p className="font-display text-sm tracking-[0.2em] text-muted uppercase">{site.name}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Suspense fallback while a page chunk downloads. Waits `delay` ms first so
 * fast navigations never flash a loader.
 */
export function RouteLoader({ delay = 200 }: { delay?: number }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setShow(true), delay);
    return () => window.clearTimeout(t);
  }, [delay]);

  if (!show) return <div className="min-h-[60svh]" aria-hidden />;
  return (
    <div className="grid min-h-[60svh] place-items-center">
      <LoaderMark />
    </div>
  );
}