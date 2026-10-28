import { Component, type ErrorInfo, type ReactNode } from "react";
import { LinkButton } from "./Button";

/**
 * Last line of defence: if a page throws (or a lazy chunk fails to load after a new deploy),
 * visitors get a calm, on-brand recovery screen instead of a blank page.
 */
const CHUNK_RELOAD_KEY = "chunk-reloaded";
const isChunkError = (e: Error) =>
  /dynamically imported module|Importing a module script failed|Loading chunk|error loading dynamically/i.test(e.message);

export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // A stale tab asking for a file that a new deploy replaced: one automatic refresh fixes it.
    try {
      if (isChunkError(error) && !sessionStorage.getItem(CHUNK_RELOAD_KEY)) {
        sessionStorage.setItem(CHUNK_RELOAD_KEY, "1");
        window.location.reload();
        return;
      }
    } catch {
      /* storage unavailable — fall through to the fallback screen */
    }
    console.error(error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" className="container-page flex min-h-[80svh] flex-col items-start justify-center gap-8 pb-20 pt-[calc(var(--nav-h)+40px)]">
        <h1 className="font-display text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.95]">Something went wrong</h1>
        <p className="max-w-[44ch] text-lg text-muted">
          This page didn't load properly. A quick refresh usually fixes it, or you can head back to the work index.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded-full bg-lav px-6 py-3.5 text-[15px] font-semibold text-bg transition-transform duration-300 ease-out active:scale-[.97]"
          >
            Refresh page
          </button>
          <LinkButton to="/works" variant="ghost">
            See all work
          </LinkButton>
        </div>
      </div>
    );
  }
}