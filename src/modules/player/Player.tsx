"use client";

import { useState } from "react";
import AppLayout from "@/src/components/layouts/AppLayout";
import { RouteHeader } from "@/src/components/ui/mobile-primitives";
import { useWallet } from "@/src/provider/WalletContext";
import { showSuccessToast } from "@/src/utils/toast";
import PlayerActions from "./components/PlayerActions";
import PlayerIdentity from "./components/PlayerIdentity";
import PlayerNameForm from "./components/PlayerNameForm";
import { updatePlayerName } from "./services/player.service";

export default function Player() {
  const { address, disconnect, displayName, refreshProfile } = useWallet();
  const [editingName, setEditingName] = useState(false);

  const saveName = async (name: string) => {
    if (!address) return;

    const result = await updatePlayerName(address, name);
    if (result.error) throw new Error(result.error);

    await refreshProfile();
    setEditingName(false);
    showSuccessToast("Player name updated", {
      description: "Shown in rooms and standings.",
      id: "player-name-updated",
    });
  };

  return (
    <AppLayout>
      <main className="mx-auto max-w-lg page-enter">
        <RouteHeader title="Player" />

        <section className="overflow-hidden rounded-base border border-border/25 bg-[var(--console-screen)] shadow-shadow">
          <div className="p-4 sm:p-5">
            {address && (
              <PlayerIdentity
                address={address}
                displayName={displayName}
                editing={editingName}
                onEdit={() => setEditingName(true)}
              />
            )}

            {editingName && address && (
              <PlayerNameForm
                currentName={displayName ?? ""}
                onSave={saveName}
                onCancel={() => setEditingName(false)}
              />
            )}
          </div>

          <PlayerActions onDisconnect={disconnect} />
        </section>
      </main>
    </AppLayout>
  );
}
