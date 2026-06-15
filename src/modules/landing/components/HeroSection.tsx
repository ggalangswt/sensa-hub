"use client";

import { ArrowRight, Brain, Layers3, Shield, Timer, Vault, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/src/provider/WalletContext";

export default function HeroSection({ onPlay }: { onPlay: () => void }) {
  const { isConnected } = useWallet();

  return (
    <section className="landing-hero px-4 py-10 sm:py-16">
      <div className="relative z-10 mx-auto max-w-3xl rounded-[28px] border border-border/20 bg-[var(--console-shell)] p-3 text-center shadow-[0_20px_48px_rgb(66_32_87_/_0.22)] sm:p-5">
        <div className="rounded-[22px] border border-white/10 bg-[var(--console-screen)] px-4 py-8 shadow-[inset_0_0_0_1px_rgb(66_32_87_/_0.08)] sm:px-8 sm:py-12">
        <Badge className="mb-5 text-sm sm:mb-6">Brain skill games on Celo</Badge>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading leading-tight mb-5 sm:mb-6 text-foreground">
          Train Fast.<br />
          <span className="inline-flex items-center gap-3 text-foreground">
            Play sharper.
          </span>
        </h1>
        <p className="text-base sm:text-xl text-foreground/70 mb-7 sm:mb-10 max-w-xl mx-auto font-base leading-relaxed">
          Sensa is a hub for quick brain-skill games: memory, timing, pattern recognition, and focus. Play free, create private rooms, or Deposit Stablecoin and Withdraw from Vault.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="w-full text-base sm:w-auto sm:text-lg gap-2" onClick={onPlay} variant={isConnected ? "default" : "neutral"}>
            {isConnected ? (
              <><Zap className="w-5 h-5" /> Play Now <ArrowRight className="w-5 h-5" /></>
            ) : (
              <><Shield className="w-5 h-5" /> Start in MiniPay <ArrowRight className="w-5 h-5" /></>
            )}
          </Button>
          <Button variant="neutral" size="lg" className="w-full text-base sm:w-auto sm:text-lg gap-2" asChild>
            <a href="#how-it-works">Learn More</a>
          </Button>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-foreground/60 sm:mt-12 sm:gap-4">
          <span className="flex items-center gap-1"><Brain className="w-4 h-4" /> Memory</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Timer className="w-4 h-4" /> Timing</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Layers3 className="w-4 h-4" /> Patterns</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Vault className="w-4 h-4" /> Vault Withdraw</span>
        </div>
        </div>
      </div>
    </section>
  );
}
