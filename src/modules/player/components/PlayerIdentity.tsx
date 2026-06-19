"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { shortenAddress } from "@/src/provider/WalletContext";

export default function PlayerIdentity({
  address,
  displayName,
  editing,
  onEdit,
}: {
  address: string;
  displayName: string | null;
  editing: boolean;
  onEdit: () => void;
}) {
  const initials = displayName?.trim().slice(0, 2) || address.slice(2, 4);

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex size-12 shrink-0 items-center justify-center rounded-base bg-main font-heading text-sm uppercase text-main-foreground"
        aria-hidden="true"
      >
        {initials}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-heading leading-tight text-foreground">
          {displayName ?? "Choose a player name"}
        </p>
        <p className="mt-1 truncate text-sm text-foreground/70">
          {shortenAddress(address)}
        </p>
      </div>

      {!editing && (
        <Button
          type="button"
          variant="neutral"
          size="icon"
          onClick={onEdit}
          aria-label="Edit player name"
        >
          <Pencil />
        </Button>
      )}
    </div>
  );
}
