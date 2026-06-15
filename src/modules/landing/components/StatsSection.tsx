import { Card, CardContent } from "@/components/ui/card";

export default function StatsSection() {
  return (
    <section className="py-14 px-4 sm:py-20">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-[var(--console-shell)] text-background">
          <CardContent className="pt-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div><div className="text-3xl font-heading text-main">360px</div><div className="text-sm opacity-80">MiniPay priority</div></div>
              <div><div className="text-3xl font-heading text-main">Free</div><div className="text-sm opacity-80">Practice mode</div></div>
              <div><div className="text-3xl font-heading text-main">2-5</div><div className="text-sm opacity-80">Private room size</div></div>
              <div><div className="text-3xl font-heading text-main">Vault</div><div className="text-sm opacity-80">Withdraw flow</div></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
