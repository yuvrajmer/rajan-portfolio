import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Nav } from "./components/layout/Nav";
import { Footer } from "./components/layout/Footer";
import { CommandMenu } from "./components/layout/CommandMenu";
import { CursorLabel } from "./components/ui/CursorLabel";
import { ScrollToTop } from "./components/ui/ScrollToTop.tsx";
import { ToastProvider } from "./components/ui/Toast";
import { PageLoader, RouteLoader } from "./components/ui/Loader";

const Home = lazy(() => import("./pages/Home"));
const Works = lazy(() => import("./pages/Works"));
const Project = lazy(() => import("./pages/Project"));
const NotFound = lazy(() => import("./pages/NotFound"));

/** Scrolls to top on navigation, or to the #hash target (waits for lazy pages to mount). */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      return;
    }
    let tries = 0;
    const seek = () => {
      const el = document.getElementById(hash.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else if (tries++ < 30) requestAnimationFrame(seek);
    };
    seek();
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  return (
    <ToastProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-lav focus:px-5 focus:py-3 focus:font-semibold focus:text-bg"
      >
        Skip to content
      </a>
      <ScrollManager />
      <Nav />
      <main id="main" className="min-h-[100svh]">
        <Suspense fallback={<RouteLoader />}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/works" element={<Works />} />
              <Route path="/work/:slug" element={<Project />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
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