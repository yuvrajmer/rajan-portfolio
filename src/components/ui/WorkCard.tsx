import { Link } from "react-router-dom";
import { img } from "../../assets";
import { videoCount, type Project } from "../../data/projects";
import { cn } from "../../lib/cn";

/** Logo on a light plate — keeps every brand legible on the dark theme. */
export function LogoPlate({ project, className }: { project: Project; className?: string }) {
  const a = img(project.logo);
  return (
    <span className={cn("surface-dark inline-flex items-center rounded-xl bg-ink px-3.5 py-2.5", className)}>
      <img src={a.src} alt="" width={a.width} height={a.height} className="h-6 w-auto max-w-[130px] object-contain" />
    </span>
  );
}

export function WorkCard({ project, className }: { project: Project; className?: string }) {
  const cover = img(project.cover.key);
  const n = videoCount(project);
  return (
    <Link to={`/work/${project.slug}`} data-cursor="View" className={cn("group block", className)}>
      <div className="surface-dark relative aspect-[4/5] overflow-hidden rounded-card border border-lav/15 bg-surface">
        <img
          src={cover.src}
          alt=""
          width={cover.width}
          height={cover.height}
          loading="lazy"
          style={{ objectPosition: project.cover.position }}
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/75 via-transparent to-bg/25" />
        <LogoPlate project={project} className="absolute left-4 top-4" />
        <span className="absolute inset-0 rounded-card ring-1 ring-inset ring-ink/[0.06] transition-shadow duration-500 group-hover:ring-lav/50" />
      </div>
      <div className="mt-5 flex items-start justify-between gap-5">
        <div>
          <h3 className="font-display text-[clamp(1.25rem,1.9vw,1.6rem)] leading-tight transition-colors group-hover:text-lav">
            {project.name}
          </h3>
          <p className="mt-2 max-w-[38ch] text-[14.5px] leading-relaxed text-muted">{project.subtitle}</p>
        </div>
        {n > 0 && <span className="mt-1.5 shrink-0 text-[13px] font-medium text-faint">{n} videos</span>}
      </div>
    </Link>
  );
}