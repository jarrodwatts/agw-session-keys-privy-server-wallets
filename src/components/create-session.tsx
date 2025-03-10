"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { useCreateSession } from "@abstract-foundation/agw-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { LimitType } from "@abstract-foundation/agw-client/sessions";
import { parseEther, toFunctionSelector } from "viem";

export function CreateSession() {
  const { address, isConnected } = useAccount();
  const { createSessionAsync, isPending, isError, error } = useCreateSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverWalletAddress, setServerWalletAddress] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the server wallet address when the component mounts
    async function fetchServerWalletAddress() {
      try {
        const response = await fetch("/api/server-wallet/address");
        const data = await response.json();

        if (data.success) {
          setServerWalletAddress(data.address);
        } else {
          console.error("Failed to fetch server wallet address:", data.error);
          toast("Failed to fetch server wallet address");
        }
      } catch (error) {
        console.error("Error fetching server wallet address:", error);
        toast("Error fetching server wallet address");
      } finally {
        setIsLoading(false);
      }
    }

    fetchServerWalletAddress();
  }, []);

  if (!isConnected) {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Session Key</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">Loading server wallet...</p>
        </CardContent>
      </Card>
    );
  }

  if (!serverWalletAddress) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Session Key</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-red-500">
            Failed to load server wallet address
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleCreateSession = async () => {
    if (!address) return;

    try {
      setIsSubmitting(true);

      // Create a session that expires after 7 days
      const expiresAt = BigInt(
        Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
      ); // 7 days

      const result = await createSessionAsync({
        session: {
          signer: serverWalletAddress as `0x${string}`,
          expiresAt,
          feeLimit: {
            limitType: LimitType.Lifetime,
            limit: parseEther("0.1"), // 0.1 ETH lifetime gas limit
            period: BigInt(0),
          },
          callPolicies: [],
          transferPolicies: [],
        },
      });

      console.log("Session created:", result);

      // Send the session ID to our API endpoint
      const response = await fetch("/api/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: result,
          expiresAt: Number(expiresAt),
          userWalletAddress: address,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast("Session created successfully");
      } else {
        toast("Failed to store session information");
      }
    } catch (err) {
      console.error("Error creating session:", err);
      toast("Failed to create session");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Session Key</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          Create a new session that allows our server wallet to execute
          transactions on your behalf. The session will expire after 7 days.
        </p>
        <Button
          onClick={handleCreateSession}
          disabled={isPending || isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {isPending || isSubmitting ? "Creating..." : "Create Session Key"}
        </Button>
        {isError && (
          <p className="mt-2 text-sm text-red-500">
            Error: {error?.message || "Failed to create session"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
