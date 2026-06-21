"use client";

import { LoaderCircle, LogOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SoundRoundLoadingScene({
  error,
  onRetry,
  onExit,
}: {
  error: string | null;
  onRetry: () => void;
  onExit: () => void;
}) {
  return (
    <div className="mx-auto max-w-md page-enter">
      <div className="rounded-base border-2 border-foreground bg-[var(--console-screen)] p-5 shadow-[4px_4px_0_var(--foreground)]">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-base bg-foreground text-main">
            <LoaderCircle
              className={`size-5 ${error ? "" : "animate-spin"}`}
              aria-hidden="true"
            />
          </span>
          <div>
            <h1 className="font-heading text-xl">Loading sound round</h1>
            <p className="mt-1 text-sm text-foreground/70">
              {error
                ? "The round is safe, but its sound config could not be loaded."
                : "Getting the same five tones for every player."}
            </p>
          </div>
        </div>

        {error && (
          <>
            <div className="mt-5 rounded-base bg-main p-3 text-sm text-main-foreground">
              {error}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button onClick={onRetry} className="gap-2">
                <RefreshCw className="size-4" />
                Retry
              </Button>
              <Button variant="neutral" onClick={onExit} className="gap-2">
                <LogOut className="size-4" />
                Exit
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
