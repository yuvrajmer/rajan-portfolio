import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { img } from "../../assets";
import { getProject, projects, videoCount, VISIT_SHARJAH_CAMPAIGNS, type Project } from "../../data/projects";
import { Reveal } from "../ui/Reveal";
import { LogoPlate } from "../ui/WorkCard";

/**
 * Visit Sharjah is an umbrella client relationship — F1H2O, SCTDA, the Summer
 * Promotions campaign, Week of Stars and Shurooq were all delivered under it
 * (see VISIT_SHARJAH_CAMPAIGNS, the single source of truth for that
 * grouping). Continental is a separate, standalone client relationship.
 * Rather than listing every campaign as its own card, this section features
 * each client relationship as one card in a bento layout — Visit Sharjah as
 * the larger, primary entry (it's the bigger, longer-running body of work)
 * with Continental alongside it. Each project page carries the full detail.
 */
export function SelectedWork() {
  const visitSharjah = getProject("visit-sharjah");
  const continental = getProject("continental");

  const campaignCount = VISIT_SHARJAH_CAMPAIGNS.length;
  const visitSharjahVideos = projects
    .filter((p) => (VISIT_SHARJAH_CAMPAIGNS as readonly string[]).includes(p.slug))
    .reduce((n, p) => n + videoCount(p), 0);

  const [primary, ...secondary] = [visitSharjah, continental].filter((p): p is Project => Boolean(p));
  if (!primary) return null;
  const primaryCover = img(primary.cover.key);

  return (
    <section id="work" className="container-page py-28 lg:py-36">
      <Reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <h2 className="max-w-[16ch] text-balance font-display text-[clamp(2.4rem,5.6vw,4.6rem)]">Selected work</h2>
          <p className="mt-5 max-w-[58ch] text-lg text-muted">
            A long-running partnership with Visit Sharjah — spanning {campaignCount} campaigns and{" "}
            {visitSharjahVideos} videos and reels, from logo reveals and CGI to full social campaigns — alongside
            CGI and social work for Continental.
          </p>
        </div>
        <Link
          to="/works"
          className="group inline-flex shrink-0 items-center gap-2 self-start text-[15px] font-medium text-muted transition-colors hover:text-ink md:self-auto"
        >
          View all work
          <ArrowUpRight size={16} className="transition-transform duration-300 ease-back group-hover:translate-x-1 group-hover:-translate-y-0.5" />
        </Link>
      </Reveal>

      {/* Featured: one bento grid, one cell per client relationship */}
      <div className="mt-14 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        {/* Primary — the bigger, longer-running relationship */}
        <Reveal delay={0.1}>
          <Link
            to={`/work/${primary.slug}`}
            data-cursor="View"
            className="group relative block overflow-hidden rounded-[32px] border border-lav/20 bg-surface"
          >
            <div className="relative aspect-[4/5] sm:aspect-[16/9] lg:aspect-auto lg:h-[540px]">
              <img
                src={primaryCover.src}
                alt=""
                width={primaryCover.width}
                height={primaryCover.height}
                loading="lazy"
                style={{ objectPosition: primary.cover.position }}
                className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/25 to-bg/10" />
            </div>

            <LogoPlate project={primary} className="absolute left-6 top-6 sm:left-8 sm:top-8" />

            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-6 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-10">
              <div>
                <h3 className="font-display text-[clamp(1.8rem,4.4vw,3.4rem)] leading-[1.03] text-ink">
                  {primary.name}
                </h3>
                <p className="mt-3 max-w-[52ch] text-pretty text-[15px] leading-relaxed text-muted sm:text-base">
                  {primary.subtitle}
                </p>
              </div>
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-lav text-bg transition-transform duration-500 ease-back group-hover:rotate-45">
                <ArrowUpRight size={24} />
              </span>
            </div>
          </Link>
        </Reveal>

        {/* Secondary — smaller companion cards alongside it */}
        {secondary.length > 0 && (
          <div className="flex flex-col gap-6 lg:h-[540px]">
            {secondary.map((project, i) => {
              const cover = img(project.cover.key);
              return (
                <Reveal key={project.slug} delay={0.18 + i * 0.08} className="min-h-[260px] flex-1">
                  <Link
                    to={`/work/${project.slug}`}
                    data-cursor="View"
                    className="group relative block h-full overflow-hidden rounded-[32px] border border-lav/20 bg-surface"
                  >
                    <img
                      src={cover.src}
                      alt=""
                      width={cover.width}
                      height={cover.height}
                      loading="lazy"
                      style={{ objectPosition: project.cover.position }}
                      className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                    />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-bg/5" />

                    <LogoPlate project={project} className="absolute left-5 top-5" />

                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
                      <div>
                        <h3 className="font-display text-[clamp(1.4rem,2.4vw,2rem)] leading-[1.05] text-ink">
                          {project.name}
                        </h3>
                        <p className="mt-2 max-w-[38ch] text-pretty text-[14px] leading-relaxed text-muted">
                          {project.subtitle}
                        </p>
                      </div>
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-lav/25 bg-bg/40 text-ink backdrop-blur transition-all duration-500 ease-back group-hover:rotate-45 group-hover:border-lav group-hover:bg-lav group-hover:text-bg">
                        <ArrowUpRight size={19} />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}