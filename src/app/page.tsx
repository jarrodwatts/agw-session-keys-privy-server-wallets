"use client";

import { LoginButton } from "@/components/login-button";
import { CreateSession } from "@/components/create-session";
import { SendTransaction } from "@/components/send-transaction";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Abstract Global Wallet with Session Keys
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Use Privy Server Wallets as a signer for Abstract Global Wallet
            session keys.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <LoginButton />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <CreateSession />
            <SendTransaction />
          </div>
        </div>
      </div>
    </main>
  );
}
