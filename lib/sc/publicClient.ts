import { createPublicClient, http } from "viem";
import { celoSepolia } from "./wagmi";

export const publicClient = createPublicClient({
  chain: celoSepolia,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL),
});
