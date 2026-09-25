import { LinkButton } from "../components/ui/Button";
import { useDocumentMeta } from "../lib/hooks";

export default function NotFound() {
  useDocumentMeta("Page not found — Rajan Tarakhala");
  return (
    <div className="container-page flex min-h-[80svh] flex-col items-start justify-center gap-8 pb-20 pt-[calc(var(--nav-h)+40px)]">
      <h1 className="font-display text-[clamp(3rem,9vw,7rem)] leading-[0.95]">Page not found</h1>
      <p className="max-w-[40ch] text-lg text-muted">That link doesn't lead anywhere. Try the work index, or head back home.</p>
      <div className="flex flex-wrap gap-3">
        <LinkButton to="/works">See all work</LinkButton>
        <LinkButton to="/" variant="ghost">Back home</LinkButton>
      </div>
    </div>
  );
}
