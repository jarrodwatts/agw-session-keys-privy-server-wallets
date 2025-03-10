"use client";

import { chain } from "@/const/chain";
import { AbstractWalletProvider } from "@abstract-foundation/agw-react";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AbstractWalletProvider chain={chain}>{children}</AbstractWalletProvider>
  );
}
