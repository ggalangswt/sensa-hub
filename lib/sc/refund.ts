import { GAME_ADDRESS, gameAbi } from "./contracts";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { celoSepolia } from "./wagmi";
import { publicClient } from "./resolve";

function getBackendPrivateKey() {
  const value = process.env.BACKEND_PRIVATE_KEY;
  if (!value) {
    throw new Error("BACKEND_PRIVATE_KEY is required for on-chain refunds");
  }
  if (!/^0x[0-9a-fA-F]{64}$/.test(value)) {
    throw new Error("BACKEND_PRIVATE_KEY must be a 0x-prefixed 32-byte private key");
  }
  return value as `0x${string}`;
}

function createBackendWalletClient() {
  return createWalletClient({
    account: privateKeyToAccount(getBackendPrivateKey()),
    chain: celoSepolia,
    transport: http(process.env.NEXT_PUBLIC_RPC_URL),
  });
}

export async function backendRefund(
  roundId: string,
): Promise<{ txHash: string; refunded: boolean }> {
  const walletClient = createBackendWalletClient();
  const txHash = await walletClient.writeContract({
    address: GAME_ADDRESS,
    abi: gameAbi,
    functionName: "refundStake",
    args: [roundId as `0x${string}`],
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
  return { txHash, refunded: receipt.status === "success" };
}

export async function readStake(
  roundId: string,
  player: string,
): Promise<bigint> {
  try {
    const amount = await publicClient.readContract({
      address: GAME_ADDRESS,
      abi: gameAbi,
      functionName: "stakes",
      args: [roundId as `0x${string}`, player as `0x${string}`],
    });
    return amount as bigint;
  } catch {
    return BigInt(0);
  }
}

export async function isRoundRefunded(roundId: string): Promise<boolean> {
  try {
    const r = await publicClient.readContract({
      address: GAME_ADDRESS,
      abi: gameAbi,
      functionName: "roundRefunded",
      args: [roundId as `0x${string}`],
    });
    return r as boolean;
  } catch {
    return false;
  }
}

// Queries on-chain rather than trusting the Redis staked flag (which can lag behind).
export async function roundHasOnChainStakes(
  roundId: string,
  players: { address: string }[],
): Promise<boolean> {
  const amounts = await Promise.all(players.map((p) => readStake(roundId, p.address)));
  return amounts.some((a) => a > BigInt(0));
}
