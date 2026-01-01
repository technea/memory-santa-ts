"use client";

import { useEffect, useState } from "react";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "../config/wagmi";
import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MiniAppSDK from "@farcaster/miniapp-sdk";

const queryClient = new QueryClient();

export default function WagmiProviderWrapper({ children }: PropsWithChildren) {
  const [isMiniAppReady, setIsMiniAppReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // Initialize Farcaster Mini App SDK
        // The default export is the SDK instance with methods
        const isInMiniApp = await MiniAppSDK.isInMiniApp();
        console.log("Is in Mini App:", isInMiniApp);
        setIsMiniAppReady(true);
      } catch (error) {
        console.error("Farcaster Mini App SDK error:", error);
        // Still set to ready even if there's an error, so the app can function
        setIsMiniAppReady(true);
      }
    };

    init();
  }, []);

  if (!isMiniAppReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing Farcaster Mini App...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        {children}
      </WagmiProvider>
    </QueryClientProvider>
  );
}
