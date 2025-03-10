import { NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import { createViemAccount } from "@privy-io/server-auth/viem";
import { checkRequiredEnvVars } from "@/lib/check-env";
import { parseAbi, type Address } from "viem";
import { chain } from "@/const/chain";
import { createSessionClient } from "@abstract-foundation/agw-client/sessions";
import { createSessionConfig } from "@/lib/session-config";
import { parseJson } from "@/lib/parseJson";

type ServerWalletResponse = {};

/**
 * Submit a transaction from a session key using the Privy server wallet.
 * Docs: https://docs.privy.io/guide/server-wallets/usage/ethereum#viem
 * @returns {Promise<NextResponse<ServerWalletResponse>>} An object containing the wallet address.
 */
export async function POST(
  request: Request
): Promise<NextResponse<ServerWalletResponse>> {
  checkRequiredEnvVars();

  // Get the server wallet address from the request body
  const { agwAddress } = await request.json();

  // Initialize Privy client
  const privy = new PrivyClient(
    process.env.PRIVY_APP_ID!,
    process.env.PRIVY_APP_SECRET!
  );

  // Create a viem account instance for a wallet
  const account = await createViemAccount({
    walletId: process.env.PRIVY_SERVER_WALLET_ID!,
    address: process.env.PRIVY_SERVER_WALLET_ADDRESS as Address,
    privy,
  });
  console.log(`🔑 Server wallet address: ${account.address}`);

  const sessionConfig = createSessionConfig(account.address);
  console.log(`🔑 Session config: ${JSON.stringify(parseJson(sessionConfig))}`);

  // Initialize the AGW Session Client to send transactions from the server wallet
  const agwSessionClient = createSessionClient({
    account: agwAddress,
    chain,
    signer: account,
    session: sessionConfig,
  });
  console.log(`🔑 AGW Session Client initialized`);

  // Use the session client to make transactions
  const hash = await agwSessionClient.writeContract({
    account: agwAddress,
    chain,
    address: "0xC4822AbB9F05646A9Ce44EFa6dDcda0Bf45595AA",
    abi: parseAbi(["function mint(address,uint256) external"]),
    functionName: "mint",
    args: [agwAddress, BigInt(1)],
  });

  console.log(`✅ Transaction submitted. Hash: ${hash}`);

  return NextResponse.json({
    hash,
  });
}
