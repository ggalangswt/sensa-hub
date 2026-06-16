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
      <div className="rounded-[28px] border border-border/20 bg-[var(--console-screen)] p-6 shadow-shadow">
        <div className="flex items-center justify-between gap-3">
          <Badge>Result submitted</Badge>
          <span className="text-xs font-heading text-foreground/60">
            Waiting for settlement
          </span>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-foreground/60">Your sound match total</p>
          <div className="mt-2 font-heading text-5xl text-foreground">
            {totalScore.toFixed(2)}
            <span className="ml-1 text-2xl text-foreground/55">/50</span>
          </div>
          <p className="mt-2 text-lg font-heading text-foreground/75">
            {percentScore.toFixed(1)}%
          </p>
        </div>
        <div className="mt-8 rounded-[20px] border border-border/15 bg-white/70 p-4 text-sm text-foreground/72">
          Your full 5-round run is locked in. Sensa is waiting for the rest of
          the room and final on-chain settlement.
        </div>
      </div>
    </div>
  );
}
