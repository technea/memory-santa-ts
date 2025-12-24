"use client";

import { useEffect, useState } from "react";
import { sdk } from "@farcaster/frame-sdk"; // Is se pehle terminal mein 'npm install @farcaster/frame-sdk' karna hoga

export default function SantaMemoryGame() {
  const [isSDKReady, setIsSDKReady] = useState(false);
  const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; solved: boolean }[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const emojis = ["🎅", "🎄", "🎁", "🦌", "❄️", "🔔", "🌟", "⛄"];

  // 1. Farcaster SDK Ready Signal
  useEffect(() => {
    const loadSDK = async () => {
      sdk.actions.ready();
    };
    if (sdk) {
      loadSDK();
      setIsSDKReady(true);
    }
  }, []);

  // 2. Game Logic
  useEffect(() => {
    const shuffledCards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, flipped: false, solved: false }));
    setCards(shuffledCards);
  }, []);

  const handleFlip = (id: number) => {
    if (flipped.length === 2 || cards[id].flipped || cards[id].solved) return;
    const newCards = [...cards];
    newCards[id].flipped = true;
    setCards(newCards);
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        newCards[first].solved = true;
        newCards[second].solved = true;
        setCards(newCards);
        setFlipped([]);
      } else {
        setTimeout(() => {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards(newCards);
          setFlipped([]);
        }, 1000);
      }
    }
  };

  if (!isSDKReady) return <div>Loading Santa Game...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "#f0f0f0", minHeight: "100vh", padding: "20px", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#d42426" }}>🎅 Santa Memory</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginTop: "20px" }}>
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleFlip(card.id)}
            style={{
              width: "65px", height: "65px", background: card.flipped || card.solved ? "#fff" : "#d42426",
              display: "flex", justifyContent: "center", alignItems: "center", fontSize: "25px",
              cursor: "pointer", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}
          >
            {(card.flipped || card.solved) ? card.emoji : "❓"}
          </div>
        ))}
      </div>
      <button 
        onClick={() => window.location.reload()}
        style={{ marginTop: "30px", padding: "10px 20px", background: "#d42426", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
      >
        Reset Game
      </button>
    </div>
  );
}