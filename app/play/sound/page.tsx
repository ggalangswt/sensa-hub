import AppLayout from "@/src/components/layouts/AppLayout";
import Play from "@/src/modules/play/Play";

export default function SoundPage() {
  return (
    <AppLayout>
      <Play showBackToGames />
    </AppLayout>
  );
}
