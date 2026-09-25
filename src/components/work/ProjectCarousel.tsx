import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Project } from "../../data/projects";
import { WorkCard } from "../ui/WorkCard";

/** Swipe on touch, drag or use the arrows on desktop. */
export function ProjectCarousel({ items }: { items: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });

  const by = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="mb-6 flex justify-end gap-2">
        {([-1, 1] as const).map((d) => (
          <button
            key={d}
            onClick={() => by(d)}
            aria-label={d === 1 ? "Next projects" : "Previous projects"}
            className="grid h-11 w-11 place-items-center rounded-full border border-lav/20 text-ink transition-colors hover:border-lav/60 hover:bg-lav/10"
          >
            {d === 1 ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        ))}
      </div>
      <div
        ref={ref}
        data-cursor="Drag"
        className="no-scrollbar -mx-[var(--gutter)] flex snap-x snap-mandatory gap-6 overflow-x-auto px-[var(--gutter)] pb-2"
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") return;
          drag.current = { down: true, x: e.clientX, left: ref.current!.scrollLeft, moved: false };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d.down) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > 4) d.moved = true;
          ref.current!.scrollLeft = d.left - dx;
        }}
        onPointerUp={() => (drag.current.down = false)}
        onPointerLeave={() => (drag.current.down = false)}
        onClickCapture={(e) => {
          if (drag.current.moved) { e.preventDefault(); e.stopPropagation(); drag.current.moved = false; }
        }}
      >
        {items.map((p) => (
          <div key={p.slug} className="w-[78vw] shrink-0 snap-start sm:w-[340px]">
            <WorkCard project={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
