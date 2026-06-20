"use client";

import { Badge } from "@/components/ui/badge";

export default function SoundWaitingScene({
  totalScore,
  percentScore,
}: {
  totalScore: number;
  percentScore: number;
}) {
  return (
    <div className="mx-auto max-w-md page-enter">
      <div className="rounded-base border-2 border-foreground bg-[var(--console-screen)] p-5 shadow-[4px_4px_0_var(--foreground)]">
        <div className="flex items-center justify-between gap-3">
          <Badge>Result submitted</Badge>
          <span className="text-xs font-heading text-foreground/60">
            Waiting for settlement
          </span>
        </div>
        <div className="mt-7 rounded-base bg-foreground p-5 text-center text-background">
          <p className="text-sm text-background/70">Your sound match total</p>
          <div className="mt-2 font-heading text-5xl text-main">
            {totalScore.toFixed(2)}
            <span className="ml-1 text-2xl text-background/60">/50</span>
          </div>
          <p className="mt-2 text-lg font-heading text-background">
            {percentScore.toFixed(1)}%
          </p>
        </div>
        <div className="mt-5 rounded-base bg-main p-4 text-sm text-main-foreground">
          Your full 5-round run is locked in. Sensa is waiting for the rest of
          the room and final settlement.
        </div>
      </div>
    </div>
  );
}
