import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, Play, Volume2, X } from "lucide-react";
import { img, ratio, type ImageKey } from "../../assets";
import { cn } from "../../lib/cn";
import { embedUrl, isEmbedDisabledError, isShort, loadYouTubeIframeAPI, YT_PLAYING, type YTPlayer } from "../../lib/youtube";

export type LightboxItem =
  | { type: "video"; url: string; title: string; thumb: ImageKey; src?: string }
  | { type: "image"; key: ImageKey; alt: string };

const title = (i: LightboxItem) => (i.type === "video" ? i.title : i.alt);

function VideoStage({ item }: { item: Extract<LightboxItem, { type: "video" }> }) {
  const [loaded, setLoaded] = useState(false);
  const [blocked, setBlocked] = useState(false);
  // true when the video is playing but the player is muted (autoplay policies, iOS, etc.)
  const [silent, setSilent] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const poster = img(item.thumb);
  const selfHosted = Boolean(item.src);
  // Shape of the stage follows the real video: wide thumbnails are always landscape (some wide videos
  // are published under /shorts/ links); otherwise a /shorts/ link means portrait.
  const r = ratio(item.thumb);
  const wide = r >= 1.2;
  const square = !wide && r > 0.9; // 1:1 posts (e.g. square Shorts)
  const short = !wide && !square && isShort(item.url);

  // Self-hosted files skip the YouTube API entirely — nothing to detect, it just plays.
  useEffect(() => {
    if (selfHosted) return;
    let cancelled = false;
    setSilent(false);
    loadYouTubeIframeAPI().then(() => {
      if (cancelled || !iframeRef.current || !window.YT) return;
      playerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          // SOUND FIX: make sure the player is un-muted and at full volume the moment it is ready,
          // instead of relying on whatever state the embed started in.
          onReady: (e) => {
            try {
              e.target.unMute();
              e.target.setVolume(100);
              e.target.playVideo();
            } catch {
              /* player not ready for commands yet — the "Tap for sound" pill below covers it */
            }
          },
          // If the video ends up playing while muted, say so and let the viewer fix it with one tap.
          onStateChange: (e) => {
            if (e.data === YT_PLAYING) {
              try {
                setSilent(e.target.isMuted() || e.target.getVolume() === 0);
              } catch {
                /* ignore */
              }
            }
          },
          onError: (e) => {
            if (isEmbedDisabledError(e.data)) setBlocked(true);
          },
        },
      });
    });
    return () => {
      cancelled = true;
      playerRef.current = null;
    };
  }, [selfHosted, item.url]);

  const turnSoundOn = () => {
    const p = playerRef.current;
    if (!p) return;
    try {
      p.unMute();
      p.setVolume(100);
      p.playVideo();
    } catch {
      /* ignore */
    }
    setSilent(false);
  };

  if (!selfHosted && blocked) {
    // The video owner has disabled embedding — no site can override that. Fall back to a
    // clean poster + CTA that matches the site instead of YouTube's own branded error card.
    return (
      <div className="surface-dark relative w-[min(92vw,1120px,calc(74vh*1.7778))] overflow-hidden rounded-2xl shadow-[0_40px_120px_-20px_rgb(var(--sh)/.9)] ring-1 ring-lav/20">
        <img src={poster.src} alt="" className="aspect-video w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/85 via-bg/20 to-bg/10" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-lav text-bg">
            <Play size={26} className="translate-x-0.5" />
          </span>
          <p className="max-w-[36ch] text-pretty text-[15px] text-muted">
            The owner has disabled playback on other sites for this one — it still plays fine on YouTube.
          </p>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-lav px-5 py-2.5 text-[14px] font-medium text-bg transition-transform duration-300 ease-back hover:scale-[1.03]"
          >
            Watch on YouTube
            <ExternalLink size={15} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-black shadow-[0_40px_120px_-20px_rgb(var(--sh)/.9)] ring-1 ring-lav/20",
        square
          ? "aspect-square w-[min(92vw,calc(76vh),780px)]"
          : short
            ? "aspect-[9/16] h-[min(76vh,780px)] max-w-[92vw]"
            : "aspect-video w-[min(92vw,1120px,calc(74vh*1.7778))]"
      )}
    >
      {/* poster stays until the player is ready */}
      <img src={poster.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
      {!loaded && (
        <span className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border-2 border-lav/70" />
      )}
      {selfHosted ? (
        <video
          src={item.src}
          poster={poster.src}
          controls
          autoPlay
          playsInline
          onLoadedData={(e) => {
            e.currentTarget.muted = false;
            e.currentTarget.volume = 1;
            setLoaded(true);
          }}
          className={cn("absolute inset-0 h-full w-full bg-black object-contain transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0")}
        />
      ) : (
        <iframe
          ref={iframeRef}
          src={embedUrl(item.url)}
          title={item.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          onLoad={() => setLoaded(true)}
          className={cn("absolute inset-0 h-full w-full transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0")}
        />
      )}
      {!selfHosted && silent && (
        <button
          onClick={turnSoundOn}
          className="absolute left-3 top-3 z-10 inline-flex items-center gap-2 rounded-full bg-lav px-4 py-2 text-[13px] font-semibold text-bg shadow-lg transition-transform duration-300 ease-back hover:scale-105"
        >
          <Volume2 size={15} />
          Tap for sound
        </button>
      )}
    </div>
  );
}

export function MediaLightbox({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: LightboxItem[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const open = index !== null;
  const item = open ? items[index] : null;
  const count = items.length;

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onIndex((index + 1) % count);
      if (e.key === "ArrowLeft") onIndex((index - 1 + count) % count);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open, index, count, onIndex]);

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[85] bg-bg/92 backdrop-blur-md data-[state=open]:animate-[cmdk-fade_.25s_ease-out]" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-[86] flex flex-col outline-none data-[state=open]:animate-[cmdk-fade_.25s_ease-out]"
        >
          <Dialog.Title className="sr-only">{item ? title(item) : "Media viewer"}</Dialog.Title>

          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
            <p className="truncate font-display text-[15px] sm:text-lg">{item ? title(item) : ""}</p>
            <div className="flex shrink-0 items-center gap-2">
              {item?.type === "video" && !item.src && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-lav/20 px-4 py-2.5 text-[13px] font-medium text-muted transition-colors hover:border-lav/50 hover:text-ink"
                >
                  <span className="hidden sm:inline">Open on YouTube</span>
                  <ExternalLink size={15} />
                </a>
              )}
              <Dialog.Close
                aria-label="Close"
                className="grid h-10 w-10 place-items-center rounded-full bg-lav/15 text-ink transition-colors hover:bg-lav/30"
              >
                <X size={18} />
              </Dialog.Close>
            </div>
          </div>

          {/* stage — clicking the empty space closes */}
          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            {count > 1 && (
              <button
                aria-label="Previous"
                onClick={() => onIndex(((index ?? 0) - 1 + count) % count)}
                className="absolute left-3 z-10 hidden h-12 w-12 place-items-center rounded-full border border-lav/20 bg-surface/80 text-ink backdrop-blur transition-colors hover:border-lav/60 sm:grid"
              >
                <ChevronLeft size={22} />
              </button>
            )}
            <AnimatePresence mode="wait">
              {item && (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  {item.type === "video" ? (
                    <VideoStage item={item} />
                  ) : (
                    <img
                      src={img(item.key).src}
                      alt={item.alt}
                      className="max-h-[76vh] max-w-[92vw] rounded-2xl object-contain shadow-[0_40px_120px_-20px_rgb(var(--sh)/.9)] ring-1 ring-lav/20 sm:max-w-[min(1400px,86vw)]"
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            {count > 1 && (
              <button
                aria-label="Next"
                onClick={() => onIndex(((index ?? 0) + 1) % count)}
                className="absolute right-3 z-10 hidden h-12 w-12 place-items-center rounded-full border border-lav/20 bg-surface/80 text-ink backdrop-blur transition-colors hover:border-lav/60 sm:grid"
              >
                <ChevronRight size={22} />
              </button>
            )}
          </div>

          <div className="flex items-center justify-center gap-4 px-4 py-5 text-sm text-muted">
            {count > 1 && (
              <>
                <button aria-label="Previous" onClick={() => onIndex(((index ?? 0) - 1 + count) % count)} className="grid h-10 w-10 place-items-center rounded-full border border-lav/20 sm:hidden">
                  <ChevronLeft size={18} />
                </button>
                <span className="tabular-nums">{(index ?? 0) + 1} / {count}</span>
                <button aria-label="Next" onClick={() => onIndex(((index ?? 0) + 1) % count)} className="grid h-10 w-10 place-items-center rounded-full border border-lav/20 sm:hidden">
                  <ChevronRight size={18} />
                </button>
                <span className="hidden text-faint sm:inline">← → to browse · Esc to close</span>
              </>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}