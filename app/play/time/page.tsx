import AppLayout from "@/src/components/layouts/AppLayout";
import GameComingSoonScene from "@/src/modules/play/components/GameComingSoonScene";

export default function TimePage() {
  return (
    <AppLayout>
      <GameComingSoonScene game="time" />
    </AppLayout>
  );
}
