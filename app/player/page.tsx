import type { Metadata } from "next";
import Player from "@/src/modules/player/Player";

export const metadata: Metadata = {
  title: "Player | Sensa",
  description: "Manage your Sensa player name and account.",
};

export default function PlayerPage() {
  return <Player />;
}
