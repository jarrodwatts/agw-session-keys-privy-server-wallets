"use client";

import { AbstractWalletProvider } from "@abstract-foundation/agw-react";
import { ReactNode } from "react";
import { abstractTestnet } from "viem/chains";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AbstractWalletProvider chain={abstractTestnet}>
      {children}
    </AbstractWalletProvider>
  );
}
