import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { img } from "../assets";
import { DISCIPLINES, projects, videoCount, type Discipline, type Project } from "../data/projects";
import { cn } from "../lib/cn";
import { useDocumentMeta } from "../lib/hooks";

type Filter = "All" | Discipline;

export default function Works() {
  useDocumentMeta(
    "All work — Rajan Tarakhala",
    "Brands and projects Rajan Tarakhala has worked with: F1H2O, SCTDA, Visit Sharjah, Shurooq, Sharjah Summer Promotions, Week of Stars and Continental."
  );

  const [filter, setFilter] = useState<Filter>("All");
  const [hover, setHover] = useState<Project | null>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 28, mass: 0.5 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 28, mass: 0.5 });

  const list = filter === "All" ? projects : projects.filter((p) => p.disciplines.includes(filter));
  const count = (f: Filter) => (f === "All" ? projects.length : projects.filter((p) => p.disciplines.includes(f)).length);

  return (
    <div className="container-page pb-32 pt-[calc(var(--nav-h)+56px)]">
      <h1 className="font-display text-[clamp(3rem,9vw,7.5rem)] leading-[0.94] tracking-[-0.045em]">All work</h1>
      <p className="mt-7 max-w-[46ch] text-[1.2rem] leading-relaxed text-muted">
        Brands and projects I have worked with.
      </p>

      <div className="mt-14 flex flex-wrap gap-2.5" role="group" aria-label="Filter by discipline">
        {(["All", ...DISCIPLINES] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[14px] font-medium transition-colors",
              filter === f ? "border-lav bg-lav text-bg" : "border-lav/20 text-muted hover:border-lav/50 hover:text-ink"
            )}
          >
            {f}
            <span className={cn("text-[12px] tabular-nums", filter === f ? "text-bg/70" : "text-faint")}>{count(f)}</span>
          </button>
        ))}
      </div>

      <ul
        className="group/list mt-10 border-t border-lav/12"
        onMouseMove={(e) => { x.set(e.clientX); y.set(e.clientY); }}
        onMouseLeave={() => setHover(null)}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {list.map((p) => {
            const cover = img(p.cover.key);
            const n = videoCount(p);
            return (
              <motion.li
                key={p.slug}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHover(p)}
                className="border-b border-lav/12 transition-opacity duration-300 group-hover/list:opacity-35 hover:!opacity-100"
              >
                <Link
                  to={`/work/${p.slug}`}
                  className="group grid grid-cols-[64px_1fr_auto] items-center gap-x-5 gap-y-2 py-7 md:grid-cols-[minmax(0,1fr)_260px_130px_44px] md:gap-x-8 md:py-9"
                >
                  <img
                    src={cover.src}
                    alt=""
                    width={cover.width}
                    height={cover.height}
                    loading="lazy"
                    style={{ objectPosition: p.cover.position }}
                    className="h-20 w-16 rounded-xl object-cover md:hidden"
                  />
                  <div>
                    <h2 className="font-display text-[clamp(1.5rem,3.6vw,3.1rem)] leading-[1.05] transition-all duration-500 ease-out md:group-hover:translate-x-3 md:group-hover:text-lav">
                      {p.name}
                    </h2>
                    <p className="mt-2 hidden max-w-[52ch] text-[14.5px] text-muted sm:block md:group-hover:translate-x-3 md:transition-transform md:duration-500">
                      {p.subtitle}
                    </p>
                  </div>
                  <div className="hidden flex-wrap gap-1.5 md:flex">
                    {p.disciplines.map((d) => (
                      <span key={d} className="rounded-full border border-lav/15 px-2.5 py-1 text-[12px] text-faint">{d}</span>
                    ))}
                  </div>
                  <div className="text-right text-[14px] text-muted md:text-left">
                    {p.years && <div className="font-medium text-ink">{p.years}</div>}
                    {n > 0 && <div className="text-faint">{n} videos</div>}
                  </div>
                  <span className="hidden h-11 w-11 place-items-center rounded-full border border-lav/20 transition-all duration-500 ease-back group-hover:rotate-45 group-hover:border-lav group-hover:bg-lav group-hover:text-bg md:grid">
                    <ArrowUpRight size={19} />
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      {/* cursor-following preview (desktop hover only) */}
      <motion.div aria-hidden style={{ x, y }} className="pointer-events-none fixed left-0 top-0 z-40 hidden lg:block">
        <AnimatePresence>
          {hover && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: -2 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="ml-10 -mt-[150px] h-[300px] w-[240px] overflow-hidden rounded-2xl border border-lav/30 shadow-[0_40px_90px_-20px_rgba(0,0,0,.9)]"
            >
              <img
                key={hover.slug}
                src={img(hover.cover.key).src}
                alt=""
                style={{ objectPosition: hover.cover.position }}
                className="h-full w-full object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {list.length === 0 && <p className="py-20 text-center text-muted">No projects match this filter.</p>}
    </div>
  );
}
