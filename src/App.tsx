import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import { motion } from "framer-motion";
import { Nav } from "./components/layout/Nav";
import { Footer } from "./components/layout/Footer";
import { CommandMenu } from "./components/layout/CommandMenu";
import { CursorLabel } from "./components/ui/CursorLabel";
import { ScrollToTop } from "./components/ui/ScrollToTop.tsx";
import { ToastProvider } from "./components/ui/Toast";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { PageLoader, RouteLoader } from "./components/ui/Loader";

const loadHome = () => import("./pages/Home");
const loadWorks = () => import("./pages/Works");
const loadProject = () => import("./pages/Project");
const Home = lazy(loadHome);
const Works = lazy(loadWorks);
const Project = lazy(loadProject);
const NotFound = lazy(() => import("./pages/NotFound"));

/** Once the first page is up, fetch the other pages in the background so navigation feels instant. */
function usePrefetchPages() {
  useEffect(() => {
    const run = () => {
      loadWorks().catch(() => {});
      loadProject().catch(() => {});
    };
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(run, { timeout: 4000 });
    else window.setTimeout(run, 2500);
  }, []);
}

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---- Scroll positions, remembered per page so Back / Forward return to where you were ---- */
const SCROLL_KEY = "scroll-positions";
const readPositions = (): Record<string, number> => {
  try {
    return JSON.parse(sessionStorage.getItem(SCROLL_KEY) ?? "{}");
  } catch {
    return {};
  }
};
const writePositions = (p: Record<string, number>) => {
  try {
    sessionStorage.setItem(SCROLL_KEY, JSON.stringify(p));
  } catch {
    /* storage unavailable — scroll restore simply won't persist */
  }
};

/**
 * New page (link click)  -> starts at the top, or at the #hash target.
 * Back / Forward / reload -> returns to the saved position (waits for lazy pages to be tall enough).
 */
function ScrollManager() {
  const { pathname, search, hash } = useLocation();
  const navType = useNavigationType();
  const positions = useRef<Record<string, number>>(readPositions());
  const current = useRef(pathname + search);
  const locked = useRef(true); // released once the first scroll position is settled
  const lastPath = useRef(pathname);

  // Flag a page change during render, before the DOM swaps — the browser may clamp the scroll
  // position while the new page loads, and that must not overwrite the position we saved.
  if (lastPath.current !== pathname) {
    lastPath.current = pathname;
    locked.current = true;
  }

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    let raf = 0;
    const save = () => {
      raf = 0;
      if (locked.current) return;
      positions.current[current.current] = window.scrollY;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(save);
    };
    const persist = () => writePositions(positions.current);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", persist);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", persist);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    current.current = pathname + search;
  }, [pathname, search]);

  useEffect(() => {
    const smooth: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";
    let cancelled = false;
    let tries = 0;
    const done = () => {
      // let any trailing layout-driven scroll events settle before we start saving again
      window.setTimeout(() => {
        if (!cancelled) locked.current = false;
      }, 150);
    };

    if (hash) {
      const seek = () => {
        if (cancelled) return;
        const el = document.getElementById(hash.slice(1));
        if (el) {
          el.scrollIntoView({ behavior: smooth, block: "start" });
          done();
        } else if (tries++ < 30) requestAnimationFrame(seek);
        else done();
      };
      seek();
    } else if (navType === "POP" && positions.current[pathname + search] > 0) {
      const target = positions.current[pathname + search];
      const restore = () => {
        if (cancelled) return;
        const tall = document.documentElement.scrollHeight >= target + window.innerHeight - 4;
        if (tall || tries++ > 90) {
          window.scrollTo({ top: target, left: 0, behavior: "instant" as ScrollBehavior });
          done();
        } else requestAnimationFrame(restore);
      };
      restore();
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      done();
    }
    return () => {
      cancelled = true;
    };
  }, [pathname, hash]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

/** Screen readers get told when the page changes (sighted visitors never see this). */
function RouteAnnouncer() {
  const { pathname } = useLocation();
  const [text, setText] = useState("");
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = window.setTimeout(() => setText(document.title), 250);
    return () => window.clearTimeout(t);
  }, [pathname]);
  return (
    <div role="status" aria-live="polite" aria-atomic className="sr-only">
      {text}
    </div>
  );
}

export default function App() {
  const { pathname } = useLocation();
  usePrefetchPages();
  return (
    <ToastProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-lav focus:px-5 focus:py-3 focus:font-semibold focus:text-bg"
      >
        Skip to content
      </a>
      <ScrollManager />
      <RouteAnnouncer />
      <Nav />
      <main id="main" tabIndex={-1} className="min-h-[100svh] outline-none">
        <Suspense fallback={<RouteLoader />}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <ErrorBoundary key={pathname}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/works" element={<Works />} />
                <Route path="/work/:slug" element={<Project />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </motion.div>
        </Suspense>
      </main>
      <Footer />
      <CommandMenu />
      <ScrollToTop />
      <CursorLabel />
      <div className="grain" aria-hidden />
      <PageLoader />
    </ToastProvider>
  );
}