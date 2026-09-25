import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export function SlidingTabs({
  tabs,
  value,
  onChange,
  id,
}: {
  tabs: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  id: string;
}) {
  const onKey = (e: React.KeyboardEvent, i: number) => {
    let n = i;
    if (e.key === "ArrowRight") n = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = tabs.length - 1;
    else return;
    e.preventDefault();
    onChange(tabs[n].id);
    document.getElementById(`${id}-tab-${tabs[n].id}`)?.focus();
  };

  return (
    <div role="tablist" aria-label="Project sections" className="glass no-scrollbar inline-flex max-w-full gap-1 overflow-x-auto rounded-full p-1.5">
      {tabs.map((t, i) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            id={`${id}-tab-${t.id}`}
            role="tab"
            aria-selected={active}
            aria-controls={`${id}-panel`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={cn(
              "relative shrink-0 rounded-full px-5 py-2.5 text-[14px] font-semibold transition-colors",
              active ? "text-bg" : "text-muted hover:text-ink"
            )}
          >
            {active && (
              <motion.span
                layoutId={`${id}-pill`}
                className="absolute inset-0 rounded-full bg-lav"
                transition={{ type: "spring", stiffness: 460, damping: 36 }}
              />
            )}
            <span className="relative">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
