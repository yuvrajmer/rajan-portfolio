import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowDown, Copy } from "lucide-react";
import { useEffect, useRef } from "react";
import { site } from "../../data/site";
import { copyText } from "../../lib/hooks";
import { Button, LinkButton } from "../ui/Button";
import { Magnetic } from "../ui/Magnetic";
import { useToast } from "../ui/Toast";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Each letter rises out of a mask — the one orchestrated moment on page load. */
function Line({ text, delay }: { text: string; delay: number }) {
  const reduce = useReducedMotion();
  const letters: Variants = {
    hidden: { y: "108%" },
    show: (i: number) => ({ y: "0%", transition: { duration: 1.05, ease: EASE, delay: delay + i * 0.045 } }),
  };
  return (
    <span className="block overflow-hidden pb-[0.1em]" aria-hidden>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={letters}
          initial={reduce ? "show" : "hidden"}
          animate="show"
          className="inline-block will-change-transform"
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE, delay },
});

/** Muted, looping reel behind the hero copy — pauses for reduced-motion users. */
function HeroBackdrop() {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (reduce) v.pause();
    else v.play().catch(() => {});
  }, [reduce]);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        poster="https://cdn.pixabay.com/video/2016/11/04/6266-190550868_tiny.jpg"
        autoPlay={!reduce}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
      >
        <source src="https://cdn.pixabay.com/video/2016/11/04/6266-190550868_large.mp4" type="video/mp4" />
      </video>
      {/* Heavy scrim — video stays a faint, subtle presence behind the copy, not the main visual */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg/85 via-bg/70 to-bg" />
      <div className="absolute inset-0 bg-bg/35" />
    </div>
  );
}

export function Hero() {
  const { toast } = useToast();

  const copyEmail = async () =>
    toast((await copyText(site.email)) ? "Email copied" : "Couldn't copy — try again");

  return (
    <section className="isolate relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-bg pb-16 pt-[calc(var(--nav-h)+36px)]">
      <HeroBackdrop />
      <div className="container-page relative z-10 flex flex-col items-center text-center">
        <motion.div
          {...fade(0.1)}
          className="inline-flex items-center gap-2.5 rounded-full border border-lav/20 bg-surface/60 px-4 py-1.5"
        >
          <span aria-hidden className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-ember" />
          <span className="text-[14px] font-medium text-muted">{site.role}</span>
        </motion.div>

        <h1
          aria-label={site.name}
          className="mt-7 font-display text-[clamp(3.4rem,10vw,8.5rem)] leading-[0.92] tracking-[-0.045em]"
        >
          <Line text={site.firstName} delay={0.15} />
          <Line text={site.lastName} delay={0.32} />
        </h1>

        <motion.p
          {...fade(0.7)}
          className="mt-8 max-w-[46ch] text-pretty text-[clamp(1.05rem,1.5vw,1.25rem)] leading-relaxed text-muted"
        >
          {site.lede}
        </motion.p>

        <motion.div
          {...fade(0.85)}
          className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center"
        >
          <Magnetic>
            <LinkButton href="#work" className="w-full sm:w-auto">
              See selected work
              <ArrowDown size={17} className="transition-transform duration-300 ease-back group-hover:translate-y-0.5" />
            </LinkButton>
          </Magnetic>
          <Button variant="ghost" onClick={copyEmail} className="w-full sm:w-auto">
            <Copy size={16} />
            Copy email
          </Button>
        </motion.div>
      </div>
    </section>
  );
}