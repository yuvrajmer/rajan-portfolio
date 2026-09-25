import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-lav/20 bg-lav/[0.06] px-3.5 py-1.5 text-[13px] font-medium text-muted",
        className
      )}
    >
      {children}
    </span>
  );
}
