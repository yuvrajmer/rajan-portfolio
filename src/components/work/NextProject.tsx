import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { img } from "../../assets";
import { getProject } from "../../data/projects";

/**
 * F1H2O, SCTDA, Summer Promotions, Week of Stars, and Shurooq are campaigns
 * delivered under the one Visit Sharjah relationship — there's no sibling
 * project to cycle "next/previous" through, so those pages route back to the
 * Visit Sharjah hub instead. Visit Sharjah (the hub) and Continental (a
 * separate, standalone client) render nothing here.
 */
export function NextProject({ slug }: { slug: string }) {
  if (slug === "visit-sharjah" || slug === "continental") return null;

  const visitSharjah = getProject("visit-sharjah");
  if (!visitSharjah) return null;

  const cover = img(visitSharjah.cover.key);

  return (
    <section aria-label="More work" className="container-page pb-28 pt-24">
      <Link
        to={`/work/${visitSharjah.slug}`}
        data-cursor="View"
        className="group relative block overflow-hidden rounded-[30px] border border-lav/20 bg-surface"
      >
        <img
          src={cover.src}
          alt=""
          loading="lazy"
          style={{ objectPosition: visitSharjah.cover.position }}
          className="absolute inset-y-0 right-0 h-full w-full object-cover opacity-40 transition-all duration-[1400ms] ease-out [mask-image:linear-gradient(270deg,#000_5%,transparent_75%)] group-hover:scale-[1.04] group-hover:opacity-70 sm:w-3/5"
        />
        <div className="relative flex min-h-[260px] flex-col justify-between gap-16 p-8 sm:min-h-[320px] sm:p-12">
          <span className="text-[15px] font-medium text-muted">Part of</span>
          <div className="flex items-end justify-between gap-6">
            <h2 className="max-w-[16ch] text-balance font-display text-[clamp(2rem,5.4vw,4.6rem)] leading-[1]">
              {visitSharjah.name}
            </h2>
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-lav text-bg transition-transform duration-500 ease-back group-hover:rotate-45 sm:h-16 sm:w-16">
              <ArrowUpRight size={26} />
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}
