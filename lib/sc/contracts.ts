import gameAbi from "../abi/SensaSoundGameUpgradeable.json";
import usdcAbi from "../abi/MockUSDC.json";

export const GAME_ADDRESS = (process.env.NEXT_PUBLIC_GAME_ADDRESS ||
  "0xB33e13bd00d562Ea9dBffAC0b84540742670AC00") as `0x${string}`;

export const USDC_ADDRESS = (process.env.NEXT_PUBLIC_USDC_ADDRESS ||
  "0x01C5C0122039549AD1493B8220cABEdD739BC44E") as `0x${string}`;

export { gameAbi, usdcAbi };
