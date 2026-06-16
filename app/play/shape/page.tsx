import AppLayout from "@/src/components/layouts/AppLayout";
import GameComingSoonScene from "@/src/modules/play/components/GameComingSoonScene";

export default function ShapePage() {
  return (
    <AppLayout>
      <GameComingSoonScene game="shape" />
    </AppLayout>
  );
}
