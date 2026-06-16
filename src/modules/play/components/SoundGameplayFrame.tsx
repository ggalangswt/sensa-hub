"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { SoundStartPayload } from "../types/play.types";
import type { SoundMatchSubmission } from "../utils/sound";

const GAME_URL =
  process.env.NEXT_PUBLIC_SENSA_SOUND_GAME_URL ?? "http://127.0.0.1:4173";

export default function SoundGameplayFrame({
  config,
  roomId,
  walletAddress,
  onComplete,
  onError,
}: {
  config: SoundStartPayload;
  roomId: string;
  walletAddress?: string;
  onComplete: (submission: SoundMatchSubmission) => void;
  onError: (message: string) => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [frameReady, setFrameReady] = useState(false);

  const iframeSrc = useMemo(() => GAME_URL, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data as
        | { type?: string; payload?: unknown }
        | undefined;
      if (!data?.type) return;

      if (data.type === "sensa-sound:ready") {
        setFrameReady(true);
        return;
      }

      if (data.type === "sensa-sound:error") {
        const payload = data.payload as { message?: string } | undefined;
        onError(payload?.message ?? "Gameplay runtime failed.");
        return;
      }

      if (data.type === "sensa-sound:match-complete") {
        const payload = data.payload as
          | { submission?: SoundMatchSubmission }
          | undefined;
        if (!payload?.submission) {
          onError("Gameplay completed without a valid submission payload.");
          return;
        }
        onComplete(payload.submission);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onComplete, onError]);

  useEffect(() => {
    if (!frameReady || !iframeRef.current?.contentWindow) return;

    iframeRef.current.contentWindow.postMessage(
      {
        type: "sensa-sound:init",
        payload: {
          matchId: config.roundId,
          roomId,
          walletAddress: walletAddress ?? "",
          difficulty: config.difficulty,
          octaveShift: config.octaveShift,
        },
      },
      "*",
    );
  }, [config, frameReady, roomId, walletAddress]);

  return (
    <div className="mx-auto max-w-md page-enter">
      <div className="mb-3 flex items-center justify-between gap-3">
        <Badge>Sound gameplay</Badge>
        <p className="text-xs text-foreground/60">
          {config.difficulty.toUpperCase()}
          {config.octaveShift === 1
            ? " · +8va"
            : config.octaveShift === -1
              ? " · -8va"
              : ""}
        </p>
      </div>
      <div className="overflow-hidden rounded-[28px] border border-border/20 bg-black shadow-shadow">
        <iframe
          ref={iframeRef}
          title="Sensa Sound Gameplay"
          src={iframeSrc}
          className="h-[78svh] min-h-[620px] w-full border-0 bg-black"
          allow="autoplay"
        />
      </div>
    </div>
  );
}
