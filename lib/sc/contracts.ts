import gameAbi from "../abi/SensaSoundGameUpgradeable.json";

const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || "11142220");
const defaultUsdcAddress =
  chainId === 42220
    ? "0xcebA9300f2b948710d2653dD7B07f33A8B32118C"
    : "0x01C5C0122039549AD1493B8220cABEdD739BC44E";

export const GAME_ADDRESS = (process.env.NEXT_PUBLIC_GAME_ADDRESS ||
  "0xB33e13bd00d562Ea9dBffAC0b84540742670AC00") as `0x${string}`;

export const USDC_ADDRESS = (process.env.NEXT_PUBLIC_USDC_ADDRESS ||
  defaultUsdcAddress) as `0x${string}`;

export const usdcAbi = [
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
] as const;

export { gameAbi };
