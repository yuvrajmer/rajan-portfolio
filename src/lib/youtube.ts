/** Extracts the video id from youtu.be / youtube.com/shorts / watch?v= links. */
export function youtubeId(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1);
    if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2];
    return u.searchParams.get("v") ?? "";
  } catch {
    return "";
  }
}

export const isShort = (url: string) => url.includes("/shorts/");

export const embedUrl = (url: string) =>
  `https://www.youtube-nocookie.com/embed/${youtubeId(url)}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;

/* -------------------------------------------------------------------- */
/*  IFrame Player API — loaded lazily, once, so we can listen for the    */
/*  real "embedding disabled by owner" error (codes 101 / 150) instead   */
/*  of guessing from onLoad (which fires even for YouTube's own error    */
/*  page, since that's still a successfully-loaded document).            */
/* -------------------------------------------------------------------- */
declare global {
  interface Window {
    YT?: { Player: new (el: HTMLIFrameElement | string, opts: Record<string, unknown>) => unknown };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;

export function loadYouTubeIframeAPI(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(s);
  });
  return apiPromise;
}

/** YouTube error codes 101 and 150 both mean "embedding disabled by the video owner". */
export const isEmbedDisabledError = (code: number) => code === 101 || code === 150;