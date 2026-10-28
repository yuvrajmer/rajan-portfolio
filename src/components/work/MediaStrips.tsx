import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { img, ratio } from "../../assets";
import type { Still, Video } from "../../data/projects";

/**
 * Size rules: every card of the same shape is the same height on every page, however many videos
 * sit in the group — portrait reels 440px, square posts 400px, widescreen 340px. On narrow screens
 * the height shrinks just enough that one full card always fits; extra cards slide sideways.
 * (Stills pass their own min / max and keep their own sizing.)
 */
const stripStyle = (ars: number[], opts?: { min?: string; max?: string }): CSSProperties => {
  const n = ars.length;
  const sum = ars.reduce((a, b) => a + b, 0);
  const avg = sum / n;
  let min = opts?.min;
  let max = opts?.max;
  if (min === undefined && max === undefined) {
    const base = avg < 0.9 ? 440 : avg < 1.3 ? 400 : 340;
    min = max = `min(${base}px, calc(100cqw / ${Math.max(...ars).toFixed(4)}))`;
  }
  return {
    "--n": n,
    "--sum": sum.toFixed(4),
    "--min": min ?? "0px",
    "--max": max ?? "460px",
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

/** One video card: thumbnail with play button, then title + description underneath. Shared by the "cards" and "cardgrid" layouts. */
function VideoCard({ v, ar, onOpen }: { v: Video; ar: number; onOpen: (v: Video) => void }) {
  const a = img(v.thumb);
  return (
    <button onClick={() => onOpen(v)} data-cursor="Play" aria-label={`Play ${v.title}`} className="group block w-full text-left">
      <span
        style={{ aspectRatio: ar }}
        className="surface-dark relative block overflow-hidden rounded-card border border-lav/15 bg-surface"
      >
        <img
          src={a.src}
          alt=""
          width={a.width}
          height={a.height}
          loading="lazy"
          draggable={false}
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.07]"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-bg/55 via-transparent to-bg/10 opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
        <span className="absolute left-1/2 top-1/2 grid h-[clamp(48px,22%,64px)] aspect-square -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-black/15 text-ink transition-all duration-500 ease-back group-hover:scale-110 group-hover:border-transparent group-hover:bg-lav group-hover:text-bg">
          <Play size={20} fill="currentColor" className="ml-0.5" />
        </span>
        <span className="absolute inset-0 rounded-card ring-1 ring-inset ring-ink/[0.06] transition-shadow duration-500 group-hover:ring-lav/50" />
      </span>
      <span className="mt-3.5 block">
        <span className="block font-display text-[clamp(1.15rem,1.7vw,1.4rem)] leading-tight transition-colors group-hover:text-lav">
          {v.title}
        </span>
        {v.desc && <span className="mt-1 block max-w-[38ch] text-[14.5px] leading-relaxed text-muted">{v.desc}</span>}
      </span>
    </button>
  );
}

/**
 * Cards layout: every video is a card with its title and description underneath — the same look
 * as the cards in "Projects I have worked on". Slide with the arrows, swipe, or drag with the mouse.
 * The description comes from the video's `desc` field in data/projects.ts.
 */
export function VideoCards({ label, items, onOpen }: { label?: string; items: Video[]; onOpen: (v: Video) => void }) {
  const ref = useRef<HTMLUListElement>(null);
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });
  const restore = useRef<number | undefined>(undefined);
  const [can, setCan] = useState({ prev: false, next: false });
  const ar = ratio(items[0].thumb);
  const wide = ar >= 0.9;

  /** One card + one gap = the distance between two snap points. */
  const metrics = () => {
    const el = ref.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return null;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const step = first.offsetWidth + gap;
    return { el, step, max: el.scrollWidth - el.clientWidth, perView: Math.max(1, Math.floor((el.clientWidth + gap) / step)) };
  };

  /** Smoothly land exactly on card number `i` (clamped to the first / last position). */
  const toIndex = (i: number) => {
    const m = metrics();
    if (!m) return;
    m.el.scrollTo({ left: Math.min(m.max, Math.max(0, i * m.step)), behavior: "smooth" });
  };

  useEffect(() => () => window.clearTimeout(restore.current), []);

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
    el.addEventListener("scroll", update, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, [update]);

  const by = (dir: 1 | -1) => {
    const m = metrics();
    if (m) toIndex(Math.round(m.el.scrollLeft / m.step) + dir * m.perView);
  };

  /** Mouse drag finished: glide to the right card instead of stopping half-way between two. */
  const endDrag = () => {
    const d = drag.current;
    const m = metrics();
    if (!d.down || !m) return;
    d.down = false;
    const dx = m.el.scrollLeft - d.left; // negative = dragged back
    const start = Math.round(d.left / m.step);
    const target = dx > 40 ? start + 1 : dx < -40 ? start - 1 : Math.round(m.el.scrollLeft / m.step);
    toIndex(target);
    window.clearTimeout(restore.current);
    restore.current = window.setTimeout(() => {
      m.el.style.scrollSnapType = "";
    }, 600);
  };

  return (
    <figure className="mt-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <figcaption className="text-[14px] font-medium text-faint">{label}</figcaption>
        {(can.prev || can.next) && (
          <div className="flex gap-2">
            {([-1, 1] as const).map((d) => {
              const on = d === 1 ? can.next : can.prev;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => by(d)}
                  disabled={!on}
                  aria-label={d === 1 ? "Next videos" : "Previous videos"}
                  className="grid h-11 w-11 place-items-center rounded-full border border-lav/20 text-ink transition-colors hover:border-lav/60 hover:bg-lav/10 disabled:pointer-events-none disabled:opacity-35"
                >
                  {d === 1 ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <ul
        ref={ref}
        data-cursor="Drag"
        className="no-scrollbar flex cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain pb-2 [-webkit-overflow-scrolling:touch] active:cursor-grabbing"
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || e.button !== 0) return;
          const el = ref.current!;
          window.clearTimeout(restore.current);
          el.style.scrollSnapType = "none"; // snapping fights the drag, so pause it until release
          drag.current = { down: true, x: e.clientX, left: el.scrollLeft, moved: false };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d.down) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > 4) d.moved = true;
          ref.current!.scrollLeft = d.left - dx;
        }}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            drag.current.moved = false;
          }
        }}
      >
        {items.map((v) => {
          return (
            <li key={v.url} className={`shrink-0 snap-start ${wide ? "w-[86vw] sm:w-[440px]" : "w-[62vw] sm:w-[238px]"}`}>
              <VideoCard v={v} ar={ar} onOpen={onOpen} />
            </li>
          );
        })}
      </ul>
    </figure>
  );
}

/**
 * Card grid layout: the same video cards as "cards", but laid out 2 per row (1 on phones) with no sliding; pass cols={3} for 3 per row on desktop.
 * Use it when a group has several videos of one shape (all widescreen, or all square).
 */
export function VideoCardGrid({ label, items, cols = 2, onOpen }: { label?: string; items: Video[]; cols?: 2 | 3; onOpen: (v: Video) => void }) {
  const ar = ratio(items[0].thumb);
  return (
    <figure className="mt-8">
      <Caption>{label}</Caption>
      <ul className={`grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 ${cols === 3 ? "lg:grid-cols-3" : ""}`}>
        {items.map((v) => (
          <li key={v.url}>
            <VideoCard v={v} ar={ar} onOpen={onOpen} />
          </li>
        ))}
      </ul>
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
/**
 * Carousel layout: 16:9 cards, 3 per slide on desktop (2 on tablet, 1 on phones).
 * Arrows + dots move one slide at a time; swiping / trackpad scrolling works too.
 */
export function VideoCarousel({ label, items, onOpen }: { label?: string; items: Video[]; onOpen: (v: Video) => void }) {
  const ref = useRef<HTMLUListElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const pad = (n: number) => String(n).padStart(2, "0");

  const update = useCallback(() => {
    const el = ref.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const perView = Math.max(1, Math.round((el.clientWidth + gap) / (first.offsetWidth + gap)));
    const count = Math.max(1, Math.ceil(items.length / perView));
    const max = el.scrollWidth - el.clientWidth;
    setPages(count);
    setPage(max > 4 ? Math.round((el.scrollLeft / max) * (count - 1)) : 0);
  }, [items.length]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    el.addEventListener("scroll", update, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, [update]);

  const goTo = (p: number) => {
    const el = ref.current;
    if (!el || pages < 2) return;
    const i = Math.min(pages - 1, Math.max(0, p));
    el.scrollTo({ left: (i / (pages - 1)) * (el.scrollWidth - el.clientWidth), behavior: "smooth" });
  };

  return (
    <figure className="mt-8">
      <Caption>{label}</Caption>
      <div className="relative">
        <ul
          ref={ref}
          className="flex snap-x snap-proximity gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((v, i) => {
            const a = img(v.thumb);
            return (
              <li key={v.url} className="w-[86%] shrink-0 snap-start sm:w-[calc((100%_-_16px)/2)] lg:w-[calc((100%_-_32px)/3)]">
                <button
                  onClick={() => onOpen(v)}
                  data-cursor="Play"
                  aria-label={`Play ${v.title}`}
                  className="surface-dark group relative block aspect-video w-full overflow-hidden rounded-2xl border border-lav/15 bg-surface text-left transition-colors duration-500 hover:border-lav/50"
                >
                  <img
                    src={a.src}
                    alt=""
                    width={a.width}
                    height={a.height}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-bg/85 via-bg/5 to-bg/10" />
                  <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-black/15 text-ink transition-all duration-500 ease-back group-hover:scale-110 group-hover:border-transparent group-hover:bg-lav group-hover:text-bg">
                    <Play size={20} fill="currentColor" className="ml-0.5" />
                  </span>
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                    <span className="text-[14.5px] font-semibold leading-snug text-ink">{v.title}</span>
                    <span className="shrink-0 font-display text-[13px] tabular-nums text-ink/70">{pad(i + 1)}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {([-1, 1] as const).map((d) => {
          const show = d === 1 ? page < pages - 1 : page > 0;
          return (
            <button
              key={d}
              type="button"
              onClick={() => goTo(page + d)}
              aria-label={d === 1 ? "Next slide" : "Previous slide"}
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

      {pages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2" role="tablist" aria-label="Slides">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === page}
              aria-label={`Slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-[6px] rounded-full transition-all duration-500 ${i === page ? "w-8 bg-ember" : "w-[6px] bg-lav/30 hover:bg-lav/60"}`}
            />
          ))}
        </div>
      )}
    </figure>
  );
}

/** Column layout: every video as a full-width 16:9 player, stacked one under another — no sliding. */
export function VideoColumn({ label, items, onOpen }: { label?: string; items: Video[]; onOpen: (v: Video) => void }) {
  return (
    <figure className="mt-8">
      <Caption>{label}</Caption>
      <ul className="flex max-w-[820px] flex-col gap-8">
        {items.map((v) => {
          const a = img(v.thumb);
          return (
            <li key={v.url}>
              <button onClick={() => onOpen(v)} data-cursor="Play" aria-label={`Play ${v.title}`} className="group block w-full text-left">
                <span
                  style={{ aspectRatio: ratio(v.thumb) }}
                  className="surface-dark relative block overflow-hidden rounded-card border border-lav/15 bg-surface"
                >
                  <img
                    src={a.src}
                    alt=""
                    width={a.width}
                    height={a.height}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-bg/55 via-transparent to-bg/10 opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
                  <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-black/15 text-ink transition-all duration-500 ease-back group-hover:scale-110 group-hover:border-transparent group-hover:bg-lav group-hover:text-bg">
                    <Play size={24} fill="currentColor" className="ml-0.5" />
                  </span>
                  <span className="absolute inset-0 rounded-card ring-1 ring-inset ring-ink/[0.06] transition-shadow duration-500 group-hover:ring-lav/50" />
                </span>
                <span className="mt-3.5 block font-display text-[clamp(1.15rem,1.7vw,1.4rem)] leading-tight transition-colors group-hover:text-lav">
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