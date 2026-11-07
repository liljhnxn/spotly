import deployedAddress from "@/contracts/deployedAddress.json";

export const CONTRACT_ADDRESS: `0x${string}` = (
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS &&
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS.startsWith("0x") &&
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000"
    ? process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
    : (deployedAddress?.address as `0x${string}`) || "0x0000000000000000000000000000000000000000"
) as `0x${string}`;

