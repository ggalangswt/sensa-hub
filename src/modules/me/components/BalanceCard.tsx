import { Card, CardContent } from "@/components/ui/card";
import UsdcIcon from "@/src/components/elements/UsdcIcon";
import { formatUsdc } from "@/src/utils/utils";

export default function BalanceCard({
  walletBalance,
  claimable,
}: {
  walletBalance: number;
  claimable: number;
}) {
  return (
    <Card className="mb-6 bg-main shadow-[0_12px_26px_rgb(66_32_87_/_0.16)]">
      <CardContent className="pt-6 flex items-center justify-between">
        <div>
          <p className="font-heading text-foreground text-sm">Wallet balance</p>
          <p className="flex items-center gap-2 text-2xl font-heading text-foreground">
            {formatUsdc(walletBalance)} <UsdcIcon size={22} />
          </p>
          {claimable > 0 && (
            <p className="mt-1 flex items-center gap-1 text-xs text-chart-2">
              +{formatUsdc(claimable)} <UsdcIcon size={12} /> ready to Withdraw
            </p>
          )}
        </div>
        <p className="max-w-36 text-right text-xs text-foreground/50">
          Use wallet balance to Deposit into paid rooms.
        </p>
      </CardContent>
    </Card>
  );
}
