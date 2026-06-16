import { NextResponse } from "next/server";
import type { TargetDifficulty } from "@/src/utils/color";
import { buildSoundGameplayConfig, type SoundDifficulty } from "@/src/modules/play/utils/sound";
import { randomBytes } from "crypto";

function toSoundDifficulty(difficulty: TargetDifficulty): SoundDifficulty {
  return difficulty === "hard" || difficulty === "god" ? "hard" : "easy";
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const mode: string = body?.mode ?? "solo";
  const difficulty = toSoundDifficulty(
    (body?.difficulty ?? "medium") as TargetDifficulty,
  );

  // Generate a proper bytes32 roundId for on-chain use
  const roundId = "0x" + randomBytes(32).toString("hex");
  const gameplayConfig = buildSoundGameplayConfig({
    matchId: roundId,
    difficulty,
    octaveShift: 0,
  });

  return NextResponse.json({
    roundId,
    mode,
    difficulty,
    octaveShift: 0,
    gameplayConfig,
    previewSeconds: gameplayConfig.memorizeMs / 1000,
    guessSeconds: gameplayConfig.guessSeconds,
    startedAt: Date.now(),
  });
}
