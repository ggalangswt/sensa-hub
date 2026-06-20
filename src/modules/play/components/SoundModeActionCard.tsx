"use client";

import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

export default function SoundModeActionCard({
  icon,
  title,
  description,
  meta,
  cta,
  tone = "light",
  onClick,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  meta: ReactNode;
  cta: string;
  tone?: "light" | "dark";
  onClick: () => void;
}) {
  const dark = tone === "dark";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full rounded-base border-2 p-4 text-left transition-transform duration-150 active:translate-x-0.5 active:translate-y-0.5 ${
        dark
          ? "border-foreground bg-foreground text-background shadow-[3px_3px_0_var(--main)]"
          : "border-foreground bg-[var(--console-screen)] text-foreground shadow-[3px_3px_0_var(--foreground)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-base ${
            dark
              ? "bg-main text-main-foreground"
              : "bg-foreground text-main"
          }`}
        >
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-start justify-between gap-3">
            <span className="font-heading text-lg leading-tight">{title}</span>
            <span
              className="inline-flex shrink-0 items-center gap-1 rounded-base bg-main px-2 py-1 text-xs font-heading text-main-foreground"
            >
              {cta}
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </span>
          <span
            className={`mt-1 block text-sm leading-normal ${
              dark ? "text-background/75" : "text-foreground/72"
            }`}
          >
            {description}
          </span>
          <span className="mt-3 flex flex-wrap gap-2">{meta}</span>
        </span>
      </div>
    </button>
  );
}
