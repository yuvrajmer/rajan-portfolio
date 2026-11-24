import { Fragment } from "react";
import { ArrowRight } from "lucide-react";
import { img, type ImageKey } from "../../assets";

const LOGOS: { key: ImageKey; label: string }[] = [
  { key: "sctda/logo-1-sun", label: "Original Government of Sharjah sun" },
  { key: "sctda/logo-2-government", label: "Government of Sharjah logo" },
  { key: "logo/sctda", label: "SCTDA logo" },
];

/** Height of the archway image — change this one number to resize it. */
const ARCH_H = 260;

/** Compact archway reference on the left, the three logos in one row on its right.
 *  Everything uses object-contain, so nothing is zoomed or cropped. */
export function LogoMorph() {
  const arch = img("sctda/archway-reference");
  const archW = Math.round((ARCH_H * arch.width) / arch.height);

  return (
    <div className="mt-8 rounded-card border border-lav/15 bg-surface/60 p-4 sm:p-5">
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
        {/* 4 — archway, smaller, natural ratio (no crop) */}
        <figure className="m-0 shrink-0" style={{ width: archW }}>
          <div
            className="relative overflow-hidden rounded-2xl bg-black/40"
            style={{ width: archW, height: ARCH_H }}
          >
            <img
              src={arch.src}
              width={arch.width}
              height={arch.height}
              alt="Archway design reference used for the transition"
              loading="lazy"
              draggable={false}
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
          <figcaption className="mt-2 px-1 text-[12px] font-medium leading-snug text-muted">
            Archway design reference used for transition
          </figcaption>
        </figure>

        {/* 1–3 — logos in a single row, arrows show the transformation order */}
        <div className="flex w-full min-w-0 flex-1 items-start justify-center gap-2 sm:gap-3">
          {LOGOS.map((l, i) => {
            const a = img(l.key);
            return (
              <Fragment key={l.key}>
                {i > 0 && (
                  <ArrowRight
                    aria-hidden
                    size={20}
                    className="mt-[clamp(18px,3vw,30px)] shrink-0 text-lav"
                  />
                )}
              <figure className="m-0 min-w-0 max-w-[132px] flex-1">
                <div className="surface-dark relative aspect-[4/3] overflow-hidden rounded-xl bg-ink">
                  <img
                    src={a.src}
                    width={a.width}
                    height={a.height}
                    alt={l.label}
                    loading="lazy"
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-contain p-[8%]"
                  />
                </div>
                <figcaption className="mt-1.5 px-1 text-[12px] font-medium leading-snug text-muted">
                  {l.label}
                </figcaption>
              </figure>
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}