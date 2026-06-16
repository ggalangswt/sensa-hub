import { NextResponse } from "next/server";
import { redis, parseRedisJson } from "@/lib/db/redis";
import { tier } from "@/src/utils/color";
import { resolveMultiplayer } from "../submit/route";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { roundId } = body;

    if (!roundId) {
      return NextResponse.json({ error: "Missing roundId" }, { status: 400 });
    }

    // If already resolved, return result immediately
    const existing = parseRedisJson<object>(
      await redis.get(`round:${roundId}:result`),
    );
    if (existing) {
      return NextResponse.json({ resolved: true, ...existing });
    }

    const players = parseRedisJson<string[]>(
      await redis.get(`round:${roundId}:players`),
    );
    if (!players) {
      return NextResponse.json({ error: "Round not found" }, { status: 404 });
    }

    // Auto-submit a zero-score fallback for any player who hasn't submitted.
    for (const p of players) {
      const key = `round:${roundId}:score:${p.toLowerCase()}`;
      const existing = await redis.get(key);
      if (!existing) {
        const acc = 0;
        const t = tier(acc);
        await redis.set(
          key,
          JSON.stringify({
            address: p.toLowerCase(),
            accuracy: acc,
            tier: t.name,
            score: 0,
            timeSec: 15,
            totalScore: 0,
          }),
          { ex: 3600 },
        );
      }
    }

    // Now all players have scores — resolve
    const scoreResults = await Promise.all(
      players.map((p) =>
        redis.get(`round:${roundId}:score:${p.toLowerCase()}`),
      ),
    );

    const baseResult = { method: "force-resolve" };
    return resolveMultiplayer(
      roundId,
      players,
      scoreResults as (string | null)[],
      players.length,
      baseResult,
    );
  } catch (error: any) {
    console.error("Force-resolve error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
