import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { img } from "../../assets";
import type { Video } from "../../data/projects";
import { cn } from "../../lib/cn";

const pad = (n: number) => String(n).padStart(2, "0");
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Cinematic cover-flow slider for tall (9:16) videos.
 * The active video sits big in the centre, the others fan out in 3D on both sides.
 * Click the centre card to play, click a side card (or drag / swipe / use ← →) to bring it forward.
 * A blurred copy of the active frame glows behind the stage and crossfades as you move.
 */
export function CoverflowSlider({ label, items, onOpen }: { label?: string; items: Video[]; onOpen: (v: Video) => void }) {
  const n = items.length;
  const reduce = useReducedMotion();
  const [active, setActive] = useState(Math.floor(n / 2));
  const [dims, setDims] = useState({ w: 300, h: 533 });
  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, x: 0, moved: 0 });

  // Card size: as tall as the viewport comfortably allows, but never wider than ~60% of the stage.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const calc = () => {
      let h = Math.min(640, Math.max(420, window.innerHeight * 0.64));
      let w = (h * 9) / 16;
      const maxW = el.clientWidth * 0.6;
      if (w > maxW) {
        w = maxW;
        h = (w * 16) / 9;
      }
      setDims({ w: Math.round(w), h: Math.round(h) });
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    window.addEventListener("resize", calc);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", calc);
    };
  }, []);

  const go = useCallback((i: number) => setActive(((i % n) + n) % n), [n]);
  const next = useCallback(() => go(active + 1), [go, active]);
  const prev = useCallback(() => go(active - 1), [go, active]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(items[active]); }
  };

  // Shortest signed distance from the active card, so the row wraps around endlessly.
  const offsetOf = (i: number) => {
    let o = i - active;
    if (o > n / 2) o -= n;
    if (o < -n / 2) o += n;
    return o;
  };

  const current = items[active];
  const bg = img(current.thumb);

  return (
    <figure className="mt-8">
      {label && <figcaption className="mb-3.5 text-[14px] font-medium text-faint">{label}</figcaption>}

      <div className="surface-dark relative overflow-hidden rounded-[32px] border border-lav/20 bg-bg shadow-[0_50px_120px_-50px_rgb(var(--sh)/.9)]">
        {/* ambient glow from the active frame */}
        <AnimatePresence initial={false}>
          <motion.img
            key={current.thumb}
            src={bg.src}
            alt=""
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.9, ease: EASE }}
            className="pointer-events-none absolute inset-0 h-full w-full scale-150 object-cover blur-3xl"
          />
        </AnimatePresence>
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/70 via-bg/30 to-bg/90" />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--c-lav)/0.18),transparent)]" />

        {/* top bar: counter + arrows */}
        <div className="relative z-20 flex items-center justify-between px-5 pt-5 sm:px-8 sm:pt-7">
          <div className="flex items-baseline gap-2 font-display tabular-nums">
            <span className="text-[clamp(1.8rem,3vw,2.6rem)] leading-none">{pad(active + 1)}</span>
            <span className="text-sm text-faint">/ {pad(n)}</span>
          </div>
          <div className="flex gap-2">
            {([-1, 1] as const).map((d) => (
              <button
                key={d}
                onClick={() => (d === 1 ? next() : prev())}
                aria-label={d === 1 ? "Next video" : "Previous video"}
                className="grid h-11 w-11 place-items-center rounded-full border border-lav/25 bg-bg/40 text-ink backdrop-blur transition-all duration-300 ease-back hover:scale-110 hover:border-lav hover:bg-lav hover:text-bg"
              >
                {d === 1 ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              </button>
            ))}
          </div>
        </div>

        {/* stage */}
        <div
          ref={stageRef}
          tabIndex={0}
          role="group"
          aria-roledescription="carousel"
          aria-label={label ?? "Video showcase"}
          onKeyDown={onKey}
          data-cursor="Drag"
          onPointerDown={(e) => {
            drag.current = { down: true, x: e.clientX, moved: 0 };
          }}
          onPointerMove={(e) => {
            if (drag.current.down) drag.current.moved = e.clientX - drag.current.x;
          }}
          onPointerUp={() => {
            const d = drag.current;
            if (!d.down) return;
            d.down = false;
            if (d.moved < -50) next();
            else if (d.moved > 50) prev();
          }}
          onPointerLeave={() => (drag.current.down = false)}
          className="relative z-10 touch-pan-y select-none outline-none [perspective:1500px] focus-visible:ring-2 focus-visible:ring-lav/60"
          style={{ height: dims.h + 90 }}
        >
          {/* floor glow under the active card */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-5 left-1/2 h-10 -translate-x-1/2 rounded-full bg-lav/35 blur-2xl"
            style={{ width: dims.w * 0.9 }}
          />

          {items.map((v, i) => {
            const o = offsetOf(i);
            const abs = Math.abs(o);
            const isActive = o === 0;
            const a = img(v.thumb);
            return (
              <motion.button
                key={v.url}
                type="button"
                tabIndex={-1}
                aria-label={isActive ? `Play ${v.title}` : `Show ${v.title}`}
                aria-current={isActive}
                onClick={() => {
                  if (Math.abs(drag.current.moved) > 6) return; // that was a drag, not a click
                  isActive ? onOpen(v) : go(i);
                }}
                initial={false}
                animate={{
                  x: o * dims.w * 0.68,
                  scale: Math.max(0.5, 1 - abs * 0.17),
                  rotateY: Math.max(-55, Math.min(55, -o * 30)),
                  opacity: abs > 2 ? 0 : 1 - abs * 0.22,
                }}
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 170, damping: 24, mass: 0.9 }}
                style={{
                  zIndex: 20 - Math.round(abs * 5),
                  width: dims.w,
                  height: dims.h,
                  left: "50%",
                  top: 40,
                  marginLeft: -dims.w / 2,
                  transformStyle: "preserve-3d",
                }}
                className={cn(
                  "group absolute overflow-hidden rounded-[26px] border bg-surface text-left",
                  isActive
                    ? "cursor-pointer border-lav/60 shadow-[0_40px_90px_-20px_rgb(var(--c-lav)/0.55)]"
                    : "cursor-pointer border-lav/15 shadow-[0_30px_70px_-30px_rgb(0_0_0/.8)]",
                  abs > 2 && "pointer-events-none"
                )}
              >
                <img
                  src={a.src}
                  alt=""
                  width={a.width}
                  height={a.height}
                  draggable={false}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
                />
                {/* dim the cards that are not in focus */}
                <span
                  aria-hidden
                  className="absolute inset-0 bg-bg transition-opacity duration-500"
                  style={{ opacity: Math.min(0.6, abs * 0.3) }}
                />
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-bg/10" />

                {isActive && (
                  <>
                    <span className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center">
                      <span className="absolute inset-0 animate-ping rounded-full border border-white/50" />
                      <span className="grid h-full w-full place-items-center rounded-full border border-white/50 bg-black/25 text-ink backdrop-blur-sm transition-all duration-500 ease-back group-hover:scale-110 group-hover:border-transparent group-hover:bg-lav group-hover:text-bg">
                        <Play size={28} fill="currentColor" className="ml-1" />
                      </span>
                    </span>
                    <span className="absolute inset-x-0 bottom-0 p-5 text-[13px] font-semibold uppercase tracking-[0.16em] text-ink/90">
                      Tap to play
                    </span>
                  </>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* title + dots */}
        <div className="relative z-20 flex flex-col items-center gap-5 px-5 pb-7 sm:px-8 sm:pb-9">
          <div className="relative h-[3.2rem] w-full overflow-hidden text-center sm:h-[3.6rem]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.h4
                key={current.url}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
                className="font-display text-[clamp(1.35rem,2.6vw,2.1rem)] leading-tight"
              >
                {current.title}
              </motion.h4>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2" role="tablist" aria-label="Choose a video">
            {items.map((v, i) => (
              <button
                key={v.url}
                role="tab"
                aria-selected={i === active}
                aria-label={v.title}
                onClick={() => go(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-500 ease-back",
                  i === active ? "w-9 bg-ember" : "w-2 bg-lav/35 hover:bg-lav/70"
                )}
              />
            ))}
          </div>
          <p className="hidden text-[12.5px] text-faint sm:block">Drag, swipe or use ← → · click the centre video to play</p>
        </div>
      </div>
    </figure>
  );
}