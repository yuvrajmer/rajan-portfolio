import { chapterVideos, type Chapter, type Section, type Still, type Video } from "../../data/projects";
import { slugify } from "../../lib/hooks";
import { Chip } from "../ui/Chip";
import { LogoMorph } from "./LogoMorph";
import { StillStrip, VideoStrip } from "./MediaStrips";

export const sectionId = (chapter: Chapter, s: Section) => `${chapter.id}-${slugify(s.title)}`;

function SectionBlock({
  chapter,
  section,
  first,
  onVideo,
  onStills,
}: {
  chapter: Chapter;
  section: Section;
  first: boolean;
  onVideo: (v: Video) => void;
  onStills: (items: Still[], i: number) => void;
}) {
  const toolsOnly = !section.body && !section.media && !section.list && section.tools;
  return (
    <section
      id={sectionId(chapter, section)}
      className={first ? "" : "mt-16 border-t border-lav/10 pt-14"}
    >
      <h3 className="font-display text-[clamp(1.5rem,2.4vw,2.1rem)]">{section.title}</h3>

      {section.body?.map((p, i) => (
        <p
          key={i}
          className={
            first && i === 0
              ? "mt-6 max-w-[62ch] text-pretty text-[clamp(1.15rem,1.7vw,1.4rem)] leading-[1.6] text-ink/90"
              : "mt-5 max-w-[62ch] text-pretty text-[1.06rem] leading-[1.75] text-muted"
          }
        >
          {p}
        </p>
      ))}

      {section.list && (
        <ul className="mt-5 max-w-[62ch] space-y-3">
          {section.list.map((li) => (
            <li key={li} className="flex gap-4 text-[1.04rem] leading-relaxed text-muted">
              <span aria-hidden className="mt-[0.62em] h-2 w-2 shrink-0 rotate-45 bg-ember" />
              {li}
            </li>
          ))}
        </ul>
      )}

      {section.media?.map((m, i) => {
        if (m.kind === "logo-morph") return <LogoMorph key={i} />;
        if (m.kind === "videos") return <VideoStrip key={i} label={m.label} items={m.items} onOpen={onVideo} />;
        return <StillStrip key={i} label={m.label} items={m.items} onOpen={(idx) => onStills(m.items, idx)} />;
      })}

      {section.tools && (
        <div className={toolsOnly ? "mt-6 flex flex-wrap gap-2.5" : "mt-8 flex flex-wrap items-center gap-2.5"}>
          {!toolsOnly && <span className="mr-1 text-[13.5px] font-medium text-faint">Tools</span>}
          {section.tools.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>
      )}
    </section>
  );
}

export function ChapterContent({
  chapter,
  onVideo,
  onStills,
}: {
  chapter: Chapter;
  onVideo: (v: Video, all: Video[]) => void;
  onStills: (items: Still[], i: number) => void;
}) {
  const all = chapterVideos(chapter);
  return (
    <div>
      <h2 className="max-w-[24ch] text-balance font-display text-[clamp(1.7rem,3.2vw,2.7rem)] leading-[1.08]">
        {chapter.title}
      </h2>
      {chapter.intro?.map((p, i) => (
        <p key={i} className="mt-6 max-w-[62ch] text-pretty text-[1.1rem] leading-[1.75] text-muted">
          {p}
        </p>
      ))}
      <div className="mt-14">
        {chapter.sections.map((s, i) => (
          <SectionBlock
            key={s.title}
            chapter={chapter}
            section={s}
            first={i === 0 && !chapter.intro}
            onVideo={(v) => onVideo(v, all)}
            onStills={onStills}
          />
        ))}
      </div>
    </div>
  );
}
