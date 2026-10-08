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
import { AnimatePresence, animate, motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, LayoutGrid, Rows3 } from "lucide-react";
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
import { Reveal } from "../components/ui/Reveal";

type Filter = "All" | Discipline;
type View = "showcase" | "grid";

/** Showcase view: this many companies get the big panels, the rest drop into a compact grid. */
const FEATURED_COUNT = 3;
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

/** Cover that drifts slightly against the scroll — depth without weight. */
function ParallaxCover({ project }: { project: Project }) {
  const cover = img(project.cover.key);
  const box = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: box, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-7%", "7%"]);
  return (
    <div ref={box} className="absolute inset-0 overflow-hidden">
      <motion.img
        src={cover.src}
        alt=""
        width={cover.width}
        height={cover.height}
        loading="lazy"
        style={{ y, objectPosition: project.cover.position }}
        className="absolute -inset-y-[9%] h-[118%] w-full object-cover transition-transform duration-[1400ms] ease-out group-hover/img:scale-[1.05]"
      />
    </div>
  );
}

function Panel({ project, index }: { project: Project; index: number }) {
  const flip = index % 2 === 1;
  const campaigns = campaignsOf(project);
  const videos = clientVideoCount(project);
  const stats = [
    campaigns.length > 0 && { label: "Campaigns", value: campaigns.length },
    videos > 0 && { label: "Videos", value: videos },
  ].filter(Boolean) as { label: string; value: number }[];

  return (
    <article className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
      {/* Image */}
      <Reveal className={cn("lg:col-span-7", flip && "lg:order-2")}>
        <Link
          to={`/work/${project.slug}`}
          data-cursor="View"
          aria-label={`Open ${project.name}`}
          className="surface-dark group/img relative block aspect-[4/5] overflow-hidden rounded-[36px] border border-lav/20 bg-surface shadow-[0_40px_90px_-40px_rgb(var(--sh)/.6)] sm:aspect-[5/4] lg:aspect-[4/4.4]"
        >
          <ParallaxCover project={project} />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-bg/10" />
          <LogoPlate project={project} className="absolute left-6 top-6 sm:left-8 sm:top-8" />
          <span className="absolute bottom-6 right-6 grid h-14 w-14 place-items-center rounded-full bg-lav text-bg transition-transform duration-500 ease-back group-hover/img:rotate-45 sm:bottom-8 sm:right-8">
            <ArrowUpRight size={24} />
          </span>
        </Link>
      </Reveal>

      {/* Copy */}
      <Reveal delay={0.1} className={cn("relative lg:col-span-5", flip && "lg:order-1")}>
        <span
          aria-hidden
          className="pointer-events-none absolute -top-16 -left-2 select-none font-display text-[clamp(6rem,13vw,11rem)] leading-none text-transparent [-webkit-text-stroke:1px_rgb(var(--c-lav)/0.3)]"
        >
          {pad(index + 1)}
        </span>

        <div className="relative pt-16 lg:pt-24">
          <Link to={`/work/${project.slug}`} className="group/title inline-block">
            <h2 className="font-display text-[clamp(2.3rem,5vw,4.2rem)] leading-[1.02] transition-colors duration-500 group-hover/title:text-lav">
              {project.name}
            </h2>
          </Link>
          <p className="mt-5 max-w-[42ch] text-pretty text-[1.05rem] leading-relaxed text-muted">{project.subtitle}</p>

          {(stats.length > 0 || project.years) && (
            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
              {stats.map((s) => (
                <div key={s.label} className="border-l border-lav/25 pl-4">
                  <dt className="text-[12px] uppercase tracking-[0.14em] text-faint">{s.label}</dt>
                  <dd className="mt-1 font-display text-[2.2rem] leading-none tabular-nums">
                    <Count to={s.value} />
                  </dd>
                </div>
              ))}
              {project.years && (
                <div className="border-l border-lav/25 pl-4">
                  <dt className="text-[12px] uppercase tracking-[0.14em] text-faint">Year</dt>
                  <dd className="mt-1 font-display text-[2.2rem] leading-none tabular-nums">{project.years}</dd>
                </div>
              )}
            </dl>
          )}

          <div className="mt-7 flex flex-wrap gap-1.5">
            {clientDisciplines(project).map((d) => (
              <span key={d} className="rounded-full border border-lav/20 px-3 py-1 text-[12.5px] text-muted">{d}</span>
            ))}
          </div>

          {campaigns.length > 0 && (
            <div className="mt-8">
              <p className="text-[12px] uppercase tracking-[0.14em] text-faint">Jump to a campaign</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {campaigns.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/work/${c.slug}`}
                    className="group/chip inline-flex items-center gap-1.5 rounded-full border border-lav/20 bg-surface/60 px-3.5 py-1.5 text-[13.5px] text-ink transition-colors hover:border-lav hover:bg-lav hover:text-bg"
                  >
                    {c.shortName}
                    <ArrowUpRight size={13} className="transition-transform duration-300 group-hover/chip:translate-x-0.5 group-hover/chip:-translate-y-0.5" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          <Link
            to={`/work/${project.slug}`}
            className="group/cta mt-10 inline-flex items-center gap-3 text-[15px] font-medium text-ink"
          >
            <span className="border-b border-lav/40 pb-0.5 transition-colors group-hover/cta:border-lav group-hover/cta:text-lav">
              {campaigns.length > 0 ? "Explore all campaigns" : "View project"}
            </span>
            <ArrowUpRight size={17} className="transition-transform duration-300 group-hover/cta:translate-x-1 group-hover/cta:-translate-y-1" />
          </Link>
        </div>
      </Reveal>
    </article>
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
  const [view, setView] = useState<View>("grid");
  const list = filter === "All" ? clients : clients.filter((p) => clientDisciplines(p).includes(filter));
  const count = (f: Filter) => (f === "All" ? clients.length : clients.filter((p) => clientDisciplines(p).includes(f)).length);
  const featured = view === "showcase" ? list.slice(0, FEATURED_COUNT) : [];
  const rest = list.slice(featured.length);
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

        {/* Filters */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <div className="flex flex-wrap gap-2.5" role="group" aria-label="Filter by discipline">
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

        {/* Only useful once there are more companies than the showcase features */}
        {list.length > FEATURED_COUNT && (
          <div role="group" aria-label="Layout" className="inline-flex rounded-full border border-lav/20 p-1">
            {([["showcase", "Showcase", Rows3], ["grid", "Grid", LayoutGrid]] as const).map(([v, label, Icon]) => (
              <button
                key={v}
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13.5px] font-medium transition-colors",
                  view === v ? "bg-lav text-bg" : "text-muted hover:text-ink"
                )}
              >
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>
        )}
        </div>

        {/* Companies */}
        <ul className={cn("flex flex-col gap-28 lg:gap-40", featured.length > 0 && "mt-16 lg:mt-24")}>
          <AnimatePresence initial={false} mode="popLayout">
            {featured.map((p, i) => (
              <motion.li
                key={p.slug}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <Panel project={p} index={i} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {rest.length > 0 && (
          <section aria-label="More companies" className={featured.length > 0 ? "mt-28 lg:mt-40" : "mt-14"}>
            {featured.length > 0 && (
              <div className="mb-10 flex items-center gap-5">
                <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)]">More companies</h2>
                <span className="h-px flex-1 bg-lav/15" />
                <span className="text-[14px] tabular-nums text-faint">{pad(rest.length)}</span>
              </div>
            )}
            <ul className="grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence initial={false} mode="popLayout">
                {rest.map((p, i) => (
                  <motion.li
                    key={p.slug}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, delay: (i % 3) * 0.06, ease: EASE }}
                  >
                    <GridCard project={p} index={featured.length + i} />
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