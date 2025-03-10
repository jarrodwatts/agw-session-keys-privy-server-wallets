import { PrivyClient } from "@privy-io/server-auth";
import { createViemAccount } from "@privy-io/server-auth/viem";
import { createWalletClient, http } from "viem";
import { abstractTestnet } from "viem/chains";

// Initialize Privy client
const privy = new PrivyClient(
  process.env.PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

// Create or get existing server wallet
export async function getServerWallet() {
  // Check if we already have a wallet ID stored
  let walletId = process.env.SERVER_WALLET_ID;
  let walletAddress = process.env.SERVER_WALLET_ADDRESS;

  if (!walletId || !walletAddress) {
    // Create a new server wallet if none exists
    const { id, address } = await privy.walletApi.create({
      chainType: "ethereum",
    });
    walletId = id;
    walletAddress = address;
    // In a production environment, you would store these securely
    console.log(`Created new server wallet: ${id} with address ${address}`);
  }

  return { walletId, address: walletAddress as `0x${string}` };
}

// Create a Viem account from the server wallet
export async function getServerWalletAccount() {
  const { walletId, address } = await getServerWallet();

  const account = await createViemAccount({
    walletId,
    address,
    privy,
  });

  return account;
}

// Create a Viem wallet client with the server wallet account
export async function getServerWalletClient() {
  const account = await getServerWalletAccount();

  const client = createWalletClient({
    account,
    chain: abstractTestnet,
    transport: http(),
  });

  return client;
}
