import { NextResponse } from "next/server";

export async function GET() {
  const manifest = {
    accountAssociation: {
      header: "eyJmaWQiOjE0NDk4NjAsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHhDMUM1NEZmQWMwNzM5OGRlNjExQjE5QUU3MWM3NjAxQzgyYzI5NWFGIn0",
      payload: "eyJkb21haW4iOiJtZW1vcnktc2FudGEtdHMtdXp6NS52ZXJjZWwuYXBwIn0",
      signature: "DVpeyxOEFqAZUzQpSR+XNn0xoTJP9WkDcsOJ58UTvnssay4nVUj/eCfcSaASYpU52ayJUxg6KNusmF50bIZdTxw="
    },
    miniapp: {
      version: "1",
      name: "Santa Memory 2026",
      homeUrl: "https://memory-santa-ts-uzz5.vercel.app", 
      iconUrl: "https://memory-santa-ts-uzz5.vercel.app/santa-og.png", 
      // missing fields added below
      imageUrl: "https://memory-santa-ts-uzz5.vercel.app/santa-og.png",
      buttonTitle: "Play Santa 2026",
      splashImageUrl: "https://memory-santa-ts-uzz5.vercel.app/splash.png", 
      splashBackgroundColor: "#d42426",
      webhookUrl: "https://memory-santa-ts-uzz5.vercel.app/api/webhook",
      subtitle: "New Year Memory Challenge",
      description: "Challenge your memory with Santa in 2026! A fun Farcaster miniapp.",
      screenshotUrls: [],
      primaryCategory: "social",
      tags: ["miniapp", "game", "farcaster"],
      heroImageUrl: "https://memory-santa-ts-uzz5.vercel.app/santa-og.png",
      tagline: "Play 2026 Edition",
      ogTitle: "Santa Memory Game 2026",
      ogDescription: "Challenge your memory in real time with the 2026 edition.",
      ogImageUrl: "https://memory-santa-ts-uzz5.vercel.app/santa-og.png",
      noindex: false
    }
  };

  return NextResponse.json(manifest);
}