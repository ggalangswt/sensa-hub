import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db/supabase";
import { generateUniqueName } from "@/src/utils/names";

function sanitizeDisplayName(value: unknown): string {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 24);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { walletAddress } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Missing walletAddress" },
        { status: 400 },
      );
    }

    const addr = walletAddress.toLowerCase();

    const { data: existing } = await supabaseAdmin
      .from("players")
      .select("*")
      .eq("wallet_address", addr)
      .single();

    if (existing) {
      return NextResponse.json(existing);
    }

    const displayName = generateUniqueName();

    const { data: newPlayer, error } = await supabaseAdmin
      .from("players")
      .insert({
        wallet_address: addr,
        display_name: displayName,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to register player:", error);
      return NextResponse.json({
        wallet_address: addr,
        display_name: displayName,
      });
    }

    return NextResponse.json(newPlayer);
  } catch (error: unknown) {
    console.error("API /me error:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const walletAddress = body?.walletAddress as string | undefined;
    const nextDisplayName = sanitizeDisplayName(body?.displayName);

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Missing walletAddress" },
        { status: 400 },
      );
    }
    if (nextDisplayName.length < 3) {
      return NextResponse.json(
        { error: "Name must be at least 3 characters" },
        { status: 400 },
      );
    }
    if (!/^[A-Za-z0-9 _-]+$/.test(nextDisplayName)) {
      return NextResponse.json(
        { error: "Name may only contain letters, numbers, spaces, _ or -" },
        { status: 400 },
      );
    }

    const addr = walletAddress.toLowerCase();

    const { data: conflict } = await supabaseAdmin
      .from("players")
      .select("wallet_address")
      .ilike("display_name", nextDisplayName)
      .neq("wallet_address", addr)
      .limit(1)
      .maybeSingle();

    if (conflict) {
      return NextResponse.json(
        { error: "That name is already used by another player" },
        { status: 409 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("players")
      .upsert(
        {
          wallet_address: addr,
          display_name: nextDisplayName,
        },
        { onConflict: "wallet_address" },
      )
      .select()
      .single();

    if (error) {
      console.error("Failed to update player name:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("API /me PATCH error:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
