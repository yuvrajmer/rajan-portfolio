import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";

type Variant = "primary" | "ghost";

const base =
  "group relative inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-[15px] font-semibold " +
  "transition-[transform,background-color,border-color,color] duration-300 ease-out active:scale-[.97] select-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-lav text-bg hover:bg-[rgb(var(--solid-hover))]",
  ghost: "border border-lav/25 text-ink hover:border-lav/60 hover:bg-lav/10",
};

type CommonProps = { variant?: Variant; children: ReactNode; className?: string };

export const Button = forwardRef<HTMLButtonElement, CommonProps & ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ variant = "primary", className, children, ...rest }, ref) => (
    <button ref={ref} className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  )
);
Button.displayName = "Button";

export function LinkButton({
  to,
  href,
  variant = "primary",
  className,
  children,
  ...rest
}: CommonProps & { to?: string; href?: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const cls = cn(base, variants[variant], className);
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  return <a href={href} className={cls} {...rest}>{children}</a>;
}