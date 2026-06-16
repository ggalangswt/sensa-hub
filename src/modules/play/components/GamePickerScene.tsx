"use client";

import Link from "next/link";
import { ArrowRight, Brain, Clock3, Shapes, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RouteHeader } from "@/src/components/ui/mobile-primitives";

type GameCard = {
  key: "sound" | "shape" | "time";
  title: string;
  href: string;
  status: "live" | "soon";
  description: string;
  icon: typeof Volume2;
};

const GAMES: GameCard[] = [
  {
    key: "sound",
    title: "Sensa Sound",
    href: "/play/sound",
    status: "live",
    description: "Short sound-memory rounds. Practice free or enter Stablecoin rooms.",
    icon: Volume2,
  },
  {
    key: "shape",
    title: "Sensa Shape",
    href: "/play/shape",
    status: "soon",
    description: "Pattern memory challenges are next in the library.",
    icon: Shapes,
  },
  {
    key: "time",
    title: "Sensa Time",
    href: "/play/time",
    status: "soon",
    description: "Timing challenges are planned for a later release.",
    icon: Clock3,
  },
];

export default function GamePickerScene() {
  return (
    <div className="mx-auto max-w-2xl page-enter">
      <RouteHeader
        eyebrow={
          <Badge className="gap-1.5">
            <Brain className="h-3.5 w-3.5" />
            Game library
          </Badge>
        }
        title="Pick a brain game"
        description="Choose the skill you want to train first. Each game keeps the same MiniPay-first room, Vault, and Withdraw loop."
      />

      <div className="grid gap-3">
        {GAMES.map((game) => {
          const Icon = game.icon;
          const isLive = game.status === "live";

          return (
            <Card
              key={game.key}
              className={isLive ? "bg-main" : "bg-[var(--console-screen)]"}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-base border border-border/20 bg-secondary-background text-foreground">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="font-heading text-lg leading-tight text-foreground">
                        {game.title}
                      </h2>
                      <span className="shrink-0 rounded-full border border-border/20 bg-secondary-background px-2.5 py-1 text-[11px] font-heading leading-none text-foreground">
                        {isLive ? "Live" : "Soon"}
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-normal text-foreground/72">
                      {game.description}
                    </p>

                    <Button
                      className="mt-4 w-full gap-2"
                      variant={isLive ? "default" : "neutral"}
                      asChild
                    >
                      <Link href={game.href}>
                        {isLive ? "Open game" : "View status"}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
