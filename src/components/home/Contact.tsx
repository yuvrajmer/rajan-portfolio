import { Copy, Mail } from "lucide-react";
import { site } from "../../data/site";
import { copyText } from "../../lib/hooks";
import { Button, LinkButton } from "../ui/Button";
import { Magnetic } from "../ui/Magnetic";
import { Reveal } from "../ui/Reveal";
import { useToast } from "../ui/Toast";

export function Contact() {
  const { toast } = useToast();
  const copy = async () => toast((await copyText(site.email)) ? "Email copied" : "Couldn't copy — try again");

  return (
    <section id="contact" className="container-page pb-32 pt-8 lg:pb-44">
      <Reveal>
        <div className="relative overflow-hidden rounded-[32px] border border-lav/20 bg-surface/70 px-7 py-16 sm:px-14 sm:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 70% at 100% 0%, rgb(var(--c-lav) / .18), transparent 65%), radial-gradient(40% 50% at 0% 100%, rgb(var(--c-ember) / .12), transparent 70%)",
            }}
          />
          <h2 className="relative max-w-[17ch] text-balance font-display text-[clamp(2.3rem,6vw,5.2rem)] leading-[1.02]">
            {site.contactLine}
          </h2>
          <div className="relative mt-12 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Magnetic>
              <Button onClick={copy} className="w-full px-7 py-4 text-base sm:w-auto">
                <Copy size={18} />
                {site.email}
              </Button>
            </Magnetic>
            <LinkButton href={`mailto:${site.email}`} variant="ghost" className="w-full px-7 py-4 text-base sm:w-auto">
              <Mail size={18} />
              Write an email
            </LinkButton>
          </div>
          {site.socials.length > 0 && (
            <ul className="relative mt-10 flex flex-wrap gap-x-8 gap-y-2 text-[15px] text-muted">
              {site.socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Reveal>
    </section>
  );
}
