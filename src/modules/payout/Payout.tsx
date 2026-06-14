"use client";

import { ArrowUpFromLine, Loader2, WalletCards } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoneyStateBlock,
  RouteHeader,
  TrustStatusStrip,
} from "@/src/components/ui/mobile-primitives";
import UsdcIcon from "@/src/components/elements/UsdcIcon";
import { formatUsdc } from "@/src/utils/utils";
import { useWallet } from "@/src/provider/WalletContext";
import { usePayout } from "./hooks/usePayout";

export default function Payout() {
  const { address, isConnected } = useWallet();
  const { claimable, walletBalance, withdrawing, withdraw } = usePayout(address);

  return (
    <div className="max-w-2xl mx-auto page-enter">
      <RouteHeader
        eyebrow={
          <Badge className={isConnected ? "bg-chart-2 text-foreground" : "bg-chart-4 text-white"}>
            {isConnected ? "Connected" : "Offline"}
          </Badge>
        }
        title="Vault"
        description="Winnings and refunds appear here first. Withdraw Stablecoin when your balance is ready."
        action={<WalletCards className="mt-1 h-6 w-6" />}
      />

      <MoneyStateBlock
        label="Withdrawable balance"
        value={
          <span className="inline-flex items-center gap-2">
            {formatUsdc(claimable)} <UsdcIcon size={28} />
          </span>
        }
        helper="This is your internal Vault balance from wins or refunds. Network fee applies when you Withdraw."
        action={
          <Button
            className="w-full gap-2 text-lg"
            size="lg"
            onClick={withdraw}
            disabled={withdrawing || claimable <= 0}
          >
            {withdrawing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Withdrawing...
              </>
            ) : (
              <>
                <ArrowUpFromLine className="w-5 h-5" />
                {claimable > 0 ? (
                  <span className="inline-flex items-center gap-2">
                    Withdraw {formatUsdc(claimable)} <UsdcIcon />
                  </span>
                ) : (
                  "Nothing to Withdraw"
                )}
              </>
            )}
          </Button>
        }
      />

      {claimable <= 0 && (
        <TrustStatusStrip title="Vault is empty" className="mt-4">
          Play free to practice, or enter paid rooms. Winnings and refunds will
          appear here before you Withdraw.
        </TrustStatusStrip>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4">
        <Card className="bg-main">
          <CardContent className="pt-3">
            <p className="text-xs font-heading text-foreground/60">
              WALLET BALANCE
            </p>
            <p className="text-2xl font-heading text-foreground">
              {formatUsdc(walletBalance)} <UsdcIcon size={25} />
            </p>
            <p className="mt-1 text-xs text-foreground/60">
              Wallet balance is used for paid room Deposits.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
