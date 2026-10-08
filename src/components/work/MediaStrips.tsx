import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { img, ratio } from "../../assets";
import type { Still, Video } from "../../data/projects";

/** Size rules: portrait reels get a tall, readable height and slide sideways when they don't all fit. */
const stripStyle = (ars: number[], opts?: { min?: string; max?: string }): CSSProperties => {
  const n = ars.length;
  const avg = ars.reduce((a, b) => a + b, 0) / n;
  const portrait = avg < 0.9;
  const min = opts?.min ?? (n === 1 ? "0px" : portrait && n >= 3 ? "400px" : "260px");
  const max = opts?.max ?? (portrait && n >= 3 ? "520px" : n === 1 ? "460px" : "440px");
  return {
    "--n": n,
    "--sum": ars.reduce((a, b) => a + b, 0).toFixed(4),
    "--min": min,
    "--max": max,
  } as CSSProperties;
};

/** Scrollable strip with prev / next arrows that only appear when there is something to slide to. */
function StripSlider({ style, children }: { style: CSSProperties; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [can, setCan] = useState({ prev: false, next: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCan({ prev: el.scrollLeft > 4, next: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    Array.from(el.children).forEach((c) => ro.observe(c));
    el.addEventListener("scroll", update, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, [update]);

  const slide = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="strip-wrap">
        <div ref={ref} className="strip" style={style}>
          {children}
        </div>
      </div>
      {([-1, 1] as const).map((d) => {
        const show = d === 1 ? can.next : can.prev;
        return (
          <button
            key={d}
            type="button"
            onClick={() => slide(d)}
            aria-label={d === 1 ? "Slide right" : "Slide left"}
            tabIndex={show ? 0 : -1}
            className={`absolute top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-lav/30 bg-bg/70 text-ink shadow-lg backdrop-blur transition-all duration-300 ease-back hover:scale-110 hover:border-lav hover:bg-lav hover:text-bg ${
              d === 1 ? "right-2" : "left-2"
            } ${show ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            {d === 1 ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        );
      })}
    </div>
  );
}

function Caption({ children }: { children?: string }) {
  return children ? <figcaption className="mb-3.5 text-[14px] font-medium text-faint">{children}</figcaption> : null;
}

export function VideoStrip({ label, items, onOpen }: { label?: string; items: Video[]; onOpen: (v: Video) => void }) {
  const ars = items.map((v) => ratio(v.thumb));
  return (
    <figure className="mt-8">
      <Caption>{label}</Caption>
      <StripSlider style={stripStyle(ars)}>
          {items.map((v, i) => {
            const a = img(v.thumb);
            return (
              <button
                key={v.url}
                onClick={() => onOpen(v)}
                data-cursor="Play"
                aria-label={`Play ${v.title}`}
                style={{ aspectRatio: ars[i] }}
                className="surface-dark group relative overflow-hidden rounded-2xl border border-lav/15 bg-surface text-left"
              >
                <img
                  src={a.src}
                  alt=""
                  width={a.width}
                  height={a.height}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-bg/45 via-bg/0 to-bg/5 opacity-45 transition-opacity duration-500 group-hover:opacity-70" />
                <span className="absolute left-1/2 top-1/2 grid h-[clamp(44px,26%,64px)] aspect-square -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-black/15 text-ink transition-all duration-500 ease-back group-hover:scale-110 group-hover:border-transparent group-hover:bg-lav group-hover:text-bg">
                  <Play size={20} fill="currentColor" className="ml-0.5" />
                </span>
                <span className="absolute inset-x-0 bottom-0 translate-y-2 p-3.5 text-[13px] font-semibold opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {v.title}
                </span>
              </button>
            );
          })}
      </StripSlider>
    </figure>
  );
}

export function StillStrip({ label, items, onOpen }: { label: string; items: Still[]; onOpen: (i: number) => void }) {
  const ars = items.map((s) => ratio(s.key));
  return (
    <figure className="mt-8">
      <Caption>{label}</Caption>
      <StripSlider style={stripStyle(ars, { min: "200px", max: "340px" })}>
          {items.map((s, i) => {
            const a = img(s.key);
            return (
              <button
                key={s.key}
                onClick={() => onOpen(i)}
                data-cursor="Zoom"
                aria-label={`Enlarge: ${s.alt}`}
                style={{ aspectRatio: ars[i] }}
                className="group overflow-hidden rounded-xl border border-lav/15 bg-surface"
              >
                <img
                  src={a.src}
                  alt={s.alt}
                  width={a.width}
                  height={a.height}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                />
              </button>
            );
          })}
      </StripSlider>
    </figure>
  );
}