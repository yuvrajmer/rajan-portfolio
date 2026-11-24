import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** "On this page" — laid out like a timeline: each section is a keyframe, the active one lights up. */
export function SectionRail({ items }: { items: { id: string; title: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  // While a click-to-scroll is travelling, the highlight stays on the clicked section instead of
  // flickering through every section it passes.
  const lockedTo = useRef<string | null>(null);
  const unlockTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    setActive(items[0]?.id);
    lockedTo.current = null;
    let raf = 0;

    // The active section is the last one whose top has passed a "reading line" near the top of the
    // screen. Short sections at the very end of the page can never scroll up that far, so once the
    // visitor reaches the bottom of the page the last section is lit instead.
    const update = () => {
      raf = 0;
      if (lockedTo.current) return;
      const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
      if (!els.length) return;
      const line = Math.max(window.innerHeight * 0.3, 170);
      let current = els[0];
      for (const el of els) {
        if (el.getBoundingClientRect().top <= line) current = el;
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
      if (atBottom) current = els[els.length - 1];
      setActive(current.id);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    // Release the click lock once scrolling has actually stopped.
    const onScroll = () => {
      schedule();
      if (lockedTo.current) {
        window.clearTimeout(unlockTimer.current);
        unlockTimer.current = window.setTimeout(() => {
          lockedTo.current = null;
          schedule();
        }, 140);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);
    // Images / videos loading in can push sections around — keep the highlight honest.
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(schedule) : null;
    ro?.observe(document.body);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      ro?.disconnect();
      window.clearTimeout(unlockTimer.current);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [items]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    // Scroll without adding a browser-history entry, so the Back button still leaves the page.
    e.preventDefault();
    setActive(id);
    lockedTo.current = id;
    window.clearTimeout(unlockTimer.current);
    // Safety net: if the page is already at that spot no scroll event fires, so release the lock anyway.
    unlockTimer.current = window.setTimeout(() => {
      lockedTo.current = null;
    }, 300);
    el.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
  };

  return (
    <nav aria-label="On this page" className="relative">
      <span aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-lav/15" />
      <ul className="space-y-1">
        {items.map((it) => {
          const on = it.id === active;
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                onClick={(e) => go(e, it.id)}
                aria-current={on ? "location" : undefined}
                className={cn(
                  "group relative flex items-center gap-4 py-2 text-[14.5px] transition-colors",
                  on ? "font-semibold text-ink" : "text-faint hover:text-muted"
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "relative z-10 h-[15px] w-[15px] shrink-0 rotate-45 scale-[.55] rounded-[3px] border transition-all duration-500 ease-back",
                    on ? "scale-100 border-ember bg-ember" : "border-lav/40 bg-bg group-hover:border-lav"
                  )}
                />
                {it.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}