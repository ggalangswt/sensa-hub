"use client";

import Link from "next/link";
import { LogOut, Vault } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PlayerActions({
  onDisconnect,
}: {
  onDisconnect: () => void;
}) {
  return (
    <div className="flex items-center gap-2 border-t border-border/20 bg-secondary-background p-3 sm:p-4">
      <Button asChild className="flex-1">
        <Link href="/vault">
          <Vault />
          Open Vault
        </Link>
      </Button>
      <Button
        type="button"
        variant="neutral"
        size="icon"
        onClick={onDisconnect}
        aria-label="Disconnect wallet"
      >
        <LogOut />
      </Button>
    </div>
  );
}
