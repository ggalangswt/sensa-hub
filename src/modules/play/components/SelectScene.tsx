"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Crown,
  Gamepad2,
  Globe,
  Loader2,
  Play,
  Swords,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  RouteHeader,
  TrustStatusStrip,
} from "@/src/components/ui/mobile-primitives";
import UsdcIcon from "@/src/components/elements/UsdcIcon";
import { formatCompactUsdc } from "@/src/utils/utils";
import type { Mode, TabKey } from "../types/play.types";
import { STAKE_PRESETS } from "../types/play.types";
import type { TargetDifficulty } from "@/src/utils/color";

type RoomPanel = "closed" | "choose" | "create" | "join" | "online";

function ModeActionCard({
  icon,
  title,
  description,
  meta,
  cta,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  meta: ReactNode;
  cta: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-base border-2 border-border bg-secondary-background p-3 text-left shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none sm:p-4"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-base border-2 border-border bg-main text-main-foreground">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-heading text-lg leading-tight text-foreground">
              {title}
            </h2>
            <span className="inline-flex items-center gap-1 rounded-base border-2 border-border bg-background px-2 py-1 text-xs font-heading text-foreground">
              {cta}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
          <p className="mt-1 text-sm leading-normal text-foreground/70">
            {description}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">{meta}</div>
        </div>
      </div>
    </button>
  );
}

export default function SelectScene({
  tab,
  setTab,
  onStart,
  onCreateRoom,
  onJoinRoom,
  onJoinOnline,
  onlineCount,
  soloReserveBalance,
  roomLoading,
}: {
  tab: TabKey;
  setTab: (t: TabKey) => void;
  onStart: (
    m: Mode,
    opts?: { practice?: boolean; difficulty?: TargetDifficulty },
  ) => void;
  onCreateRoom: (input: {
    name: string;
    maxPlayers: number;
    paid: boolean;
    stakeAmount: number;
    difficulty: TargetDifficulty;
  }) => void;
  onJoinRoom: (code: string) => void;
  onJoinOnline: (mode: "duel" | "royale") => void;
  onlineCount: number | null;
  soloReserveBalance: number;
  roomLoading?: string | null;
}) {
  const [panel, setPanel] = useState<RoomPanel>("closed");
  const [roomName, setRoomName] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [isPaid, setIsPaid] = useState(false);
  const [stakeAmount, setStakeAmount] = useState(1);
  const [joinCode, setJoinCode] = useState("");

  const resetPanel = () => {
    setPanel("closed");
    setRoomName("");
    setMaxPlayers(2);
    setIsPaid(false);
    setStakeAmount(1);
    setJoinCode("");
  };

  return (
    <div className="mx-auto max-w-2xl page-enter">
      <RouteHeader
        eyebrow={
          <Badge className="gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-chart-2" />
            {onlineCount !== null ? `${onlineCount} online` : "Ready"}
          </Badge>
        }
        title="Choose your next round"
        description="Practice free, play solo, or bring friends into a private room. Money states stay visible before you Deposit."
      />

      <div className="mb-4 grid grid-cols-2 gap-2">
        <Button
          variant={tab === "single" ? "default" : "neutral"}
          onClick={() => setTab("single")}
          className="gap-2"
        >
          <Gamepad2 className="h-4 w-4" /> Solo
        </Button>
        <Button
          variant={tab === "multi" ? "default" : "neutral"}
          onClick={() => setTab("multi")}
          className="gap-2"
        >
          <Users className="h-4 w-4" /> Friends
        </Button>
      </div>

      {tab === "single" ? (
        <div className="flex flex-col gap-3">
          <ModeActionCard
            icon={<Play className="h-5 w-5" />}
            title="Practice"
            description="Free warm-up round. No Deposit, no vault movement, just train the skill loop."
            cta="Start"
            onClick={() => onStart("solo", { practice: true })}
            meta={
              <>
                <Badge variant="neutral">Free</Badge>
                <Badge variant="neutral">No timer</Badge>
                <Badge variant="neutral">No Stablecoin</Badge>
              </>
            }
          />

          <ModeActionCard
            icon={<Swords className="h-5 w-5" />}
            title="Solo stake"
            description="Deposit 5 USDC, play a short skill round, then winnings or refunds appear in Vault."
            cta="Play"
            onClick={() => onStart("solo")}
            meta={
              <>
                <Badge className="gap-1">
                  5 <UsdcIcon size={12} />
                </Badge>
                <Badge variant="neutral">Vault payout</Badge>
                <Badge variant="neutral">Network fee applies</Badge>
              </>
            }
          />

          <TrustStatusStrip
            tone={soloReserveBalance >= 5 ? "info" : "warning"}
            title={
              soloReserveBalance >= 5
                ? "Solo reserve can cover payouts"
                : "Low reserve: stake may refund"
            }
          >
            Current reserve is {formatCompactUsdc(soloReserveBalance)} USDC. If
            the prize reserve is too low, your 5 USDC stake returns to Vault.
          </TrustStatusStrip>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <ModeActionCard
            icon={<UserPlus className="h-5 w-5" />}
            title="Private room"
            description="Create a room or join by code. Pick casual or paid before friends ready up."
            cta="Open"
            onClick={() => setPanel("choose")}
            meta={
              <>
                <Badge variant="neutral">2-5 players</Badge>
                <Badge variant="neutral">Room code</Badge>
                <Badge variant="neutral">Casual or paid</Badge>
              </>
            }
          />

          <ModeActionCard
            icon={<Globe className="h-5 w-5" />}
            title="Random match"
            description="Queue for a duel or royale. Deposit after a match is found."
            cta="Queue"
            onClick={() => setPanel("online")}
            meta={
              <>
                <Badge variant="neutral">Live queue</Badge>
                <Badge className="gap-1">
                  10 <UsdcIcon size={12} />
                </Badge>
                <Badge variant="neutral">Vault payout</Badge>
              </>
            }
          />
        </div>
      )}

      {panel !== "closed" && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-overlay p-2 sm:items-center sm:p-3"
          onClick={() => {
            if (!roomLoading) resetPanel();
          }}
        >
          <Card
            className="max-h-[88dvh] w-full max-w-md overflow-y-auto rounded-t-[18px] py-0 sm:rounded-base"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="px-4 pb-4 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
              <div className="mb-4 flex items-start justify-between gap-4 sm:mb-5">
                <div>
                  <h2 className="font-heading text-xl leading-tight sm:text-2xl">
                    {panel === "choose" && "Private room"}
                    {panel === "create" && "Create room"}
                    {panel === "join" && "Join room"}
                    {panel === "online" && "Random match"}
                  </h2>
                  <p className="mt-1 text-sm leading-normal text-foreground/65">
                    {panel === "choose" && "Choose how friends enter this round."}
                    {panel === "create" && "Set rules before anyone Deposits."}
                    {panel === "join" && "Paste the code your friend shared."}
                    {panel === "online" && "Pick the queue you want to enter."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetPanel}
                  disabled={!!roomLoading}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-border bg-secondary-background"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {panel === "choose" && (
                <div className="grid gap-3">
                  <Button
                    className="h-auto justify-start gap-3 p-4 text-left"
                    onClick={() => setPanel("create")}
                  >
                    <Crown className="h-5 w-5" />
                    <span>
                      <span className="block font-heading">Create room</span>
                      <span className="block text-xs font-base opacity-75">
                        You become leader and share the code.
                      </span>
                    </span>
                  </Button>
                  <Button
                    variant="neutral"
                    className="h-auto justify-start gap-3 p-4 text-left"
                    onClick={() => setPanel("join")}
                  >
                    <Users className="h-5 w-5" />
                    <span>
                      <span className="block font-heading">Join room</span>
                      <span className="block text-xs font-base opacity-75">
                        Enter a code from a friend.
                      </span>
                    </span>
                  </Button>
                </div>
              )}

              {panel === "create" && (
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="space-y-1.5">
                    <Label>Room name</Label>
                    <Input
                      placeholder="Friday duel"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value.slice(0, 32))}
                      disabled={!!roomLoading}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Max players</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {[2, 3, 4, 5].map((n) => (
                        <Button
                          key={n}
                          type="button"
                          variant={maxPlayers === n ? "default" : "neutral"}
                          disabled={!!roomLoading}
                          onClick={() => setMaxPlayers(n)}
                        >
                          {n}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-base border-2 border-border bg-background p-3 sm:p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-heading text-sm">Paid room</p>
                        <p className="text-xs text-foreground/65">
                          Players Deposit Stablecoin before ready.
                        </p>
                      </div>
                      <Switch
                        checked={isPaid}
                        onCheckedChange={setIsPaid}
                        disabled={!!roomLoading}
                      />
                    </div>
                    {isPaid && (
                      <div className="mt-4 space-y-2">
                        <Label>Stake preset</Label>
                        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                          {STAKE_PRESETS.map((amt) => (
                            <Button
                              key={amt}
                              type="button"
                              size="sm"
                              variant={stakeAmount === amt ? "default" : "neutral"}
                              disabled={!!roomLoading}
                              onClick={() => setStakeAmount(amt)}
                              className="px-1.5 sm:px-2"
                            >
                              {amt}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full gap-2"
                    size="lg"
                    disabled={!roomName.trim() || !!roomLoading}
                    onClick={() =>
                      onCreateRoom({
                        name: roomName.trim(),
                        maxPlayers,
                        paid: isPaid,
                        stakeAmount: isPaid ? stakeAmount : 0,
                        difficulty: "medium",
                      })
                    }
                  >
                    <Crown className="h-4 w-4" /> Create room
                  </Button>
                </div>
              )}

              {panel === "join" && (
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="space-y-1.5">
                    <Label>Room code</Label>
                    <input
                      value={joinCode}
                      onChange={(e) =>
                        setJoinCode(
                          e.target.value
                            .toUpperCase()
                            .replace(/[^A-Z0-9]/g, "")
                            .slice(0, 6),
                        )
                      }
                      placeholder="ABC123"
                      disabled={!!roomLoading}
                      className="w-full min-h-14 rounded-base border-2 border-border bg-secondary-background px-4 py-3 text-center text-2xl font-heading tracking-[0.28em] text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:text-3xl"
                    />
                  </div>
                  <Button
                    className="w-full gap-2"
                    size="lg"
                    disabled={joinCode.length < 4 || !!roomLoading}
                    onClick={() => onJoinRoom(joinCode)}
                  >
                    <Users className="h-4 w-4" /> Join room
                  </Button>
                </div>
              )}

              {panel === "online" && (
                <div className="grid gap-3">
                  <Button
                    className="h-auto justify-start gap-3 p-4 text-left"
                    onClick={() => {
                      setPanel("closed");
                      onJoinOnline("duel");
                    }}
                  >
                    <Swords className="h-5 w-5" />
                    <span>
                      <span className="block font-heading">1v1 duel</span>
                      <span className="block text-xs font-base opacity-75">
                        2 players · 10 USDC Deposit
                      </span>
                    </span>
                  </Button>
                  <Button
                    variant="neutral"
                    className="h-auto justify-start gap-3 p-4 text-left"
                    onClick={() => {
                      setPanel("closed");
                      onJoinOnline("royale");
                    }}
                  >
                    <Crown className="h-5 w-5" />
                    <span>
                      <span className="block font-heading">Quick royale</span>
                      <span className="block text-xs font-base opacity-75">
                        5 players · 10 USDC Deposit
                      </span>
                    </span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {roomLoading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-overlay p-4">
          <div className="w-full max-w-sm rounded-base border-2 border-border bg-secondary-background p-6 text-center shadow-shadow">
            <Loader2 className="mx-auto mb-4 h-9 w-9 animate-spin text-foreground" />
            <p className="text-xs font-heading uppercase tracking-[0.22em] text-foreground/55">
              Room progress
            </p>
            <h3 className="mt-1 text-2xl font-heading">{roomLoading}</h3>
            <p className="mt-2 text-sm text-foreground/65">
              Keep this page open while the room syncs.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
