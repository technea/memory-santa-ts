"use client";

import { useEffect } from "react"; // 1. useEffect import karein
import sdk from "@farcaster/frame-sdk"; // 2. SDK import karein
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "../config/wagmi";
import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function WagmiProviderWrapper({ children }: PropsWithChildren) {
  
  // 3. Ye block splash screen hatane ke liye hai
  useEffect(() => {
    const init = async () => {
      try {
        await sdk.actions.ready();
      } catch (error) {
        console.error("Farcaster SDK error:", error);
      }
    };

    init();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        {children}
      </WagmiProvider>
    </QueryClientProvider>
  );
}