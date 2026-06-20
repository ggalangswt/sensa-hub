import type { Metadata } from "next";
import AppLayout from "@/src/components/layouts/AppLayout";
import Play from "@/src/modules/play/Play";

export const metadata: Metadata = {
  title: "Sensa Sound",
  description: "Listen, remember, and tune five tones.",
};

export default function SoundPage() {
  return (
    <AppLayout>
      <Play showBackToGames />
    </AppLayout>
  );
}
