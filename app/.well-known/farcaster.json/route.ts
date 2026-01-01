import { NextResponse } from "next/server";

export async function GET() {
  const manifest = {
    accountAssociation: {
      header: "eyJmaWQiOjE0NDk4NjAsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHhDMUM1NEZmQWMwNzM5OGRlNjExQjE5QUU3MWM3NjAxQzgyYzI5NWFGIn0",
      payload: "eyJkb21haW4iOiJtZW1vcnktc2FudGEtdHMtdXp6NS52ZXJjZWwuYXBwIn0",
      signature: "DVpeyxOEFqAZUzQpSR+XNn0xoTJP9WkDcsOJ58UTvnssay4nVUj/eCfcSaASYpU52ayJUxg6KNusmF50bIZdTxw="
    },
    miniapp: {
      version: "1.0.0",
      name: "Memory 2026",
      homeUrl: "https://memory-santa-ts-uzz5.vercel.app", 
      // Image updated to: nft/unnamed (2).jpg
      iconUrl: "https://memory-santa-ts-uzz5.vercel.app/nft/unnamed%20(2).jpg", 
      imageUrl: "https://memory-santa-ts-uzz5.vercel.app/nft/unnamed%20(2).jpg",
      heroImageUrl: "https://memory-santa-ts-uzz5.vercel.app/nft/unnamed%20(2).jpg",
      ogImageUrl: "https://memory-santa-ts-uzz5.vercel.app/nft/unnamed%20(2).jpg",
      
      buttonTitle: "Start Memory 2026",
      splashImageUrl: "https://memory-santa-ts-uzz5.vercel.app/nft/unnamed%20(2).jpg", 
      splashBackgroundColor: "#000000",
      webhookUrl: "https://memory-santa-ts-uzz5.vercel.app/api/webhook",
      subtitle: "The 2026 Challenge",
      description: "Test your skills in the 2026 Memory Challenge on Farcaster.",
      screenshotUrls: [],
      primaryCategory: "social",
      tags: ["miniapp", "game", "farcaster", "2026", "memory"],
      tagline: "Memory 2026 Edition",
      ogTitle: "Memory 2026",
      ogDescription: "Official 2026 Memory Miniapp",
      noindex: false
    }
  };

  return NextResponse.json(manifest);
}