import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- FARCASTER FRAME V2 METADATA START ---
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
// --- FARCASTER FRAME V2 METADATA END ---

export const metadata: Metadata = {
  title: "Santa Memory Game",
  description: "A fun Christmas memory game for Farcaster",
  other: {
    "fc:frame": JSON.stringify(frameMetadata),
    // --- BASE APP ID TAG START ---
    "base:app_id": "6947b8b5d77c069a945be3bd", 
    // --- BASE APP ID TAG END ---
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}