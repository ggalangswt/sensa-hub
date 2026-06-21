import { NextResponse } from "next/server";
import { getSoundRoundMeta } from "@/lib/sound-round";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roundId = searchParams.get("roundId")?.trim();
  const walletAddress = searchParams.get("walletAddress")?.trim().toLowerCase();

  if (!roundId || !walletAddress) {
    return NextResponse.json(
      { error: "Missing roundId or walletAddress." },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  const meta = await getSoundRoundMeta(roundId);
  if (!meta) {
    return NextResponse.json(
      { error: "Sound round config is not available yet." },
      { status: 404, headers: NO_STORE_HEADERS },
    );
  }

  if (!meta.players.includes(walletAddress)) {
    return NextResponse.json(
      { error: "This wallet is not a participant in the sound round." },
      { status: 403, headers: NO_STORE_HEADERS },
    );
  }

  return NextResponse.json(
    {
      roundId,
      mode: meta.mode,
      difficulty: meta.difficulty,
      octaveShift: meta.octaveShift,
      gameplayConfig: meta.gameplayConfig,
      previewSeconds: meta.gameplayConfig.memorizeMs / 1000,
      guessSeconds: meta.gameplayConfig.guessSeconds,
      startedAt: Date.now(),
      isPractice: meta.isPractice,
    },
    { headers: NO_STORE_HEADERS },
  );
}
