import { NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import { checkRequiredEnvVars } from "@/lib/check-env";

type ServerWalletResponse = {
  walletId: string;
  address: string;
};

/**
 * Create a new Privy server wallet
 * Docs: https://docs.privy.io/guide/server-wallets/create/
 * @returns {Promise<NextResponse<ServerWalletResponse>>} An object containing the walletId, wallet address.
 */
export async function GET(): Promise<NextResponse<ServerWalletResponse>> {
  checkRequiredEnvVars(["PRIVY_APP_ID", "PRIVY_APP_SECRET"]);

  // Initialize Privy client
  const privy = new PrivyClient(
    process.env.PRIVY_APP_ID!,
    process.env.PRIVY_APP_SECRET!
  );

  // Create a server wallet
  const { id: walletId, address } = await privy.walletApi.create({
    chainType: "ethereum",
  });

  console.log(`✅ Server wallet created. 
    
Store the following values in your environment variables or datababase:
  PRIVY_SERVER_WALLET_ID: ${walletId}
  PRIVY_SERVER_WALLET_ADDRESS: ${address}`);

  return NextResponse.json({
    walletId,
    address,
  });
}
