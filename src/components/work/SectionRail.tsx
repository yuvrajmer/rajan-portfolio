import { useEffect, useState } from "react";
import { cn } from "../../lib/cn";

/** "On this page" — laid out like a timeline: each section is a keyframe, the active one lights up. */
export function SectionRail({ items }: { items: { id: string; title: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    setActive(items[0]?.id);
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

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
