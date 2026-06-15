import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function GameModesSection() {
  return (
    <section className="py-14 px-4 sm:py-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 sm:mb-14">
          <Badge className="mb-4">Game Modes</Badge>
          <h2 className="text-3xl sm:text-4xl font-heading text-foreground">Games for memory, timing, and patterns</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <Card className="bg-main shadow-[0_12px_26px_rgb(66_32_87_/_0.18)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Sensa Sound</CardTitle>
                <Badge variant="neutral">Live</Badge>
              </div>
              <CardDescription>Remember short cues, keep focus, and turn fast recall into a score.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="neutral">Practice free</Badge>
                <Badge variant="neutral">Private rooms</Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[var(--console-screen)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Sensa Shape</CardTitle>
                <Badge>Next</Badge>
              </div>
              <CardDescription>
                Pattern and form memory for players who read structure faster than words.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2"><Badge variant="neutral">Coming soon</Badge><Badge variant="neutral">Pattern skill</Badge></div>
            </CardContent>
          </Card>
          <Card className="bg-[var(--console-screen)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Sensa Time</CardTitle>
                <Badge>Next</Badge>
              </div>
              <CardDescription>
                Timing challenges for players who can feel the beat without watching a clock.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2"><Badge variant="neutral">Coming soon</Badge><Badge variant="neutral">Timing skill</Badge></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
