import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { ironOptions, SessionData } from "../nonce/route";
import { chain } from "@/const/chain";

export async function GET() {
  try {
    // Get session
    const session = await getIronSession<SessionData>(
      await cookies(),
      ironOptions
    );

    console.log("session", session);

    if (!session.isAuthenticated || !session.siweMessage) {
      return NextResponse.json(
        { ok: false, message: "No user session found." },
        { status: 401 }
      );
    }

    if (
      session.siweMessage.expirationTime &&
      parseInt(session.siweMessage.expirationTime) < Date.now()
    ) {
      return NextResponse.json(
        { ok: false, message: "SIWE session expired." },
        { status: 401 }
      );
    }

    if (session.siweMessage.chainId !== chain.id) {
      return NextResponse.json(
        { ok: false, message: "Invalid chain." },
        { status: 401 }
      );
    }

    // Return the SIWE session data
    return NextResponse.json({
      ok: true,
      user: {
        isAuthenticated: session.isAuthenticated,
        address: session.address,
        siweMessage: session.siweMessage,
      },
    });
  } catch (error) {
    // Return failure response without exposing error details
    return NextResponse.json({ ok: false });
  }
}
