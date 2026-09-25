import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, Search, X } from "lucide-react";
import { cn } from "../../lib/cn";
import { useIsMac } from "../../lib/hooks";
import { site } from "../../data/site";

const REEL_SECONDS = 90;
const FPS = 24;
const pad = (n: number) => String(n).padStart(2, "0");
function timecode(sec: number) {
  const s = Math.floor(sec);
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}:${pad(Math.floor((sec - s) * FPS))}`;
}

/** The page is a reel: scrolling moves the playhead. Updates the DOM directly (no re-renders). */
function ScrollTimecode() {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll();
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (ref.current) ref.current.textContent = timecode(Math.min(1, Math.max(0, v)) * REEL_SECONDS);
  });
  return (
    <span
      ref={ref}
      aria-hidden
      className="hidden w-[88px] text-[12px] font-medium tabular-nums tracking-wide text-ember xl:inline-block"
    >
      00:00:00:00
    </span>
  );
}

function Mark() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden className="shrink-0">
      <circle cx="12" cy="16" r="8" className="origin-center fill-lav/40 transition-transform duration-500 ease-back group-hover:-translate-x-1" />
      <circle cx="20" cy="16" r="8" className="origin-center fill-ember transition-transform duration-500 ease-back group-hover:translate-x-1" />
    </svg>
  );
}

const links = [
  { label: "Work", to: "/works", match: (p: string) => p.startsWith("/work") },
  { label: "About", to: "/#about", id: "about" },
  { label: "Contact", to: "/#contact", id: "contact" },
];

export function Nav() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [menu, setMenu] = useState(false);
  const [spy, setSpy] = useState("");
  const mac = useIsMac();
  const { scrollYProgress, scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  useEffect(() => setMenu(false), [pathname]);

  // scroll-spy for the in-page links on the home page
  useEffect(() => {
    if (!isHome) return setSpy("");
    const ids = ["about", "contact"];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setSpy(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    const t = window.setTimeout(() => ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); }), 400);
    const clear = () => { if (window.scrollY < 300) setSpy(""); };
    window.addEventListener("scroll", clear, { passive: true });
    return () => { window.clearTimeout(t); io.disconnect(); window.removeEventListener("scroll", clear); };
  }, [isHome]);

  const openSearch = () => window.dispatchEvent(new Event("open-command-menu"));

  return (
    <>
      <motion.div
        aria-hidden
        style={{ scaleX: scrollYProgress }}
        className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-lav via-lav to-ember"
      />
      <header className="fixed inset-x-0 top-0 z-[65] pt-3 sm:pt-4">
        <div className="container-page">
          <nav
            aria-label="Primary"
            className={cn(
              "flex items-center gap-2 rounded-full py-2 pl-4 pr-2 transition-all duration-400 ease-out",
              scrolled
                ? "glass shadow-[0_18px_50px_-20px_rgba(0,0,0,.8)]"
                : "border border-transparent bg-transparent shadow-none"
            )}
          >
          <Link to="/" className="group flex items-center gap-2.5 rounded-full pr-2" aria-label={`${site.name} — home`}>
            <Mark />
            <span className="font-display text-[15px] font-medium tracking-tight">{site.name}</span>
          </Link>

          <div className="ml-auto hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = l.match ? l.match(pathname) : spy === l.id;
              return (
                <Link
                  key={l.label}
                  to={l.to}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-[14px] font-medium transition-colors",
                    active ? "text-ink" : "text-muted hover:text-ink"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-lav/15"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  {l.label}
                </Link>
              );
            })}
          </div>


          <button
            onClick={openSearch}
            className="ml-auto flex items-center gap-2 rounded-full border border-lav/20 py-2 pl-3 pr-2.5 text-[13px] text-muted transition-colors hover:border-lav/50 hover:text-ink md:ml-0"
            aria-label="Search the site"
          >
            <Search size={15} />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden rounded-md bg-lav/10 px-1.5 py-0.5 font-sans text-[11px] font-semibold text-faint sm:inline">
              {mac ? "⌘" : "Ctrl"} K
            </kbd>
          </button>

          <button
            onClick={() => setMenu((m) => !m)}
            aria-expanded={menu}
            aria-label={menu ? "Close menu" : "Open menu"}
            className="grid h-9 w-9 place-items-center rounded-full text-ink transition-colors hover:bg-lav/10 md:hidden"
          >
            {menu ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
        </div>

        <AnimatePresence>
          {menu && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="glass absolute inset-x-3 top-[68px] rounded-3xl p-3 md:hidden"
            >
              {[{ label: "Home", to: "/" }, ...links].map((l) => (
                <Link key={l.label} to={l.to} className="block rounded-2xl px-4 py-3.5 font-display text-xl hover:bg-lav/10">
                  {l.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}