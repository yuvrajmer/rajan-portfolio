import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Check, Copy, RotateCcw } from "lucide-react";
import { cn } from "../../lib/cn";
import { copyText } from "../../lib/hooks";
import { curveToCss, makeEasing, type Curve } from "../../lib/bezier";
import { useToast } from "../ui/Toast";

/* ---------------------------------------------------------------- */
/*  A tiny graph editor: drag the bezier handles, watch the ball's   */
/*  timing — and its squash & stretch — change live.                 */
/* ---------------------------------------------------------------- */

const PRESETS: { name: string; curve: Curve }[] = [
  { name: "Linear", curve: [0, 0, 1, 1] },
  { name: "Ease out", curve: [0.16, 1, 0.3, 1] },
  { name: "Ease in-out", curve: [0.65, 0, 0.35, 1] },
  { name: "Overshoot", curve: [0.34, 1.56, 0.64, 1] },
  { name: "Anticipate", curve: [0.36, 0, 0.66, -0.56] },
];

// graph geometry (SVG user units)
const W = 360, H = 262, L = 34, R = 16, T = 14, B = 30;
const PW = W - L - R, PH = H - T - B;
const YMIN = -0.5, YMAX = 1.5;
const sx = (x: number) => L + x * PW;
const sy = (y: number) => T + ((YMAX - y) / (YMAX - YMIN)) * PH;
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));
const round2 = (n: number) => Math.round(n * 100) / 100;

const MOVE = 1400; // ms per pass
const HOLD = 550;  // ms rest at each end
const BALL = 40;

export function EasingLab() {
  const reduce = useReducedMotion();
  const { toast } = useToast();

  const [curve, setCurve] = useState<Curve>(PRESETS[3].curve);
  const [preset, setPreset] = useState<string | null>("Overshoot");
  const [drag, setDrag] = useState<0 | 1 | 2>(0);
  const [copied, setCopied] = useState(false);

  const easing = useMemo(() => makeEasing(curve), [curve]);
  const easingRef = useRef(easing);
  easingRef.current = easing;

  const svgRef = useRef<SVGSVGElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const headRef = useRef<SVGLineElement>(null);
  const startRef = useRef(0);
  const visibleRef = useRef(true);
  const onceUntil = useRef(0);
  const trackW = useRef(320);

  const restart = useCallback(() => {
    startRef.current = performance.now();
    onceUntil.current = startRef.current + MOVE + 80;
  }, []);

  /* ---- animation loop (direct DOM writes, no React re-render per frame) ---- */
  useEffect(() => {
    startRef.current = performance.now();
    if (reduce) onceUntil.current = 0;
    const cycle = 2 * (MOVE + HOLD);
    let raf = 0;

    const paint = (v: number, p: number, vy: number, dir: 1 | -1) => {
      const w = trackW.current;
      const x0 = w * 0.1, x1 = w * 0.9;
      const cx = x0 + clamp(v, -0.4, 1.4) * (x1 - x0);
      const stretch = 1 + Math.min(0.55, Math.abs(vy) * 0.085);
      const squash = 1 / Math.pow(stretch, 0.85);
      if (ballRef.current)
        ballRef.current.style.transform = `translate3d(${cx - BALL / 2}px,0,0) scale(${stretch.toFixed(3)},${squash.toFixed(3)})`;
      if (shadowRef.current)
        shadowRef.current.style.transform = `translate3d(${cx - 20}px,0,0) scaleX(${(0.9 + (stretch - 1) * 0.9).toFixed(3)})`;
      if (dotRef.current && headRef.current) {
        const px = sx(p), py = sy(dir === 1 ? v : 1);
        dotRef.current.setAttribute("cx", String(px));
        dotRef.current.setAttribute("cy", String(py));
        dotRef.current.style.opacity = dir === 1 ? "1" : "0.25";
        headRef.current.setAttribute("x1", String(px));
        headRef.current.setAttribute("x2", String(px));
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visibleRef.current) return;
      const e = easingRef.current;
      if (reduce) {
        // reduced motion: one forward pass on demand, otherwise rest at the end
        const t = now - startRef.current;
        if (now > onceUntil.current) { paint(1, 1, 0, 1); return; }
        const p = clamp(t / MOVE, 0, 1);
        paint(e.at(p), p, e.velocity(p), 1);
        return;
      }
      const t = (now - startRef.current) % cycle;
      let p: number, dir: 1 | -1;
      if (t < MOVE) { p = t / MOVE; dir = 1; }
      else if (t < MOVE + HOLD) { p = 1; dir = 1; }
      else if (t < 2 * MOVE + HOLD) { p = (t - MOVE - HOLD) / MOVE; dir = -1; }
      else { p = 1; dir = -1; }
      const y = e.at(p);
      paint(dir === 1 ? y : 1 - y, dir === 1 ? p : 1 - p, e.velocity(p), dir);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const ro = new ResizeObserver(() => (trackW.current = track.clientWidth));
    ro.observe(track);
    trackW.current = track.clientWidth;
    const io = new IntersectionObserver(([en]) => (visibleRef.current = en.isIntersecting), { threshold: 0.05 });
    io.observe(track);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);

  /* ---- dragging ---- */
  const toGraph = (e: React.PointerEvent) => {
    const svg = svgRef.current!;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    return {
      x: round2(clamp((p.x - L) / PW, 0, 1)),
      y: round2(clamp(YMAX - ((p.y - T) / PH) * (YMAX - YMIN), YMIN, YMAX)),
    };
  };
  const update = (h: 1 | 2, x: number, y: number) => {
    setPreset(null);
    setCurve((c) => (h === 1 ? [x, y, c[2], c[3]] : [c[0], c[1], x, y]));
    restart();
  };
  const onDown = (h: 1 | 2) => (e: React.PointerEvent) => {
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    setDrag(h);
  };
  const onMove = (h: 1 | 2) => (e: React.PointerEvent) => {
    if (drag !== h) return;
    const g = toGraph(e);
    update(h, g.x, g.y);
  };
  const onKey = (h: 1 | 2) => (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 0.1 : 0.02;
    const cur = h === 1 ? [curve[0], curve[1]] : [curve[2], curve[3]];
    let [x, y] = cur;
    if (e.key === "ArrowLeft") x -= step;
    else if (e.key === "ArrowRight") x += step;
    else if (e.key === "ArrowUp") y += step;
    else if (e.key === "ArrowDown") y -= step;
    else return;
    e.preventDefault();
    update(h, round2(clamp(x, 0, 1)), round2(clamp(y, YMIN, YMAX)));
  };

  const choose = (p: (typeof PRESETS)[number]) => {
    setCurve(p.curve);
    setPreset(p.name);
    restart();
  };

  const css = curveToCss(curve);
  const onCopy = async () => {
    const ok = await copyText(css);
    setCopied(true);
    toast(ok ? "Curve copied — paste it into your CSS" : "Couldn't copy");
    window.setTimeout(() => setCopied(false), 1600);
  };

  const [x1, y1, x2, y2] = curve;
  const path = `M ${sx(0)} ${sy(0)} C ${sx(x1)} ${sy(y1)}, ${sx(x2)} ${sy(y2)}, ${sx(1)} ${sy(1)}`;

  return (
    <div className="relative">
      {/* ambient light — belongs to this widget only. Clipped so the blur bleed
          can never push the page's own scrollWidth wider than the viewport. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[24px]">
        <div
          className="absolute -inset-12 opacity-80 blur-3xl"
          style={{
            background:
              "radial-gradient(55% 45% at 25% 15%, rgb(var(--c-lav) / .30), transparent 70%), radial-gradient(40% 35% at 85% 92%, rgb(var(--c-ember) / .20), transparent 70%)",
          }}
        />
      </div>
      <section
        aria-labelledby="lab-title"
        className="rounded-[24px] border border-lav/20 bg-surface/80 p-4 shadow-[0_40px_100px_-30px_rgba(0,0,0,.9),inset_0_1px_0_rgb(255_255_255/.05)] backdrop-blur-xl sm:p-5"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="lab-title" className="font-display text-[19px] leading-tight">Change how it moves</h2>
            <p className="mt-1.5 text-[13.5px] text-muted">Drag the two handles or pick a preset.</p>
          </div>
          <button
            onClick={restart}
            aria-label="Replay motion"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-lav/20 text-muted transition-colors hover:border-lav/50 hover:text-ink"
          >
            <RotateCcw size={15} />
          </button>
        </div>

        <div className="no-scrollbar -mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Easing presets">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => choose(p)}
              aria-pressed={preset === p.name}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                preset === p.name
                  ? "border-lav bg-lav text-bg"
                  : "border-lav/20 text-muted hover:border-lav/50 hover:text-ink"
              )}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* ---- graph ---- */}
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="mt-3 block w-full select-none"
          role="group"
          aria-label="Bezier curve editor"
        >
          <defs>
            <linearGradient id="lab-grad" gradientUnits="userSpaceOnUse" x1={L} y1="0" x2={W - R} y2="0">
              <stop offset="0" stopColor="rgb(159 154 255)" />
              <stop offset="1" stopColor="rgb(255 123 57)" />
            </linearGradient>
          </defs>

          {/* grid */}
          {[0, 0.25, 0.5, 0.75, 1].map((x) => (
            <line key={x} x1={sx(x)} x2={sx(x)} y1={T} y2={H - B} stroke="rgb(159 154 255 / .10)" />
          ))}
          {[-0.5, 0, 0.5, 1, 1.5].map((y) => (
            <line
              key={y}
              x1={L}
              x2={W - R}
              y1={sy(y)}
              y2={sy(y)}
              stroke={y === 0 || y === 1 ? "rgb(159 154 255 / .32)" : "rgb(159 154 255 / .10)"}
              strokeDasharray={y === 0 || y === 1 ? undefined : "2 4"}
            />
          ))}
          <text x={L - 8} y={sy(0) + 4} textAnchor="end" fontSize="11" fill="rgb(127 130 172)">0</text>
          <text x={L - 8} y={sy(1) + 4} textAnchor="end" fontSize="11" fill="rgb(127 130 172)">1</text>
          {[["0f", 0], ["12f", 0.5], ["24f", 1]].map(([t, x]) => (
            <text key={t as string} x={sx(x as number)} y={H - 10} textAnchor="middle" fontSize="11" fill="rgb(127 130 172)">{t}</text>
          ))}

          {/* linear reference */}
          <line x1={sx(0)} y1={sy(0)} x2={sx(1)} y2={sy(1)} stroke="rgb(169 171 208 / .28)" strokeDasharray="4 5" />

          {/* handle arms */}
          <line x1={sx(0)} y1={sy(0)} x2={sx(x1)} y2={sy(y1)} stroke="rgb(159 154 255 / .55)" strokeWidth="1.5" />
          <line x1={sx(1)} y1={sy(1)} x2={sx(x2)} y2={sy(y2)} stroke="rgb(255 123 57 / .55)" strokeWidth="1.5" />

          {/* the curve */}
          <path d={path} fill="none" stroke="url(#lab-grad)" strokeWidth="3.5" strokeLinecap="round" />

          {/* playhead */}
          <line ref={headRef} x1={sx(0)} x2={sx(0)} y1={T} y2={H - B} stroke="rgb(255 123 57 / .35)" />
          <circle ref={dotRef} cx={sx(0)} cy={sy(0)} r="4.5" fill="rgb(255 123 57)" />

          {/* end keyframes */}
          <rect x={sx(0) - 4.5} y={sy(0) - 4.5} width="9" height="9" transform={`rotate(45 ${sx(0)} ${sy(0)})`} fill="rgb(6 7 20)" stroke="rgb(159 154 255)" strokeWidth="1.5" />
          <rect x={sx(1) - 4.5} y={sy(1) - 4.5} width="9" height="9" transform={`rotate(45 ${sx(1)} ${sy(1)})`} fill="rgb(6 7 20)" stroke="rgb(255 123 57)" strokeWidth="1.5" />

          {/* draggable handles */}
          {([1, 2] as const).map((h) => {
            const hx = h === 1 ? x1 : x2, hy = h === 1 ? y1 : y2;
            const col = h === 1 ? "159 154 255" : "255 123 57";
            return (
              <g key={h} transform={`translate(${sx(hx)} ${sy(hy)})`}>
                <circle r={drag === h ? 15 : 11} fill={`rgb(${col} / .18)`} className="transition-[r] duration-200" />
                <circle r="7" fill={`rgb(${col})`} stroke="rgb(6 7 20)" strokeWidth="2.5" />
                <circle
                  r="20"
                  fill="transparent"
                  tabIndex={0}
                  role="slider"
                  aria-label={`Curve handle ${h}`}
                  aria-valuemin={YMIN}
                  aria-valuemax={YMAX}
                  aria-valuenow={hy}
                  aria-valuetext={`x ${hx}, y ${hy}`}
                  data-cursor={drag === h ? undefined : "Drag"}
                  style={{ touchAction: "none", cursor: drag === h ? "grabbing" : "grab" }}
                  onPointerDown={onDown(h)}
                  onPointerMove={onMove(h)}
                  onPointerUp={() => setDrag(0)}
                  onPointerCancel={() => setDrag(0)}
                  onKeyDown={onKey(h)}
                />
              </g>
            );
          })}
        </svg>

        {/* ---- stage ---- */}
        <div
          ref={trackRef}
          className="relative mt-2 h-[96px] overflow-hidden rounded-2xl border border-lav/10 bg-bg/70"
          aria-hidden
        >
          <div className="absolute left-[10%] right-[10%] top-[64px] h-px bg-lav/25" />
          <span className="absolute left-[10%] top-[64px] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-lav bg-bg" />
          <span className="absolute left-[90%] top-[64px] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-ember bg-bg" />
          <div ref={shadowRef} className="absolute left-0 top-[68px] h-[7px] w-10 rounded-[50%] bg-black/70 blur-[3px]" />
          <div
            ref={ballRef}
            className="absolute left-0 top-[24px] rounded-full will-change-transform"
            style={{
              width: BALL,
              height: BALL,
              transformOrigin: "50% 100%",
              background:
                "radial-gradient(circle at 32% 26%, #fff1e6 0 7%, rgb(255 123 57) 34%, #b83f0e 74%, #5a1a04 100%)",
              boxShadow: "0 0 34px -2px rgb(255 123 57 / .55)",
            }}
          />
        </div>

        {/* ---- readout ---- */}
        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-lav/10 bg-bg/60 py-2 pl-4 pr-2">
          <code className="truncate font-mono text-[12.5px] tabular-nums text-muted" aria-live="off">{css}</code>
          <button
            onClick={onCopy}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-lav/15 px-3.5 py-2 text-[13px] font-semibold text-ink transition-colors hover:bg-lav/30"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </section>
    </div>
  );
}
