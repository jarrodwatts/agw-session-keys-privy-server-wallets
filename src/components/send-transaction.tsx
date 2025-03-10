"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function SendTransaction() {
  const { address, isConnected } = useAccount();
  const [recipient, setRecipient] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isConnected || !address) {
    return null;
  }

  const handleSendTransaction = async () => {
    if (!recipient) return;

    try {
      setIsSubmitting(true);

      // Send the transaction request to our server wallet API
      const response = await fetch("/api/server-wallet/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userWalletAddress: address,
          to: recipient,
          value: "0", // 0 ETH, just a ping
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast(`Transaction sent successfully: ${data.transactionHash}`);
      } else {
        toast(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error sending transaction:", error);
      toast("Error sending transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Send Transaction via Server Wallet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient Address</Label>
          <Input
            id="recipient"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>
        <Button
          onClick={handleSendTransaction}
          disabled={isSubmitting || !recipient}
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
