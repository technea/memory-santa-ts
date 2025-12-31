import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WagmiProviderWrapper from "@/components/WagmiProviderWrapper";

const geistSans = Geist({ 
  variable: "--font-geist-sans", 
  subsets: ["latin"],
  preload: false 
});
const geistMono = Geist_Mono({ 
  variable: "--font-geist-mono", 
  subsets: ["latin"],
  preload: false 
});

// FIXED: Added -uzz5 to all URLs
const frameMetadata = {
  version: "next",
  imageUrl: "https://memory-santa-ts-uzz5.vercel.app/santa-og.png",
  button: {
    title: "Play Santa Game",
    action: {
      type: "launch_frame",
      name: "Santa Memory",
      url: "https://memory-santa-ts-uzz5.vercel.app/",
      splashImageUrl: "https://memory-santa-ts-uzz5.vercel.app/splash.png",
      splashBackgroundColor: "#d42426",
    },
  },
};

export const metadata: Metadata = {
  title: "Santa Memory Game",
  description: "A fun Christmas memory game for Farcaster",
  other: {
    "fc:frame": JSON.stringify(frameMetadata),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <WagmiProviderWrapper>
          {children}
        </WagmiProviderWrapper>
      </body>
    </html>
  );
}