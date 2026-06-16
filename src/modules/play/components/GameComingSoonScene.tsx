"use client";

import Link from "next/link";
import { ArrowLeft, Clock3, Shapes } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RouteHeader } from "@/src/components/ui/mobile-primitives";

const GAME_COPY = {
  shape: {
    title: "Sensa Shape",
    icon: Shapes,
    description: "Pattern and form memory is next in the Sensa game library.",
    skills: ["Pattern memory", "Shape recall", "Coming soon"],
  },
  time: {
    title: "Sensa Time",
    icon: Clock3,
    description: "Timing challenges are being prepared for the same room, Vault, and Withdraw loop.",
    skills: ["Timing", "Rhythm", "Coming soon"],
  },
} as const;

export default function GameComingSoonScene({ game }: { game: keyof typeof GAME_COPY }) {
  const meta = GAME_COPY[game];
  const Icon = meta.icon;

  return (
    <div className="mx-auto max-w-2xl page-enter">
      <RouteHeader
        eyebrow={<Badge>Coming soon</Badge>}
        title={meta.title}
        description="This game is visible in the hub, but not playable yet."
        action={
          <Button variant="neutral" size="sm" asChild>
            <Link href="/play">
              <ArrowLeft className="h-4 w-4" />
              Games
            </Link>
          </Button>
        }
      />

      <Card className="bg-[var(--console-screen)]">
        <CardContent className="p-5 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] border border-border/25 bg-main text-main-foreground shadow-[inset_0_-3px_0_rgb(66_32_87_/_0.16)]">
            <Icon className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-2xl font-heading text-foreground">{meta.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/70">{meta.description}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {meta.skills.map((skill) => (
              <Badge key={skill} variant="neutral">
                {skill}
              </Badge>
            ))}
          </div>
          <Button className="mt-6 w-full gap-2" asChild>
            <Link href="/play">
              <ArrowLeft className="h-4 w-4" />
              Back to games
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
