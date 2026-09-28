import { useCallback, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";

/**
 * Theme state. The tokens themselves live in styles/theme.css — this file only
 * flips `data-theme` on <html>, remembers the choice and keeps the browser
 * chrome colour (<meta name="theme-color">) in step.
 * The first paint is handled by the inline script in index.html (no flash).
 */
export type Theme = "dark" | "light";

const KEY = "theme";
const listeners = new Set<() => void>();

const read = (): Theme =>
  typeof document !== "undefined" && document.documentElement.dataset.theme === "light" ? "light" : "dark";

/** "6 7 20" → "#060714" — reads the live --c-bg token so there is no second copy of the colour. */
function pageColourHex() {
  const t = getComputedStyle(document.documentElement).getPropertyValue("--c-bg").trim().split(/\s+/);
  return "#" + t.map((n) => Number(n).toString(16).padStart(2, "0")).join("");
}

function apply(next: Theme) {
  const root = document.documentElement;
  root.dataset.theme = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* private mode — the choice just won't persist */
  }
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", pageColourHex());
  flushSync(() => listeners.forEach((l) => l()));
}

type Origin = { x: number; y: number };
type VTDocument = Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };

export function setTheme(next: Theme, origin?: Origin) {
  if (next === read()) return;
  const doc = document as VTDocument;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Circular reveal from the toggle where supported…
  if (doc.startViewTransition && origin && !reduce) {
    const { x, y } = origin;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    doc.startViewTransition(() => apply(next)).ready.then(() =>
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 750, easing: "cubic-bezier(.16,1,.3,1)", pseudoElement: "::view-transition-new(root)" }
      )
    ).catch(() => {});
    return;
  }

  // …otherwise a soft cross-fade.
  const root = document.documentElement;
  root.classList.add("theme-fade");
  apply(next);
  window.setTimeout(() => root.classList.remove("theme-fade"), 600);
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  // keep several open tabs in sync
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY && (e.newValue === "light" || e.newValue === "dark")) {
      document.documentElement.dataset.theme = e.newValue;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
};

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, read, () => "dark" as Theme);
  const toggle = useCallback((origin?: Origin) => setTheme(read() === "dark" ? "light" : "dark", origin), []);
  return { theme, toggle };
}