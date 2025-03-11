// app/api/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { SiweMessage } from "siwe";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { ironOptions, SessionData } from "../nonce/route";
import { createPublicClient, http } from "viem";
import { chain } from "@/const/chain";

export async function POST(request: NextRequest) {
  try {
    // Get request body
    const { message, signature } = await request.json();

    // Get session
    const session = await getIronSession<SessionData>(
      await cookies(),
      ironOptions
    );

    const publicClient = createPublicClient({
      chain,
      transport: http(),
    });

    try {
      // Create and verify the SIWE message
      const valid = await publicClient.verifySiweMessage({
        message,
        signature,
        nonce: session.nonce,
      });

      // If verification is successful, update the session
      if (valid) {
        // Parse the message to get user information
        const siweMessage = new SiweMessage(message);

        // Store the SIWE response in the session
        session.isAuthenticated = true;
        session.address = siweMessage.address as `0x${string}`;
        session.siweMessage = siweMessage;
        await session.save();
      }

      if (!valid) {
        return NextResponse.json(
          { ok: false, message: "Invalid signature." },
          { status: 422 }
        );
      }
    } catch (error) {
      console.error("Error verifying SIWE message:", error);
      return NextResponse.json(
        { ok: false, message: "Error verifying SIWE message" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    // Return failure response without exposing error details
    return NextResponse.json({ ok: false });
  }
}
