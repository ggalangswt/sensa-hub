import type { TargetDifficulty } from "@/src/utils/color";
import type {
  RoundResult,
  SoundStartPayload,
  SoundSubmitPayload,
  SoundSubmissionAck,
} from "../types/play.types";

export async function startRound(payload: {
  mode: string;
  tab: "play" | "practice";
  difficulty: TargetDifficulty;
  playerAddress?: string;
}): Promise<SoundStartPayload> {
  const res = await fetch("/api/play/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function submitGuess(payload: SoundSubmitPayload): Promise<{
  resolved?: boolean;
  winner?: string;
  onChainError?: string;
  refunded?: boolean;
  refundReason?: string;
} & Partial<RoundResult> & SoundSubmissionAck> {
  const res = await fetch("/api/play/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok && typeof data?.accepted !== "boolean") {
    data.accepted = false;
  }
  return data;
}

export async function fetchRoundResult(
  roundId: string,
): Promise<{ resolved: boolean; winner?: string; allScores?: unknown[] }> {
  const res = await fetch(`/api/play/result?roundId=${roundId}`);
  return res.json();
}

export async function forceResolveRound(roundId: string): Promise<{
  resolved?: boolean;
  winner?: string;
  waiting?: boolean;
  resolving?: boolean;
  message?: string;
  onChainError?: string;
}> {
  const res = await fetch("/api/play/force-resolve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roundId }),
  });
  return res.json();
}
