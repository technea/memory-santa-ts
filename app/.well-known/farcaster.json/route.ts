import { NextResponse } from "next/server";

export async function GET() {
  const manifest = {
    accountAssociation: {
      header: "", 
      // Yeh naya payload hai jo "-uzz5" domain ke liye hai
      payload: "", 
      // Yahan Warpcast tool se 0x wala naya signature lekar dalein
      signature: "" 
    },
    miniapp: {
      version: "1",
      name: "Santa Memory",
      homeUrl: "https://memory-santa-ts-uzz5.vercel.app", 
      iconUrl: "https://memory-santa-ts-uzz5.vercel.app/santa-og.png", 
      splashImageUrl: "https://memory-santa-ts-uzz5.vercel.app/splash.png", 
      splashBackgroundColor: "#d42426",
      webhookUrl: "https://memory-santa-ts-uzz5.vercel.app/api/webhook",
      subtitle: "Christmas Memory Game",
      description: "Challenge your memory with Santa! A fun Farcaster miniapp.",
      screenshotUrls: [],
      primaryCategory: "social",
      tags: ["miniapp", "game", "farcaster"],
      heroImageUrl: "https://memory-santa-ts-uzz5.vercel.app/santa-og.png",
      tagline: "Play instantly",
      ogTitle: "Santa Memory Game",
      ogDescription: "Challenge your memory in real time.",
      ogImageUrl: "https://memory-santa-ts-uzz5.vercel.app/santa-og.png",
      noindex: false
    }
  };

  return NextResponse.json(manifest);
}