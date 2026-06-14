import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { defineChain } from "viem";

const celoMainnet = defineChain({
  id: 42220,
  name: "Celo",
  nativeCurrency: { name: "CELO", symbol: "CELO", decimals: 18 },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_RPC_URL || "https://forno.celo.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Celoscan",
      url: "https://celoscan.io",
    },
  },
  testnet: false,
});

const celoSepoliaChain = defineChain({
  id: 11142220,
  name: "Celo Sepolia",
  nativeCurrency: { name: "CELO", symbol: "CELO", decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        process.env.NEXT_PUBLIC_RPC_URL ||
          "https://forno.celo-sepolia.celo-testnet.org",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Celo Sepolia Explorer",
      url: "https://celo-sepolia.blockscout.com",
    },
  },
  testnet: true,
});

const configuredChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || "11142220");

export const celoChain =
  configuredChainId === celoMainnet.id ? celoMainnet : celoSepoliaChain;

// Backward-compatible alias for existing imports.
export const celoSepolia = celoChain;

export const config = createConfig({
  chains: [celoChain],
  connectors: [injected()],
  transports: {
    [celoMainnet.id]: http(
      configuredChainId === celoMainnet.id
        ? process.env.NEXT_PUBLIC_RPC_URL
        : undefined,
    ),
    [celoSepoliaChain.id]: http(
      configuredChainId === celoSepoliaChain.id
        ? process.env.NEXT_PUBLIC_RPC_URL
        : undefined,
    ),
  },
  ssr: true,
});
