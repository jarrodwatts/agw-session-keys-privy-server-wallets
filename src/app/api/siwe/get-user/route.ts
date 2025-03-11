import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { ironOptions, SessionData } from "../nonce/route";

export async function GET() {
  try {
    // Get session
    const session = await getIronSession<SessionData>(
      await cookies(),
      ironOptions
    );

    console.log("session", session);

    // Check if session contains SIWE data
    if (!session.isAuthenticated) {
      return NextResponse.json(
        { ok: false, message: "No user session found." },
        { status: 404 }
      );
    }

    // Return the SIWE session data
    return NextResponse.json({
      ok: true,
      user: {
        isAuthenticated: session.isAuthenticated,
        address: session.address,
        chainId: session.chainId,
      },
    });
  } catch (error) {
    // Return failure response without exposing error details
    return NextResponse.json({ ok: false });
  }
}
