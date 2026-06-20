"use client";

import { RotateCcw, Vault } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UsdcIcon from "@/src/components/elements/UsdcIcon";

export default function SoundResultScene({
  totalScore,
  percentScore,
  payout,
  label,
  isPractice,
  soloRefunded,
  onAgain,
}: {
  totalScore: number;
  percentScore: number;
  payout: number;
  label: string;
  isPractice: boolean;
  soloRefunded: boolean;
  onAgain: () => void;
}) {
  return (
    <div className="mx-auto max-w-md page-enter">
      <div className="rounded-base border-2 border-foreground bg-[var(--console-screen)] p-5 shadow-[4px_4px_0_var(--foreground)]">
        <div className="flex items-center justify-between gap-3">
          <Badge>{label}</Badge>
          <span className="text-xs font-heading text-foreground/60">
            Sound match complete
          </span>
        </div>

        <div className="mt-7 rounded-base bg-foreground p-5 text-center text-background">
          <p className="text-sm text-background/70">Final total</p>
          <div className="mt-2 font-heading text-5xl text-main">
            {totalScore.toFixed(2)}
            <span className="ml-1 text-2xl text-background/60">/50</span>
          </div>
          <p className="mt-2 text-lg font-heading text-background">
            {percentScore.toFixed(1)}%
          </p>
        </div>

        {!isPractice && (
          <div className="mt-5 rounded-base bg-main p-4 text-main-foreground">
            <p className="text-xs font-heading text-main-foreground/70">
              {soloRefunded ? "Stake refunded to Vault" : payout > 0 ? "Vault credit" : "No payout"}
            </p>
            <div className="mt-2 flex items-center gap-2 text-3xl font-heading">
              <span>{soloRefunded || payout > 0 ? "+" : ""}{soloRefunded ? 1 : payout}</span>
              <UsdcIcon size={22} />
            </div>
            {soloRefunded && (
              <p className="mt-2 text-sm text-main-foreground/75">
                Solo reserve was too low for this prize, so your entry stake is
                back in Vault.
              </p>
            )}
          </div>
        )}

        <div className={`mt-6 grid gap-3 ${isPractice ? "grid-cols-1" : "grid-cols-2"}`}>
          <Button onClick={onAgain} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Play again
          </Button>
          {!isPractice && (
            <Button variant="neutral" asChild className="gap-2">
              <Link href="/vault">
                <Vault className="h-4 w-4" />
                Open Vault
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
