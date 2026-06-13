import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Withdrawals must be submitted from the connected wallet through the vault page.",
    },
    { status: 410 },
  );
}
