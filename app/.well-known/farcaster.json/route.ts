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