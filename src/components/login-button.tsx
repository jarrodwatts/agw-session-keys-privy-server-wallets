"use client";

import { useLoginWithAbstract } from "@abstract-foundation/agw-react";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";

/**
 * A button that allows the user to login with their Abstract Wallet.
 * Docs: https://docs.abs.xyz/abstract-global-wallet/agw-react/hooks/useLoginWithAbstract
 */
export function LoginButton() {
  const { login } = useLoginWithAbstract();
  const { isConnected, status } = useAccount();

  if (isConnected) {
    return null;
  }

  const isLoading = status === "connecting" || status === "reconnecting";

  return (
    <Button
      onClick={login}
      disabled={isLoading}
      className="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer transition-colors duration-200"
    >
      {isLoading ? "Connecting..." : "Connect with Abstract Wallet"}
    </Button>
  );
}
