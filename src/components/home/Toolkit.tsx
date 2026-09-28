import { motion, useReducedMotion } from "framer-motion";
import { img } from "../../assets";
import { site } from "../../data/site";
import { Reveal } from "../ui/Reveal";

export function Toolkit() {
  const reduce = useReducedMotion();

  return (
    <section id="toolkit" className="container-page pb-28 lg:pb-36">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-14">
        <div className="min-w-0 lg:col-span-5">
          <Reveal>
            <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)]">What I do</h2>
          </Reveal>
          <ul className="mt-9 border-t border-lav/12">
            {site.skills.map((s, i) => (
              <Reveal key={s} delay={i * 0.05} y={12}>
                <li className="group flex items-center justify-between border-b border-lav/12 py-5">
                  <span className="font-display text-[clamp(1.35rem,2.2vw,1.9rem)] transition-all duration-500 ease-out group-hover:translate-x-2 group-hover:text-lav">
                    {s}
                  </span>
                  <span className="h-2.5 w-2.5 rotate-45 border border-lav/40 transition-all duration-500 ease-back group-hover:scale-125 group-hover:border-ember group-hover:bg-ember" />
                </li>
              </Reveal>
            ))}
          </ul>
        </div>

        <div className="min-w-0 lg:col-span-7">
          <Reveal>
            <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)]">Software</h2>
          </Reveal>

          {/* Floating icon cluster — badge size scales with proficiency, glow halo, full-color icons */}
          <div className="relative mt-16 flex flex-wrap items-end gap-x-12 gap-y-16 sm:gap-x-16">
            <svg
              aria-hidden
              className="pointer-events-none absolute -left-12 -top-16 -z-10 h-[130%] w-[75%] opacity-[0.14]"
              viewBox="0 0 400 400"
              fill="none"
            >
              <circle cx="200" cy="200" r="180" stroke="rgb(var(--c-lav))" strokeDasharray="2 11" />
              <circle cx="200" cy="200" r="120" stroke="rgb(var(--c-ember))" strokeDasharray="1 9" />
            </svg>

            {site.software.map((t, i) => {
              const a = img(t.icon);
              const size = 68 + t.level * 48; // 68px .. 116px, driven by t.level
              const accent = i % 2 === 0 ? "lav" : "ember";
              return (
                <Reveal key={t.name} delay={i * 0.08} y={24}>
                  <motion.div
                    className="group relative flex flex-col items-center gap-4"
                    animate={reduce ? undefined : { y: [0, -10, 0] }}
                    transition={
                      reduce
                        ? undefined
                        : { duration: 4.4 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }
                    }
                  >
                    <div
                      aria-hidden
                      className={`absolute inset-0 -z-10 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-70 ${
                        accent === "lav" ? "bg-lav/40" : "bg-ember/40"
                      }`}
                    />
                    <div
                      className="relative flex items-center justify-center rounded-full border border-lav/15 bg-gradient-to-b from-surface/85 to-surface2/45 shadow-[0_20px_50px_-20px_rgb(var(--sh)/0.65)] backdrop-blur-sm transition-all duration-500 ease-out group-hover:-translate-y-3 group-hover:scale-[1.07] group-hover:border-lav/40"
                      style={{ width: size, height: size }}
                    >
                      <img
                        src={a.src}
                        width={a.width}
                        height={a.height}
                        alt=""
                        loading="lazy"
                        className="h-[56%] w-[56%] object-contain drop-shadow-[0_4px_14px_rgb(var(--sh)/0.4)]"
                      />
                      <span
                        aria-hidden
                        className={`pointer-events-none absolute inset-0 rounded-full ring-1 transition-all duration-500 ${
                          accent === "lav" ? "ring-lav/0 group-hover:ring-lav/60" : "ring-ember/0 group-hover:ring-ember/60"
                        }`}
                      />
                    </div>
                    <span className="font-display text-sm tracking-wide text-muted transition-colors duration-300 group-hover:text-ink">
                      {t.name}
                    </span>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}