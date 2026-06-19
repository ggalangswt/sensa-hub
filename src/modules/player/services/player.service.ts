export async function updatePlayerName(
  walletAddress: string,
  displayName: string,
): Promise<{ error?: string }> {
  const response = await fetch("/api/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress, displayName }),
  });

  return response.json();
}
