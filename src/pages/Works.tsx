// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
// import { ArrowUpRight } from "lucide-react";
// import { img } from "../assets";
// import {
//   campaignsOf,
//   clientDisciplines,
//   clients,
//   clientVideoCount,
//   DISCIPLINES,
//   type Discipline,
//   type Project,
// } from "../data/projects";
// import { cn } from "../lib/cn";
// import { useDocumentMeta } from "../lib/hooks";

// type Filter = "All" | Discipline;

// export default function Works() {
//   useDocumentMeta(
//     "All work — Rajan Tarakhala",
//     `Companies Rajan Tarakhala has worked with: ${clients.map((c) => c.name).join(", ")}.`
//   );

//   const [filter, setFilter] = useState<Filter>("All");
//   const [hover, setHover] = useState<Project | null>(null);
//   const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 28, mass: 0.5 });
//   const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 28, mass: 0.5 });

//   const list = filter === "All" ? clients : clients.filter((p) => clientDisciplines(p).includes(filter));
//   const count = (f: Filter) => (f === "All" ? clients.length : clients.filter((p) => clientDisciplines(p).includes(f)).length);

//   return (
//     <div className="container-page pb-32 pt-[calc(var(--nav-h)+56px)]">
//       <h1 className="font-display text-[clamp(3rem,9vw,7.5rem)] leading-[0.94] tracking-[-0.045em]">All work</h1>
//       <p className="mt-7 max-w-[46ch] text-[1.2rem] leading-relaxed text-muted">
//         The companies I have worked with.
//       </p>

//       <div className="mt-14 flex flex-wrap gap-2.5" role="group" aria-label="Filter by discipline">
//         {(["All", ...DISCIPLINES] as Filter[]).map((f) => (
//           <button
//             key={f}
//             onClick={() => setFilter(f)}
//             aria-pressed={filter === f}
//             className={cn(
//               "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[14px] font-medium transition-colors",
//               filter === f ? "border-lav bg-lav text-bg" : "border-lav/20 text-muted hover:border-lav/50 hover:text-ink"
//             )}
//           >
//             {f}
//             <span className={cn("text-[12px] tabular-nums", filter === f ? "text-bg/70" : "text-faint")}>{count(f)}</span>
//           </button>
//         ))}
//       </div>

//       <ul
//         className="group/list mt-10 border-t border-lav/12"
//         onMouseMove={(e) => { x.set(e.clientX); y.set(e.clientY); }}
//         onMouseLeave={() => setHover(null)}
//       >
//         <AnimatePresence initial={false} mode="popLayout">
//           {list.map((p) => {
//             const cover = img(p.cover.key);
//             const n = clientVideoCount(p);
//             const campaigns = campaignsOf(p).length;
//             return (
//               <motion.li
//                 key={p.slug}
//                 layout
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
//                 onMouseEnter={() => setHover(p)}
//                 className="border-b border-lav/12 transition-opacity duration-300 group-hover/list:opacity-35 hover:!opacity-100"
//               >
//                 <Link
//                   to={`/work/${p.slug}`}
//                   className="group grid grid-cols-[64px_1fr_auto] items-center gap-x-5 gap-y-2 py-7 md:grid-cols-[minmax(0,1fr)_260px_130px_44px] md:gap-x-8 md:py-9"
//                 >
//                   <img
//                     src={cover.src}
//                     alt=""
//                     width={cover.width}
//                     height={cover.height}
//                     loading="lazy"
//                     style={{ objectPosition: p.cover.position }}
//                     className="h-20 w-16 rounded-xl object-cover md:hidden"
//                   />
//                   <div>
//                     <h2 className="font-display text-[clamp(1.5rem,3.6vw,3.1rem)] leading-[1.05] transition-all duration-500 ease-out md:group-hover:translate-x-3 md:group-hover:text-lav">
//                       {p.name}
//                     </h2>
//                     <p className="mt-2 hidden max-w-[52ch] text-[14.5px] text-muted sm:block md:group-hover:translate-x-3 md:transition-transform md:duration-500">
//                       {p.subtitle}
//                     </p>
//                   </div>
//                   <div className="hidden flex-wrap gap-1.5 md:flex">
//                     {clientDisciplines(p).map((d) => (
//                       <span key={d} className="rounded-full border border-lav/15 px-2.5 py-1 text-[12px] text-faint">{d}</span>
//                     ))}
//                   </div>
//                   <div className="text-right text-[14px] text-muted md:text-left">
//                     {p.years && <div className="font-medium text-ink">{p.years}</div>}
//                     {campaigns > 0 && <div className="font-medium text-ink">{campaigns} campaigns</div>}
//                     {n > 0 && <div className="text-faint">{n} videos</div>}
//                   </div>
//                   <span className="hidden h-11 w-11 place-items-center rounded-full border border-lav/20 transition-all duration-500 ease-back group-hover:rotate-45 group-hover:border-lav group-hover:bg-lav group-hover:text-bg md:grid">
//                     <ArrowUpRight size={19} />
//                   </span>
//                 </Link>
//               </motion.li>
//             );
//           })}
//         </AnimatePresence>
//       </ul>

//       {/* cursor-following preview (desktop hover only) */}
//       <motion.div aria-hidden style={{ x, y }} className="pointer-events-none fixed left-0 top-0 z-40 hidden lg:block">
//         <AnimatePresence>
//           {hover && (
//             <motion.div
//               key="preview"
//               initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
//               animate={{ opacity: 1, scale: 1, rotate: -2 }}
//               exit={{ opacity: 0, scale: 0.9 }}
//               transition={{ type: "spring", stiffness: 300, damping: 26 }}
//               className="ml-10 -mt-[150px] h-[300px] w-[240px] overflow-hidden rounded-2xl border border-lav/30 shadow-[0_40px_90px_-20px_rgb(var(--sh)/.9)]"
//             >
//               <img
//                 key={hover.slug}
//                 src={img(hover.cover.key).src}
//                 alt=""
//                 style={{ objectPosition: hover.cover.position }}
//                 className="h-full w-full object-cover"
//               />
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>

//       {list.length === 0 && <p className="py-20 text-center text-muted">No companies match this filter.</p>}
//     </div>
//   );
// }















import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, ChevronDown } from "lucide-react";
import { img } from "../assets";
import {
  campaignsOf,
  clientDisciplines,
  clients,
  clientVideoCount,
  DISCIPLINES,
  type Discipline,
  type Project,
} from "../data/projects";
import { cn } from "../lib/cn";
import { useDocumentMeta } from "../lib/hooks";
import { LogoPlate } from "../components/ui/WorkCard";

type Filter = "All" | Discipline;

const EASE = [0.16, 1, 0.3, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

/** Number that counts up once when it scrolls into view. */
function Count({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!seen || reduce) return;
    const c = animate(0, to, { duration: 1.4, ease: EASE, onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [seen, to, reduce]);
  return <span ref={ref}>{v}</span>;
}

/** Discipline filter as a simple dropdown (closes on outside click / Esc / pick). */
function FilterMenu({
  value,
  options,
  count,
  onChange,
}: {
  value: Filter;
  options: Filter[];
  count: (f: Filter) => number;
  onChange: (f: Filter) => void;
}) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", down);
      document.removeEventListener("keydown", key);
    };
  }, [open]);

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Filter by discipline"
        className={cn(
          "inline-flex min-w-[250px] items-center justify-between gap-4 rounded-full border bg-surface/60 py-2.5 pl-5 pr-4 text-[14.5px] font-medium backdrop-blur transition-colors",
          open ? "border-lav" : "border-lav/25 hover:border-lav/60"
        )}
      >
        <span className="flex items-center gap-2.5">
          <span className="text-faint">Discipline</span>
          <span className="text-ink">{value}</span>
          <span className="rounded-full bg-lav/15 px-2 py-0.5 text-[12px] tabular-nums text-muted">{count(value)}</span>
        </span>
        <ChevronDown size={17} className={cn("shrink-0 text-muted transition-transform duration-300", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Discipline"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="absolute left-0 top-full z-30 mt-2 w-full min-w-[250px] overflow-hidden rounded-2xl border border-lav/25 bg-surface p-1.5 shadow-[0_30px_70px_-30px_rgb(var(--sh)/.7)]"
          >
            {options.map((f) => {
              const on = f === value;
              return (
                <li key={f} role="option" aria-selected={on}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(f);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-[14.5px] transition-colors",
                      on ? "bg-lav/15 font-medium text-ink" : "text-muted hover:bg-lav/10 hover:text-ink"
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <Check size={15} className={cn("text-lav", on ? "opacity-100" : "opacity-0")} />
                      {f}
                    </span>
                    <span className="text-[12.5px] tabular-nums text-faint">{count(f)}</span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Company card. At rest: cover image with the company name and its campaign / video counts.
 * On hover: the dark view fades in — dimmed cover, big logo, description, number and arrow.
 */
function GridCard({ project, index }: { project: Project; index: number }) {
  const cover = img(project.cover.key);
  const campaigns = campaignsOf(project).length;
  const videos = clientVideoCount(project);
  const meta = [campaigns > 0 && `${campaigns} campaigns`, videos > 0 && `${videos} videos`].filter(Boolean);
  return (
    <Link to={`/work/${project.slug}`} data-cursor="View" className="group block outline-none">
      <div className="surface-dark relative flex aspect-[4/5] flex-col overflow-hidden rounded-[28px] border border-lav/20 bg-bg shadow-[0_30px_70px_-40px_rgb(var(--sh)/.6)] transition-all duration-500 ease-out group-hover:-translate-y-1.5 group-hover:border-lav/60 group-focus-visible:-translate-y-1.5 group-focus-visible:border-lav/60">
        <img
          src={cover.src}
          alt=""
          width={cover.width}
          height={cover.height}
          loading="lazy"
          style={{ objectPosition: project.cover.position }}
          className="absolute inset-0 h-full w-full object-cover transition-all duration-[1400ms] ease-out group-hover:scale-110 group-hover:opacity-50 group-focus-visible:scale-110 group-focus-visible:opacity-50"
        />
        {/* resting gradient so the name stays readable */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-bg/85 via-bg/10 to-bg/20" />
        {/* hover: dark wash + glow */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-bg/60 via-bg/55 to-bg/95 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
        />
        <div
          aria-hidden
          className="absolute left-1/2 top-[42%] h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--c-lav)/0.28),transparent)] opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100"
        />

        {/* hover: number + arrow */}
        <div className="relative z-10 flex items-center justify-between p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="font-display text-[1.05rem] tabular-nums text-ink/70">{pad(index + 1)}</span>
          <span className="grid h-11 w-11 place-items-center rounded-full bg-lav text-bg transition-transform duration-500 ease-back group-hover:rotate-45">
            <ArrowUpRight size={19} />
          </span>
        </div>

        {/* hover: big logo */}
        <div className="relative z-10 grid flex-1 place-items-center px-6">
          <LogoPlate
            project={project}
            large
            className="scale-90 opacity-0 transition-all duration-700 ease-out group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100"
          />
        </div>

        {/* always: name + counts. hover: description slides in */}
        <div className="relative z-10 p-6 pt-2">
          <h3 className="font-display text-[clamp(1.4rem,2.1vw,1.85rem)] leading-[1.08] text-ink">{project.name}</h3>
          <div className="grid grid-rows-[0fr] transition-all duration-500 ease-out group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
            <p className="overflow-hidden text-[14px] leading-relaxed text-ink/65 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
              <span className="line-clamp-2 block pt-2">{project.subtitle}</span>
            </p>
          </div>
          {meta.length > 0 && (
            <p className="mt-3 text-[13px] text-ink/75 transition-colors duration-500 group-hover:border-t group-hover:border-ink/10 group-hover:pt-3.5 group-hover:text-[12.5px] group-hover:uppercase group-hover:tracking-[0.12em] group-hover:text-ink/55">
              {meta.join("  ·  ")}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function Works() {
  useDocumentMeta(
    "All work — Rajan Tarakhala",
    `Companies Rajan Tarakhala has worked with: ${clients.map((c) => c.name).join(", ")}.`
  );

  const [filter, setFilter] = useState<Filter>("All");
  const list = filter === "All" ? clients : clients.filter((p) => clientDisciplines(p).includes(filter));
  const count = (f: Filter) => (f === "All" ? clients.length : clients.filter((p) => clientDisciplines(p).includes(f)).length);
  const totalVideos = clients.reduce((n, p) => n + clientVideoCount(p), 0);

  return (
    <div className="relative overflow-x-clip pb-32 pt-[calc(var(--nav-h)+56px)]">
      {/* ambient glow — token-driven, so it follows the theme */}
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-24 h-[620px] w-[620px] rounded-full bg-[radial-gradient(closest-side,rgb(var(--c-lav)/0.16),transparent)]" />
      <div aria-hidden className="pointer-events-none absolute -left-52 top-[52%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(closest-side,rgb(var(--c-ember)/0.09),transparent)]" />

      <div className="container-page relative">
        {/* Hero */}
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="inline-flex items-center gap-2.5 text-[13px] uppercase tracking-[0.18em] text-muted"
            >
              <span className="h-px w-8 bg-ember" /> Portfolio
            </motion.p>
            <h1 className="mt-5 overflow-hidden font-display text-[clamp(3.4rem,10vw,8.5rem)] leading-[0.94] tracking-[-0.045em]">
              <motion.span
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: EASE }}
                className="block"
              >
                All work
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
              className="mt-7 max-w-[44ch] text-[1.2rem] leading-relaxed text-muted"
            >
              The companies I have worked with — animation, CGI and motion, built frame by frame.
            </motion.p>
          </div>

          <motion.dl
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
            className="flex gap-10 lg:gap-12"
          >
            {[
              { label: "Companies", value: clients.length },
              { label: "Videos", value: totalVideos },
              { label: "Disciplines", value: DISCIPLINES.length },
            ].map((s) => (
              <div key={s.label}>
                <dd className="font-display text-[clamp(2.4rem,4.5vw,3.6rem)] leading-none tabular-nums">
                  <Count to={s.value} />
                </dd>
                <dt className="mt-2 text-[12px] uppercase tracking-[0.14em] text-faint">{s.label}</dt>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Filter */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
          <FilterMenu value={filter} options={["All", ...DISCIPLINES] as Filter[]} count={count} onChange={setFilter} />
          <p className="text-[14px] text-faint" aria-live="polite">
            Showing <span className="tabular-nums text-muted">{list.length}</span> of{" "}
            <span className="tabular-nums text-muted">{clients.length}</span> companies
          </p>
        </div>

        {/* Companies */}
        {list.length > 0 && (
          <section aria-label="Companies" className="mt-10">
            <ul className="grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence initial={false} mode="popLayout">
                {list.map((p, i) => (
                  <motion.li
                    key={p.slug}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, delay: (i % 3) * 0.06, ease: EASE }}
                  >
                    <GridCard project={p} index={i} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </section>
        )}

        {list.length === 0 && <p className="py-20 text-center text-muted">No companies match this filter.</p>}
      </div>
    </div>
  );
}