import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WagmiProviderWrapper from "@/components/WagmiProviderWrapper";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const frameMetadata = {
  version: "next",
  imageUrl: "https://memory-santa-ts.vercel.app/santa-og.png",
  button: {
    title: "Play Santa Game",
    action: {
      type: "launch_frame",
      name: "Santa Memory",
      url: "https://memory-santa-ts.vercel.app/",
      splashImageUrl: "https://memory-santa-ts.vercel.app/splash.png",
      splashBackgroundColor: "#d42426",
    },
  },
};

export const metadata: Metadata = {
  title: "Santa Memory Game",
  description: "A fun Christmas memory game for Farcaster",
  other: {
    "fc:frame": JSON.stringify(frameMetadata),
    "base:app_id": "6947b8b5d77c069a945be3bd",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <WagmiProviderWrapper>{children}</WagmiProviderWrapper>
      </body>
    </html>
  );
}
