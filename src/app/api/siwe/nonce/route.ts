// app/api/nonce/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { generateNonce } from "siwe";
import { getIronSession } from "iron-session";
import { SiweMessage } from "siwe";
import { ironOptions } from "@/types/ironOptions";

export interface SessionData {
  nonce?: string;
  isAuthenticated?: boolean;
  address?: `0x${string}`;
  siweMessage?: SiweMessage;
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
