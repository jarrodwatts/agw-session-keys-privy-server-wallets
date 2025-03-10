"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { useCreateSession } from "@abstract-foundation/agw-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSessionConfig } from "@/lib/session-config";

export function CreateSession() {
  const { address, isConnected } = useAccount();
  const { createSessionAsync, isPending, isError, error } = useCreateSession();
  const [serverWalletAddress, setServerWalletAddress] = useState<
    `0x${string}` | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the server wallet address when the component mounts
  useEffect(() => {
    async function fetchServerWalletAddress() {
      try {
        const response = await fetch("/api/server-wallet/get");
        const data = await response.json();

        if (data.address) {
          setServerWalletAddress(data.address as `0x${string}`);
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
      const result = await createSessionAsync({
        session: createSessionConfig(serverWalletAddress),
      });

      console.log(result);

      if (result.session) {
        toast("Session created successfully");
      } else {
        toast("Failed to store session information");
      }
    } catch (err) {
      console.error("Error creating session:", err);
      toast("Failed to create session");
    }
  };

  return (
    <Card className="w-full max-w-md gap-3">
      <CardHeader>
        <CardTitle>1. Create Session Key</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          Create a new session that allows the Privy Server Wallet to execute
          NFT mint transactions on behalf of your AGW.
          <br /> <br /> The session will expire after 7 days.
        </p>
        <Button
          onClick={handleCreateSession}
          disabled={isPending}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white hover:cursor-pointer"
        >
          {isPending ? "Creating..." : "Create Session Key"}
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
