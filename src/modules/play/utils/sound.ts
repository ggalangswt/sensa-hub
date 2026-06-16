export const SOUND_DEFAULTS = {
  rounds: 5,
  maxScore: 50,
  easyFrequencyRange: [220, 880] as const,
  hardFrequencyRange: [110, 1760] as const,
};

export type SoundDifficulty = "easy" | "hard";
export type SoundOctaveShift = -1 | 0 | 1;

export type SoundGameplayRound = {
  round: number;
  promptLabel: string;
  targetNorm: number;
  targetHz: number;
};

export type SoundGameplayConfig = {
  matchId: string;
  difficulty: SoundDifficulty;
  octaveShift: SoundOctaveShift;
  rounds: SoundGameplayRound[];
  memorizeMs: number;
  guessSeconds: number;
};

export type SoundRoundSubmission = {
  round: number;
  pickedNorm: number;
  latencyMs: number;
};

export type SoundMatchSubmission = {
  roomId: string;
  walletAddress: string;
  submittedAt: string;
  difficulty: SoundDifficulty;
  octaveShift: SoundOctaveShift;
  totalScore: number;
  rounds: SoundRoundSubmission[];
};

export type SoundRoundResult = {
  round: number;
  targetNorm: number;
  pickedNorm: number;
  targetHz: number;
  guessedHz: number;
  score: number;
  latencyMs: number;
};

export type SoundMatchComputed = {
  total: number;
  percent: number;
  perRound: SoundRoundResult[];
};

function seededUnit(seed: string, key: string): number {
  let hash = 2166136261;
  const full = `${seed}:${key}`;
  for (let index = 0; index < full.length; index += 1) {
    hash ^= full.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 1_000_000) / 1_000_000;
}

function clampNorm(norm: number): number {
  return Math.max(0, Math.min(1, norm));
}

function rangeForDifficulty(difficulty: SoundDifficulty) {
  return difficulty === "hard"
    ? SOUND_DEFAULTS.hardFrequencyRange
    : SOUND_DEFAULTS.easyFrequencyRange;
}

function minFreq(difficulty: SoundDifficulty): number {
  return rangeForDifficulty(difficulty)[0];
}

function maxFreq(difficulty: SoundDifficulty): number {
  return rangeForDifficulty(difficulty)[1];
}

export function freqFromNorm(norm: number, difficulty: SoundDifficulty): number {
  const [min, max] = rangeForDifficulty(difficulty);
  return min * Math.pow(max / min, clampNorm(norm));
}

function normFromFreq(frequencyHz: number, difficulty: SoundDifficulty): number {
  const [min, max] = rangeForDifficulty(difficulty);
  return clampNorm(Math.log(frequencyHz / min) / Math.log(max / min));
}

function effectiveTargetFrequency(
  targetNorm: number,
  difficulty: SoundDifficulty,
  octaveShift: SoundOctaveShift,
): number {
  const base = freqFromNorm(targetNorm, difficulty);
  if (octaveShift === 1) return base * 2;
  if (octaveShift === -1) return base / 2;
  return base;
}

export function buildSoundGameplayConfig(args: {
  matchId: string;
  difficulty: SoundDifficulty;
  octaveShift?: SoundOctaveShift;
}): SoundGameplayConfig {
  const octaveShift = args.octaveShift ?? 0;
  const minNorm =
    octaveShift === -1 ? Math.max(0.1, normFromFreq(minFreq(args.difficulty) * 2, args.difficulty)) : 0.1;
  const maxNorm =
    octaveShift === 1 ? Math.min(0.9, normFromFreq(maxFreq(args.difficulty) / 2, args.difficulty)) : 0.9;

  return {
    matchId: args.matchId,
    difficulty: args.difficulty,
    octaveShift,
    memorizeMs: args.difficulty === "hard" ? 1250 : 2500,
    guessSeconds: 15,
    rounds: Array.from({ length: SOUND_DEFAULTS.rounds }, (_, index) => {
      const round = index + 1;
      const targetNorm =
        minNorm +
        seededUnit(args.matchId, `target:${round}`) * (maxNorm - minNorm);
      return {
        round,
        promptLabel: `Round ${round}`,
        targetNorm,
        targetHz: Number(
          effectiveTargetFrequency(targetNorm, args.difficulty, octaveShift).toFixed(2),
        ),
      };
    }),
  };
}

function erbRate(frequencyHz: number): number {
  return 21.4 * Math.log10(0.00437 * frequencyHz + 1);
}

function scoreRound(args: {
  targetNorm: number;
  pickedNorm: number;
  difficulty: SoundDifficulty;
  octaveShift: SoundOctaveShift;
}): number {
  const targetHz = effectiveTargetFrequency(
    args.targetNorm,
    args.difficulty,
    args.octaveShift,
  );
  const guessedHz = freqFromNorm(args.pickedNorm, args.difficulty);
  const maxErb = erbRate(maxFreq(args.difficulty)) - erbRate(minFreq(args.difficulty));
  const distance =
    Math.abs(erbRate(targetHz) - erbRate(guessedHz)) / maxErb;
  const sharp = Math.exp(-Math.pow(distance / 0.015, 2));
  const gentle = Math.exp(-Math.pow(distance / 0.12, 2));
  return Math.round((sharp * 4 + gentle * 6) * 100) / 100;
}

export function scoreSoundSubmission(
  matchId: string,
  difficulty: SoundDifficulty,
  submission: SoundMatchSubmission,
): SoundMatchComputed {
  const config = buildSoundGameplayConfig({
    matchId,
    difficulty,
    octaveShift: submission.octaveShift,
  });
  const perRound = config.rounds.map((round) => {
    const picked = submission.rounds.find((entry) => entry.round === round.round);
    const pickedNorm = picked?.pickedNorm ?? 0.5;
    return {
      round: round.round,
      targetNorm: round.targetNorm,
      pickedNorm,
      targetHz: round.targetHz,
      guessedHz: Number(freqFromNorm(pickedNorm, config.difficulty).toFixed(2)),
      score: scoreRound({
        targetNorm: round.targetNorm,
        pickedNorm,
        difficulty: config.difficulty,
        octaveShift: config.octaveShift,
      }),
      latencyMs: picked?.latencyMs ?? 0,
    };
  });
  const total = Number(
    Math.min(
      SOUND_DEFAULTS.maxScore,
      Math.max(0, perRound.reduce((sum, round) => sum + round.score, 0)),
    ).toFixed(2),
  );
  return {
    total,
    percent: Number(((total / SOUND_DEFAULTS.maxScore) * 100).toFixed(2)),
    perRound,
  };
}
