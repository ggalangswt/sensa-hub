"use client";

import { Check, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  RouteHeader,
  TrustStatusStrip,
} from "@/src/components/ui/mobile-primitives";
import { addrTone, toneBg, shortAddr, addrInitials } from "@/src/utils/address";
import { REQUIRED_PLAYERS } from "../types/play.types";

export default function MatchedLobbyScene({
  mode,
  players,
  myAddress,
  stakedCount,
  stakedPlayers,
  staking,
  countdown,
  onStake,
}: {
  mode: "duel" | "royale";
  players: string[];
  myAddress: string;
  stakedCount: number;
  stakedPlayers: string[];
  staking: boolean;
  countdown: number | null;
  onStake: () => void;
}) {
  const required = REQUIRED_PLAYERS[mode];
  const normalizedMe = myAddress.toLowerCase();
  const stakedSet = new Set(stakedPlayers.map((p) => p.toLowerCase()));
  const myStaked = stakedSet.has(normalizedMe);
  const everyoneStaked = stakedCount >= players.length && players.length > 0;

  return (
    <div className="max-w-2xl mx-auto page-enter">
      <RouteHeader
        eyebrow={<Badge className="bg-chart-2 text-foreground">Matched</Badge>}
        title="Deposit to ready"
        description={`${mode === "duel" ? "1v1 Duel" : "5 Player Royale"} · ${Math.min(players.length, required)}/${required} players`}
      />

      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3">
            {players.map((player) => {
              const staked = stakedSet.has(player.toLowerCase());
              const isMe = player.toLowerCase() === normalizedMe;
              const tone = addrTone(player);
              return (
                <div
                  key={player}
                  className="flex items-center justify-between rounded-[16px] border border-border/20 bg-secondary-background px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border border-border/25 font-heading text-sm ${toneBg(tone)}`}
                    >
                      {addrInitials(player)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-heading text-sm text-foreground">
                        {shortAddr(player)} {isMe ? "(You)" : ""}
                      </p>
                      <p className="text-xs text-foreground/50">
                        {staked ? "Deposit locked" : "Waiting for Deposit"}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={
                      staked
                        ? "bg-chart-2 text-white"
                        : "bg-secondary-background text-foreground border-border"
                    }
                  >
                    {staked ? "Staked" : "Pending"}
                  </Badge>
                </div>
              );
            })}
          </div>
          <div className="mt-6 mx-2 text-sm text-foreground/60">
            {everyoneStaked ? (
                <span>All players have Deposited. Match is about to start.</span>
            ) : myStaked ? (
              <span>Waiting for other players to Deposit</span>
            ) : (
              <span>Deposit to ready up</span>
            )}
          </div>
        </CardContent>
      </Card>

      {countdown !== null ? (
        <Card className="mb-4 border-chart-2 bg-chart-2/10">
          <CardContent className="pt-6 text-center">
            <p className="mb-2 text-xs font-heading uppercase tracking-wider text-foreground/50">Starting In</p>
            <p className="text-5xl font-heading text-chart-2">{countdown}</p>
          </CardContent>
        </Card>
      ) : (
        <Button
          className="w-full gap-2"
          size="lg"
          disabled={staking || myStaked}
          onClick={onStake}
        >
          {staking ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Depositing...</>
          ) : myStaked ? (
            <><Check className="w-4 h-4" /> Deposited</>
          ) : (
            <>Deposit 0.5 USDC</>
          )}
        </Button>
      )}
      {!myStaked && countdown === null && (
        <TrustStatusStrip tone="info" title="Network fee applies" className="mt-4">
          Your Stablecoin stays locked until the result resolves or refunds to Vault.
        </TrustStatusStrip>
      )}
    </div>
  );
}
