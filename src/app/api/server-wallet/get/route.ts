import { NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import { checkRequiredEnvVars } from "@/lib/check-env";

type ServerWalletResponse = {
  address: string;
};

/**
 * Get the Privy server wallet address via it's ID.
 * Docs: https://docs.privy.io/guide/server-wallets/get/all-wallets
 * @returns {Promise<NextResponse<ServerWalletResponse>>} An object containing the wallet address.
 */
export async function GET(): Promise<NextResponse<ServerWalletResponse>> {
  checkRequiredEnvVars();

  // Initialize Privy client
  const privy = new PrivyClient(
    process.env.PRIVY_APP_ID!,
    process.env.PRIVY_APP_SECRET!
  );

  // Get the Privy server wallet address via it's ID.
  const result = await privy.walletApi.getWallet({
    id: process.env.PRIVY_SERVER_WALLET_ID!,
  });

  return NextResponse.json({
    address: result.address,
  });
}
