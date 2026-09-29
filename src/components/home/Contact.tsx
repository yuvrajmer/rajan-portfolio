import { Copy, Mail } from "lucide-react";
import { site } from "../../data/site";
import { copyText } from "../../lib/hooks";
import { Reveal } from "../ui/Reveal";
import { useToast } from "../ui/Toast";
import { ContactForm } from "./ContactForm";

export function Contact() {
  const { toast } = useToast();
  const copy = async () => toast((await copyText(site.email)) ? "Email copied" : "Couldn't copy — try again");

  return (
    <section id="contact" className="container-page pb-32 pt-8 lg:pb-44">
      <Reveal>
        <div className="relative overflow-hidden rounded-[32px] border border-lav/20 bg-surface/70 px-7 py-16 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 70% at 100% 0%, rgb(var(--c-lav) / .18), transparent 65%), radial-gradient(40% 50% at 0% 100%, rgb(var(--c-ember) / .12), transparent 70%)",
            }}
          />

          <div className="relative grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
            <div>
              <h2 className="max-w-[17ch] text-balance font-display text-[clamp(2.3rem,5.4vw,4.4rem)] leading-[1.02]">
                {site.contactLine}
              </h2>
              <p className="mt-5 max-w-[38ch] text-[17px] text-muted">
                Tell me what you're building — I read every message myself.
              </p>

              <div className="mt-12 flex flex-col gap-4 border-t border-lav/10 pt-8 text-[15px] text-muted">
                <button
                  onClick={copy}
                  className="group inline-flex items-center gap-2.5 text-left transition-colors hover:text-ink"
                >
                  <Copy size={15} className="shrink-0 text-faint transition-colors group-hover:text-lav" />
                  {site.email}
                </button>
                <a
                  href={`mailto:${site.email}`}
                  className="group inline-flex items-center gap-2.5 transition-colors hover:text-ink"
                >
                  <Mail size={15} className="shrink-0 text-faint transition-colors group-hover:text-lav" />
                  Write an email instead
                </a>
                {site.socials.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-ink"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </Reveal>
    </section>
  );
}