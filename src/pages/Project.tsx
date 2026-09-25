import { useCallback, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { getProject, siblingsOf, videoCount, type Project as ProjectT, type Still, type Video } from "../data/projects";
import { useDocumentMeta } from "../lib/hooks";
import { Chip } from "../components/ui/Chip";
import { Reveal } from "../components/ui/Reveal";
import { LogoPlate } from "../components/ui/WorkCard";
import { ChapterContent, sectionId } from "../components/work/ChapterContent";
import { MediaLightbox, type LightboxItem } from "../components/work/MediaLightbox";
import { NextProject } from "../components/work/NextProject";
import { ProjectCarousel } from "../components/work/ProjectCarousel";
import { SectionRail } from "../components/work/SectionRail";
import { SlidingTabs } from "../components/work/YearTabs";
import NotFound from "./NotFound";

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[13.5px] font-medium text-faint">{label}</dt>
      <dd className="mt-1.5 font-display text-[1.35rem] leading-tight">{children}</dd>
    </div>
  );
}

function ProjectView({ project }: { project: ProjectT }) {
  useDocumentMeta(`${project.name} — Rajan Tarakhala`, project.subtitle);

  const [params, setParams] = useSearchParams();
  const chapter = project.chapters.find((c) => c.id === params.get("tab")) ?? project.chapters[0];
  const n = videoCount(project);

  const [box, setBox] = useState<{ items: LightboxItem[]; index: number } | null>(null);

  const openVideo = useCallback((v: Video, all: Video[]) => {
    const items: LightboxItem[] = all.map((x) => ({ type: "video", url: x.url, title: x.title, thumb: x.thumb, src: x.src }));
    setBox({ items, index: Math.max(0, all.findIndex((x) => x.url === v.url)) });
  }, []);
  const openStills = useCallback((stills: Still[], index: number) => {
    setBox({ items: stills.map((s) => ({ type: "image", key: s.key, alt: s.alt })), index });
  }, []);

  const rail = useMemo(
    () => (chapter ? chapter.sections.map((s) => ({ id: sectionId(chapter, s), title: s.title })) : []),
    [chapter]
  );
  const others = siblingsOf(project.slug);

  return (
    <>
      <header className="container-page pb-16 pt-[calc(var(--nav-h)+44px)]">
        <Link to="/works" className="group inline-flex items-center gap-2 text-[15px] text-muted transition-colors hover:text-ink">
          <ArrowLeft size={16} className="transition-transform duration-300 ease-back group-hover:-translate-x-1" />
          All work
        </Link>

        <div className="mt-12 flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <LogoPlate project={project} className="px-5 py-3.5 [&_img]:h-9 [&_img]:max-w-[190px]" />
            <h1 className="mt-9 max-w-[15ch] text-balance font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.96] tracking-[-0.04em]">
              {project.name}
            </h1>
            <p className="mt-7 max-w-[50ch] text-pretty text-[1.2rem] leading-relaxed text-muted">{project.subtitle}</p>
          </div>

          <dl className="flex flex-wrap gap-x-12 gap-y-6">
            {project.years && <Meta label="Years">{project.years}</Meta>}
            {n > 0 && <Meta label="Videos & reels">{n}</Meta>}
            <div>
              <dt className="text-[13.5px] font-medium text-faint">Disciplines</dt>
              <dd className="mt-2.5 flex max-w-[300px] flex-wrap gap-2">
                {project.disciplines.map((d) => (
                  <Chip key={d}>{d}</Chip>
                ))}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      {/* Visit Sharjah: an overview page rather than a year-by-year case study */}
      {project.intro && (
        <section className="container-page border-t border-lav/10 py-20">
          <div className="max-w-[62ch]">
            {project.intro.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className={i === 0 ? "text-[clamp(1.25rem,2vw,1.6rem)] leading-[1.55] text-ink/90" : "mt-6 text-[1.1rem] leading-[1.75] text-muted"}>
                  {p}
                </p>
              </Reveal>
            ))}
            {project.tags && (
              <div className="mt-9 flex flex-wrap gap-2.5">
                {project.tags.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            )}
          </div>
          {others.length > 0 && (
            <div className="mt-24">
              <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.8rem)]">Projects I have worked on</h2>
              <div className="mt-4">
                <ProjectCarousel items={others} />
              </div>
            </div>
          )}
        </section>
      )}

      {chapter && (
        <div className="border-t border-lav/10">
          {project.chapters.length > 1 && (
            <div className="sticky top-[76px] z-30 -mb-2 flex justify-center px-4 pt-5 sm:justify-start sm:px-0">
              <div className="container-page">
                <SlidingTabs
                  id="chapters"
                  value={chapter.id}
                  tabs={project.chapters.map((c) => ({ id: c.id, label: c.tab }))}
                  onChange={(id) => {
                    setParams({ tab: id }, { replace: true, preventScrollReset: true });
                  }}
                />
              </div>
            </div>
          )}

          <div className="container-page grid gap-14 py-16 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-20 lg:py-24">
            <aside className="hidden lg:block">
              <div className="sticky top-[150px]">
                <SectionRail items={rail} />
              </div>
            </aside>
            <div id="chapters-panel" role="tabpanel" aria-labelledby={`chapters-tab-${chapter.id}`} className="min-w-0">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ChapterContent chapter={chapter} onVideo={openVideo} onStills={openStills} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      <NextProject slug={project.slug} />

      <MediaLightbox
        items={box?.items ?? []}
        index={box ? box.index : null}
        onIndex={(i) => setBox((b) => (b ? { ...b, index: i } : b))}
        onClose={() => setBox(null)}
      />
    </>
  );
}

export default function Project() {
  const { slug } = useParams();
  const project = getProject(slug ?? "");
  return project ? <ProjectView key={project.slug} project={project} /> : <NotFound />;
}