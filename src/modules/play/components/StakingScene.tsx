"use client";

import type { ReactNode } from "react";
import { Check, Loader2, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  RouteHeader,
  TrustStatusStrip,
} from "@/src/components/ui/mobile-primitives";
import UsdcIcon from "@/src/components/elements/UsdcIcon";
import type { StakingStep } from "../hooks/useStake";

function StepItem({
  num,
  label,
  desc,
  state,
}: {
  num: number;
  label: ReactNode;
  desc: ReactNode;
  state: "done" | "active" | "pending";
}) {
  return (
    <div
      className={`flex items-center gap-4 rounded-[18px] border p-4 transition-all ${
        state === "done"
          ? "border-chart-2/35 bg-chart-2/12"
          : state === "active"
            ? "border-main/60 bg-main shadow-shadow"
            : "border-border/20 bg-secondary-background opacity-60"
      }`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-heading ${
          state === "active" ? "border-foreground bg-foreground text-background" : "border-border/25 bg-secondary-background"
        }`}
      >
        {state === "done" ? (
          <Check className="h-4 w-4" />
        ) : state === "active" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <span className="text-xs">{num}</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-heading text-sm text-foreground">{label}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-foreground/65">{desc}</p>
      </div>
    </div>
  );
}

export default function StakingScene({
  needsApproval,
  step,
}: {
  needsApproval: boolean;
  step: StakingStep;
}) {
  const steps = needsApproval
    ? [
        {
          label: (
            <span className="inline-flex items-center gap-2">
              Approve Stablecoin <UsdcIcon size={14} />
            </span>
          ),
          desc: "One-time wallet approval before this app can Deposit your stake.",
          state: step === "deposit" ? "done" : "active",
        },
        {
          label: "Deposit stake",
          desc: "Your stake is locked until the round resolves or refunds to Vault.",
          state: step === "deposit" ? "active" : "pending",
        },
      ]
    : [
        {
          label: "Deposit stake",
          desc: "Your stake is locked until the round resolves or refunds to Vault.",
          state: "active",
        },
      ];

  return (
    <div className="mx-auto max-w-2xl page-enter">
      <RouteHeader
        eyebrow={<Badge>Stablecoin</Badge>}
        title="Deposit stake"
        description="Confirm in your wallet, then Sensa will move you into the round automatically."
        action={<WalletCards className="mt-1 h-6 w-6 text-foreground" />}
      />

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3">
            {steps.map((s, i) => (
              <StepItem
                key={i}
                num={i + 1}
                label={s.label}
                desc={s.desc}
                state={s.state as "done" | "active" | "pending"}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <TrustStatusStrip
        tone="warning"
        title="Wallet confirmation in progress"
        className="mt-4"
      >
        A Network fee applies. Do not close this screen until the Deposit
        finishes.
      </TrustStatusStrip>
    </div>
  );
}
