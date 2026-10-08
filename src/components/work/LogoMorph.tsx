import { useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";
import { Play } from "lucide-react";
import { img, type ImageKey } from "../../assets";
import { cn } from "../../lib/cn";

const LOGOS: { key: ImageKey; label: string }[] = [
  { key: "sctda/logo-1-sun", label: "Original Government of Sharjah sun" },
  { key: "sctda/logo-2-government", label: "Government of Sharjah logo" },
  { key: "logo/sctda", label: "SCTDA logo" },
];

/** Scrub through the three-logo transformation by hand. */
export function LogoMorph() {
  const [p, setP] = useState(0);
  const reduce = useReducedMotion();
  const anim = useRef<ReturnType<typeof animate>>();
  const arch = img("sctda/archway-reference");

  const stop = () => anim.current?.stop();
  const goTo = (to: number) => {
    stop();
    if (reduce) return setP(to);
    anim.current = animate(p, to, { duration: 0.9, ease: [0.16, 1, 0.3, 1], onUpdate: setP });
  };
  const play = () => {
    stop();
    setP(0);
    anim.current = animate(0, 2, { duration: 4.2, ease: "easeInOut", onUpdate: setP });
  };

  const nearest = Math.round(p);

  return (
    <div className="mt-8 grid items-stretch gap-4 sm:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
      {/* Archway reference — stretches to the exact height of the player card beside it,
          so the image and the video panel always line up top and bottom. */}
      <figure className="relative hidden min-h-[340px] overflow-hidden rounded-t-[999px] rounded-b-2xl border border-lav/15 bg-surface sm:block">
        <img
          src={arch.src}
          width={arch.width}
          height={arch.height}
          alt="Archway design reference used for the transition"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-4 pb-4 pt-12 text-[12.5px] leading-snug text-white/90">
          Archway design reference used for transition
        </figcaption>
      </figure>

      <div className="rounded-card border border-lav/15 bg-surface/60 p-4 sm:p-5">
        {/* light plate keeps dark-on-transparent logos legible */}
        <div className="surface-dark relative aspect-[16/9] overflow-hidden rounded-2xl bg-ink">
          {LOGOS.map((l, i) => {
            const a = img(l.key);
            const d = p - i;
            const o = Math.max(0, 1 - Math.abs(d) * 1.15);
            return (
              <img
                key={l.key}
                src={a.src}
                alt={o > 0.5 ? l.label : ""}
                width={a.width}
                height={a.height}
                draggable={false}
                style={{ opacity: o, transform: `scale(${1 + d * 0.12})`, filter: `blur(${Math.abs(d) * 9}px)` }}
                className="absolute inset-0 m-auto h-[68%] w-[68%] object-contain will-change-[opacity,transform,filter]"
              />
            );
          })}
        </div>

        <div className="mt-5 flex items-center gap-4">
          <button
            onClick={play}
            aria-label="Play the transformation"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-lav text-bg transition-transform duration-300 ease-back hover:scale-105"
          >
            <Play size={17} fill="currentColor" className="ml-0.5" />
          </button>
          <input
            type="range"
            min={0}
            max={2}
            step={0.005}
            value={p}
            onChange={(e) => { stop(); setP(parseFloat(e.target.value)); }}
            aria-label="Scrub the logo transformation"
            aria-valuetext={LOGOS[nearest].label}
            className="scrub"
            style={{ "--fill": `${(p / 2) * 100}%` } as React.CSSProperties}
          />
        </div>

        <div className="mt-2 grid grid-cols-3 gap-2">
          {LOGOS.map((l, i) => (
            <button
              key={l.key}
              onClick={() => goTo(i)}
              aria-pressed={nearest === i}
              className={cn(
                "rounded-xl border px-2 py-2.5 text-[12.5px] font-medium leading-snug transition-colors",
                nearest === i ? "border-lav bg-lav/15 text-ink" : "border-lav/15 text-faint hover:border-lav/40 hover:text-muted"
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}