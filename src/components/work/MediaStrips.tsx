import type { CSSProperties } from "react";
import { Play } from "lucide-react";
import { img, ratio } from "../../assets";
import type { Still, Video } from "../../data/projects";

const stripStyle = (ars: number[]): CSSProperties =>
  ({
    "--n": ars.length,
    "--sum": ars.reduce((a, b) => a + b, 0).toFixed(4),
    "--min": ars.length === 1 ? "0px" : "220px",
  }) as CSSProperties;

function Caption({ children }: { children?: string }) {
  return children ? <figcaption className="mb-3.5 text-[14px] font-medium text-faint">{children}</figcaption> : null;
}

export function VideoStrip({ label, items, onOpen }: { label?: string; items: Video[]; onOpen: (v: Video) => void }) {
  const ars = items.map((v) => ratio(v.thumb));
  return (
    <figure className="mt-8">
      <Caption>{label}</Caption>
      <div className="strip-wrap">
        <div className="strip" style={stripStyle(ars)}>
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
        </div>
      </div>
    </figure>
  );
}

export function StillStrip({ label, items, onOpen }: { label: string; items: Still[]; onOpen: (i: number) => void }) {
  const ars = items.map((s) => ratio(s.key));
  return (
    <figure className="mt-8">
      <Caption>{label}</Caption>
      <div className="strip-wrap">
        <div className="strip" style={{ ...stripStyle(ars), "--min": "170px", "--max": "260px" } as CSSProperties}>
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
        </div>
      </div>
    </figure>
  );
}