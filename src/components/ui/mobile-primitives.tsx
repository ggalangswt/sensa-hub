import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/src/utils/utils";

export function RouteHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-4 flex items-start justify-between gap-3 sm:mb-5 sm:gap-4", className)}>
      <div className="min-w-0">
        {eyebrow && <div className="mb-2 flex items-center gap-2">{eyebrow}</div>}
        <h1 className="text-2xl font-heading leading-tight text-foreground text-balance sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-[34rem] text-sm leading-normal text-foreground/70 text-pretty sm:leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}

export function TrustStatusStrip({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: "info" | "success" | "warning" | "danger" | "dark";
  title: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  const toneClass = {
    info: "bg-chart-5/10",
    success: "bg-chart-2/12",
    warning: "bg-chart-3/20",
    danger: "bg-chart-4/10",
    dark: "bg-foreground text-background border-foreground",
  }[tone];
  const Icon = tone === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div
      className={cn(
        "rounded-base border border-border/20 p-3 shadow-shadow sm:p-4",
        toneClass,
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-1 flex h-2.5 w-2.5 shrink-0 rounded-full bg-current opacity-80" aria-hidden="true" />
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-heading text-sm leading-tight">
            <Icon className="h-3.5 w-3.5" />
            {title}
          </p>
          {children && <div className="mt-1 text-xs leading-normal opacity-75 sm:leading-relaxed">{children}</div>}
        </div>
      </div>
    </div>
  );
}

export function PrimaryActionBar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "sticky bottom-[4.75rem] z-20 -mx-4 mt-4 border-t-2 border-border bg-background/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function MoneyStateBlock({
  label,
  value,
  helper,
  action,
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  helper?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[20px] border border-border/20 bg-foreground p-4 text-background shadow-shadow sm:p-5",
        className,
      )}
    >
      <p className="text-xs font-heading uppercase tracking-wide opacity-70">{label}</p>
      <div className="mt-2 text-3xl font-heading leading-none sm:text-4xl">{value}</div>
      {helper && <div className="mt-3 text-sm leading-normal opacity-80 sm:leading-relaxed">{helper}</div>}
      {action && <div className="mt-4 sm:mt-5">{action}</div>}
    </section>
  );
}
