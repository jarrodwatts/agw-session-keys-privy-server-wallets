import { parseEther } from "viem";
import {
  LimitType,
  SessionConfig,
} from "@abstract-foundation/agw-client/sessions";
import { toFunctionSelector } from "viem";

export function createSessionConfig(
  serverWalletAddress: `0x${string}`
): SessionConfig {
  return {
    signer: serverWalletAddress,
    expiresAt: BigInt(Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60),
    feeLimit: {
      limitType: LimitType.Lifetime,
      limit: parseEther("1"), // 1 ETH lifetime gas limit
      period: BigInt(0),
    },
    callPolicies: [
      {
        target: "0xC4822AbB9F05646A9Ce44EFa6dDcda0Bf45595AA", // Contract address
        selector: toFunctionSelector("mint(address,uint256)"), // Allowed function
        valueLimit: {
          limitType: LimitType.Unlimited,
          limit: BigInt(0),
          period: BigInt(0),
        },
        maxValuePerUse: BigInt(0),
        constraints: [],
      },
    ],
    transferPolicies: [],
  };
}
