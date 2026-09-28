import { useEffect } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { img } from "../../assets";
import { site } from "../../data/site";
import { Chip } from "../ui/Chip";
import { Reveal } from "../ui/Reveal";

/** Onion skin: ghost frames of the portrait that lag behind the pointer. */
function Ring({ mx, my, inset, k, className }: { mx: MotionValue<number>; my: MotionValue<number>; inset: number; k: number; className: string }) {
  const x = useTransform(mx, (v) => v * k);
  const y = useTransform(my, (v) => v * k);
  return <motion.span aria-hidden style={{ x, y, inset: -inset }} className={`absolute rounded-full ${className}`} />;
}

function Portrait() {
  const a = img("portrait");
  const reduce = useReducedMotion();
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const mx = useSpring(rx, { stiffness: 90, damping: 18 });
  const my = useSpring(ry, { stiffness: 90, damping: 18 });

  useEffect(() => {
    if (reduce) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      rx.set((e.clientX / window.innerWidth - 0.5) * 2);
      ry.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduce, rx, ry]);

  return (
    <div className="isolate relative mx-auto aspect-square w-[min(78vw,340px)]">
      {/* Small soft halo — just a couple cm past the portrait's edge, not a room-filling glow */}
      <motion.div
        aria-hidden
        className="absolute inset-[-2%] -z-10 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle at 38% 40%, rgb(var(--c-ember) / var(--halo-a)) 0%, rgb(var(--c-lav) / var(--halo-a)) 45%, transparent 68%)",
        }}
        animate={reduce ? undefined : { opacity: [0.7, 1, 0.7], scale: [1, 1.04, 1] }}
        transition={reduce ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <Ring mx={mx} my={my} inset={-42} k={-16} className="border border-lav/15" />
      <Ring mx={mx} my={my} inset={-22} k={-9} className="border border-ember/40" />
      <Ring mx={mx} my={my} inset={-8} k={-4} className="border-[1.5px] border-lav/60" />

      <img
        src={a.src}
        width={a.width}
        height={a.height}
        alt={`Portrait of ${site.name}`}
        loading="lazy"
        className="relative h-full w-full rounded-full object-cover shadow-[0_30px_90px_-18px_rgb(var(--sh)/.9)] light:shadow-[0_18px_44px_-22px_rgb(var(--sh)/.28)]"
      />
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="container-page py-28 lg:py-36">
      <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-12">
        <Reveal className="min-w-0 lg:col-span-4">
          <Portrait />
        </Reveal>
        <div className="min-w-0 lg:col-span-8">
          <h2 className="sr-only">About</h2>
          <Reveal>
            <p className="text-balance font-display text-[clamp(1.6rem,3vw,2.55rem)] leading-[1.18] tracking-[-0.02em]">
              {site.about[0]}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-[56ch] text-[1.15rem] leading-relaxed text-muted">{site.about[1]}</p>
          </Reveal>
          <Reveal delay={0.16}>
            <h3 className="mt-12 font-display text-lg text-faint">Loves to do</h3>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {site.interests.map((t) => (
                <Chip key={t} className="px-4 py-2 text-[14px]">{t}</Chip>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}