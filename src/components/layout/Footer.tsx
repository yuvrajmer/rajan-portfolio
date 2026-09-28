import { Link } from "react-router-dom";
import { site } from "../../data/site";

export function Footer() {
  return (
    <footer className="border-t border-lav/10">
      <div className="container-page flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg">{site.name}</p>
          <p className="mt-1 text-sm text-faint">
            {site.role} · © {new Date().getFullYear()}
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-7 gap-y-2 text-[15px] text-muted">
          <Link to="/works" className="transition-colors hover:text-ink">All work</Link>
          <Link to="/#about" className="transition-colors hover:text-ink">About</Link>
          <a href={`mailto:${site.email}`} className="transition-colors hover:text-ink">{site.email}</a>
          {site.socials.map((s) => (
            <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">
              {s.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}