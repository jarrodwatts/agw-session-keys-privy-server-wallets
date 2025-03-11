// app/api/nonce/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { generateNonce, SiweResponse } from "siwe";
import { getIronSession } from "iron-session";

export const ironOptions = {
  cookieName: "siwe",
  password: process.env.IRON_SESSION_PASSWORD as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export interface SessionData {
  nonce?: string;
  isAuthenticated?: boolean;
  address?: `0x${string}`;
  chainId?: number;
}

export async function GET() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    ironOptions
  );

  // Generate and store the nonce
  const nonce = generateNonce();
  session.nonce = nonce;
  await session.save();

  // Return the nonce as plain text
  return new NextResponse(nonce);
}
