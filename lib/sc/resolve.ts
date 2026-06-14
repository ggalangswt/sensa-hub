import {
  createWalletClient,
  createPublicClient,
  http,
  encodeAbiParameters,
  parseAbiParameters,
  keccak256,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { GAME_ADDRESS, gameAbi } from "./contracts";
import { celoSepolia } from "./wagmi";

const CHAIN_ID = 11142220;

function getPrivateKey(name: "SIGNER_PRIVATE_KEY" | "BACKEND_PRIVATE_KEY") {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required for on-chain settlement`);
  }
  if (!/^0x[0-9a-fA-F]{64}$/.test(value)) {
    throw new Error(`${name} must be a 0x-prefixed 32-byte private key`);
  }
  return value as `0x${string}`;
}

export function getSignerAccount() {
  return privateKeyToAccount(getPrivateKey("SIGNER_PRIVATE_KEY"));
}

function getBackendAccount() {
  return privateKeyToAccount(getPrivateKey("BACKEND_PRIVATE_KEY"));
}

export const publicClient = createPublicClient({
  chain: celoSepolia,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL),
});

function createBackendWalletClient() {
  const backendAccount = getBackendAccount();
  return createWalletClient({
    account: backendAccount,
    chain: celoSepolia,
    transport: http(process.env.NEXT_PUBLIC_RPC_URL),
  });
}

export function toTierEnum(tierName: string): number {
  switch (tierName) {
    case "WHAT?!":
    case "WHAT":
      return 5;
    case "GREAT":
      return 4;
    case "GOOD":
      return 3;
    case "OK":
      return 2;
    case "MEH":
      return 1;
    default:
      return 0;
  }
}

export async function signAndResolve(
  roundId: string,
  winners: `0x${string}`[],
  rewards: bigint[],
  tiers: number[],
  scores: bigint[],
  devRake: bigint,
  soloRake: bigint,
  drainSoloReserve: boolean,
): Promise<{ txHash: string; resolved: boolean }> {
  const signerAccount = getSignerAccount();
  const backendAccount = getBackendAccount();
  const walletClient = createBackendWalletClient();
  const roundIdHex = roundId as `0x${string}`;
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 5 * 60);
  const totalRewards = rewards.reduce((sum, reward) => sum + reward, BigInt(0));

  if (drainSoloReserve && totalRewards > BigInt(0)) {
    const reserveBalance = (await publicClient.readContract({
      address: GAME_ADDRESS,
      abi: gameAbi,
      functionName: "soloReserveBalance",
    })) as bigint;

    if (totalRewards > reserveBalance) {
      throw new Error(
        `Solo reserve insufficient: need ${Number(totalRewards) / 1_000_000} USDm, have ${Number(reserveBalance) / 1_000_000} USDm`,
      );
    }
  }

  const hash = keccak256(
    encodeAbiParameters(
      parseAbiParameters(
        "bytes32, address[], uint256[], uint8[], uint256[], uint256, uint256, bool, uint256, address, uint256",
      ),
      [
        roundIdHex,
        winners,
        rewards,
        tiers,
        scores,
        devRake,
        soloRake,
        drainSoloReserve,
        deadline,
        GAME_ADDRESS,
        BigInt(CHAIN_ID),
      ],
    ),
  );

  const signature = await signerAccount.signMessage({ message: { raw: hash } });
  const args = [
    roundIdHex,
    winners,
    rewards,
    tiers,
    scores,
    devRake,
    soloRake,
    drainSoloReserve,
    deadline,
    signature,
  ] as const;

  await publicClient.simulateContract({
    account: backendAccount,
    address: GAME_ADDRESS,
    abi: gameAbi,
    functionName: "resolveRound",
    args,
  });

  const txHash = await walletClient.writeContract({
    address: GAME_ADDRESS,
    abi: gameAbi,
    functionName: "resolveRound",
    args,
  });

  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });
  if (receipt.status !== "success") {
    throw new Error(`resolveRound transaction reverted: ${txHash}`);
  }

  return { txHash, resolved: receipt.status === "success" };
}

export type PlayerScore = {
  address: string;
  accuracy: number;
  tier: string;
  score: number;
  timeSec?: number;
  guess?: { h: number; s: number; l: number };
};
