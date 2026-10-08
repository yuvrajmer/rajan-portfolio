import { Link } from "react-router-dom";
import { img } from "../../assets";
import { projects } from "../../data/projects";

/** Client logos as clean single-colour silhouettes (white on dark, ink on light) — several originals are dark-on-transparent
 *  and would disappear on a dark theme. */
export function BrandMarquee() {
  const set = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-16 pr-16" aria-hidden={hidden || undefined}>
      {projects.map((p) => {
        const a = p.logo ? img(p.logo) : null;
        return (
          <li key={p.slug} className="shrink-0">
            <Link
              to={`/work/${p.slug}`}
              tabIndex={hidden ? -1 : undefined}
              aria-label={hidden ? undefined : p.name}
              className="block opacity-45 transition-opacity duration-300 hover:opacity-100"
            >
              {a ? (
                <img
                  src={a.src}
                  alt=""
                  width={a.width}
                  height={a.height}
                  className="h-9 w-auto max-w-none brightness-0 invert light:invert-0"
                  draggable={false}
                />
              ) : (
                // PLACEHOLDER: no logo file for this company yet — its name is shown as text instead.
                <span className="block whitespace-nowrap font-display text-[22px] leading-9 text-ink">{p.shortName}</span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <section aria-label="Brands I have worked with" className="border-y border-lav/10 py-9">
      <div className="group flex w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {set(false)}
          {set(true)}
        </div>
      </div>
    </section>
  );
}