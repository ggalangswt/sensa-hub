import type { TargetDifficulty } from "@/src/utils/color";
import type {
  SoundGameplayConfig,
  SoundMatchSubmission,
  SoundRoundResult,
} from "../utils/sound";

export type Phase =
  | "select"
  | "staking"
  | "queueing"
  | "matched"
  | "lobby"
  | "gameplay"
  | "waiting"
  | "leaderboard"
  | "result";

export type Mode = "solo" | "duel" | "royale";
export type TabKey = "single" | "multi";

export type RoundResult = {
  winner: string;
  winnerAccuracy: number;
  winnerPayout: number;
  totalScore?: number;
  percentScore?: number;
  soundSummary?: {
    total: number;
    percent: number;
    rounds: SoundRoundResult[];
  };
  allScores: {
    address: string;
    accuracy: number;
    tier: string;
    score: number;
    timeSec?: number;
    totalScore?: number;
  }[];
  txHash?: string;
};

export type SoundStartPayload = {
  roundId: string;
  mode: string;
  difficulty: "easy" | "hard";
  octaveShift: -1 | 0 | 1;
  gameplayConfig: SoundGameplayConfig;
  previewSeconds: number;
  guessSeconds: number;
  startedAt: number;
  isPractice: boolean;
};

export type SoundSubmitPayload = SoundMatchSubmission & {
  mode: string;
  isPractice: boolean;
  playerAddress?: string;
  roundId?: string;
};

export type SoundSubmissionAck = {
  accepted: boolean;
  resolved?: boolean;
  refunded?: boolean;
  waiting?: boolean;
  outcome?: "prize" | "refund" | "no-prize" | "waiting";
  message?: string;
  error?: string;
};

export type RoomPlayer = {
  address: string;
  status: "unready" | "ready";
  staked: boolean;
  joinedAt: number;
};

export type Room = {
  code: string;
  name: string;
  leader: string;
  maxPlayers: number;
  paid: boolean;
  stakeAmount: number;
  mode: 0 | 1 | 2;
  difficulty: TargetDifficulty;
  status: "lobby" | "active" | "resolved" | "cancelled";
  roundId: string;
  players: RoomPlayer[];
  createdAt: number;
  lastActivity: number;
};

export const MODE_META: Record<Mode, { label: string; stake: number; pool: number }> = {
  solo: { label: "SOLO", stake: 1, pool: 0 },
  duel: { label: "1 vs 1 DUEL", stake: 0.5, pool: 1 },
  royale: { label: "5 PLAYER ROYALE", stake: 0.5, pool: 2.5 },
};

export const MODE_NUM: Record<Mode, number> = { solo: 0, duel: 1, royale: 2 };

export const REQUIRED_PLAYERS: Record<"duel" | "royale", number> = {
  duel: 2,
  royale: 5,
};

export const DIFFICULTY_OPTIONS: TargetDifficulty[] = ["easy", "medium", "hard", "god"];

export const DIFFICULTY_LABEL: Record<TargetDifficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  god: "GOD",
};

export const USDC_DECIMALS = BigInt(1_000_000);
export const ONE_BILLION_USDC = BigInt(1_000_000_000) * USDC_DECIMALS;
export const STAKE_PRESETS = [0.2, 0.5, 1, 2, 5] as const;

export function usdcToRaw(amount: number): bigint {
  return BigInt(Math.round(amount * Number(USDC_DECIMALS)));
}

export const STAKE_AMOUNT: Record<Mode, bigint> = {
  solo: usdcToRaw(1),
  duel: usdcToRaw(0.5),
  royale: usdcToRaw(0.5),
};
