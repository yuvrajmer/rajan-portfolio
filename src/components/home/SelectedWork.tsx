import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useInView, useReducedMotion } from "framer-motion";
import { img } from "../../assets";
import {
  campaignsOf,
  clients,
  clientVideoCount,
  HOME_CLIENT_LIMIT,
  projects,
  videoCount,
  VISIT_SHARJAH_CAMPAIGNS,
} from "../../data/projects";
import { cn } from "../../lib/cn";
import { Reveal } from "../ui/Reveal";
import { LogoPlate } from "../ui/WorkCard";
import type { Project } from "../../data/projects";

/** Milliseconds each company stays in the spotlight before the slider moves on by itself. */
const INTERVAL = 6000;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Selected work — an expanding-panel slider.
 * One company is open (big, with its stats and a call to action); the others fold into slim
 * tabs beside it. Click a tab, use the arrows / ← → keys, swipe, or just let it play —
 * it advances on its own, and pauses when you hover it, scroll away, or press pause.
 * Which companies appear (and their order) lives in data/projects.ts → CLIENT_SLUGS.
 */
export function SelectedWork() {
  const campaignCount = VISIT_SHARJAH_CAMPAIGNS.length;
  const visitSharjahVideos = projects
    .filter((p) => (VISIT_SHARJAH_CAMPAIGNS as readonly string[]).includes(p.slug))
    .reduce((n, p) => n + videoCount(p), 0);

  const items = clients.slice(0, HOME_CLIENT_LIMIT);
  const n = items.length;

  const reduce = useReducedMotion();
  const sliderRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sliderRef, { amount: 0.3 });
  const [active, setActive] = useState(0);
  const [tick, setTick] = useState(0); // bumps on every change so the timer + progress bar restart
  const [playing, setPlaying] = useState(true);
  const [hover, setHover] = useState(false);
  const swipe = useRef<number | null>(null);

  const running = n > 1 && playing && inView && !hover && !reduce;

  const go = (i: number) => {
    setActive(((i % n) + n) % n);
    setTick((t) => t + 1);
  };

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => go(active + 1), INTERVAL);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, tick, active]);

  if (n === 0) return null;

  return (
    <section id="work" className="container-page py-24 lg:py-32">
      <style>{`@keyframes sw-progress { from { transform: scaleX(0) } to { transform: scaleX(1) } }`}</style>
      <Reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <h2 className="max-w-[16ch] text-balance font-display text-[clamp(2.4rem,5.6vw,4.6rem)]">Selected work</h2>
          <p className="mt-5 max-w-[58ch] text-lg text-muted">
            A long-running partnership with Visit Sharjah — spanning {campaignCount} campaigns and{" "}
            {visitSharjahVideos} videos and reels, from logo reveals and CGI to full social campaigns — alongside
            CGI and social work for Continental, launch videos and posts for ceramic brands, and a set of 3D
            character and animation assignments.
          </p>
        </div>
        <Link
          to="/works"
          className="group inline-flex shrink-0 items-center gap-2 self-start text-[15px] font-medium text-muted transition-colors hover:text-ink md:self-auto"
        >
          View all work
          <ArrowUpRight size={16} className="transition-transform duration-300 ease-back group-hover:translate-x-1 group-hover:-translate-y-0.5" />
        </Link>
      </Reveal>

      <div
        ref={sliderRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Selected work"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); go(active + 1); }
          if (e.key === "ArrowLeft") { e.preventDefault(); go(active - 1); }
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onPointerDown={(e) => { swipe.current = e.pointerType === "touch" ? e.clientX : null; }}
        onPointerUp={(e) => {
          if (swipe.current === null) return;
          const dx = e.clientX - swipe.current;
          swipe.current = null;
          if (dx < -50) go(active + 1);
          else if (dx > 50) go(active - 1);
        }}
        className="mt-12 outline-none focus-visible:ring-2 focus-visible:ring-lav/60"
      >
        {/* Panels: a row on desktop, a stack on mobile — the open one takes most of the space */}
        <ul className="flex h-[560px] flex-col gap-3 sm:h-[600px] lg:h-[clamp(380px,calc(100vh_-_380px),540px)] lg:flex-row">
          {items.map((p, i) => (
            <Panel key={p.slug} project={p} index={i} total={n} on={i === active} onSelect={() => go(i)} />
          ))}
        </ul>

        {/* Controls: story-style progress segments + arrows */}
        <div className="mt-6 flex items-center gap-4 sm:gap-6">
          <div className="flex flex-1 gap-2 sm:gap-3" role="tablist" aria-label="Choose a company">
            {items.map((p, i) => (
              <button
                key={p.slug}
                role="tab"
                aria-selected={i === active}
                onClick={() => go(i)}
                className="group min-w-0 flex-1 text-left"
              >
                <span className="relative block h-[3px] overflow-hidden rounded-full bg-lav/15">
                  {i < active && <span className="absolute inset-0 bg-lav/60" />}
                  {i === active && (
                    <span
                      key={tick}
                      className="absolute inset-0 origin-left bg-ember"
                      style={
                        reduce
                          ? undefined
                          : {
                              animation: `sw-progress ${INTERVAL}ms linear forwards`,
                              // pausing (hover / paused / off-screen) freezes the bar instead of resetting it
                              animationPlayState: running ? "running" : "paused",
                            }
                      }
                    />
                  )}
                </span>
                <span
                  className={cn(
                    "mt-2.5 hidden truncate text-[13px] font-medium transition-colors sm:block",
                    i === active ? "text-ink" : "text-faint group-hover:text-muted"
                  )}
                >
                  {p.shortName}
                </span>
              </button>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {!reduce && (
              <button
                onClick={() => setPlaying((v) => !v)}
                aria-label={playing ? "Pause autoplay" : "Resume autoplay"}
                className="grid h-11 w-11 place-items-center rounded-full border border-lav/20 text-ink transition-colors hover:border-lav/60 hover:bg-lav/10"
              >
                {playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
              </button>
            )}
            {([-1, 1] as const).map((d) => (
              <button
                key={d}
                onClick={() => go(active + d)}
                aria-label={d === 1 ? "Next company" : "Previous company"}
                className="grid h-11 w-11 place-items-center rounded-full border border-lav/20 text-ink transition-all duration-300 ease-back hover:scale-105 hover:border-lav hover:bg-lav hover:text-bg"
              >
                {d === 1 ? <ChevronRight size={19} /> : <ChevronLeft size={19} />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** One company panel. Closed = a slim tab with its name; open = full artwork, stats and a call to action. */
function Panel({
  project,
  index,
  total,
  on,
  onSelect,
}: {
  project: Project;
  index: number;
  total: number;
  on: boolean;
  onSelect: () => void;
}) {
  const cover = img(project.cover.key);
  const videos = clientVideoCount(project);
  const campaigns = campaignsOf(project).length;
  const facts = [
    videos > 0 && `${videos} videos`,
    campaigns > 0 && `${campaigns} campaigns`,
    project.years,
  ].filter(Boolean) as string[];

  return (
    <li
      className={cn(
        "surface-dark relative min-h-0 min-w-0 overflow-hidden rounded-[28px] border bg-surface",
        "transition-[flex-grow,border-color,box-shadow] duration-[800ms] [transition-timing-function:cubic-bezier(.16,1,.3,1)]",
        on
          ? "flex-[7] border-lav/40 shadow-[0_40px_90px_-40px_rgb(var(--c-lav)/0.55)]"
          : "flex-[1] border-lav/15"
      )}
    >
      <Link
        to={`/work/${project.slug}`}
        data-cursor={on ? "View" : "Open"}
        aria-current={on}
        aria-label={on ? `Open ${project.name}` : `Show ${project.name}`}
        // a closed panel only opens on click; the open one is the real link
        onClick={(e) => {
          if (!on) {
            e.preventDefault();
            onSelect();
          }
        }}
        className="group absolute inset-0 block outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-lav"
      >
        {/* artwork — slightly zoomed + dimmed while closed, eases to full when opened */}
        <img
          src={cover.src}
          alt=""
          width={cover.width}
          height={cover.height}
          loading="lazy"
          style={{ objectPosition: project.cover.position }}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out",
            on ? "scale-100 group-hover:scale-[1.04]" : "scale-125 group-hover:scale-[1.3]"
          )}
        />
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            on ? "bg-gradient-to-t from-bg/95 via-bg/30 to-bg/15" : "bg-bg/60 group-hover:bg-bg/40"
          )}
        />

        {/* ---------- closed state: slim tab ---------- */}
        <div
          className={cn(
            "absolute inset-0 transition-opacity",
            on ? "pointer-events-none opacity-0 duration-200" : "opacity-100 delay-300 duration-500"
          )}
        >
          {/* desktop: number on top, name running up the side */}
          <span className="absolute left-1/2 top-6 hidden -translate-x-1/2 font-display text-[15px] tabular-nums text-ink/70 lg:block">
            {pad(index + 1)}
          </span>
          <span className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 rotate-180 whitespace-nowrap font-display text-[1.25rem] tracking-wide text-ink [writing-mode:vertical-rl] lg:block">
            {project.shortName}
          </span>
          {/* mobile: a simple row */}
          <div className="absolute inset-0 flex items-center justify-between gap-4 px-5 lg:hidden">
            <span className="font-display text-[1.1rem] text-ink">{project.shortName}</span>
            <span className="font-display text-[14px] tabular-nums text-ink/70">{pad(index + 1)}</span>
          </div>
        </div>

        {/* ---------- open state: full details ---------- */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col justify-between p-5 transition-opacity sm:p-8",
            on ? "opacity-100 delay-[350ms] duration-500" : "pointer-events-none opacity-0 duration-150"
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <LogoPlate project={project} />
            <span className="font-display text-[1.05rem] tabular-nums text-ink/85">
              {pad(index + 1)}
              <span className="text-ink/45"> / {pad(total)}</span>
            </span>
          </div>

          <div className="w-full lg:w-[min(600px,100%)]">
            {facts.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {facts.map((f) => (
                  <span key={f} className="rounded-full border border-white/20 bg-bg/40 px-3 py-1 text-[12.5px] font-medium text-ink/90 backdrop-blur">
                    {f}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-end justify-between gap-5">
              <div className="min-w-0">
                <h3 className="font-display text-[clamp(1.7rem,3.4vw,3rem)] leading-[1.02] text-ink">{project.name}</h3>
                <p className="mt-3 max-w-[46ch] text-pretty text-[14.5px] leading-snug text-muted sm:text-[15px]">
                  {project.subtitle}
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2.5 rounded-full bg-lav py-1.5 pl-5 pr-1.5 text-[14px] font-semibold text-bg transition-transform duration-500 ease-back group-hover:scale-105">
                <span className="hidden sm:inline">View project</span>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-bg/90 text-lav transition-transform duration-500 ease-back group-hover:rotate-45">
                  <ArrowUpRight size={19} />
                </span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}