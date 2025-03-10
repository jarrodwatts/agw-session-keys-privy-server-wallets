"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SendTransaction() {
  const { address, isConnected } = useAccount();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isConnected || !address) {
    return null;
  }

  async function handleSendTransaction() {
    const response = await fetch("/api/server-wallet/submit-tx", {
      method: "POST",
      body: JSON.stringify({ agwAddress: address }),
    });

    const data = await response.json();

    console.log(data);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>2. Send Transaction</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleSendTransaction}
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {isSubmitting ? "Sending..." : "Send Transaction via Server"}
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          This transaction will be sent using our server wallet through your
          approved session. No signature will be required from your wallet.
        </p>
      </CardContent>
    </Card>
  );
}
