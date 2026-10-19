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

/** All videos visible at once in a tidy grid — no sliding. Cards share the first thumbnail's shape. */
export function VideoGrid({ label, items, onOpen }: { label?: string; items: Video[]; onOpen: (v: Video) => void }) {
  const ar = ratio(items[0].thumb);
  return (
    <figure className="mt-8">
      <Caption>{label}</Caption>
      <ul className={`grid gap-3 sm:gap-4 ${ar < 0.9 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-2 lg:grid-cols-3"}`}>
        {items.map((v) => {
          const a = img(v.thumb);
          return (
            <li key={v.url}>
              <button
                onClick={() => onOpen(v)}
                data-cursor="Play"
                aria-label={`Play ${v.title}`}
                style={{ aspectRatio: ar }}
                className="surface-dark group relative block w-full overflow-hidden rounded-2xl border border-lav/15 bg-surface text-left"
              >
                <img
                  src={a.src}
                  alt=""
                  width={a.width}
                  height={a.height}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-bg/55 via-bg/0 to-bg/5 opacity-50 transition-opacity duration-500 group-hover:opacity-80" />
                <span className="absolute left-1/2 top-1/2 grid h-[clamp(44px,22%,60px)] aspect-square -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-black/15 text-ink transition-all duration-500 ease-back group-hover:scale-110 group-hover:border-transparent group-hover:bg-lav group-hover:text-bg">
                  <Play size={20} fill="currentColor" className="ml-0.5" />
                </span>
                <span className="absolute inset-x-0 bottom-0 translate-y-2 p-3.5 text-[13px] font-semibold opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {v.title}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}

/**
 * Feature layout: one big player on the left, the rest as a playlist on the right.
 * Pick a row to swap the big player, click the big player to watch it full screen.
 */
export function VideoFeature({ label, items, onOpen }: { label?: string; items: Video[]; onOpen: (v: Video) => void }) {
  const [active, setActive] = useState(0);
  const cur = items[active];
  const a = img(cur.thumb);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <figure className="mt-8">
      <Caption>{label}</Caption>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
        {/* big player */}
        <button
          onClick={() => onOpen(cur)}
          data-cursor="Play"
          aria-label={`Play ${cur.title}`}
          className="surface-dark group relative block aspect-video w-full overflow-hidden rounded-2xl border border-lav/20 bg-surface text-left shadow-[0_30px_70px_-40px_rgb(var(--sh)/.6)]"
        >
          <img
            src={a.src}
            alt=""
            width={a.width}
            height={a.height}
            className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-bg/85 via-bg/10 to-bg/10" />
          <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-black/15 text-ink transition-all duration-500 ease-back group-hover:scale-110 group-hover:border-transparent group-hover:bg-lav group-hover:text-bg">
            <Play size={24} fill="currentColor" className="ml-0.5" />
          </span>
          <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-5">
            <span className="font-display text-[clamp(1.1rem,2vw,1.6rem)] leading-tight text-ink">{cur.title}</span>
            <span className="shrink-0 font-display text-[14px] tabular-nums text-ink/70">
              {pad(active + 1)} / {pad(items.length)}
            </span>
          </span>
        </button>

        {/* playlist */}
        <div className="relative">
          <ul className="flex flex-col gap-2 lg:absolute lg:inset-0 lg:overflow-y-auto">
            {items.map((v, i) => {
              const t = img(v.thumb);
              const on = i === active;
              return (
                <li key={v.url} className="lg:min-h-[64px] lg:flex-1">
                  <button
                    onClick={() => setActive(i)}
                    aria-pressed={on}
                    aria-label={`Show ${v.title}`}
                    className={`group/row flex h-full w-full items-center gap-3 rounded-xl border p-2 text-left transition-colors duration-300 ${
                      on ? "border-lav/50 bg-lav/10" : "border-lav/15 hover:border-lav/40 hover:bg-lav/5"
                    }`}
                  >
                    <span className="surface-dark relative aspect-video h-12 shrink-0 overflow-hidden rounded-lg bg-surface sm:h-14 lg:h-full lg:max-h-[72px]">
                      <img src={t.src} alt="" loading="lazy" className="h-full w-full object-cover" />
                      {on && (
                        <span className="absolute inset-0 grid place-items-center bg-bg/45">
                          <Play size={14} fill="currentColor" className="text-ink" />
                        </span>
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className={`block text-[11.5px] tabular-nums ${on ? "text-ember" : "text-faint"}`}>{pad(i + 1)}</span>
                      <span className={`block truncate text-[14px] font-medium ${on ? "text-ink" : "text-muted group-hover/row:text-ink"}`}>
                        {v.title}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </figure>
  );
}