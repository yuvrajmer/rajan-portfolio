import { useState, type ChangeEvent, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, Send } from "lucide-react";
import { site } from "../../data/site";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";
import { Magnetic } from "../ui/Magnetic";
import { useToast } from "../ui/Toast";

/**
 * Frontend-only contact form. Submits straight from the browser to Web3Forms
 * (https://web3forms.com), which forwards the message to your inbox — no backend.
 * Put your access key in .env as VITE_WEB3FORMS_KEY. Without a key the form
 * falls back to opening the visitor's email app with the message pre-filled.
 *
 * The card's four corner marks are a viewfinder: dim by default, they brighten
 * to lavender while you're in that field and lock to ember once it's filled —
 * a frame pulling into focus, echoing the reel/timecode language in the nav.
 * Sending fires one shutter-flash across the frame as the confirmation.
 */
const ENDPOINT = "https://api.web3forms.com/submit";
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;
const EMAIL_RE = /^\S+@\S+\.\S+$/;

type FieldKey = "name" | "email" | "message";
type Status = "idle" | "sending" | "sent" | "error";

function Field({
  id,
  field,
  label,
  value,
  onChange,
  active,
  setActive,
  type = "text",
  as = "input",
  rows,
  autoComplete,
}: {
  id: string;
  field: FieldKey;
  label: string;
  value: string;
  onChange: (v: string) => void;
  active: FieldKey | null;
  setActive: (f: FieldKey | null) => void;
  type?: string;
  as?: "input" | "textarea";
  rows?: number;
  autoComplete?: string;
}) {
  const floated = active === field || value.length > 0;
  const shared = {
    id,
    name: id,
    required: true,
    autoComplete,
    value,
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
    onFocus: () => setActive(field),
    onBlur: () => setActive(null),
    className: cn(
      "w-full border-b border-lav/20 bg-transparent pb-3 pt-8 text-[16px] text-ink outline-none",
      "transition-colors duration-300 focus:border-lav",
      as === "textarea" && "resize-none"
    ),
  };

  return (
    <div className="relative">
      {as === "textarea" ? <textarea rows={rows} {...shared} /> : <input type={type} {...shared} />}
      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute left-0 top-8 text-[16px] text-faint transition-all duration-300 ease-out",
          floated && "top-1 text-[12px] tracking-wide text-muted"
        )}
      >
        {label}
      </label>
    </div>
  );
}

function Corner({ at, filled, focused }: { at: "tl" | "tr" | "bl" | "br"; filled: boolean; focused: boolean }) {
  const side: Record<typeof at, string> = {
    tl: "left-0 top-0 border-l border-t rounded-tl-[22px]",
    tr: "right-0 top-0 border-r border-t rounded-tr-[22px]",
    bl: "left-0 bottom-0 border-l border-b rounded-bl-[22px]",
    br: "right-0 bottom-0 border-r border-b rounded-br-[22px]",
  };
  return (
    <span
      aria-hidden
      className={cn(
        "absolute h-7 w-7 transition-all duration-300 ease-out sm:h-9 sm:w-9",
        side[at],
        filled ? "scale-110 border-ember" : focused ? "border-lav" : "border-lav/25"
      )}
    />
  );
}

export function ContactForm() {
  const { toast } = useToast();
  const [status, setStatus] = useState<Status>("idle");
  const [active, setActive] = useState<FieldKey | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const nameOk = name.trim().length > 0;
  const emailOk = EMAIL_RE.test(email);
  const messageOk = message.trim().length > 0;
  const filledCount = [nameOk, emailOk, messageOk].filter(Boolean).length;
  const ready = filledCount === 3;

  const caption =
    filledCount === 0
      ? "Fill this in and the frame comes together."
      : ready
        ? "Frame's complete — send it over."
        : "Almost in frame…";

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    // Honeypot: real visitors never see or fill this field.
    if (new FormData(form).get("botcheck")) return;

    if (!ACCESS_KEY) {
      const body = `${message}\n\n— ${name} (${email})`;
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Message from ${name}`)}&body=${encodeURIComponent(body)}`;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `Portfolio message from ${name}`,
          from_name: name,
          name,
          email,
          message,
        }),
      });
      const json = (await res.json()) as { success?: boolean };
      if (!res.ok || !json.success) throw new Error("send failed");
      setStatus("sent");
      toast("Message sent — thank you!");
      window.setTimeout(() => {
        form.reset();
        setName("");
        setEmail("");
        setMessage("");
        setStatus("idle");
      }, 1500);
    } catch {
      setStatus("error");
      toast("Couldn't send — please try again");
    }
  };

  const sending = status === "sending";
  const sent = status === "sent";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[22px] bg-surface/40 p-7 transition-shadow duration-500 sm:p-10",
        ready && "shadow-[0_0_0_1px_rgb(var(--c-ember)/.15),0_30px_70px_-40px_rgb(var(--c-ember)/.35)]"
      )}
    >
      <Corner at="tl" filled={nameOk} focused={active === "name"} />
      <Corner at="tr" filled={emailOk} focused={active === "email"} />
      <Corner at="bl" filled={messageOk} focused={active === "message"} />
      <Corner at="br" filled={ready} focused={false} />

      <AnimatePresence>
        {sent && (
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.9, times: [0, 0.2, 1], ease: "easeOut" }}
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-ember/30 via-lav/15 to-transparent"
          />
        )}
      </AnimatePresence>

      <form onSubmit={onSubmit} className="relative grid gap-1">
        <Field id="cf-name" field="name" label="Your name" value={name} onChange={setName} active={active} setActive={setActive} autoComplete="name" />
        <Field id="cf-email" field="email" label="Your email" value={email} onChange={setEmail} type="email" active={active} setActive={setActive} autoComplete="email" />
        <Field
          id="cf-message"
          field="message"
          label="Tell me about the project"
          value={message}
          onChange={setMessage}
          active={active}
          setActive={setActive}
          as="textarea"
          rows={3}
        />

        <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

        <p aria-live="polite" className="mt-7 text-[13px] text-faint">
          {caption}
        </p>

        <div className="mt-4">
          <Magnetic>
            <Button
              type="submit"
              disabled={sending || sent}
              className="w-full px-7 py-4 text-base disabled:opacity-90 sm:w-auto"
            >
              {sent ? (
                <motion.span
                  initial={{ scale: 0.6, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="inline-flex"
                >
                  <Check size={18} />
                </motion.span>
              ) : sending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
              {sent ? "Sent" : sending ? "Sending…" : "Send message"}
            </Button>
          </Magnetic>
        </div>
      </form>
    </div>
  );
}