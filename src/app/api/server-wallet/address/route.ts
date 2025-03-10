import { NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";

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
  if (!process.env.PRIVY_APP_ID || !process.env.PRIVY_APP_SECRET) {
    throw new Error(
      "❌ .env variables: PRIVY_APP_ID and PRIVY_APP_SECRET must be set"
    );
  }

  // Initialize Privy client
  const privy = new PrivyClient(
    process.env.PRIVY_APP_ID!,
    process.env.PRIVY_APP_SECRET!
  );

  // Create a server wallet
  const { id: walletId, address } = await privy.walletApi.create({
    chainType: "ethereum",
  });

  console.log("Server wallet created:", { walletId, address });

  return NextResponse.json({
    walletId,
    address,
  });
}
