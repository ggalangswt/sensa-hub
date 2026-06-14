"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Share2, Vault } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import UsdcIcon from "@/src/components/elements/UsdcIcon";
import { hslCss } from "@/src/utils/color";
import type { HSL } from "@/src/utils/color";
import type { Mode } from "../types/play.types";

export default function ResultScene({
  target,
  guess,
  acc,
  tier,
  isPractice,
  soloRefunded,
  onAgain,
}: {
  target: HSL;
  guess: HSL;
  acc: number;
  tier: { name: string; payout: number; color: string };
  deltaE: number;
  isPractice: boolean;
  mode: Mode;
  matchedPlayers: string[];
  soloRefunded: boolean;
  onAgain: () => void;
}) {
  const [displayAcc, setDisplayAcc] = useState(0);
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    const duration = 1200;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setDisplayAcc((1 - Math.pow(2, -10 * progress)) * acc);
      if (progress < 1) requestAnimationFrame(step);
      else setTimeout(() => setShowLabel(true), 400);
    };
    requestAnimationFrame(step);
  }, [acc]);

  const tierExpression = useMemo(() => {
    if (acc >= 98) return "Pixel perfect";
    if (acc >= 95) return "Great match";
    if (acc >= 90) return "Good match";
    if (acc >= 80) return "Close enough";
    return "Try another round";
  }, [acc]);

  return (
    <div className="game-zone max-w-3xl mx-auto page-enter">
      <div
        className="relative w-full rounded-2xl overflow-hidden border-2 border-border shadow-shadow flex flex-col"
        style={{ minHeight: "min(65vh,550px)" }}
      >
        <div className="relative flex-1 p-6 flex flex-col justify-between" style={{ background: hslCss(guess) }}>
          <div className="flex justify-end items-start w-full">
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 delay-150 fill-mode-both flex flex-col items-end text-right">
              <div className="text-[64px] sm:text-[80px] font-heading text-white leading-none flex items-baseline justify-end gap-1">
                {displayAcc.toFixed(1)}
                <span className="text-3xl text-white/60">%</span>
              </div>
              <div
                className={`text-white/90 text-2xl font-heading mt-2 transition-all duration-500 ${showLabel ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
              >
                {tierExpression}
              </div>
            </div>
          </div>
          <div>
            <p className="text-white/50 text-xs mb-1 uppercase tracking-wider">Your selection</p>
            <p className="text-white font-heading text-sm">
              H{Math.round(guess.h)} S{Math.round(guess.s)} L{Math.round(guess.l)}
            </p>
          </div>
        </div>

        <div className="relative flex-1 p-6 flex flex-col justify-between" style={{ background: hslCss(target) }}>
          <div className="flex justify-end">
            {!isPractice && (
              <div className="text-right animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both bg-black/55 border-2 border-white px-4 py-2 rounded-base">
                <p className="text-white/70 text-xs uppercase tracking-wider mb-1">
                  {soloRefunded ? "Stake refunded to Vault" : tier.payout > 0 ? `Earned (${tier.name})` : "No payout"}
                </p>
                <p className="text-white font-heading text-3xl">
                  <span className="inline-flex items-center gap-2">
                    {soloRefunded || tier.payout > 0 ? "+" : ""}
                    {soloRefunded ? 5 : tier.payout} <UsdcIcon size={18} />
                  </span>
                </p>
                {soloRefunded && (
                  <p className="mt-1 max-w-[220px] text-xs text-white/70">
                    Reserve was too low. Your entry stake is back in Vault.
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-white/50 text-xs mb-1 uppercase tracking-wider">Target</p>
              <p className="text-white font-heading text-sm">
                H{Math.round(target.h)} S{Math.round(target.s)} L{Math.round(target.l)}
              </p>
            </div>
            <button
              onClick={onAgain}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border-2 border-border shadow-shadow flex items-center justify-center hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all cursor-pointer animate-in fade-in zoom-in-50 duration-500 delay-700 fill-mode-both"
            >
              <ArrowRight className="w-6 h-6 text-foreground" />
            </button>
          </div>
        </div>
      </div>

      {!isPractice && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button variant="neutral" asChild className="gap-2">
            <Link href="/vault"><Vault className="w-4 h-4" /> Open Vault</Link>
          </Button>
          <Button variant="neutral" className="gap-2">
            <Share2 className="w-4 h-4" /> Share
          </Button>
        </div>
      )}
    </div>
  );
}
