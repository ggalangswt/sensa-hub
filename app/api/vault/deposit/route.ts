import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Direct vault deposits are not supported. Stake through a paid room instead.",
    },
    { status: 410 },
  );
}
