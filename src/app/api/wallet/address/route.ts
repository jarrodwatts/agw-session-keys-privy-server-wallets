import { getServerWallet } from "@/lib/server-wallet";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { address } = await getServerWallet();
    return NextResponse.json({ address });
  } catch (error) {
    console.error("Error getting server wallet address:", error);
    return NextResponse.json(
      { error: "Failed to get server wallet address" },
      { status: 500 }
    );
  }
}
