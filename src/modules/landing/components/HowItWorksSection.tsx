import { Brain, Gamepad2, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-14 px-4 sm:py-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 sm:mb-14">
          <Badge className="mb-4">How It Works</Badge>
          <h2 className="text-3xl sm:text-4xl font-heading text-foreground">One loop for every skill game</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 rounded-[18px] bg-main border border-border/25 shadow-shadow flex items-center justify-center mb-2">
                <Brain className="w-8 h-8 text-main-foreground" />
              </div>
              <CardTitle className="text-xl">1. Focus</CardTitle>
              <CardDescription>Each game gives your brain a short challenge: remember, compare, time, or recognize a pattern.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 rounded-[18px] bg-chart-3 border border-border/25 shadow-shadow flex items-center justify-center mb-2">
                <Gamepad2 className="w-8 h-8 text-main-foreground" />
              </div>
              <CardTitle className="text-xl">2. Play</CardTitle>
              <CardDescription>Make your move quickly. Some games test memory, others test timing, shape sense, or pattern reading.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 rounded-[18px] bg-chart-2 border border-border/25 shadow-shadow flex items-center justify-center mb-2">
                <Trophy className="w-8 h-8 text-main-foreground" />
              </div>
              <CardTitle className="text-xl">3. Resolve</CardTitle>
              <CardDescription>Your skill score determines the result. Winnings or refunds become visible in Vault.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
}
