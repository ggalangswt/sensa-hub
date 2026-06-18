import { NextResponse } from "next/server";
import type { TargetDifficulty } from "@/src/utils/color";
import { randomBytes } from "crypto";
import {
  createSoundRoundMeta,
  saveSoundRoundMeta,
} from "@/lib/sound-round";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const mode: string = body?.mode ?? "solo";
  const difficulty = (body?.difficulty ?? "medium") as TargetDifficulty;
  const isPractice = body?.tab === "practice";
  const playerAddress =
    typeof body?.playerAddress === "string"
      ? body.playerAddress.toLowerCase()
      : "";

  // Generate a proper bytes32 roundId for on-chain use
  const roundId = "0x" + randomBytes(32).toString("hex");
  const meta = createSoundRoundMeta({
    roundId,
    mode: "solo",
    source: isPractice ? "practice" : "solo",
    isPractice,
    casual: isPractice,
    stakeAmount: isPractice ? 0 : 1,
    difficulty,
    players: playerAddress ? [playerAddress] : [],
  });
  await saveSoundRoundMeta(roundId, meta);
  if (meta.players.length > 0) {
    const { redis } = await import("@/lib/db/redis");
    await redis.set(
      `round:${roundId}:players`,
      JSON.stringify(meta.players),
      { ex: 3600 },
    );
  }

  return NextResponse.json({
    roundId,
    mode,
    difficulty: meta.difficulty,
    octaveShift: meta.octaveShift,
    gameplayConfig: meta.gameplayConfig,
    previewSeconds: meta.gameplayConfig.memorizeMs / 1000,
    guessSeconds: meta.gameplayConfig.guessSeconds,
    startedAt: Date.now(),
    isPractice,
  });
}
