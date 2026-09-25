/** Cubic-bezier easing solver (same maths browsers use for CSS `cubic-bezier()`).
 *  y may leave 0..1, which is what gives overshoot & anticipation. */
export type Curve = [number, number, number, number];

export function makeEasing([x1, y1, x2, y2]: Curve) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;

  const X = (u: number) => ((ax * u + bx) * u + cx) * u;
  const Y = (u: number) => ((ay * u + by) * u + cy) * u;
  const dX = (u: number) => (3 * ax * u + 2 * bx) * u + cx;
  const dY = (u: number) => (3 * ay * u + 2 * by) * u + cy;

  const solve = (t: number) => {
    let u = t;
    for (let i = 0; i < 8; i++) {
      const err = X(u) - t;
      if (Math.abs(err) < 1e-5) return u;
      const d = dX(u);
      if (Math.abs(d) < 1e-6) break;
      u -= err / d;
    }
    let lo = 0, hi = 1;
    u = t;
    for (let i = 0; i < 24; i++) {
      const err = X(u) - t;
      if (Math.abs(err) < 1e-5) break;
      if (err > 0) hi = u; else lo = u;
      u = (lo + hi) / 2;
    }
    return u;
  };

  return {
    /** value at time t (0..1) */
    at: (t: number) => Y(solve(Math.min(1, Math.max(0, t)))),
    /** rate of change at time t — drives squash & stretch */
    velocity: (t: number) => {
      const u = solve(Math.min(1, Math.max(0, t)));
      const dx = dX(u);
      return Math.abs(dx) < 1e-4 ? 0 : dY(u) / dx;
    },
  };
}

export const fmt = (n: number) => String(Math.round(n * 100) / 100);
export const curveToCss = ([a, b, c, d]: Curve) =>
  `cubic-bezier(${fmt(a)}, ${fmt(b)}, ${fmt(c)}, ${fmt(d)})`;
