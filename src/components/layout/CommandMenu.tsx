import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import { ArrowRight, AtSign, Copy, Film, Home, Layers, Mail, User } from "lucide-react";
import { projects } from "../../data/projects";
import { site } from "../../data/site";
import { copyText, useIsMac } from "../../lib/hooks";
import { useToast } from "../ui/Toast";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const mac = useIsMac();

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const openIt = () => setOpen(true);
    window.addEventListener("keydown", key);
    window.addEventListener("open-command-menu", openIt);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("open-command-menu", openIt);
    };
  }, []);

  const go = (to: string) => { setOpen(false); navigate(to); };
  const copyEmail = async () => {
    setOpen(false);
    toast((await copyText(site.email)) ? "Email copied" : "Couldn't copy — press Ctrl+C");
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Search the site"
      overlayClassName="cmdk-overlay"
      contentClassName="cmdk-content"
    >
      <div className="flex items-center gap-3 border-b border-lav/15 px-5">
        <Command.Input placeholder="Search projects, sections, actions…" autoFocus />
        <kbd className="shrink-0 rounded-md bg-lav/10 px-1.5 py-0.5 text-[11px] font-semibold text-faint">Esc</kbd>
      </div>
      <Command.List>
        <Command.Empty>Nothing matches. Try a project name like “Shurooq”.</Command.Empty>

        <Command.Group heading="Projects">
          {projects.map((p) => (
            <Command.Item key={p.slug} value={`${p.name} ${p.subtitle} ${p.disciplines.join(" ")}`} onSelect={() => go(`/work/${p.slug}`)}>
              <Film size={16} className="text-lav" />
              <span className="flex-1">{p.name}</span>
              <span className="text-xs text-faint">{p.years ?? p.disciplines[0]}</span>
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Go to">
          <Command.Item value="home top" onSelect={() => go("/")}>
            <Home size={16} className="text-lav" /> Home
          </Command.Item>
          <Command.Item value="all work index" onSelect={() => go("/works")}>
            <Layers size={16} className="text-lav" /> All work
          </Command.Item>
          <Command.Item value="about rajan" onSelect={() => go("/#about")}>
            <User size={16} className="text-lav" /> About
          </Command.Item>
          <Command.Item value="contact hire hello" onSelect={() => go("/#contact")}>
            <AtSign size={16} className="text-lav" /> Contact
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Actions">
          <Command.Item value="copy email address" onSelect={copyEmail}>
            <Copy size={16} className="text-ember" />
            <span className="flex-1">Copy email</span>
            <span className="text-xs text-faint">{site.email}</span>
          </Command.Item>
          <Command.Item
            value="send email mail write"
            onSelect={() => { setOpen(false); window.location.href = `mailto:${site.email}`; }}
          >
            <Mail size={16} className="text-ember" />
            <span className="flex-1">Write an email</span>
            <ArrowRight size={14} className="text-faint" />
          </Command.Item>
        </Command.Group>
      </Command.List>
      <div className="flex items-center justify-between border-t border-lav/15 px-5 py-3 text-xs text-faint">
        <span>↑ ↓ to move · ↵ to open</span>
        <span>{mac ? "⌘" : "Ctrl"} K to toggle</span>
      </div>
    </Command.Dialog>
  );
}
