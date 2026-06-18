import { NextResponse } from "next/server";
import {
  tier,
} from "@/src/utils/color";
import {
  scoreSoundMatch,
  type SoundMatchSubmission,
} from "@/src/modules/play/utils/sound";
import { redis, parseRedisJson } from "@/lib/db/redis";
import {
  getSoloReserveBalance,
  signAndResolve,
  toTierEnum,
  PlayerScore,
} from "@/lib/sc/resolve";
import { backendRefund } from "@/lib/sc/refund";
import { supabaseAdmin } from "@/lib/db/supabase";
import { usdcToRaw } from "@/lib/rooms";
import {
  getSoundRoundMeta,
  validateSoundSubmission,
} from "@/lib/sound-round";

function soloRewardAmount(tierName: string): {
  reward: bigint;
  tierEnum: number;
} {
  switch (tierName) {
    case "WHAT?!":
    case "WHAT":
      return { reward: usdcToRaw(2), tierEnum: 5 };
    case "GREAT":
      return { reward: usdcToRaw(1.5), tierEnum: 4 };
    case "GOOD":
      return { reward: usdcToRaw(1), tierEnum: 3 };
    case "OK":
      return { reward: usdcToRaw(0.5), tierEnum: 2 };
    case "MEH":
      return { reward: usdcToRaw(0.2), tierEnum: 1 };
    default:
      return { reward: BigInt(0), tierEnum: 0 };
  }
}

function modeToEnum(mode: string, playerCount: number): number {
  if (mode === "solo") return 0;
  return playerCount <= 2 ? 1 : 2;
}

async function ensureRoundRecord(
  gameRoundId: string,
  modeEnum: number,
  players: string[],
  source: "solo" | "public" | "private",
): Promise<string | null> {
  const normalizedRoundId = gameRoundId.toLowerCase();
  const normalizedPlayers = players.map((walletAddress) => ({
    wallet_address: walletAddress.toLowerCase(),
  }));

  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("rounds")
    .select("id")
    .eq("game_round_id", normalizedRoundId)
    .maybeSingle();

  if (fetchError) {
    console.warn("Failed to fetch round history row:", fetchError);
  }

  let roundDbId = existing?.id ?? null;

  if (!roundDbId) {
    const { data: inserted, error: insertError } = await supabaseAdmin
      .from("rounds")
      .insert({
        game_round_id: normalizedRoundId,
        mode: modeEnum,
        source,
        status: "matched",
      })
      .select("id")
      .single();

    if (insertError || !inserted) {
      console.warn("Failed to create round history row:", insertError);
      return null;
    }

    roundDbId = inserted.id;
  }

  const { error: playersError } = await supabaseAdmin
    .from("players")
    .upsert(normalizedPlayers, { onConflict: "wallet_address" });

  if (playersError) {
    console.warn("Failed to upsert players for round history:", playersError);
  }

  const { error: participantsError } = await supabaseAdmin
    .from("round_participants")
    .upsert(
      normalizedPlayers.map((player) => ({
        round_id: roundDbId,
        wallet_address: player.wallet_address,
      })),
      { onConflict: "round_id,wallet_address" },
    );

  if (participantsError) {
    console.warn("Failed to seed round participants:", participantsError);
  }

  return roundDbId;
}

async function persistResolvedRound(params: {
  gameRoundId: string;
  mode: string;
  source: "solo" | "public" | "private";
  players: PlayerScore[];
  winnerAddress?: string | null;
  rewardByAddress: Record<string, number>;
  resolved: boolean;
}) {
  const {
    gameRoundId,
    mode,
    source,
    players,
    winnerAddress,
    rewardByAddress,
    resolved,
  } = params;
  const roundDbId = await ensureRoundRecord(
    gameRoundId,
    modeToEnum(mode, players.length),
    players.map((player) => player.address),
    source,
  );

  if (!roundDbId) return;

  const normalizedWinner = winnerAddress?.toLowerCase() ?? null;
  const participantRows = players.map((player) => {
    const normalizedAddress = player.address.toLowerCase();
    return {
      round_id: roundDbId,
      wallet_address: normalizedAddress,
      accuracy: player.accuracy,
      score: player.score,
      tier: toTierEnum(player.tier),
      reward_earned: rewardByAddress[normalizedAddress] ?? 0,
      is_winner: normalizedWinner === normalizedAddress,
    };
  });

  const { error: participantsError } = await supabaseAdmin
    .from("round_participants")
    .upsert(participantRows, { onConflict: "round_id,wallet_address" });

  if (participantsError) {
    console.warn("Failed to persist round participants:", participantsError);
  }

  const { error: roundError } = await supabaseAdmin
    .from("rounds")
    .update({
      status: resolved ? "resolved" : "pending_payout",
      resolved_at: new Date().toISOString(),
    })
    .eq("id", roundDbId);

  if (roundError) {
    console.warn("Failed to update round history status:", roundError);
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  const roundId = body?.roundId as string | undefined;
  const playerAddress = body?.playerAddress as string | undefined;
  const incomingSubmission = body as SoundMatchSubmission;

  if (!roundId) {
    return NextResponse.json(
      { accepted: false, error: "Missing roundId." },
      { status: 400 },
    );
  }

  const meta = await getSoundRoundMeta(roundId);
  if (!meta) {
    return NextResponse.json(
      { accepted: false, error: "Round config expired or was not found." },
      { status: 404 },
    );
  }
  const mode = meta.mode;
  const isPractice = meta.isPractice;

  const validationError = validateSoundSubmission(incomingSubmission, meta);
  if (validationError) {
    return NextResponse.json(
      { accepted: false, error: validationError },
      { status: 400 },
    );
  }

  const normalizedPlayer = playerAddress?.toLowerCase();
  if (!isPractice) {
    if (!normalizedPlayer || !meta.players.includes(normalizedPlayer)) {
      return NextResponse.json(
        { accepted: false, error: "Player is not registered for this round." },
        { status: 403 },
      );
    }
    if (incomingSubmission.walletAddress.toLowerCase() !== normalizedPlayer) {
      return NextResponse.json(
        { accepted: false, error: "Submission wallet does not match player." },
        { status: 403 },
      );
    }
  }
  if (incomingSubmission.roomId.toLowerCase() !== roundId.toLowerCase()) {
    return NextResponse.json(
      { accepted: false, error: "Submission round does not match request." },
      { status: 400 },
    );
  }

  const resultKey = `round:${roundId}:result`;
  const existingResult = parseRedisJson<Record<string, unknown>>(
    await redis.get(resultKey),
  );
  if (existingResult && (mode === "solo" || isPractice)) {
    return NextResponse.json({ accepted: true, ...existingResult });
  }

  const submissionIdentity = normalizedPlayer ?? "practice";
  const submissionKey = `round:${roundId}:submission:${submissionIdentity}`;
  const firstSubmission = await redis.set(
    submissionKey,
    JSON.stringify(incomingSubmission),
    { ex: 3600, nx: true },
  );
  const submission = firstSubmission
    ? incomingSubmission
    : parseRedisJson<SoundMatchSubmission>(await redis.get(submissionKey));

  if (!submission) {
    return NextResponse.json(
      { accepted: false, error: "Stored submission could not be read." },
      { status: 409 },
    );
  }

  const timeSec =
    Array.isArray(submission?.rounds) && submission.rounds.length > 0
      ? submission.rounds.reduce((sum, round) => sum + round.latencyMs, 0) /
        1000
      : undefined;

  const canonical = scoreSoundMatch(meta.gameplayConfig, submission);
  const totalScore = canonical.total;
  const acc = canonical.percent;
  const t = tier(acc);

  const baseResult = {
    accepted: true,
    method: "sound-total",
    accuracy: acc,
    tier: t.name,
    payout: t.payout,
    totalScore,
    percentScore: acc,
    soundSummary: {
      total: totalScore,
      percent: acc,
      rounds: canonical.perRound,
    },
    canonicalScore: canonical.total,
  };

  if (isPractice) {
    return NextResponse.json(baseResult);
  }

  // ── SOLO ─────────────────────────────────────────────────────────────────
  if (mode === "solo") {
    try {
      const { reward, tierEnum } = soloRewardAmount(t.name);
      const reserveBalance =
        reward > BigInt(0) ? await getSoloReserveBalance() : BigInt(0);

      if (reward > reserveBalance) {
        const { txHash, refunded } = await backendRefund(roundId);
        await persistResolvedRound({
          gameRoundId: roundId,
          mode,
          source: "solo",
          players: [
            {
              address: normalizedPlayer!,
              accuracy: acc,
              tier: t.name,
              score: Math.round(acc * 100),
              timeSec,
              totalScore,
            },
          ],
          winnerAddress: null,
          rewardByAddress: {
            [normalizedPlayer!]: 0,
          },
          resolved: false,
        });
        const resultData = {
          ...baseResult,
          txHash,
          refunded,
          outcome: "refund",
          refundReason: "solo_reserve_insufficient",
          reserveBalance: Number(reserveBalance) / 1_000_000,
        };
        await redis.set(resultKey, JSON.stringify(resultData), { ex: 3600 });
        return NextResponse.json(resultData);
      }

      const { txHash, resolved } = await signAndResolve(
        roundId,
        [normalizedPlayer as `0x${string}`],
        [reward],
        [tierEnum],
        [BigInt(Math.round(acc * 100))],
        BigInt(0),
        usdcToRaw(1),
        true,
      );
      await persistResolvedRound({
        gameRoundId: roundId,
        mode,
        source: "solo",
          players: [
            {
              address: normalizedPlayer!,
              accuracy: acc,
              tier: t.name,
              score: Math.round(acc * 100),
              timeSec,
              totalScore,
            },
          ],
        winnerAddress: reward > BigInt(0) ? normalizedPlayer : null,
        rewardByAddress: {
          [normalizedPlayer!]: t.payout,
        },
        resolved,
      });
      const resultData = {
        ...baseResult,
        txHash,
        resolved,
        outcome: reward > BigInt(0) ? "prize" : "no-prize",
      };
      await redis.set(resultKey, JSON.stringify(resultData), { ex: 3600 });
      return NextResponse.json(resultData);
    } catch (error: unknown) {
      console.error("Solo resolve error:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json({
        ...baseResult,
        accepted: false,
        onChainError: message,
        message: "Settlement failed. Retry to use the same recorded score.",
      });
    }
  }

  // ── MULTIPLAYER ───────────────────────────────────────────────────────────
  const addrLower = normalizedPlayer!;

  console.log(
    `[submit] Player ${addrLower} submitting for round ${roundId}, mode=${mode}, acc=${acc.toFixed(1)}%`,
  );

  await redis.set(
    `round:${roundId}:score:${addrLower}`,
      JSON.stringify({
        address: addrLower,
        accuracy: acc,
        tier: t.name,
        score: Math.round(acc * 100),
        timeSec,
        totalScore,
      }),
    { ex: 3600, nx: true },
  );

  const players = parseRedisJson<string[]>(
    await redis.get(`round:${roundId}:players`),
  );
  if (!players) {
    console.warn(`[submit] round:${roundId}:players NOT FOUND in Redis`);
    return NextResponse.json({
      ...baseResult,
      waiting: true,
      message: "Round not found",
    });
  }
  // Use actual player count from Redis — friend rooms may have 2-5 players
  // regardless of the mode enum (duel=2, royale=3-5)
  const required = players.length;
  const scoreResults = await Promise.all(
    players.map((p) => redis.get(`round:${roundId}:score:${p.toLowerCase()}`)),
  );
  const submittedCount = scoreResults.filter(Boolean).length;

  console.log(
    `[submit] Round ${roundId}: submitted=${submittedCount}/${required}, players=${JSON.stringify(players)}`,
  );

  if (submittedCount < required) {
    return NextResponse.json({
      ...baseResult,
      waiting: true,
      submitted: submittedCount,
      required,
    });
  }

  return resolveMultiplayer(
    roundId,
    players,
    scoreResults as (string | null)[],
    required,
    baseResult,
  );
}

export async function resolveMultiplayer(
  roundId: string,
  players: string[],
  scoreResults: (string | null)[],
  required: number,
  baseResult: object,
) {
  const resultKey = `round:${roundId}:result`;
  const lockKey = `round:${roundId}:resolving`;

  const existingResult = parseRedisJson<object>(await redis.get(resultKey));
  if (existingResult) {
    return NextResponse.json({
      ...baseResult,
      resolved: true,
      ...existingResult,
    });
  }

  const locked = await redis.set(lockKey, "1", { ex: 120, nx: true });
  if (!locked) {
    const eventualResult = parseRedisJson<object>(await redis.get(resultKey));
    if (eventualResult) {
      return NextResponse.json({
        ...baseResult,
        resolved: true,
        ...eventualResult,
      });
    }
    return NextResponse.json({
      ...baseResult,
      waiting: true,
      resolving: true,
      message: "Resolution in progress",
    });
  }

  const allScores: PlayerScore[] = scoreResults
    .map((s) => parseRedisJson<PlayerScore>(s))
    .filter((x): x is PlayerScore => x !== null);
  allScores.sort((a, b) => {
    const scoreDiff = (b.totalScore ?? 0) - (a.totalScore ?? 0);
    if (scoreDiff !== 0) return scoreDiff;
    const timeDiff =
      (a.timeSec ?? Number.MAX_SAFE_INTEGER) -
      (b.timeSec ?? Number.MAX_SAFE_INTEGER);
    if (timeDiff !== 0) return timeDiff;
    return a.address.toLowerCase().localeCompare(b.address.toLowerCase());
  });
  const winner = allScores[0];

  // Per-round meta set by /api/rooms/start. Defaults preserve existing matchmaking rounds.
  const roundMeta = await getSoundRoundMeta(roundId);
  const casual = roundMeta?.casual === true;
  const stakePerPlayer = usdcToRaw(roundMeta?.stakeAmount ?? 0.5);
  const source = roundMeta?.source === "private" ? "private" : "public";

  if (casual) {
    const resultData = {
      winner: winner.address,
      winnerAccuracy: winner.accuracy,
      winnerPayout: 0,
      allScores,
    };
    await redis.set(resultKey, JSON.stringify(resultData), { ex: 3600 });
    await persistResolvedRound({
      gameRoundId: roundId,
      mode: required <= 2 ? "duel" : "royale",
      source,
      players: allScores,
      winnerAddress: winner.address,
      rewardByAddress: {},
      resolved: true,
    });
    return NextResponse.json({
      ...baseResult,
      ...resultData,
      resolved: true,
      casual: true,
    });
  }

  const totalStake = BigInt(required) * stakePerPlayer;
  const winnerReward = (totalStake * BigInt(80)) / BigInt(100);
  const devRake = (totalStake * BigInt(10)) / BigInt(100);
  const soloRake = totalStake - winnerReward - devRake;

  try {
    const { txHash, resolved } = await signAndResolve(
      roundId,
      [winner.address as `0x${string}`],
      [winnerReward],
      [toTierEnum(winner.tier)],
      [BigInt(winner.score)],
      devRake,
      soloRake,
      false,
    );

    const resultData = {
      winner: winner.address,
      winnerAccuracy: winner.accuracy,
      winnerPayout: Number(winnerReward) / 1_000_000,
      allScores,
      txHash,
    };
    await redis.set(resultKey, JSON.stringify(resultData), { ex: 3600 });
    await persistResolvedRound({
      gameRoundId: roundId,
      mode: required <= 2 ? "duel" : "royale",
      source,
      players: allScores,
      winnerAddress: winner.address,
      rewardByAddress: {
        [winner.address.toLowerCase()]: Number(winnerReward) / 1_000_000,
      },
      resolved,
    });

    return NextResponse.json({ ...baseResult, ...resultData, resolved });
  } catch (error: unknown) {
    console.error("Multiplayer resolve error:", error);
    await redis.del(lockKey);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ...baseResult, onChainError: message });
  }
}
