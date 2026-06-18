import {
  buildSoundGameplayConfig,
  type SoundDifficulty,
  type SoundGameplayConfig,
  type SoundMatchSubmission,
  type SoundOctaveShift,
} from "@sensa/sound";
import type { TargetDifficulty } from "@/src/utils/color";
import { parseRedisJson, redis } from "@/lib/db/redis";

export type SoundRoundMeta = {
  mode: "solo" | "duel" | "royale";
  source: "solo" | "public" | "private" | "practice";
  isPractice: boolean;
  casual: boolean;
  stakeAmount: number;
  difficulty: SoundDifficulty;
  octaveShift: SoundOctaveShift;
  gameplayConfig: SoundGameplayConfig;
  players: string[];
};

export function toSoundDifficulty(
  difficulty: TargetDifficulty | string,
): SoundDifficulty {
  return difficulty === "hard" || difficulty === "god" ? "hard" : "easy";
}

export function createSoundRoundMeta(args: {
  roundId: string;
  mode: SoundRoundMeta["mode"];
  source: SoundRoundMeta["source"];
  isPractice?: boolean;
  casual?: boolean;
  stakeAmount?: number;
  difficulty: TargetDifficulty | SoundDifficulty;
  players?: string[];
}): SoundRoundMeta {
  const difficulty = toSoundDifficulty(args.difficulty);
  const octaveShift = 0;
  return {
    mode: args.mode,
    source: args.source,
    isPractice: args.isPractice ?? false,
    casual: args.casual ?? false,
    stakeAmount: args.stakeAmount ?? 0,
    difficulty,
    octaveShift,
    gameplayConfig: buildSoundGameplayConfig({
      matchId: args.roundId,
      difficulty,
      octaveShift,
    }),
    players: (args.players ?? []).map((address) => address.toLowerCase()),
  };
}

export async function saveSoundRoundMeta(
  roundId: string,
  meta: SoundRoundMeta,
) {
  await redis.set(`round:${roundId}:meta`, JSON.stringify(meta), { ex: 3600 });
}

export async function getSoundRoundMeta(roundId: string) {
  return parseRedisJson<SoundRoundMeta>(
    await redis.get(`round:${roundId}:meta`),
  );
}

export function validateSoundSubmission(
  submission: SoundMatchSubmission,
  meta: SoundRoundMeta,
): string | null {
  if (
    submission.difficulty !== meta.difficulty ||
    submission.octaveShift !== meta.octaveShift
  ) {
    return "Submission config does not match this round.";
  }
  if (!Array.isArray(submission.rounds) || submission.rounds.length !== 5) {
    return "Submission must contain exactly five rounds.";
  }

  const roundNumbers = new Set<number>();
  for (const round of submission.rounds) {
    if (
      !Number.isInteger(round.round) ||
      round.round < 1 ||
      round.round > 5 ||
      roundNumbers.has(round.round)
    ) {
      return "Submission contains invalid or duplicate round numbers.";
    }
    if (
      !Number.isFinite(round.pickedNorm) ||
      round.pickedNorm < 0 ||
      round.pickedNorm > 1
    ) {
      return "Submission contains an invalid tone position.";
    }
    if (
      !Number.isFinite(round.latencyMs) ||
      round.latencyMs < 0 ||
      round.latencyMs > meta.gameplayConfig.guessSeconds * 1000 + 1_500
    ) {
      return "Submission contains an invalid round time.";
    }
    roundNumbers.add(round.round);
  }

  return null;
}
