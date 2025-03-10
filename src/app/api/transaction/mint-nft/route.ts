import { getServerWalletClient } from "@/lib/server-wallet";
import { NextRequest, NextResponse } from "next/server";
import { parseAbi } from "viem";
import { abstractTestnet } from "viem/chains";

// NFT contract details
const NFT_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as `0x${string}`;
const NFT_CONTRACT_ABI = parseAbi(["function mint(address,uint256) external"]);

export async function POST(request: NextRequest) {
  try {
    const { recipient, tokenId } = await request.json();

    if (!recipient || !tokenId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const client = await getServerWalletClient();

    // Execute the mint function on the NFT contract
    const hash = await client.writeContract({
      address: NFT_CONTRACT_ADDRESS,
      abi: NFT_CONTRACT_ABI,
      functionName: "mint",
      args: [recipient as `0x${string}`, BigInt(tokenId)],
      chain: abstractTestnet,
    });

    return NextResponse.json({ hash });
  } catch (error) {
    console.error("Error minting NFT:", error);
    return NextResponse.json({ error: "Failed to mint NFT" }, { status: 500 });
  }
}
