"use client";

import { ArrowLeft, AudioLines } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RouteHeader } from "@/src/components/ui/mobile-primitives";

export default function SoundPageHeader({
  onlineCount,
  showBackToGames,
  onBackToGames,
}: {
  onlineCount: number | null;
  showBackToGames?: boolean;
  onBackToGames?: () => void;
}) {
  return (
    <RouteHeader
      eyebrow={
        <Badge className="gap-1.5 border-foreground/40 bg-foreground text-main">
          <AudioLines className="size-3" />
          {onlineCount !== null ? `${onlineCount} online` : "Sound ready"}
        </Badge>
      }
      title="Sensa Sound"
      description="Listen, remember, and tune the tone."
      action={
        showBackToGames && onBackToGames ? (
          <Button variant="neutral" size="sm" onClick={onBackToGames}>
            <ArrowLeft />
            Games
          </Button>
        ) : undefined
      }
    />
  );
}
