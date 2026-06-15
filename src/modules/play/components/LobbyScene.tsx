"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Copy,
  Crown,
  Loader2,
  Play,
  Users,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PrimaryActionBar,
  RouteHeader,
  TrustStatusStrip,
} from "@/src/components/ui/mobile-primitives";
import UsdcIcon from "@/src/components/elements/UsdcIcon";
import { shortAddr } from "@/src/utils/address";
import { fetchPlayerNames } from "../services/rooms.service";
import type { Room } from "../types/play.types";
import { showSuccessToast } from "@/src/utils/toast";

export default function LobbyScene({
  room,
  myAddress,
  readying,
  onLeave,
  onCancel,
  onKick,
  onToggleReady,
  onStart,
}: {
  room: Room;
  myAddress: string;
  readying: boolean;
  onLeave: () => void;
  onCancel: () => void;
  onKick: (target: string) => void;
  onToggleReady: () => void;
  onStart: () => void;
}) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [names, setNames] = useState<Record<string, string | null>>({});

  const isMe = (addr: string) => addr.toLowerCase() === myAddress.toLowerCase();
  const amLeader = room.leader.toLowerCase() === myAddress.toLowerCase();
  const me = room.players.find((p) => isMe(p.address));
  const allReady = room.players.every((p) => p.status === "ready");
  const isFull = room.players.length >= room.maxPlayers;
  const canStart = amLeader && allReady && isFull;
  const statusCopy = !isFull
    ? `Waiting for players (${room.players.length}/${room.maxPlayers})`
    : !allReady
      ? room.paid
        ? "Waiting for every player to Deposit and ready"
        : "Waiting for every player to ready"
      : amLeader
        ? "Everyone is ready. Start the game."
        : "Waiting for leader to start";

  useEffect(() => {
    if (room.players.length === 0) return;
    const addrs = room.players.map((p) => p.address.toLowerCase());
    fetchPlayerNames(addrs)
      .then(setNames)
      .catch(() => {});
  }, [room.players]);

  const copyLink = () => {
    const url = window.location.origin + "/play/lobby/" + room.code;
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopiedCode(true);
    showSuccessToast("Invite link copied", {
      description: "Share it with friends to bring them into this room.",
      id: "room-link-copied",
    });
    setTimeout(() => setCopiedCode(false), 1500);
  };

  return (
    <div className="max-w-2xl mx-auto page-enter">
      <RouteHeader
        eyebrow={
          <Badge className={room.paid ? "" : "bg-chart-2 text-foreground"}>
            {room.paid ? "Paid room" : "Casual room"}
          </Badge>
        }
        title={room.name || "Room lobby"}
        description={
          <>
            {room.players.length}/{room.maxPlayers} players ·{" "}
            {room.paid ? (
              <>
                {room.stakeAmount} <UsdcIcon size={12} /> Deposit each
              </>
            ) : (
              "No Stablecoin Deposit"
            )}
          </>
        }
      />

      <div className="mb-4 rounded-[22px] border border-border/20 bg-[var(--console-shell)] p-4 text-background shadow-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-0.5 text-xs uppercase tracking-wider opacity-65">Room code</p>
            <p className="text-2xl font-heading tracking-[0.3em] text-main">{room.code}</p>
          </div>
          <Button variant="neutral" size="sm" className="gap-1.5" onClick={copyLink}>
            {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedCode ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="w-4 h-4" /> Players
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {room.players.map((player) => {
              const isLeaderPlayer = player.address.toLowerCase() === room.leader.toLowerCase();
              const isSelf = isMe(player.address);
              const displayName = names[player.address.toLowerCase()] ?? shortAddr(player.address);
              return (
                <div
                  key={player.address}
                  className={`flex items-center justify-between p-3 rounded-[16px] border transition-all ${
                    player.status === "ready"
                      ? "border-chart-2/35 bg-chart-2/10"
                      : "border-border/20 bg-secondary-background"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 ${
                        player.status === "ready"
                          ? "bg-chart-2/20 border-chart-2/45 text-foreground"
                          : "bg-secondary-background border-border/25 text-foreground/30"
                      }`}
                    >
                      {player.status === "ready" ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span className="text-xs">?</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-heading text-sm truncate">{displayName}</span>
                        {isLeaderPlayer && (
                            <Badge className="text-xs gap-1">
                            <Crown className="w-3 h-3" /> Leader
                          </Badge>
                        )}
                        {isSelf && (
                          <Badge className="bg-foreground text-background text-xs">You</Badge>
                        )}
                      </div>
                      {displayName !== shortAddr(player.address) && (
                        <p className="text-[10px] text-foreground/45 font-mono truncate">
                          {shortAddr(player.address)}
                        </p>
                      )}
                      <span
                        className={`text-xs font-heading ${
                          player.status === "ready" ? "text-foreground" : "text-foreground/40"
                        }`}
                      >
                        {player.status === "ready" ? "Ready" : "Not Ready"}
                        {room.paid && player.staked && " · Deposited"}
                      </span>
                    </div>
                  </div>
                  {amLeader && !isSelf && (
                    <button
                      onClick={() => onKick(player.address)}
                      className="flex h-11 w-11 flex-shrink-0 cursor-pointer items-center justify-center rounded-full border border-border/25 bg-secondary-background text-foreground/40 transition-all hover:border-chart-4 hover:bg-chart-4/10 hover:text-chart-4"
                      aria-label="Remove player"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
            {Array.from({ length: room.maxPlayers - room.players.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex items-center gap-3 p-3 rounded-[16px] border border-dashed border-border/35 bg-secondary-background/50"
              >
                <div className="w-8 h-8 rounded-full border border-border/30 bg-secondary-background flex items-center justify-center text-foreground/20">
                  <span className="text-xs">?</span>
                </div>
                <span className="text-sm text-foreground/35 font-heading">Open seat</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <TrustStatusStrip
        tone={canStart ? "success" : "warning"}
        title={statusCopy}
        className="mb-4"
      >
        {room.paid
          ? "Paid rooms start after every player has Deposited and readied."
          : "Casual rooms start after everyone is ready."}
      </TrustStatusStrip>

      <PrimaryActionBar>
        <div className="flex flex-col gap-3">
          {me && me.status !== "ready" && (
            <Button
              className="w-full gap-2"
              size="lg"
              disabled={readying}
              onClick={onToggleReady}
            >
              {readying ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> {room.paid ? "Depositing..." : "Readying..."}</>
              ) : (
                <><Check className="w-4 h-4" /> {room.paid ? "Deposit & ready" : "Ready up"}</>
              )}
            </Button>
          )}
          {me && me.status === "ready" && !amLeader && (
            <div className="text-center py-2">
              <Badge className="bg-chart-2/20 text-foreground gap-1.5">
                <Check className="w-3.5 h-3.5" /> You are ready · waiting for leader
              </Badge>
            </div>
          )}
          {amLeader && (
            <Button
              className="w-full gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              size="lg"
              disabled={!canStart}
              onClick={onStart}
            >
              <Play className="w-5 h-5" />
              {!isFull
                ? `Waiting for players (${room.players.length}/${room.maxPlayers})`
                : !allReady
                  ? "Waiting for all players to ready"
                  : "Start game"}
            </Button>
          )}
          <div className="grid grid-cols-1 gap-2">
            {amLeader ? (
              <Button variant="neutral" className="w-full gap-2" onClick={onCancel}>
                <X className="w-4 h-4" /> Cancel room
              </Button>
            ) : (
              <Button variant="neutral" className="w-full gap-2" onClick={onLeave}>
                <ArrowLeft className="w-4 h-4" /> Leave room
              </Button>
            )}
          </div>
        </div>
      </PrimaryActionBar>
    </div>
  );
}
