'use client';

import { useEffect, useState } from "react";

const EMOJIS = ["🐱", "🐶", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];

const generateDeck = (): string[] => {
  const deck = [...EMOJIS, ...EMOJIS];
  return deck.sort(() => Math.random() - 0.5);
};

export default function MemoryGame() {
  const [cards, setCards] = useState<string[]>(generateDeck());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [hints, setHints] = useState<number>(3);
  const [autoHintUsed, setAutoHintUsed] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);
  const [hintedIndices, setHintedIndices] = useState<number[]>([]);

  /* 🔹 AUTO FIRST MATCH HINT */
  useEffect(() => {
    if (solved.length === 0 && !autoHintUsed) {
      const map: Record<string, number[]> = {};
      cards.forEach((v, i) => {
        if (!map[v]) map[v] = [];
        map[v].push(i);
      });

      const pair = Object.values(map).find(p => p.length === 2);
      if (!pair) return;

      setFlipped(pair);
      setAutoHintUsed(true);

      setTimeout(() => setFlipped([]), 1200);
    }
  }, [cards, solved, autoHintUsed]);

  /* 🔹 MATCH CHECK */
  useEffect(() => {
    if (flipped.length === 2) {
      setMoves(m => m + 1);
      
      setTimeout(() => {
        const [a, b] = flipped;
        
        if (cards[a] === cards[b]) {
          setSolved(prev => [...prev, a, b]);
        } else {
          setHints(h => h + 1);
        }
        setFlipped([]);
      }, 800);
    }
  }, [flipped, cards]);

  /* 🔹 CHECK GAME COMPLETE */
  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      setGameWon(true);
    }
  }, [solved, cards.length]);

  const handleClick = (index: number): void => {
    if (
      flipped.length < 2 &&
      !flipped.includes(index) &&
      !solved.includes(index) &&
      !gameWon
    ) {
      setFlipped(prev => [...prev, index]);
    }
  };

  /* 🔹 USE HINT BUTTON */
  const useHint = (): void => {
    if (hints <= 0 || gameWon) {
      alert('No hints available! Complete quizzes to earn more hints.');
      return;
    }

    // Find unmatched cards
    const unmatchedIndices = cards
      .map((_, index) => index)
      .filter(index => !solved.includes(index));

    if (unmatchedIndices.length === 0) return;

    // Use hint
    setHints(h => h - 1);
    
    // Temporarily reveal all unmatched cards
    setHintedIndices(unmatchedIndices);

    // Flip back after 1.5 seconds
    setTimeout(() => {
      setHintedIndices([]);
    }, 1500);
  };

  const earnHint = () => {
    if (gameWon) return;
    
    // For now, just add a hint (in a real implementation, this would show a quiz)
    setHints(h => Math.min(3, h + 1));
  };

  const resetGame = (): void => {
    if (!window.confirm("Reset the game? All progress will be lost.")) return;
    
    setCards(generateDeck());
    setFlipped([]);
    setSolved([]);
    setHints(3);
    setAutoHintUsed(false);
    setGameWon(false);
    setMoves(0);
  };

  const matchedPairs = solved.length / 2;
  const totalPairs = cards.length / 2;

  // Calculate game progress percentage
  const progressPercentage = totalPairs > 0 ? (matchedPairs / totalPairs) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-yellow-300 to-orange-500 bg-clip-text text-transparent mb-2">
          🧠 Emoji Memory Game
        </h1>
        <p className="text-sm text-gray-400">Find matching pairs to win!</p>
      </div>

      {/* Game Stats Container */}
      <div className="w-full max-w-2xl mb-8">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-300">Progress</span>
            <span className="text-green-400 font-bold">
              {matchedPairs}/{totalPairs} pairs
            </span>
          </div>
          <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Moves */}
          <div className="p-4 bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-2xl border border-blue-500/20">
            <div className="text-2xl font-black text-blue-300">{moves}</div>
            <div className="text-xs text-gray-400">Moves</div>
          </div>

          {/* Hints */}
          <div className="p-4 bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 rounded-2xl border border-yellow-500/20">
            <div className={`text-2xl font-black ${hints > 0 ? 'text-yellow-300' : 'text-gray-500'}`}>
              {hints}
            </div>
            <div className="text-xs text-gray-400">Hints Left</div>
          </div>

          {/* Matched Pairs */}
          <div className="p-4 bg-gradient-to-br from-green-900/50 to-green-800/30 rounded-2xl border border-green-500/20">
            <div className="text-2xl font-black text-green-300">{matchedPairs}</div>
            <div className="text-xs text-gray-400">Matched</div>
          </div>

          {/* Remaining Pairs */}
          <div className="p-4 bg-gradient-to-br from-red-900/50 to-red-800/30 rounded-2xl border border-red-500/20">
            <div className="text-2xl font-black text-red-300">{totalPairs - matchedPairs}</div>
            <div className="text-xs text-gray-400">Remaining</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 sm:gap-4 mb-8 justify-center">
          <button
            onClick={useHint}
            disabled={hints <= 0 || gameWon}
            className={`px-5 py-3 rounded-xl font-bold transition-all text-sm shadow-lg flex items-center gap-2 ${
              hints <= 0 || gameWon
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black active:scale-95"
            }`}
          >
            <span>💡</span>
            {hints <= 0 ? "No Hints" : "Use Hint"}
          </button>

          <button
            onClick={resetGame}
            className="px-5 py-3 bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-500 hover:to-pink-600 rounded-xl font-bold transition-all text-sm shadow-lg active:scale-95 flex items-center gap-2"
          >
            <span>🔄</span>
            Reset Game
          </button>

          <button
            onClick={earnHint}
            disabled={hints >= 3 || gameWon}
            className={`px-5 py-3 rounded-xl font-bold transition-all text-sm shadow-lg flex items-center gap-2 ${
              hints >= 3 || gameWon
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 active:scale-95"
            }`}
          >
            <span>✨</span>
            Earn Hint
          </button>
        </div>
      </div>

      {/* GAME GRID */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full max-w-[320px] sm:max-w-md">
        {cards.map((card, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            disabled={gameWon}
            className={`aspect-square flex items-center justify-center text-2xl sm:text-4xl rounded-2xl cursor-pointer
              transition-all duration-300 transform select-none
              ${
                flipped.includes(index) || solved.includes(index) || hintedIndices.includes(index)
                  ? "bg-gradient-to-br from-white to-gray-100 text-black rotate-0 shadow-xl scale-105"
                  : "bg-gradient-to-br from-slate-700 to-slate-900 hover:from-slate-600 hover:to-slate-800 border-2 border-slate-600/50 -rotate-2 shadow-inner"
              }
              ${solved.includes(index) 
                ? "bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-2 border-green-500/50 opacity-70" 
                : ""
              }
              ${gameWon ? "cursor-default scale-100 rotate-0" : "active:scale-90"}
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            aria-label={
              flipped.includes(index) || solved.includes(index) || hintedIndices.includes(index)
                ? `Card ${index + 1}: ${card}` 
                : `Card ${index + 1}: face down`
            }
          >
            {flipped.includes(index) || solved.includes(index) || hintedIndices.includes(index) ? card : "❓"}
            {solved.includes(index) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-green-500/30 rounded-full blur-sm" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* WIN MESSAGE */}
      {gameWon && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative max-w-md w-full p-8 bg-gradient-to-br from-gray-900 to-black rounded-3xl border-2 border-green-500/50 text-center shadow-2xl animate-pulse">
            {/* Background effects */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="text-6xl mb-4 animate-bounce">🏆</div>
              <div className="text-4xl font-black bg-gradient-to-r from-yellow-300 to-orange-500 bg-clip-text text-transparent mb-2">
                VICTORY!
              </div>
              <p className="text-gray-300 mb-6">
                You matched all {totalPairs} pairs in {moves} moves!
              </p>
              
              {/* Score Summary */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-3 bg-gray-800/50 rounded-xl">
                  <div className="text-sm text-gray-400">Moves</div>
                  <div className="text-2xl font-bold text-white">{moves}</div>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-xl">
                  <div className="text-sm text-gray-400">Hints Left</div>
                  <div className="text-2xl font-bold text-yellow-400">{hints}</div>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-xl">
                  <div className="text-sm text-gray-400">Accuracy</div>
                  <div className="text-2xl font-bold text-green-400">
                    {totalPairs > 0 ? Math.round((totalPairs / moves) * 100) : 0}%
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={resetGame}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl"
                >
                  Play Again
                </button>
                <button
                  onClick={() => {
                    const text = `I just won the Memory Game in ${moves} moves! 🧠🎮`;
                    navigator.clipboard.writeText(text).then(() => {
                      alert('Score copied to clipboard! 📋');
                    });
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <span>📋</span>
                  Share Score
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Tips */}
      {!gameWon && (
        <div className="mt-10 p-4 bg-gray-900/50 rounded-2xl border border-gray-700/50 max-w-md">
          <h3 className="text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
            <span>💡</span> Game Tips
          </h3>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• Try to remember the positions of emojis you've seen</li>
            <li>• Use hints strategically when you're stuck</li>
            <li>• Every wrong move gives you an extra hint</li>
            <li>• Focus on one pair at a time to avoid confusion</li>
            <li>• The game starts with a free hint to help you begin!</li>
          </ul>
        </div>
      )}
    </div>
  );
}
